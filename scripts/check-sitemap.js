#!/usr/bin/env node

/**
 * 站点地图检查脚本
 * 用于发现各个网站的所有文档页面和子页面
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

// 目标网站配置
const SITES = [
  {
    name: 'ctok-docs',
    baseUrl: 'https://docs.ctok.ai/',
    description: 'Ctok 官方文档站点',
    selectors: {
      // 常见的导航和链接选择器
      navigation: 'nav a, .nav a, .navigation a, .sidebar a, .menu a',
      content: 'main a, .content a, .docs a, article a',
      footer: 'footer a'
    }
  },
  {
    name: 'claude-code-docs',
    baseUrl: 'https://cc.deeptoai.com/docs/zh',
    description: 'Claude Code 中文文档中心',
    selectors: {
      navigation: 'nav a, .nav a, .navigation a, .sidebar a, .menu a',
      content: 'main a, .content a, .docs a, article a',
      footer: 'footer a'
    }
  },
  {
    name: 'cookbook-github',
    baseUrl: 'https://github.com/foreveryh/claude-code-cookbook',
    description: 'GitHub Cookbook 仓库',
    selectors: {
      navigation: '.js-repo-nav a, .UnderlineNav a',
      content: '.markdown-body a, .file-navigation a, .Box a',
      footer: 'footer a'
    }
  }
];

/**
 * 提取页面中的所有链接
 * @param {Object} page - Puppeteer页面对象
 * @param {Object} selectors - 选择器配置
 * @param {string} baseUrl - 基础URL
 * @returns {Array} 链接数组
 */
async function extractLinks(page, selectors, baseUrl) {
  const links = new Set();
  
  try {
    // 等待页面加载完成
    await page.waitForTimeout(2000);
    
    // 提取各种类型的链接
    for (const [type, selector] of Object.entries(selectors)) {
      try {
        const typeLinks = await page.$$eval(selector, (elements, base) => {
          return elements
            .map(el => {
              const href = el.href || el.getAttribute('href');
              if (!href) return null;
              
              // 处理相对链接
              try {
                return new URL(href, base).href;
              } catch {
                return null;
              }
            })
            .filter(Boolean);
        }, baseUrl);
        
        typeLinks.forEach(link => {
          // 只收集同域名下的链接
          if (link.startsWith(baseUrl) || link.startsWith(new URL(baseUrl).origin)) {
            links.add(link);
          }
        });
        
        console.log(`  发现 ${typeLinks.length} 个 ${type} 链接`);
      } catch (error) {
        console.log(`  提取 ${type} 链接时出错:`, error.message);
      }
    }
  } catch (error) {
    console.log(`  页面加载超时或出错:`, error.message);
  }
  
  return Array.from(links);
}

/**
 * 检查单个网站的站点地图
 * @param {Object} site - 网站配置
 * @param {Object} browser - Puppeteer浏览器对象
 * @returns {Object} 站点地图结果
 */
async function checkSitemap(site, browser) {
  console.log(`\n检查网站: ${site.name} (${site.baseUrl})`);
  
  const page = await browser.newPage();
  const visitedUrls = new Set();
  const allLinks = new Set();
  const errors = [];
  
  try {
    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // 访问主页
    console.log(`  访问主页: ${site.baseUrl}`);
    await page.goto(site.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // 提取主页链接
    const mainLinks = await extractLinks(page, site.selectors, site.baseUrl);
    mainLinks.forEach(link => allLinks.add(link));
    visitedUrls.add(site.baseUrl);
    
    console.log(`  主页发现 ${mainLinks.length} 个链接`);
    
    // 访问发现的链接（限制数量避免过度爬取）
    const linksToVisit = Array.from(allLinks).slice(0, 20);
    
    for (const link of linksToVisit) {
      if (visitedUrls.has(link)) continue;
      
      try {
        console.log(`  访问子页面: ${link}`);
        await page.goto(link, { waitUntil: 'networkidle0', timeout: 15000 });
        
        const subLinks = await extractLinks(page, site.selectors, site.baseUrl);
        subLinks.forEach(subLink => allLinks.add(subLink));
        visitedUrls.add(link);
        
        console.log(`    发现 ${subLinks.length} 个子链接`);
        
        // 添加延迟避免请求过快
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`    访问 ${link} 时出错:`, error.message);
        errors.push({ url: link, error: error.message });
      }
    }
    
  } catch (error) {
    console.log(`  检查 ${site.name} 时出错:`, error.message);
    errors.push({ url: site.baseUrl, error: error.message });
  } finally {
    await page.close();
  }
  
  return {
    site: site.name,
    baseUrl: site.baseUrl,
    totalLinks: allLinks.size,
    visitedPages: visitedUrls.size,
    allLinks: Array.from(allLinks).sort(),
    errors
  };
}

/**
 * 主函数
 */
async function main() {
  console.log('开始检查各网站的站点地图...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  try {
    for (const site of SITES) {
      const result = await checkSitemap(site, browser);
      results.push(result);
    }
    
    // 保存结果
    const outputPath = path.join(__dirname, '../crawled-content', `sitemap-analysis_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    await fs.writeFile(outputPath, JSON.stringify({
      summary: {
        totalSites: SITES.length,
        analyzedAt: new Date().toISOString(),
        totalLinksFound: results.reduce((sum, r) => sum + r.totalLinks, 0)
      },
      results
    }, null, 2));
    
    console.log(`\n站点地图分析完成！`);
    console.log(`结果已保存到: ${outputPath}`);
    
    // 打印摘要
    results.forEach(result => {
      console.log(`\n${result.site}:`);
      console.log(`  - 发现链接: ${result.totalLinks} 个`);
      console.log(`  - 访问页面: ${result.visitedPages} 个`);
      console.log(`  - 错误数量: ${result.errors.length} 个`);
    });
    
  } catch (error) {
    console.error('站点地图检查失败:', error);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkSitemap, extractLinks };