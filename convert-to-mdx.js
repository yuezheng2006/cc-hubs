const fs = require('fs');
const path = require('path');

/**
 * 将爬取的内容转换为mdx格式并分类到docs目录
 */
class ContentConverter {
  constructor() {
    this.sourceDir = './crawled-content/cc-docs-complete';
    this.targetDir = './docs';
    this.categories = {
      'best-practices': 'guides',
      'community-tips': 'guides', 
      'tools': 'tools',
      'advanced': 'advanced',
      'cursor': 'integrations',
      'sub-agents': 'advanced'
    };
  }

  /**
   * 确保目录存在
   */
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 清理文件名，移除特殊字符
   */
  cleanFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * 从元数据文件获取页面信息
   */
  getMetadata(metadataPath) {
    try {
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return {
          title: metadata.title || '未命名文档',
          description: metadata.description || '',
          url: metadata.url || ''
        };
      }
    } catch (error) {
      console.warn(`读取元数据失败: ${metadataPath}`);
    }
    return { title: '未命名文档', description: '', url: '' };
  }

  /**
   * 转换Markdown内容为MDX格式
   */
  convertToMdx(content, metadata) {
    // 添加frontmatter
    const frontmatter = `---
title: "${metadata.title}"
description: "${metadata.description}"
---

`;
    
    // 清理内容
    let cleanContent = content
      .replace(/^#\s+.*$/m, '') // 移除第一个标题，因为已经在frontmatter中
      .replace(/\n{3,}/g, '\n\n') // 减少多余的空行
      .trim();
    
    return frontmatter + cleanContent;
  }

  /**
   * 确定文档分类
   */
  categorizeDocument(fileName) {
    for (const [keyword, category] of Object.entries(this.categories)) {
      if (fileName.includes(keyword)) {
        return category;
      }
    }
    return 'guides'; // 默认分类
  }

  /**
   * 处理单个文档
   */
  processDocument(fileName) {
    const baseName = fileName.replace('.md', '');
    const mdPath = path.join(this.sourceDir, fileName);
    const metadataPath = path.join(this.sourceDir, `${baseName}_metadata.json`);
    
    if (!fs.existsSync(mdPath)) {
      return null;
    }

    try {
      // 读取内容和元数据
      const content = fs.readFileSync(mdPath, 'utf8');
      const metadata = this.getMetadata(metadataPath);
      
      // 确定分类和文件名
      const category = this.categorizeDocument(fileName);
      const cleanName = this.cleanFileName(baseName.replace(/^docs_zh_?/, ''));
      const mdxFileName = `${cleanName}.mdx`;
      
      // 创建目标目录
      const categoryDir = path.join(this.targetDir, category);
      this.ensureDir(categoryDir);
      
      // 转换内容
      const mdxContent = this.convertToMdx(content, metadata);
      
      // 写入文件
      const outputPath = path.join(categoryDir, mdxFileName);
      fs.writeFileSync(outputPath, mdxContent, 'utf8');
      
      return {
        source: fileName,
        target: path.relative('.', outputPath),
        category,
        title: metadata.title
      };
    } catch (error) {
      console.error(`处理文档失败 ${fileName}:`, error.message);
      return null;
    }
  }

  /**
   * 执行转换
   */
  async convert() {
    console.log('开始转换Claude Code文档为MDX格式...');
    
    if (!fs.existsSync(this.sourceDir)) {
      throw new Error(`源目录不存在: ${this.sourceDir}`);
    }

    // 获取所有中文Markdown文件
    const files = fs.readdirSync(this.sourceDir)
      .filter(file => file.startsWith('docs_zh') && file.endsWith('.md'))
      .filter(file => !file.includes('_metadata')) // 排除元数据文件
      .sort();

    console.log(`找到 ${files.length} 个中文文档文件`);

    const results = [];
    const stats = {
      total: files.length,
      success: 0,
      failed: 0,
      categories: {}
    };

    // 处理每个文件
    for (const file of files) {
      const result = this.processDocument(file);
      if (result) {
        results.push(result);
        stats.success++;
        stats.categories[result.category] = (stats.categories[result.category] || 0) + 1;
        console.log(`✓ ${result.source} -> ${result.target}`);
      } else {
        stats.failed++;
        console.log(`✗ 处理失败: ${file}`);
      }
    }

    // 生成转换报告
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      results,
      categories: Object.keys(stats.categories)
    };

    const reportPath = './crawled-content/conversion-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n转换完成！');
    console.log(`- 成功转换: ${stats.success} 个文档`);
    console.log(`- 失败: ${stats.failed} 个文档`);
    console.log(`- 分类统计:`, stats.categories);
    console.log(`- 报告保存至: ${reportPath}`);

    return report;
  }
}

// 执行转换
if (require.main === module) {
  const converter = new ContentConverter();
  converter.convert().catch(console.error);
}

module.exports = ContentConverter;