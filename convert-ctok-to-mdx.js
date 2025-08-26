const fs = require('fs');
const path = require('path');

/**
 * Ctok内容转换脚本
 * 将爬取的ctok内容转换为mdx格式并分类整合到docs目录
 */
class CtokConverter {
  constructor() {
    this.sourceDir = './crawled-content/ctok-complete';
    this.docsDir = './docs';
    this.results = [];
    this.categories = {
      guides: [],
      tools: [],
      community: [],
      setup: []
    };
  }

  /**
   * 根据文件名和标题确定分类
   */
  categorizeDocument(fileName, title) {
    const lowerFileName = fileName.toLowerCase();
    const lowerTitle = title.toLowerCase();
    
    if (lowerFileName.includes('setup') || lowerFileName.includes('install') || 
        lowerFileName.includes('windows-env') || lowerFileName.includes('commands-guide')) {
      return 'setup';
    }
    
    if (lowerFileName.includes('tips') || lowerFileName.includes('best-practices') || 
        lowerFileName.includes('complete-guide') || lowerFileName.includes('workflow')) {
      return 'guides';
    }
    
    if (lowerFileName.includes('subagents') || lowerFileName.includes('evolution') ||
        lowerFileName.includes('versions')) {
      return 'tools';
    }
    
    if (lowerFileName.includes('group') || lowerFileName.includes('carpool') ||
        lowerFileName.includes('community') || lowerFileName.includes('index')) {
      return 'community';
    }
    
    // 默认分类
    return 'guides';
  }

  /**
   * 生成友好的文件名
   */
  generateFriendlyFileName(originalFileName, title) {
    // 从原始文件名提取关键部分
    const parts = originalFileName.split('_');
    if (parts.length >= 2) {
      let baseName = parts[1]; // 获取URL路径部分
      
      // 清理文件名
      baseName = baseName.replace(/^claude-code-/, 'ctok-');
      
      // 特殊处理一些文件名
      const nameMap = {
        'ctok-setup-ctok': 'ctok-installation-guide',
        'ctok-windows-env-setup': 'ctok-windows-environment',
        'ctok-commands-guide': 'ctok-commands-reference',
        'ctok-best-practices': 'ctok-best-practices',
        'ctok-34-tips': 'ctok-34-tips',
        'ctok-complete-guide': 'ctok-complete-guide',
        'ctok-23-practical-tips-goodbye-cursor': 'ctok-23-practical-tips',
        'ctok-vibe-coding-workflow': 'ctok-vibe-workflow',
        'ctok-subagents-evolution': 'ctok-subagents-guide',
        'ctok-max-versions': 'ctok-version-comparison',
        'ctok-group': 'ctok-community',
        'en_': 'ctok-english-guide',
        'index': 'ctok-overview'
      };
      
      return nameMap[baseName] || baseName;
    }
    
    return 'ctok-document';
  }

  /**
   * 清理和优化Markdown内容
   */
  cleanMarkdownContent(content, title) {
    let cleaned = content;
    
    // 移除重复的标题
    const titleRegex = new RegExp(`^#\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*$`, 'gm');
    cleaned = cleaned.replace(titleRegex, '');
    
    // 清理多余的空行
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // 清理页面导航和无关内容
    cleaned = cleaned.replace(/\[Skip to content\].*?\n/g, '');
    cleaned = cleaned.replace(/简体中文\s*简体中文\s*主题/g, '');
    
    // 清理重复的链接文本
    cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)\s*\1/g, '[$1]($2)');
    
    // 确保内容以换行符结尾
    if (!cleaned.endsWith('\n')) {
      cleaned += '\n';
    }
    
    return cleaned.trim();
  }

  /**
   * 生成MDX前置元数据
   */
  generateFrontmatter(title, fileName, category, originalUrl) {
    // 清理标题，移除网站后缀
    const cleanTitle = title.replace(/\s*\|\s*Ctok.*$/, '').trim();
    
    const frontmatter = {
      title: cleanTitle,
      description: this.generateDescription(cleanTitle, category),
      category: category,
      source: 'ctok',
      originalUrl: originalUrl,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    return '---\n' + 
           Object.entries(frontmatter)
             .map(([key, value]) => `${key}: "${value}"`)
             .join('\n') + 
           '\n---\n\n';
  }

  /**
   * 生成文档描述
   */
  generateDescription(title, category) {
    const descriptions = {
      'setup': `${title} - Ctok Claude Code 安装配置指南`,
      'guides': `${title} - Ctok Claude Code 使用指南和最佳实践`,
      'tools': `${title} - Ctok Claude Code 工具和功能介绍`,
      'community': `${title} - Ctok Claude Code 社区和拼车服务`
    };
    
    return descriptions[category] || `${title} - Ctok Claude Code 文档`;
  }

  /**
   * 转换单个文档
   */
  convertDocument(fileName) {
    try {
      const baseName = fileName.replace(/\.(md|html|json)$/, '');
      const mdFile = path.join(this.sourceDir, `${baseName}.md`);
      const metadataFile = path.join(this.sourceDir, `${baseName}_metadata.json`);
      
      if (!fs.existsSync(mdFile) || !fs.existsSync(metadataFile)) {
        console.log(`跳过不完整的文件: ${baseName}`);
        return null;
      }
      
      // 读取内容和元数据
      const content = fs.readFileSync(mdFile, 'utf8');
      const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
      
      const { title, url } = metadata;
      
      // 确定分类和文件名
      const category = this.categorizeDocument(baseName, title);
      const friendlyFileName = this.generateFriendlyFileName(baseName, title);
      
      // 清理内容
      const cleanedContent = this.cleanMarkdownContent(content, title);
      
      // 生成MDX内容
      const frontmatter = this.generateFrontmatter(title, friendlyFileName, category, url);
      const mdxContent = frontmatter + cleanedContent;
      
      // 确保目标目录存在
      const categoryDir = path.join(this.docsDir, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // 写入MDX文件
      const outputFile = path.join(categoryDir, `${friendlyFileName}.mdx`);
      fs.writeFileSync(outputFile, mdxContent, 'utf8');
      
      const result = {
        originalFile: baseName,
        title: title.replace(/\s*\|\s*Ctok.*$/, '').trim(),
        category,
        outputFile,
        fileName: friendlyFileName,
        contentLength: cleanedContent.length,
        success: true
      };
      
      this.results.push(result);
      this.categories[category].push(result);
      
      console.log(`✅ 转换成功: ${result.title} -> ${category}/${friendlyFileName}.mdx`);
      
      return result;
      
    } catch (error) {
      console.error(`转换失败: ${fileName} - ${error.message}`);
      this.results.push({
        originalFile: fileName,
        success: false,
        error: error.message
      });
      return null;
    }
  }

  /**
   * 转换所有文档
   */
  convertAll() {
    console.log('🚀 开始转换 Ctok 文档...');
    
    if (!fs.existsSync(this.sourceDir)) {
      throw new Error(`源目录不存在: ${this.sourceDir}`);
    }
    
    // 获取所有.md文件
    const files = fs.readdirSync(this.sourceDir)
      .filter(file => file.endsWith('.md') && !file.includes('_metadata'))
      .sort();
    
    console.log(`📋 找到 ${files.length} 个文档文件`);
    
    // 转换每个文件
    files.forEach(file => {
      this.convertDocument(file);
    });
    
    // 生成转换报告
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: files.length,
      successfulConversions: this.results.filter(r => r.success).length,
      failedConversions: this.results.filter(r => !r.success).length,
      categories: Object.fromEntries(
        Object.entries(this.categories).map(([cat, docs]) => [cat, docs.length])
      ),
      results: this.results
    };
    
    const reportFile = path.join(this.sourceDir, `conversion-report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
    
    console.log('\n📊 转换完成统计:');
    console.log(`✅ 成功: ${report.successfulConversions}`);
    console.log(`❌ 失败: ${report.failedConversions}`);
    console.log('📂 分类统计:');
    Object.entries(report.categories).forEach(([cat, count]) => {
      if (count > 0) {
        console.log(`  ${cat}: ${count} 个文档`);
      }
    });
    console.log(`📄 报告文件: ${reportFile}`);
    
    return report;
  }
}

// 执行转换
if (require.main === module) {
  const converter = new CtokConverter();
  converter.convertAll().catch(console.error);
}

module.exports = CtokConverter;