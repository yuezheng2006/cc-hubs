/**
 * Sitemap.xml生成API端点
 * 自动生成网站地图以提升SEO
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * 获取所有文档页面
 * @returns {Promise<Array>} 文档页面列表
 */
async function getAllDocumentPages() {
  const pages = [];
  const docsPath = path.join(process.cwd(), 'docs');
  
  try {
    await scanDirectory(docsPath, pages, '');
    return pages;
  } catch (error) {
    console.error('Error scanning documents:', error);
    return [];
  }
}

/**
 * 递归扫描目录
 * @param {string} dirPath - 目录路径
 * @param {Array} pages - 页面列表
 * @param {string} urlPath - URL路径
 */
async function scanDirectory(dirPath, pages, urlPath) {
  const items = await fs.readdir(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = await fs.stat(itemPath);
    
    if (stats.isDirectory()) {
      // 跳过隐藏目录和特殊目录
      if (item.startsWith('.') || item === 'node_modules') {
        continue;
      }
      
      const newUrlPath = urlPath ? `${urlPath}/${item}` : item;
      await scanDirectory(itemPath, pages, newUrlPath);
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      // 处理文档文件
      const fileName = path.basename(item, path.extname(item));
      let pageUrl;
      
      if (fileName === 'index') {
        pageUrl = urlPath || '/';
      } else {
        pageUrl = urlPath ? `${urlPath}/${fileName}` : fileName;
      }
      
      // 确保URL以/开头
      if (!pageUrl.startsWith('/')) {
        pageUrl = '/' + pageUrl;
      }
      
      // 获取文件元数据
      const metadata = await getFileMetadata(itemPath);
      
      pages.push({
        url: pageUrl,
        lastModified: stats.mtime,
        priority: calculatePriority(pageUrl, metadata),
        changeFreq: calculateChangeFrequency(pageUrl, metadata)
      });
    }
  }
}

/**
 * 获取文件元数据
 * @param {string} filePath - 文件路径
 * @returns {Promise<Object>} 文件元数据
 */
async function getFileMetadata(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const metadata = {};
      
      // 简单解析YAML frontmatter
      frontmatter.split('\n').forEach(line => {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          
          // 移除引号
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          metadata[key] = value;
        }
      });
      
      return metadata;
    }
    
    return {};
  } catch (error) {
    return {};
  }
}

/**
 * 计算页面优先级
 * @param {string} url - 页面URL
 * @param {Object} metadata - 页面元数据
 * @returns {number} 优先级 (0.0-1.0)
 */
function calculatePriority(url, metadata) {
  // 根据元数据中的优先级
  if (metadata.priority) {
    return parseFloat(metadata.priority);
  }
  
  // 根据URL路径计算优先级
  if (url === '/') {
    return 1.0; // 首页最高优先级
  }
  
  if (url === '/getting-started' || url === '/about') {
    return 0.9; // 重要页面
  }
  
  if (url.includes('/workflows') || url.includes('/commands') || url.includes('/roles')) {
    return 0.8; // 核心内容页面
  }
  
  // 根据URL深度计算
  const depth = url.split('/').length - 1;
  if (depth === 1) return 0.7;
  if (depth === 2) return 0.6;
  if (depth === 3) return 0.5;
  
  return 0.4; // 默认优先级
}

/**
 * 计算更新频率
 * @param {string} url - 页面URL
 * @param {Object} metadata - 页面元数据
 * @returns {string} 更新频率
 */
function calculateChangeFrequency(url, metadata) {
  // 根据元数据中的更新频率
  if (metadata.changefreq) {
    return metadata.changefreq;
  }
  
  // 根据页面类型计算更新频率
  if (url === '/') {
    return 'daily'; // 首页经常更新
  }
  
  if (url.includes('/workflows') || url.includes('/commands')) {
    return 'weekly'; // 内容页面定期更新
  }
  
  if (url === '/about' || url === '/getting-started') {
    return 'monthly'; // 静态页面较少更新
  }
  
  return 'monthly'; // 默认更新频率
}

/**
 * 生成XML sitemap
 * @param {Array} pages - 页面列表
 * @param {string} baseUrl - 网站基础URL
 * @returns {string} XML sitemap内容
 */
function generateSitemapXML(pages, baseUrl) {
  const urls = pages.map(page => {
    const fullUrl = `${baseUrl}${page.url}`;
    const lastmod = page.lastModified.toISOString().split('T')[0];
    
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * 获取网站基础URL
 * @param {Object} req - 请求对象
 * @returns {string} 基础URL
 */
function getBaseUrl(req) {
  // 从环境变量获取
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  
  // 从请求头获取
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || req.headers['x-forwarded-host'];
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // 默认值
  return 'https://claude-code-hub.vercel.app';
}

/**
 * 主要的sitemap处理函数
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const startTime = Date.now();
    
    // 获取所有页面
    const pages = await getAllDocumentPages();
    
    // 添加静态页面
    const baseUrl = getBaseUrl(req);
    const staticPages = [
      {
        url: '/',
        lastModified: new Date(),
        priority: 1.0,
        changeFreq: 'daily'
      }
    ];
    
    const allPages = [...staticPages, ...pages];
    
    // 生成sitemap XML
    const sitemapXML = generateSitemapXML(allPages, baseUrl);
    
    const generationTime = Date.now() - startTime;
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // 缓存1小时，CDN缓存1天
    res.setHeader('X-Generation-Time', `${generationTime}ms`);
    res.setHeader('X-Total-Pages', allPages.length.toString());
    
    res.status(200).send(sitemapXML);
    
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    res.status(500).json({
      error: 'Internal server error during sitemap generation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}