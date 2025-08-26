/**
 * Robots.txt生成API端点
 * 自动生成robots.txt文件以指导搜索引擎爬虫
 */

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
 * 生成robots.txt内容
 * @param {string} baseUrl - 网站基础URL
 * @returns {string} robots.txt内容
 */
function generateRobotsTxt(baseUrl) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // 生产环境 - 允许所有爬虫
    return `# Claude Code Best Practices Hub - Robots.txt
# Generated automatically

User-agent: *
Allow: /

# Disallow crawling of API endpoints
Disallow: /api/

# Disallow crawling of internal directories
Disallow: /.next/
Disallow: /.vercel/
Disallow: /node_modules/

# Disallow crawling of development files
Disallow: /*.json$
Disallow: /*.log$
Disallow: /*.env$

# Allow crawling of important static files
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml

# Crawl delay (optional - be respectful)
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block aggressive crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Allow social media crawlers for rich previews
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# Allow archive crawlers
User-agent: ia_archiver
Allow: /

User-agent: Wayback
Allow: /`;
  } else {
    // 开发/预览环境 - 禁止所有爬虫
    return `# Claude Code Best Practices Hub - Development Environment
# Generated automatically

User-agent: *
Disallow: /

# This is a development/preview environment
# Please visit the production site for public content

# Production site: https://claude-code-hub.vercel.app`;
  }
}

/**
 * 主要的robots.txt处理函数
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
    const baseUrl = getBaseUrl(req);
    const robotsTxt = generateRobotsTxt(baseUrl);
    
    // 设置响应头
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 缓存1天
    res.setHeader('X-Robots-Tag', 'noindex'); // robots.txt本身不需要被索引
    
    res.status(200).send(robotsTxt);
    
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    
    // 即使出错也要返回基本的robots.txt
    const fallbackRobots = `User-agent: *\nDisallow: /api/\nAllow: /`;
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(fallbackRobots);
  }
}