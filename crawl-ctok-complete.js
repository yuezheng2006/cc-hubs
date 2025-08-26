const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

/**
 * Ctok网站完整爬虫脚本
 * 爬取 https://docs.ctok.ai 的所有子页面和文档
 */
class CtokCrawler {
  constructor() {
    this.baseUrl = 'https://docs.ctok.ai';
    this.outputDir = './crawled-content/ctok-complete';
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    this.crawledUrls = new Set();
    this.results = [];
    
    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 获取所有需要爬取的页面URL
   */
  getTargetUrls() {
    return [
      `${this.baseUrl}/claude-code-setup-ctok`,
      `${this.baseUrl}/claude-code-windows-env-setup`,
      `${this.baseUrl}/claude-code-commands-guide`,
      `${this.baseUrl}/claude-code-best-practices`,
      `${this.baseUrl}/claude-code-34-tips`,
      `${this.baseUrl}/claude-code-complete-guide`,
      `${this.baseUrl}/claude-code-23-practical-tips-goodbye-cursor`,
      `${this.baseUrl}/claude-code-vibe-coding-workflow`,
      `${this.baseUrl}/claude-code-subagents-evolution`,
      `${this.baseUrl}/claude-code-max-versions`,
      `${this.baseUrl}/claude-code-group`,
      `${this.baseUrl}/en/`,
      `${this.baseUrl}/`,
    ];
  }

  /**
   * 爬取单个页面
   */
  async crawlPage(browser, url) {
    if (this.crawledUrls.has(url)) {
      console.log(`已爬取过: ${url}`);
      return null;
    }

    console.log(`正在爬取: ${url}`);
    
    try {
      const page = await browser.newPage();
      
      // 设置用户代理和视口
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // 访问页面
      const response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      if (!response.ok()) {
        console.log(`页面访问失败: ${url} - ${response.status()}`);
        await page.close();
        return null;
      }

      // 等待内容加载
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 获取页面标题
      const title = await page.title();
      
      // 获取页面HTML内容
      const htmlContent = await page.content();
      
      // 尝试获取主要内容区域
      let mainContent = '';
      try {
        // 尝试多种选择器来获取主要内容
        const contentSelectors = [
          '.VPContent',
          '.content',
          'main',
          '.main-content',
          '.markdown-body',
          '.prose',
          'article',
          '.container'
        ];
        
        for (const selector of contentSelectors) {
          const element = await page.$(selector);
          if (element) {
            mainContent = await page.evaluate(el => el.innerHTML, element);
            break;
          }
        }
        
        // 如果没有找到主要内容区域，使用body
        if (!mainContent) {
          mainContent = await page.evaluate(() => document.body.innerHTML);
        }
      } catch (error) {
        console.log(`获取内容失败: ${url} - ${error.message}`);
        mainContent = await page.evaluate(() => document.body.innerHTML);
      }

      await page.close();
      
      // 转换为Markdown
      const markdownContent = this.turndownService.turndown(mainContent);
      
      // 生成文件名
      const urlPath = new URL(url).pathname;
      const fileName = urlPath === '/' ? 'index' : urlPath.replace(/\//g, '_').replace(/^_/, '');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const baseFileName = `ctok_${fileName}_${timestamp}`;
      
      // 保存文件
      const htmlFile = path.join(this.outputDir, `${baseFileName}.html`);
      const mdFile = path.join(this.outputDir, `${baseFileName}.md`);
      const metadataFile = path.join(this.outputDir, `${baseFileName}_metadata.json`);
      
      fs.writeFileSync(htmlFile, htmlContent, 'utf8');
      fs.writeFileSync(mdFile, markdownContent, 'utf8');
      
      const metadata = {
        url,
        title,
        fileName,
        timestamp: new Date().toISOString(),
        contentLength: markdownContent.length,
        htmlLength: htmlContent.length
      };
      
      fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');
      
      this.crawledUrls.add(url);
      
      const result = {
        url,
        title,
        fileName: baseFileName,
        success: true,
        contentLength: markdownContent.length,
        files: {
          html: htmlFile,
          markdown: mdFile,
          metadata: metadataFile
        }
      };
      
      this.results.push(result);
      console.log(`✅ 成功爬取: ${title} (${markdownContent.length} 字符)`);
      
      return result;
      
    } catch (error) {
      console.error(`爬取失败: ${url} - ${error.message}`);
      this.results.push({
        url,
        success: false,
        error: error.message
      });
      return null;
    }
  }

  /**
   * 开始爬取所有页面
   */
  async crawlAll() {
    console.log('🚀 开始爬取 Ctok 网站完整内容...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      const urls = this.getTargetUrls();
      console.log(`📋 计划爬取 ${urls.length} 个页面`);
      
      // 并发爬取，但限制并发数
      const concurrency = 3;
      for (let i = 0; i < urls.length; i += concurrency) {
        const batch = urls.slice(i, i + concurrency);
        const promises = batch.map(url => this.crawlPage(browser, url));
        await Promise.all(promises);
        
        // 批次间暂停
        if (i + concurrency < urls.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
    } finally {
      await browser.close();
    }

    // 生成爬取报告
    const report = {
      timestamp: new Date().toISOString(),
      totalUrls: this.getTargetUrls().length,
      successfulCrawls: this.results.filter(r => r.success).length,
      failedCrawls: this.results.filter(r => !r.success).length,
      results: this.results
    };
    
    const reportFile = path.join(this.outputDir, `crawl-report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
    
    console.log('\n📊 爬取完成统计:');
    console.log(`✅ 成功: ${report.successfulCrawls}`);
    console.log(`❌ 失败: ${report.failedCrawls}`);
    console.log(`📄 报告文件: ${reportFile}`);
    
    return report;
  }
}

// 执行爬取
if (require.main === module) {
  const crawler = new CtokCrawler();
  crawler.crawlAll().catch(console.error);
}

module.exports = CtokCrawler;