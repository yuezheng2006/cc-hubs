const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');

/**
 * 全面爬取Claude Code中文文档中心的所有页面内容
 * 包括安装指南、核心功能、使用场景、最佳实践等
 */
class ClaudeCodeDocsCrawler {
  constructor() {
    this.baseUrl = 'https://cc.deeptoai.com';
    this.startUrl = 'https://cc.deeptoai.com/docs/zh';
    this.visitedUrls = new Set();
    this.crawledPages = [];
    this.outputDir = './crawled-content/cc-docs-complete';
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    // 确保输出目录存在
    this.ensureDirectoryExists(this.outputDir);
  }

  /**
   * 确保目录存在，如果不存在则创建
   * @param {string} dirPath - 目录路径
   */
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 清理URL，移除锚点和查询参数
   * @param {string} url - 原始URL
   * @returns {string} 清理后的URL
   */
  cleanUrl(url) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch (error) {
      return url;
    }
  }

  /**
   * 检查URL是否应该被爬取
   * @param {string} url - 要检查的URL
   * @returns {boolean} 是否应该爬取
   */
  shouldCrawlUrl(url) {
    const cleanedUrl = this.cleanUrl(url);
    
    // 已访问过的URL跳过
    if (this.visitedUrls.has(cleanedUrl)) {
      return false;
    }
    
    // 只爬取同域名下的页面
    if (!url.startsWith(this.baseUrl)) {
      return false;
    }
    
    // 跳过非文档页面
    const skipPatterns = [
      '/api/',
      '/login',
      '/register',
      '/contact',
      '/about',
      '.pdf',
      '.jpg',
      '.png',
      '.gif',
      '.css',
      '.js',
      '#'
    ];
    
    return !skipPatterns.some(pattern => url.includes(pattern));
  }

  /**
   * 从页面中提取所有相关链接
   * @param {Object} page - Puppeteer页面对象
   * @returns {Array} 提取的链接数组
   */
  async extractLinks(page) {
    return await page.evaluate((baseUrl) => {
      const links = [];
      const linkElements = document.querySelectorAll('a[href]');
      
      linkElements.forEach(link => {
        let href = link.getAttribute('href');
        if (href) {
          // 处理相对链接
          if (href.startsWith('/')) {
            href = baseUrl + href;
          } else if (href.startsWith('./')) {
            href = baseUrl + href.substring(1);
          } else if (!href.startsWith('http')) {
            href = baseUrl + '/' + href;
          }
          
          links.push({
            url: href,
            text: link.textContent.trim(),
            title: link.getAttribute('title') || ''
          });
        }
      });
      
      return links;
    }, this.baseUrl);
  }

  /**
   * 提取页面的主要内容
   * @param {Object} page - Puppeteer页面对象
   * @returns {Object} 页面内容对象
   */
  async extractPageContent(page) {
    const content = await page.evaluate(() => {
      // 尝试多种内容选择器
      const contentSelectors = [
        'main',
        '.content',
        '.main-content',
        '.documentation',
        '.docs-content',
        'article',
        '.markdown-body',
        '#content'
      ];
      
      let contentElement = null;
      for (const selector of contentSelectors) {
        contentElement = document.querySelector(selector);
        if (contentElement) break;
      }
      
      // 如果没有找到特定的内容容器，使用body
      if (!contentElement) {
        contentElement = document.body;
      }
      
      // 移除不需要的元素
      const elementsToRemove = contentElement.querySelectorAll(
        'script, style, nav, header, footer, .sidebar, .navigation, .breadcrumb'
      );
      elementsToRemove.forEach(el => el.remove());
      
      return {
        title: document.title || '',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        html: contentElement.innerHTML,
        text: contentElement.textContent.trim()
      };
    });
    
    return content;
  }

  /**
   * 爬取单个页面
   * @param {Object} browser - Puppeteer浏览器对象
   * @param {string} url - 要爬取的URL
   * @returns {Object} 爬取结果
   */
  async crawlPage(browser, url) {
    const cleanedUrl = this.cleanUrl(url);
    
    if (this.visitedUrls.has(cleanedUrl)) {
      return null;
    }
    
    this.visitedUrls.add(cleanedUrl);
    
    try {
      console.log(`正在爬取: ${url}`);
      
      const page = await browser.newPage();
      
      // 设置用户代理和视口
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // 导航到页面
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // 等待内容加载
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 提取页面内容
      const content = await this.extractPageContent(page);
      
      // 提取链接
      const links = await this.extractLinks(page);
      
      await page.close();
      
      // 转换HTML为Markdown
      const markdown = this.turndownService.turndown(content.html);
      
      const pageData = {
        url: cleanedUrl,
        title: content.title,
        description: content.description,
        keywords: content.keywords,
        html: content.html,
        markdown: markdown,
        text: content.text,
        links: links,
        crawledAt: new Date().toISOString()
      };
      
      this.crawledPages.push(pageData);
      
      // 保存单个页面数据
      await this.savePage(pageData);
      
      return {
        success: true,
        url: cleanedUrl,
        title: content.title,
        linksFound: links.length
      };
      
    } catch (error) {
      console.error(`爬取页面失败 ${url}:`, error.message);
      return {
        success: false,
        url: cleanedUrl,
        error: error.message
      };
    }
  }

  /**
   * 保存单个页面数据到文件
   * @param {Object} pageData - 页面数据
   */
  async savePage(pageData) {
    const urlPath = new URL(pageData.url).pathname;
    const fileName = urlPath.replace(/\//g, '_').replace(/^_/, '') || 'index';
    
    // 保存Markdown文件
    const markdownPath = path.join(this.outputDir, `${fileName}.md`);
    fs.writeFileSync(markdownPath, pageData.markdown, 'utf8');
    
    // 保存HTML文件
    const htmlPath = path.join(this.outputDir, `${fileName}.html`);
    fs.writeFileSync(htmlPath, pageData.html, 'utf8');
    
    // 保存元数据
    const metadataPath = path.join(this.outputDir, `${fileName}_metadata.json`);
    const metadata = {
      url: pageData.url,
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords,
      crawledAt: pageData.crawledAt,
      linksCount: pageData.links.length
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  }

  /**
   * 开始爬取过程
   */
  async crawl() {
    console.log('开始爬取Claude Code中文文档中心...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const urlsToVisit = [this.startUrl];
      const results = [];
      
      while (urlsToVisit.length > 0 && this.visitedUrls.size < 50) {
        const currentUrl = urlsToVisit.shift();
        
        if (!this.shouldCrawlUrl(currentUrl)) {
          continue;
        }
        
        const result = await this.crawlPage(browser, currentUrl);
        if (result) {
          results.push(result);
          
          // 如果爬取成功，添加发现的新链接
          if (result.success) {
            const pageData = this.crawledPages.find(p => p.url === result.url);
            if (pageData) {
              pageData.links.forEach(link => {
                if (this.shouldCrawlUrl(link.url) && !urlsToVisit.includes(link.url)) {
                  urlsToVisit.push(link.url);
                }
              });
            }
          }
        }
        
        // 添加延迟避免过于频繁的请求
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 保存完整的爬取报告
      const report = {
        crawledAt: new Date().toISOString(),
        totalPages: this.crawledPages.length,
        successfulPages: results.filter(r => r.success).length,
        failedPages: results.filter(r => !r.success).length,
        results: results,
        summary: {
          visitedUrls: Array.from(this.visitedUrls),
          totalLinks: this.crawledPages.reduce((sum, page) => sum + page.links.length, 0)
        }
      };
      
      const reportPath = path.join(this.outputDir, `crawl-report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
      
      console.log(`\n爬取完成！`);
      console.log(`- 成功爬取页面: ${report.successfulPages}`);
      console.log(`- 失败页面: ${report.failedPages}`);
      console.log(`- 总链接数: ${report.summary.totalLinks}`);
      console.log(`- 报告保存至: ${reportPath}`);
      
      return report;
      
    } finally {
      await browser.close();
    }
  }
}

// 主执行函数
async function main() {
  try {
    const crawler = new ClaudeCodeDocsCrawler();
    await crawler.crawl();
  } catch (error) {
    console.error('爬取过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = ClaudeCodeDocsCrawler;