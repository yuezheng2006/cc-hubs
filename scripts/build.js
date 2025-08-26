#!/usr/bin/env node

/**
 * 构建脚本 - 为Vercel部署生成静态文件
 * 将Mintlify格式的文档转换为静态HTML站点
 */

const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

/**
 * 读取mint.json配置文件
 */
function readMintConfig() {
  try {
    const configPath = path.join(process.cwd(), 'mint.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('无法读取mint.json配置文件:', error.message);
    process.exit(1);
  }
}

/**
 * 生成HTML模板
 */
function generateHTMLTemplate(title, content, config) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${config.name || 'Claude Code 最佳实践'}</title>
  <meta name="description" content="${config.metadata?.description || 'Claude Code 最佳实践文档中心'}">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    .prose { max-width: none; }
    .sidebar { min-height: 100vh; }
    .content { min-height: 100vh; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="flex">
    <!-- 侧边栏 -->
    <nav class="sidebar w-64 bg-white shadow-lg p-6">
      <div class="mb-8">
        <h1 class="text-xl font-bold text-gray-900">${config.name || 'Claude Code'}</h1>
        <p class="text-sm text-gray-600 mt-2">${config.metadata?.description || '最佳实践文档'}</p>
      </div>
      <div class="space-y-2">
        ${generateNavigation(config.navigation || [])}
      </div>
    </nav>
    
    <!-- 主内容区 -->
    <main class="content flex-1 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg">
          ${content}
        </div>
      </div>
    </main>
  </div>
</body>
</html>`;
}

/**
 * 生成导航菜单
 */
function generateNavigation(navigation) {
  return navigation.map(item => {
    if (item.group) {
      return `
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">${item.group}</h3>
          <div class="mt-2 space-y-1">
            ${item.pages.map(page => `
              <a href="/${page.replace('.mdx', '.html')}" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                ${getPageTitle(page)}
              </a>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      return `
        <a href="/${item.replace('.mdx', '.html')}" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
          ${getPageTitle(item)}
        </a>
      `;
    }
  }).join('');
}

/**
 * 获取页面标题
 */
function getPageTitle(pagePath) {
  try {
    const fullPath = path.join(process.cwd(), pagePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(content);
    return data.title || path.basename(pagePath, '.mdx');
  } catch (error) {
    return path.basename(pagePath, '.mdx');
  }
}

/**
 * 处理单个MDX文件
 */
function processMarkdownFile(filePath, config) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // 转换Markdown为HTML
    const htmlContent = md.render(markdownContent);
    
    // 生成完整的HTML页面
    const fullHTML = generateHTMLTemplate(
      data.title || path.basename(filePath, '.mdx'),
      htmlContent,
      config
    );
    
    return fullHTML;
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error.message);
    return null;
  }
}

/**
 * 主构建函数
 */
async function build() {
  console.log('🚀 开始构建静态站点...');
  
  const config = readMintConfig();
  const outputDir = path.join(process.cwd(), 'out');
  
  // 清理输出目录
  await fs.remove(outputDir);
  await fs.ensureDir(outputDir);
  
  // 处理所有MDX文件
  const docsDir = path.join(process.cwd(), 'docs');
  
  if (fs.existsSync(docsDir)) {
    const files = await fs.readdir(docsDir, { recursive: true });
    
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const filePath = path.join(docsDir, file);
        const relativePath = path.relative(docsDir, filePath);
        const outputPath = path.join(outputDir, relativePath.replace(/\.(mdx|md)$/, '.html'));
        
        console.log(`📝 处理文件: ${relativePath}`);
        
        const html = processMarkdownFile(filePath, config);
        if (html) {
          await fs.ensureDir(path.dirname(outputPath));
          await fs.writeFile(outputPath, html, 'utf8');
        }
      }
    }
  }
  
  // 生成首页
  const indexPath = path.join(process.cwd(), 'docs', 'introduction.mdx');
  if (fs.existsSync(indexPath)) {
    const indexHTML = processMarkdownFile(indexPath, config);
    if (indexHTML) {
      await fs.writeFile(path.join(outputDir, 'index.html'), indexHTML, 'utf8');
    }
  }
  
  // 复制静态资源
  const staticDirs = ['images', 'assets', 'public'];
  for (const dir of staticDirs) {
    const srcDir = path.join(process.cwd(), dir);
    if (fs.existsSync(srcDir)) {
      const destDir = path.join(outputDir, dir);
      await fs.copy(srcDir, destDir);
      console.log(`📁 复制静态资源: ${dir}`);
    }
  }
  
  console.log('✅ 构建完成！输出目录:', outputDir);
}

// 运行构建
if (require.main === module) {
  build().catch(error => {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  });
}

module.exports = { build };