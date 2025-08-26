/**
 * 内容处理和格式化工具
 * 提供统一的内容处理、格式化和验证功能
 * @author Claude Code Hub Team
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

/**
 * 内容处理器类
 * 负责处理和格式化各种类型的文档内容
 */
class ContentProcessor {
  constructor() {
    this.supportedFormats = ['mdx', 'md'];
    this.requiredFields = ['title', 'description'];
  }

  /**
   * 处理Markdown内容，提取frontmatter和正文
   * @param {string} content - 原始Markdown内容
   * @returns {Object} 包含data和content的对象
   */
  parseMarkdown(content) {
    try {
      const parsed = matter(content);
      return {
        data: parsed.data,
        content: parsed.content,
        excerpt: parsed.excerpt || ''
      };
    } catch (error) {
      console.error('解析Markdown失败:', error.message);
      return {
        data: {},
        content: content,
        excerpt: ''
      };
    }
  }

  /**
   * 生成Mintlify格式的frontmatter
   * @param {Object} metadata - 元数据对象
   * @returns {string} 格式化的frontmatter字符串
   */
  generateFrontmatter(metadata) {
    const frontmatter = {
      title: metadata.title || '未命名文档',
      description: metadata.description || '',
      icon: metadata.icon || 'file-text',
      ...metadata
    };

    // 移除空值和undefined
    Object.keys(frontmatter).forEach(key => {
      if (frontmatter[key] === undefined || frontmatter[key] === null || frontmatter[key] === '') {
        delete frontmatter[key];
      }
    });

    return matter.stringify('', frontmatter).split('\n---\n')[0] + '\n---\n';
  }

  /**
   * 清理和格式化Markdown内容
   * @param {string} content - 原始内容
   * @returns {string} 清理后的内容
   */
  cleanMarkdownContent(content) {
    return content
      // 移除多余的空行
      .replace(/\n{3,}/g, '\n\n')
      // 标准化标题格式
      .replace(/^#{1,6}\s*/gm, (match) => match.trim() + ' ')
      // 清理代码块格式
      .replace(/```([\s\S]*?)```/g, (match, code) => {
        const lines = code.split('\n');
        const lang = lines[0].trim();
        const codeContent = lines.slice(1, -1).join('\n');
        return `\`\`\`${lang}\n${codeContent}\n\`\`\``;
      })
      // 标准化链接格式
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1]($2)')
      // 移除HTML注释
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
  }

  /**
   * 验证内容格式和必需字段
   * @param {Object} parsed - 解析后的内容对象
   * @returns {Object} 验证结果
   */
  validateContent(parsed) {
    const errors = [];
    const warnings = [];

    // 检查必需字段
    this.requiredFields.forEach(field => {
      if (!parsed.data[field]) {
        errors.push(`缺少必需字段: ${field}`);
      }
    });

    // 检查内容长度
    if (parsed.content.length < 50) {
      warnings.push('内容过短，可能影响SEO效果');
    }

    // 检查标题层级
    const headings = parsed.content.match(/^#{1,6}\s+.+$/gm) || [];
    if (headings.length === 0) {
      warnings.push('文档缺少标题结构');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 生成文档摘要
   * @param {string} content - 文档内容
   * @param {number} maxLength - 最大长度
   * @returns {string} 文档摘要
   */
  generateSummary(content, maxLength = 160) {
    // 移除Markdown格式
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // 移除标题标记
      .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体
      .replace(/\*([^*]+)\*/g, '$1') // 移除斜体
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接格式
      .replace(/`([^`]+)`/g, '$1') // 移除行内代码
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/\n+/g, ' ') // 替换换行为空格
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    // 在单词边界截断
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  /**
   * 提取文档中的标签
   * @param {string} content - 文档内容
   * @returns {Array} 标签数组
   */
  extractTags(content) {
    const tags = new Set();

    // 从内容中提取常见的技术关键词
    const techKeywords = [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'node.js', 'python',
      'api', 'rest', 'graphql', 'database', 'sql', 'mongodb', 'redis',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'devops',
      'testing', 'jest', 'cypress', 'webpack', 'vite', 'babel',
      'css', 'sass', 'tailwind', 'bootstrap', 'html', 'markdown'
    ];

    const lowerContent = content.toLowerCase();
    techKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        tags.add(keyword);
      }
    });

    return Array.from(tags).slice(0, 10); // 限制标签数量
  }

  /**
   * 生成完整的Mintlify文档
   * @param {Object} options - 生成选项
   * @returns {string} 完整的文档内容
   */
  generateMintlifyDocument(options) {
    const {
      title,
      description,
      content,
      icon = 'file-text',
      tags = [],
      category = 'general',
      lastUpdated = new Date().toISOString().split('T')[0],
      ...otherMetadata
    } = options;

    const metadata = {
      title,
      description: description || this.generateSummary(content),
      icon,
      tags: tags.length > 0 ? tags : this.extractTags(content),
      category,
      lastUpdated,
      ...otherMetadata
    };

    const frontmatter = this.generateFrontmatter(metadata);
    const cleanContent = this.cleanMarkdownContent(content);

    return frontmatter + '\n' + cleanContent;
  }

  /**
   * 批量处理文档文件
   * @param {Array} files - 文件路径数组
   * @param {Function} processor - 处理函数
   * @returns {Promise<Array>} 处理结果数组
   */
  async batchProcess(files, processor) {
    const results = [];
    const batchSize = 5; // 并发处理数量

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(file => processor(file))
      );

      results.push(...batchResults.map((result, index) => ({
        file: batch[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      })));

      // 添加延迟避免过载
      if (i + batchSize < files.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * 保存处理后的文档
   * @param {string} filePath - 文件路径
   * @param {string} content - 文档内容
   * @returns {Promise<boolean>} 保存是否成功
   */
  async saveDocument(filePath, content) {
    try {
      // 确保目录存在
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // 写入文件
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ 文档已保存: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ 保存文档失败 ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * 读取并解析文档文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} 解析后的文档对象
   */
  async loadDocument(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = this.parseMarkdown(content);
      const validation = this.validateContent(parsed);

      return {
        filePath,
        ...parsed,
        validation,
        stats: {
          wordCount: parsed.content.split(/\s+/).length,
          charCount: parsed.content.length,
          readingTime: Math.ceil(parsed.content.split(/\s+/).length / 200) // 假设每分钟200词
        }
      };
    } catch (error) {
      console.error(`读取文档失败 ${filePath}:`, error.message);
      return null;
    }
  }
}

/**
 * 创建内容处理器实例
 * @returns {ContentProcessor} 内容处理器实例
 */
function createContentProcessor() {
  return new ContentProcessor();
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化的文件大小
 */
function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 生成唯一的文件名
 * @param {string} baseName - 基础文件名
 * @param {string} extension - 文件扩展名
 * @returns {string} 唯一的文件名
 */
function generateUniqueFileName(baseName, extension = '.mdx') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseName}-${timestamp}-${random}${extension}`;
}

module.exports = {
  ContentProcessor,
  createContentProcessor,
  formatFileSize,
  generateUniqueFileName
};