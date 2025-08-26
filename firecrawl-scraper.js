#!/usr/bin/env node

/**
 * Firecrawl v2 网站爬虫脚本
 * 用于爬取指定的三个网站内容并保存到文件
 */

const FirecrawlApp = require('@mendable/firecrawl-js').default;
const fs = require('fs').promises;
const path = require('path');

// 配置信息
const CONFIG = {
  apiKey: 'fc-e44ab01dfe404b9bbbde98031d4d380d',
  outputDir: './crawled-content',
  maxRetries: 3,
  retryDelay: 2000, // 2秒
  targets: [
    {
      url: 'https://docs.ctok.ai/',
      name: 'ctok-docs',
      description: 'Ctok 官方文档站点'
    },
    {
      url: 'https://cc.deeptoai.com/docs/zh',
      name: 'claude-code-docs',
      description: 'Claude Code 中文文档中心'
    },
    {
      url: 'https://github.com/foreveryh/claude-code-cookbook/blob/main/README_zh.md',
      name: 'cookbook-readme',
      description: 'GitHub 中文版 Cookbook'
    }
  ]
};

/**
 * 创建输出目录
 */
async function createOutputDirectory() {
  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    console.log(`✅ 输出目录已创建: ${CONFIG.outputDir}`);
  } catch (error) {
    console.error(`❌ 创建输出目录失败: ${error.message}`);
    throw error;
  }
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试机制的爬取函数
 * @param {FirecrawlApp} app - Firecrawl 应用实例
 * @param {string} url - 要爬取的URL
 * @param {number} retries - 剩余重试次数
 */
async function scrapeWithRetry(app, url, retries = CONFIG.maxRetries) {
  try {
    console.log(`🔄 正在爬取: ${url}`);
    
    const scrapeResult = await app.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'code', 'pre'],
      excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
      onlyMainContent: true
    });
    
    if (scrapeResult.success) {
      console.log(`✅ 爬取成功: ${url}`);
      return scrapeResult;
    } else {
      throw new Error(`爬取失败: ${scrapeResult.error || '未知错误'}`);
    }
  } catch (error) {
    console.error(`❌ 爬取失败 (剩余重试次数: ${retries}): ${error.message}`);
    
    if (retries > 0) {
      console.log(`⏳ ${CONFIG.retryDelay / 1000}秒后重试...`);
      await delay(CONFIG.retryDelay);
      return scrapeWithRetry(app, url, retries - 1);
    } else {
      throw new Error(`爬取最终失败: ${url} - ${error.message}`);
    }
  }
}

/**
 * 保存爬取结果到文件
 * @param {Object} result - 爬取结果
 * @param {Object} target - 目标配置
 */
async function saveResult(result, target) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFileName = `${target.name}_${timestamp}`;
    
    // 调试：打印结果结构
    console.log(`🔍 调试信息 - 结果结构:`, JSON.stringify(result, null, 2));
    
    // 获取实际的数据内容
    const data = result.data || result;
    const markdown = data.markdown || data.content || '';
    const html = data.html || '';
    const metadata = data.metadata || {};
    
    // 保存 Markdown 格式
    if (markdown) {
      const markdownPath = path.join(CONFIG.outputDir, `${baseFileName}.md`);
      await fs.writeFile(markdownPath, markdown, 'utf8');
      console.log(`📄 Markdown 已保存: ${markdownPath}`);
    }
    
    // 保存 HTML 格式
    if (html) {
      const htmlPath = path.join(CONFIG.outputDir, `${baseFileName}.html`);
      await fs.writeFile(htmlPath, html, 'utf8');
      console.log(`🌐 HTML 已保存: ${htmlPath}`);
    }
    
    // 保存原始数据用于调试
    const rawDataPath = path.join(CONFIG.outputDir, `${baseFileName}_raw.json`);
    await fs.writeFile(rawDataPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`🔧 原始数据已保存: ${rawDataPath}`);
    
    // 保存元数据
    const metadataObj = {
      url: target.url,
      name: target.name,
      description: target.description,
      title: metadata.title || '',
      description_meta: metadata.description || '',
      crawledAt: new Date().toISOString(),
      success: result.success,
      hasMarkdown: !!markdown,
      hasHtml: !!html
    };
    
    const metadataPath = path.join(CONFIG.outputDir, `${baseFileName}_metadata.json`);
    await fs.writeFile(metadataPath, JSON.stringify(metadataObj, null, 2), 'utf8');
    console.log(`📊 元数据已保存: ${metadataPath}`);
    
    return {
      markdownPath: markdown ? `${baseFileName}.md` : null,
      htmlPath: html ? `${baseFileName}.html` : null,
      metadataPath: `${baseFileName}_metadata.json`,
      rawDataPath: `${baseFileName}_raw.json`
    };
  } catch (error) {
    console.error(`❌ 保存文件失败: ${error.message}`);
    throw error;
  }
}

/**
 * 生成爬取报告
 * @param {Array} results - 爬取结果数组
 */
async function generateReport(results) {
  const report = {
    summary: {
      totalTargets: CONFIG.targets.length,
      successfulCrawls: results.filter(r => r.success).length,
      failedCrawls: results.filter(r => !r.success).length,
      crawledAt: new Date().toISOString()
    },
    results: results,
    config: {
      apiKey: CONFIG.apiKey.substring(0, 10) + '...',
      maxRetries: CONFIG.maxRetries,
      retryDelay: CONFIG.retryDelay
    }
  };
  
  const reportPath = path.join(CONFIG.outputDir, `crawl-report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  console.log('\n📋 爬取报告:');
  console.log(`总目标数: ${report.summary.totalTargets}`);
  console.log(`成功爬取: ${report.summary.successfulCrawls}`);
  console.log(`失败爬取: ${report.summary.failedCrawls}`);
  console.log(`报告已保存: ${reportPath}`);
  
  return reportPath;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始 Firecrawl v2 爬虫任务');
  console.log(`目标网站数量: ${CONFIG.targets.length}`);
  console.log('=' .repeat(50));
  
  try {
    // 创建输出目录
    await createOutputDirectory();
    
    // 初始化 Firecrawl 应用
    const app = new FirecrawlApp({ apiKey: CONFIG.apiKey });
    console.log('✅ Firecrawl 应用已初始化');
    
    const results = [];
    
    // 逐个爬取目标网站
    for (let i = 0; i < CONFIG.targets.length; i++) {
      const target = CONFIG.targets[i];
      console.log(`\n[${i + 1}/${CONFIG.targets.length}] 处理: ${target.description}`);
      
      try {
        const scrapeResult = await scrapeWithRetry(app, target.url);
        const savedFiles = await saveResult(scrapeResult, target);
        
        results.push({
          target: target,
          success: true,
          files: savedFiles,
          error: null
        });
        
        console.log(`✅ ${target.name} 处理完成`);
      } catch (error) {
        console.error(`❌ ${target.name} 处理失败: ${error.message}`);
        results.push({
          target: target,
          success: false,
          files: null,
          error: error.message
        });
      }
      
      // 在请求之间添加延迟，避免过于频繁的API调用
      if (i < CONFIG.targets.length - 1) {
        console.log('⏳ 等待 1 秒后继续下一个目标...');
        await delay(1000);
      }
    }
    
    // 生成最终报告
    console.log('\n' + '=' .repeat(50));
    await generateReport(results);
    
    console.log('\n🎉 爬虫任务完成!');
    
  } catch (error) {
    console.error(`💥 爬虫任务失败: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('💥 未处理的错误:', error);
    process.exit(1);
  });
}

module.exports = { main, CONFIG };