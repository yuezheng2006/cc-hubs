/**
 * ctok.ai 内容爬虫脚本
 * 用于从 https://docs.ctok.ai/claude-code-common-workflows 爬取 Claude Code 工作流程文档
 * 
 * 功能特性:
 * - 爬取工作流程页面内容
 * - 解析 Markdown 格式文档
 * - 提取元数据和内容结构
 * - 生成符合 Mintlify 格式的文档文件
 * - 支持增量更新和内容去重
 * 
 * @author Claude Code Best Practices Hub
 * @version 1.0.0
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const { createHash } = require('crypto');

/**
 * ctok.ai 爬虫类
 * 负责从 ctok.ai 网站爬取 Claude Code 相关文档
 */
class CtokCrawler {
  /**
   * 构造函数
   * @param {Object} options - 爬虫配置选项
   * @param {string} options.baseUrl - 基础URL
   * @param {string} options.outputDir - 输出目录
   * @param {number} options.delay - 请求间隔（毫秒）
   * @param {number} options.timeout - 请求超时时间（毫秒）
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://docs.ctok.ai';
    this.outputDir = options.outputDir || path.join(__dirname, '../../docs/workflows');
    this.delay = options.delay || 1000; // 1秒间隔，避免过于频繁的请求
    this.timeout = options.timeout || 10000; // 10秒超时
    this.userAgent = 'Claude-Code-Hub-Crawler/1.0.0';
    
    // 配置 axios 实例
    this.client = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    // 爬取统计信息
    this.stats = {
      totalPages: 0,
      successfulPages: 0,
      failedPages: 0,
      skippedPages: 0,
      startTime: null,
      endTime: null
    };
  }

  /**
   * 开始爬取流程
   * 主入口函数，协调整个爬取过程
   */
  async crawl() {
    try {
      console.log('🚀 开始爬取 ctok.ai Claude Code 文档...');
      this.stats.startTime = new Date();
      
      // 确保输出目录存在
      await this.ensureOutputDirectory();
      
      // 获取所有工作流程页面链接
      const workflowLinks = await this.discoverWorkflowPages();
      console.log(`📋 发现 ${workflowLinks.length} 个工作流程页面`);
      
      this.stats.totalPages = workflowLinks.length;
      
      // 爬取每个工作流程页面
      for (let i = 0; i < workflowLinks.length; i++) {
        const link = workflowLinks[i];
        console.log(`📄 正在处理 (${i + 1}/${workflowLinks.length}): ${link.title}`);
        
        try {
          await this.crawlWorkflowPage(link);
          this.stats.successfulPages++;
        } catch (error) {
          console.error(`❌ 处理页面失败: ${link.url}`, error.message);
          this.stats.failedPages++;
        }
        
        // 添加延迟，避免过于频繁的请求
        if (i < workflowLinks.length - 1) {
          await this.sleep(this.delay);
        }
      }
      
      // 生成索引文件
      await this.generateWorkflowIndex(workflowLinks);
      
      this.stats.endTime = new Date();
      this.printStats();
      
      console.log('✅ ctok.ai 文档爬取完成!');
      
    } catch (error) {
      console.error('💥 爬取过程中发生错误:', error);
      throw error;
    }
  }

  /**
   * 确保输出目录存在
   * 创建必要的目录结构
   */
  async ensureOutputDirectory() {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log(`📁 创建输出目录: ${this.outputDir}`);
    }
  }

  /**
   * 发现所有工作流程页面
   * 从主页面解析出所有工作流程相关的链接
   * @returns {Array} 工作流程页面链接数组
   */
  async discoverWorkflowPages() {
    const mainUrl = `${this.baseUrl}/claude-code-common-workflows`;
    console.log(`🔍 正在分析主页面: ${mainUrl}`);
    
    try {
      const response = await this.client.get(mainUrl);
      const $ = cheerio.load(response.data);
      const links = [];
      
      // 查找所有工作流程相关的链接
      // 根据 ctok.ai 的页面结构调整选择器
      $('a[href*="workflow"], a[href*="guide"], a[href*="tutorial"]').each((index, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        const title = $link.text().trim() || $link.attr('title') || `Workflow ${index + 1}`;
        
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
          const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`;
          
          // 避免重复链接
          if (!links.find(link => link.url === fullUrl)) {
            links.push({
              title: this.sanitizeTitle(title),
              url: fullUrl,
              slug: this.generateSlug(title)
            });
          }
        }
      });
      
      // 如果没有找到特定的工作流程链接，尝试查找所有内部链接
      if (links.length === 0) {
        console.log('⚠️  未找到特定工作流程链接，尝试查找所有相关页面...');
        
        $('a[href^="/"], a[href^="./"]').each((index, element) => {
          const $link = $(element);
          const href = $link.attr('href');
          const title = $link.text().trim() || `Page ${index + 1}`;
          
          if (href && href.length > 1 && !href.includes('#')) {
            const fullUrl = `${this.baseUrl}${href}`;
            
            if (!links.find(link => link.url === fullUrl)) {
              links.push({
                title: this.sanitizeTitle(title),
                url: fullUrl,
                slug: this.generateSlug(title)
              });
            }
          }
        });
      }
      
      // 如果仍然没有找到链接，至少包含主页面
      if (links.length === 0) {
        links.push({
          title: 'Claude Code Common Workflows',
          url: mainUrl,
          slug: 'common-workflows'
        });
      }
      
      return links;
      
    } catch (error) {
      console.error('❌ 获取主页面失败:', error.message);
      
      // 返回默认的工作流程页面
      return [{
        title: 'Claude Code Common Workflows',
        url: mainUrl,
        slug: 'common-workflows'
      }];
    }
  }

  /**
   * 爬取单个工作流程页面
   * @param {Object} linkInfo - 页面链接信息
   * @param {string} linkInfo.title - 页面标题
   * @param {string} linkInfo.url - 页面URL
   * @param {string} linkInfo.slug - 页面slug
   */
  async crawlWorkflowPage(linkInfo) {
    const { title, url, slug } = linkInfo;
    
    try {
      const response = await this.client.get(url);
      const $ = cheerio.load(response.data);
      
      // 提取页面内容
      const content = this.extractPageContent($);
      
      // 生成文件内容
      const fileContent = this.generateMarkdownContent({
        title,
        url,
        slug,
        content,
        extractedAt: new Date().toISOString()
      });
      
      // 保存文件
      const fileName = `${slug}.mdx`;
      const filePath = path.join(this.outputDir, fileName);
      
      // 检查文件是否已存在且内容相同（避免不必要的更新）
      const shouldUpdate = await this.shouldUpdateFile(filePath, fileContent);
      
      if (shouldUpdate) {
        await fs.writeFile(filePath, fileContent, 'utf8');
        console.log(`✅ 已保存: ${fileName}`);
      } else {
        console.log(`⏭️  跳过（无变化）: ${fileName}`);
        this.stats.skippedPages++;
      }
      
    } catch (error) {
      console.error(`❌ 爬取页面失败 ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * 从页面中提取主要内容
   * @param {Object} $ - Cheerio 实例
   * @returns {Object} 提取的内容对象
   */
  extractPageContent($) {
    const content = {
      title: '',
      description: '',
      mainContent: '',
      codeBlocks: [],
      links: [],
      images: []
    };
    
    // 提取标题
    content.title = $('h1').first().text().trim() || 
                   $('title').text().trim() || 
                   $('.title, .page-title, .main-title').first().text().trim();
    
    // 提取描述
    content.description = $('meta[name="description"]').attr('content') || 
                         $('.description, .summary, .intro').first().text().trim() || 
                         $('p').first().text().trim().substring(0, 200);
    
    // 提取主要内容
    const mainContentSelectors = [
      '.content',
      '.main-content', 
      '.article-content',
      '.post-content',
      'main',
      '.markdown-body',
      'article'
    ];
    
    let mainContentElement = null;
    for (const selector of mainContentSelectors) {
      mainContentElement = $(selector).first();
      if (mainContentElement.length > 0) break;
    }
    
    // 如果没有找到特定的内容容器，使用 body
    if (!mainContentElement || mainContentElement.length === 0) {
      mainContentElement = $('body');
    }
    
    // 清理和提取文本内容
    mainContentElement.find('script, style, nav, header, footer, .sidebar, .menu').remove();
    content.mainContent = this.cleanHtmlContent(mainContentElement.html() || '');
    
    // 提取代码块
    $('pre code, .code-block, .highlight').each((index, element) => {
      const $code = $(element);
      const language = this.detectCodeLanguage($code);
      const codeText = $code.text().trim();
      
      if (codeText) {
        content.codeBlocks.push({
          language,
          code: codeText,
          index
        });
      }
    });
    
    // 提取链接
    $('a[href]').each((index, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const text = $link.text().trim();
      
      if (href && text && !href.startsWith('#')) {
        content.links.push({
          text,
          url: href.startsWith('http') ? href : `${this.baseUrl}${href}`,
          index
        });
      }
    });
    
    // 提取图片
    $('img[src]').each((index, element) => {
      const $img = $(element);
      const src = $img.attr('src');
      const alt = $img.attr('alt') || '';
      
      if (src) {
        content.images.push({
          src: src.startsWith('http') ? src : `${this.baseUrl}${src}`,
          alt,
          index
        });
      }
    });
    
    return content;
  }

  /**
   * 清理HTML内容，转换为Markdown格式
   * @param {string} html - 原始HTML内容
   * @returns {string} 清理后的内容
   */
  cleanHtmlContent(html) {
    if (!html) return '';
    
    const $ = cheerio.load(html);
    
    // 移除不需要的元素
    $('script, style, nav, header, footer, .ads, .advertisement').remove();
    
    // 转换标题
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const $heading = $(element);
      const level = parseInt(element.tagName.substring(1));
      const text = $heading.text().trim();
      const markdown = '#'.repeat(level) + ' ' + text;
      $heading.replaceWith(markdown + '\n\n');
    });
    
    // 转换段落
    $('p').each((index, element) => {
      const $p = $(element);
      const text = $p.text().trim();
      if (text) {
        $p.replaceWith(text + '\n\n');
      }
    });
    
    // 转换列表
    $('ul li').each((index, element) => {
      const $li = $(element);
      const text = $li.text().trim();
      if (text) {
        $li.replaceWith('- ' + text + '\n');
      }
    });
    
    $('ol li').each((index, element) => {
      const $li = $(element);
      const text = $li.text().trim();
      if (text) {
        $li.replaceWith(`${index + 1}. ${text}\n`);
      }
    });
    
    // 转换代码块
    $('pre code').each((index, element) => {
      const $code = $(element);
      const language = this.detectCodeLanguage($code);
      const codeText = $code.text();
      const markdown = `\`\`\`${language}\n${codeText}\n\`\`\``;
      $code.closest('pre').replaceWith(markdown + '\n\n');
    });
    
    // 转换行内代码
    $('code').each((index, element) => {
      const $code = $(element);
      const text = $code.text();
      $code.replaceWith(`\`${text}\``);
    });
    
    // 转换链接
    $('a').each((index, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const text = $link.text();
      if (href && text) {
        $link.replaceWith(`[${text}](${href})`);
      }
    });
    
    // 获取最终文本并清理
    let cleanText = $.text();
    
    // 清理多余的空行
    cleanText = cleanText.replace(/\n\s*\n\s*\n/g, '\n\n');
    cleanText = cleanText.replace(/^\s+|\s+$/g, '');
    
    return cleanText;
  }

  /**
   * 检测代码块的编程语言
   * @param {Object} $code - Cheerio 代码元素
   * @returns {string} 检测到的语言
   */
  detectCodeLanguage($code) {
    // 检查 class 属性
    const className = $code.attr('class') || '';
    const langMatch = className.match(/(?:lang|language)-(\w+)/);
    if (langMatch) {
      return langMatch[1];
    }
    
    // 检查父元素的 class
    const parentClass = $code.parent().attr('class') || '';
    const parentLangMatch = parentClass.match(/(?:lang|language)-(\w+)/);
    if (parentLangMatch) {
      return parentLangMatch[1];
    }
    
    // 根据内容特征检测语言
    const codeText = $code.text();
    
    if (codeText.includes('function') && codeText.includes('{')) {
      return 'javascript';
    }
    if (codeText.includes('def ') && codeText.includes(':')) {
      return 'python';
    }
    if (codeText.includes('public class') || codeText.includes('import java')) {
      return 'java';
    }
    if (codeText.includes('<?php')) {
      return 'php';
    }
    if (codeText.includes('#include') || codeText.includes('int main')) {
      return 'cpp';
    }
    if (codeText.includes('SELECT') || codeText.includes('FROM')) {
      return 'sql';
    }
    if (codeText.includes('<') && codeText.includes('>')) {
      return 'html';
    }
    if (codeText.includes('{') && codeText.includes('}') && codeText.includes(':')) {
      return 'css';
    }
    
    return 'text';
  }

  /**
   * 生成Markdown文件内容
   * @param {Object} pageData - 页面数据
   * @returns {string} Markdown内容
   */
  generateMarkdownContent(pageData) {
    const { title, url, content, extractedAt } = pageData;
    
    // 生成前置元数据
    const frontMatter = {
      title: title || 'Untitled Workflow',
      description: content.description || '从 ctok.ai 爬取的 Claude Code 工作流程文档',
      icon: 'workflow',
      source: 'ctok.ai',
      sourceUrl: url,
      extractedAt,
      tags: ['workflow', 'claude-code', 'ctok']
    };
    
    // 构建Markdown内容
    let markdownContent = '---\n';
    Object.entries(frontMatter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        markdownContent += `${key}:\n${value.map(v => `  - '${v}'`).join('\n')}\n`;
      } else {
        markdownContent += `${key}: '${value}'\n`;
      }
    });
    markdownContent += '---\n\n';
    
    // 添加来源说明
    markdownContent += `<Note>\n`;
    markdownContent += `本文档来源于 [ctok.ai](${url})，由自动化爬虫提取并格式化。\n`;
    markdownContent += `最后更新时间: ${new Date(extractedAt).toLocaleString('zh-CN')}\n`;
    markdownContent += `</Note>\n\n`;
    
    // 添加主要内容
    if (content.mainContent) {
      markdownContent += content.mainContent + '\n\n';
    }
    
    // 添加代码示例（如果有）
    if (content.codeBlocks && content.codeBlocks.length > 0) {
      markdownContent += '## 代码示例\n\n';
      content.codeBlocks.forEach((block, index) => {
        markdownContent += `### 示例 ${index + 1}\n\n`;
        markdownContent += `\`\`\`${block.language}\n${block.code}\n\`\`\`\n\n`;
      });
    }
    
    // 添加相关链接（如果有）
    if (content.links && content.links.length > 0) {
      markdownContent += '## 相关链接\n\n';
      content.links.forEach(link => {
        markdownContent += `- [${link.text}](${link.url})\n`;
      });
      markdownContent += '\n';
    }
    
    // 添加页脚
    markdownContent += '---\n\n';
    markdownContent += `<Info>\n`;
    markdownContent += `如果您发现内容有误或需要更新，请访问 [原始页面](${url}) 查看最新信息。\n`;
    markdownContent += `</Info>\n`;
    
    return markdownContent;
  }

  /**
   * 检查是否需要更新文件
   * @param {string} filePath - 文件路径
   * @param {string} newContent - 新内容
   * @returns {boolean} 是否需要更新
   */
  async shouldUpdateFile(filePath, newContent) {
    try {
      const existingContent = await fs.readFile(filePath, 'utf8');
      
      // 计算内容哈希值进行比较
      const existingHash = createHash('md5').update(existingContent).digest('hex');
      const newHash = createHash('md5').update(newContent).digest('hex');
      
      return existingHash !== newHash;
    } catch {
      // 文件不存在，需要创建
      return true;
    }
  }

  /**
   * 生成工作流程索引文件
   * @param {Array} workflowLinks - 工作流程链接数组
   */
  async generateWorkflowIndex(workflowLinks) {
    const indexContent = `---
title: 'ctok.ai 工作流程'
description: '从 ctok.ai 收集的 Claude Code 工作流程文档'
icon: 'workflow'
---

## 📋 工作流程列表

以下是从 [ctok.ai](https://docs.ctok.ai/claude-code-common-workflows) 收集的 Claude Code 工作流程文档：

<CardGroup cols={2}>
${workflowLinks.map(link => `  <Card title="${link.title}" href="/workflows/${link.slug}">
    从 ctok.ai 收集的工作流程文档
  </Card>`).join('\n')}
</CardGroup>

## 📊 统计信息

- **总文档数**: ${workflowLinks.length}
- **来源**: ctok.ai
- **最后更新**: ${new Date().toLocaleString('zh-CN')}

<Note>
这些文档通过自动化爬虫从 ctok.ai 收集，内容会定期更新。如发现问题，请查看原始页面。
</Note>
`;
    
    const indexPath = path.join(this.outputDir, 'ctok-workflows.mdx');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('📋 已生成工作流程索引文件');
  }

  /**
   * 清理标题文本
   * @param {string} title - 原始标题
   * @returns {string} 清理后的标题
   */
  sanitizeTitle(title) {
    return title
      .replace(/[\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100); // 限制长度
  }

  /**
   * 生成URL slug
   * @param {string} title - 标题
   * @returns {string} URL slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) || 'untitled';
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 打印爬取统计信息
   */
  printStats() {
    const duration = this.stats.endTime - this.stats.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    console.log('\n📊 爬取统计信息:');
    console.log(`⏱️  总耗时: ${minutes}分${seconds}秒`);
    console.log(`📄 总页面数: ${this.stats.totalPages}`);
    console.log(`✅ 成功: ${this.stats.successfulPages}`);
    console.log(`❌ 失败: ${this.stats.failedPages}`);
    console.log(`⏭️  跳过: ${this.stats.skippedPages}`);
    console.log(`📈 成功率: ${((this.stats.successfulPages / this.stats.totalPages) * 100).toFixed(1)}%`);
  }
}

/**
 * 主执行函数
 * 当脚本直接运行时执行
 */
async function main() {
  try {
    const crawler = new CtokCrawler({
      baseUrl: 'https://docs.ctok.ai',
      outputDir: path.join(__dirname, '../../docs/workflows'),
      delay: 2000, // 2秒间隔
      timeout: 15000 // 15秒超时
    });
    
    await crawler.crawl();
    
  } catch (error) {
    console.error('💥 爬虫执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，执行主函数
if (require.main === module) {
  main();
}

// 导出爬虫类供其他模块使用
module.exports = CtokCrawler;