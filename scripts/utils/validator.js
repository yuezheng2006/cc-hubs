/**
 * 文档验证工具
 * 提供全面的文档质量检查、格式验证和内容分析功能
 * @author Claude Code Hub Team
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { createContentProcessor } = require('./content-processor');

/**
 * 文档验证器类
 * 负责检查文档的质量、格式和内容完整性
 */
class DocumentValidator {
  constructor() {
    this.contentProcessor = createContentProcessor();
    this.rules = {
      // 必需字段规则
      requiredFields: ['title', 'description'],
      // 内容长度规则
      minContentLength: 100,
      maxContentLength: 50000,
      // 标题规则
      maxTitleLength: 100,
      minTitleLength: 5,
      // 描述规则
      maxDescriptionLength: 300,
      minDescriptionLength: 20,
      // 标签规则
      maxTags: 10,
      minTags: 1,
      // 链接规则
      maxExternalLinks: 20,
      // 图片规则
      maxImages: 15
    };
  }

  /**
   * 验证单个文档
   * @param {string} filePath - 文档文件路径
   * @returns {Promise<Object>} 验证结果
   */
  async validateDocument(filePath) {
    const result = {
      filePath,
      isValid: true,
      score: 100,
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: {},
      timestamp: new Date().toISOString()
    };

    try {
      // 检查文件是否存在
      const stats = await fs.stat(filePath);
      result.metrics.fileSize = stats.size;

      // 读取和解析文档
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = this.contentProcessor.parseMarkdown(content);
      
      // 执行各项验证
      this.validateFrontmatter(parsed.data, result);
      this.validateContent(parsed.content, result);
      this.validateStructure(parsed.content, result);
      this.validateLinks(parsed.content, result);
      this.validateImages(parsed.content, result);
      this.validateCodeBlocks(parsed.content, result);
      this.validateAccessibility(parsed, result);
      this.validateSEO(parsed, result);
      
      // 计算最终分数
      result.score = this.calculateScore(result);
      result.isValid = result.errors.length === 0;
      
    } catch (error) {
      result.isValid = false;
      result.score = 0;
      result.errors.push({
        type: 'file_error',
        message: `无法读取文件: ${error.message}`,
        severity: 'error'
      });
    }

    return result;
  }

  /**
   * 验证文档前置元数据
   * @param {Object} frontmatter - 前置元数据
   * @param {Object} result - 验证结果对象
   */
  validateFrontmatter(frontmatter, result) {
    // 检查必需字段
    this.rules.requiredFields.forEach(field => {
      if (!frontmatter[field]) {
        result.errors.push({
          type: 'missing_field',
          field,
          message: `缺少必需字段: ${field}`,
          severity: 'error'
        });
      }
    });

    // 验证标题
    if (frontmatter.title) {
      const titleLength = frontmatter.title.length;
      if (titleLength < this.rules.minTitleLength) {
        result.warnings.push({
          type: 'title_too_short',
          message: `标题过短 (${titleLength} 字符)，建议至少 ${this.rules.minTitleLength} 字符`,
          severity: 'warning'
        });
      }
      if (titleLength > this.rules.maxTitleLength) {
        result.warnings.push({
          type: 'title_too_long',
          message: `标题过长 (${titleLength} 字符)，建议不超过 ${this.rules.maxTitleLength} 字符`,
          severity: 'warning'
        });
      }
    }

    // 验证描述
    if (frontmatter.description) {
      const descLength = frontmatter.description.length;
      if (descLength < this.rules.minDescriptionLength) {
        result.warnings.push({
          type: 'description_too_short',
          message: `描述过短 (${descLength} 字符)，建议至少 ${this.rules.minDescriptionLength} 字符`,
          severity: 'warning'
        });
      }
      if (descLength > this.rules.maxDescriptionLength) {
        result.warnings.push({
          type: 'description_too_long',
          message: `描述过长 (${descLength} 字符)，建议不超过 ${this.rules.maxDescriptionLength} 字符`,
          severity: 'warning'
        });
      }
    }

    // 验证标签
    if (frontmatter.tags) {
      if (Array.isArray(frontmatter.tags)) {
        if (frontmatter.tags.length < this.rules.minTags) {
          result.suggestions.push({
            type: 'add_tags',
            message: '建议添加更多标签以提高可发现性',
            severity: 'info'
          });
        }
        if (frontmatter.tags.length > this.rules.maxTags) {
          result.warnings.push({
            type: 'too_many_tags',
            message: `标签过多 (${frontmatter.tags.length})，建议不超过 ${this.rules.maxTags} 个`,
            severity: 'warning'
          });
        }
      } else {
        result.errors.push({
          type: 'invalid_tags_format',
          message: '标签应该是数组格式',
          severity: 'error'
        });
      }
    }

    // 验证图标
    if (frontmatter.icon && typeof frontmatter.icon !== 'string') {
      result.warnings.push({
        type: 'invalid_icon',
        message: '图标应该是字符串类型',
        severity: 'warning'
      });
    }
  }

  /**
   * 验证文档内容
   * @param {string} content - 文档内容
   * @param {Object} result - 验证结果对象
   */
  validateContent(content, result) {
    const contentLength = content.length;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    result.metrics.contentLength = contentLength;
    result.metrics.wordCount = wordCount;
    result.metrics.readingTime = Math.ceil(wordCount / 200);

    // 检查内容长度
    if (contentLength < this.rules.minContentLength) {
      result.warnings.push({
        type: 'content_too_short',
        message: `内容过短 (${contentLength} 字符)，建议至少 ${this.rules.minContentLength} 字符`,
        severity: 'warning'
      });
    }
    
    if (contentLength > this.rules.maxContentLength) {
      result.warnings.push({
        type: 'content_too_long',
        message: `内容过长 (${contentLength} 字符)，建议分割为多个文档`,
        severity: 'warning'
      });
    }

    // 检查空内容
    if (content.trim().length === 0) {
      result.errors.push({
        type: 'empty_content',
        message: '文档内容为空',
        severity: 'error'
      });
    }

    // 检查重复内容
    const duplicateLines = this.findDuplicateLines(content);
    if (duplicateLines.length > 0) {
      result.warnings.push({
        type: 'duplicate_content',
        message: `发现 ${duplicateLines.length} 行重复内容`,
        details: duplicateLines.slice(0, 5), // 只显示前5个
        severity: 'warning'
      });
    }
  }

  /**
   * 验证文档结构
   * @param {string} content - 文档内容
   * @param {Object} result - 验证结果对象
   */
  validateStructure(content, result) {
    // 提取标题
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    result.metrics.headingCount = headings.length;

    if (headings.length === 0) {
      result.warnings.push({
        type: 'no_headings',
        message: '文档缺少标题结构，影响可读性',
        severity: 'warning'
      });
    }

    // 检查标题层级
    const headingLevels = headings.map(h => h.match(/^#{1,6}/)[0].length);
    const hasH1 = headingLevels.includes(1);
    
    if (!hasH1 && headings.length > 0) {
      result.suggestions.push({
        type: 'add_h1',
        message: '建议添加一级标题 (H1) 作为文档主标题',
        severity: 'info'
      });
    }

    // 检查标题层级跳跃
    for (let i = 1; i < headingLevels.length; i++) {
      const prevLevel = headingLevels[i - 1];
      const currentLevel = headingLevels[i];
      
      if (currentLevel - prevLevel > 1) {
        result.warnings.push({
          type: 'heading_level_skip',
          message: `标题层级跳跃: H${prevLevel} 到 H${currentLevel}`,
          line: i + 1,
          severity: 'warning'
        });
      }
    }

    // 检查段落结构
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    result.metrics.paragraphCount = paragraphs.length;

    if (paragraphs.length < 2) {
      result.suggestions.push({
        type: 'add_paragraphs',
        message: '建议将内容分为多个段落以提高可读性',
        severity: 'info'
      });
    }
  }

  /**
   * 验证链接
   * @param {string} content - 文档内容
   * @param {Object} result - 验证结果对象
   */
  validateLinks(content, result) {
    // 提取所有链接
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
        position: match.index
      });
    }

    result.metrics.linkCount = links.length;

    // 检查链接数量
    const externalLinks = links.filter(link => 
      link.url.startsWith('http://') || link.url.startsWith('https://')
    );
    
    if (externalLinks.length > this.rules.maxExternalLinks) {
      result.warnings.push({
        type: 'too_many_external_links',
        message: `外部链接过多 (${externalLinks.length})，可能影响页面加载速度`,
        severity: 'warning'
      });
    }

    // 检查空链接文本
    const emptyTextLinks = links.filter(link => !link.text.trim());
    if (emptyTextLinks.length > 0) {
      result.warnings.push({
        type: 'empty_link_text',
        message: `发现 ${emptyTextLinks.length} 个空链接文本`,
        severity: 'warning'
      });
    }

    // 检查重复链接
    const urlCounts = {};
    links.forEach(link => {
      urlCounts[link.url] = (urlCounts[link.url] || 0) + 1;
    });
    
    const duplicateUrls = Object.entries(urlCounts)
      .filter(([url, count]) => count > 1)
      .map(([url]) => url);
    
    if (duplicateUrls.length > 0) {
      result.suggestions.push({
        type: 'duplicate_links',
        message: `发现 ${duplicateUrls.length} 个重复链接`,
        details: duplicateUrls.slice(0, 3),
        severity: 'info'
      });
    }
  }

  /**
   * 验证图片
   * @param {string} content - 文档内容
   * @param {Object} result - 验证结果对象
   */
  validateImages(content, result) {
    // 提取图片
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1],
        src: match[2],
        position: match.index
      });
    }

    result.metrics.imageCount = images.length;

    // 检查图片数量
    if (images.length > this.rules.maxImages) {
      result.warnings.push({
        type: 'too_many_images',
        message: `图片过多 (${images.length})，可能影响页面加载速度`,
        severity: 'warning'
      });
    }

    // 检查缺少alt文本的图片
    const missingAltImages = images.filter(img => !img.alt.trim());
    if (missingAltImages.length > 0) {
      result.warnings.push({
        type: 'missing_alt_text',
        message: `${missingAltImages.length} 张图片缺少alt文本，影响可访问性`,
        severity: 'warning'
      });
    }
  }

  /**
   * 验证代码块
   * @param {string} content - 文档内容
   * @param {Object} result - 验证结果对象
   */
  validateCodeBlocks(content, result) {
    // 提取代码块
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const lines = match[1].split('\n');
      const language = lines[0].trim();
      const code = lines.slice(1, -1).join('\n');
      
      codeBlocks.push({
        language,
        code,
        position: match.index
      });
    }

    result.metrics.codeBlockCount = codeBlocks.length;

    // 检查没有语言标识的代码块
    const noLangBlocks = codeBlocks.filter(block => !block.language);
    if (noLangBlocks.length > 0) {
      result.suggestions.push({
        type: 'add_code_language',
        message: `${noLangBlocks.length} 个代码块缺少语言标识`,
        severity: 'info'
      });
    }

    // 检查空代码块
    const emptyBlocks = codeBlocks.filter(block => !block.code.trim());
    if (emptyBlocks.length > 0) {
      result.warnings.push({
        type: 'empty_code_blocks',
        message: `发现 ${emptyBlocks.length} 个空代码块`,
        severity: 'warning'
      });
    }
  }

  /**
   * 验证可访问性
   * @param {Object} parsed - 解析后的文档
   * @param {Object} result - 验证结果对象
   */
  validateAccessibility(parsed, result) {
    const content = parsed.content;
    
    // 检查颜色对比度相关的文本
    if (content.includes('color:') || content.includes('background:')) {
      result.suggestions.push({
        type: 'check_color_contrast',
        message: '请确保颜色对比度符合WCAG标准',
        severity: 'info'
      });
    }

    // 检查表格是否有标题
    const tables = content.match(/\|[^\n]+\|/g) || [];
    if (tables.length > 0) {
      const hasTableHeaders = content.includes('|---') || content.includes('| --- ');
      if (!hasTableHeaders) {
        result.suggestions.push({
          type: 'add_table_headers',
          message: '建议为表格添加标题行以提高可访问性',
          severity: 'info'
        });
      }
    }
  }

  /**
   * 验证SEO优化
   * @param {Object} parsed - 解析后的文档
   * @param {Object} result - 验证结果对象
   */
  validateSEO(parsed, result) {
    const { data, content } = parsed;
    
    // 检查meta描述
    if (!data.description) {
      result.suggestions.push({
        type: 'add_meta_description',
        message: '建议添加meta描述以提高SEO效果',
        severity: 'info'
      });
    }

    // 检查关键词密度
    if (data.title) {
      const titleWords = data.title.toLowerCase().split(/\s+/);
      const contentLower = content.toLowerCase();
      
      titleWords.forEach(word => {
        if (word.length > 3) {
          const occurrences = (contentLower.match(new RegExp(word, 'g')) || []).length;
          const density = (occurrences / content.split(/\s+/).length) * 100;
          
          if (density > 5) {
            result.warnings.push({
              type: 'keyword_stuffing',
              message: `关键词 "${word}" 密度过高 (${density.toFixed(1)}%)`,
              severity: 'warning'
            });
          }
        }
      });
    }
  }

  /**
   * 查找重复行
   * @param {string} content - 文档内容
   * @returns {Array} 重复行数组
   */
  findDuplicateLines(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 10);
    const lineCounts = {};
    const duplicates = [];

    lines.forEach(line => {
      lineCounts[line] = (lineCounts[line] || 0) + 1;
    });

    Object.entries(lineCounts).forEach(([line, count]) => {
      if (count > 1) {
        duplicates.push({ line, count });
      }
    });

    return duplicates;
  }

  /**
   * 计算文档质量分数
   * @param {Object} result - 验证结果对象
   * @returns {number} 质量分数 (0-100)
   */
  calculateScore(result) {
    let score = 100;
    
    // 错误扣分
    result.errors.forEach(error => {
      switch (error.type) {
        case 'missing_field':
          score -= 15;
          break;
        case 'empty_content':
          score -= 30;
          break;
        case 'file_error':
          score -= 50;
          break;
        default:
          score -= 10;
      }
    });

    // 警告扣分
    result.warnings.forEach(warning => {
      switch (warning.type) {
        case 'content_too_short':
          score -= 8;
          break;
        case 'missing_alt_text':
          score -= 5;
          break;
        case 'too_many_external_links':
          score -= 3;
          break;
        default:
          score -= 2;
      }
    });

    // 建议轻微扣分
    score -= result.suggestions.length * 0.5;

    return Math.max(0, Math.round(score));
  }

  /**
   * 批量验证文档
   * @param {Array} filePaths - 文件路径数组
   * @returns {Promise<Object>} 批量验证结果
   */
  async validateBatch(filePaths) {
    const results = [];
    const summary = {
      total: filePaths.length,
      valid: 0,
      invalid: 0,
      averageScore: 0,
      commonIssues: {}
    };

    console.log(`🔍 开始验证 ${filePaths.length} 个文档...`);

    for (const filePath of filePaths) {
      try {
        const result = await this.validateDocument(filePath);
        results.push(result);
        
        if (result.isValid) {
          summary.valid++;
        } else {
          summary.invalid++;
        }

        // 统计常见问题
        [...result.errors, ...result.warnings].forEach(issue => {
          summary.commonIssues[issue.type] = (summary.commonIssues[issue.type] || 0) + 1;
        });

        console.log(`✓ ${path.basename(filePath)} (分数: ${result.score})`);
      } catch (error) {
        console.error(`✗ ${path.basename(filePath)}: ${error.message}`);
        summary.invalid++;
      }
    }

    summary.averageScore = Math.round(
      results.reduce((sum, r) => sum + r.score, 0) / results.length
    );

    console.log(`\n📊 验证完成: ${summary.valid}/${summary.total} 个文档通过验证`);
    console.log(`📈 平均分数: ${summary.averageScore}/100`);

    return { results, summary };
  }

  /**
   * 生成验证报告
   * @param {Object} batchResult - 批量验证结果
   * @returns {string} HTML格式的报告
   */
  generateReport(batchResult) {
    const { results, summary } = batchResult;
    
    let report = `# 文档质量验证报告\n\n`;
    report += `**生成时间**: ${new Date().toLocaleString()}\n\n`;
    report += `## 总体概况\n\n`;
    report += `- 总文档数: ${summary.total}\n`;
    report += `- 通过验证: ${summary.valid}\n`;
    report += `- 验证失败: ${summary.invalid}\n`;
    report += `- 平均分数: ${summary.averageScore}/100\n\n`;
    
    if (Object.keys(summary.commonIssues).length > 0) {
      report += `## 常见问题\n\n`;
      Object.entries(summary.commonIssues)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([issue, count]) => {
          report += `- ${issue}: ${count} 次\n`;
        });
      report += `\n`;
    }
    
    report += `## 详细结果\n\n`;
    results.forEach(result => {
      const fileName = path.basename(result.filePath);
      const status = result.isValid ? '✅' : '❌';
      report += `### ${status} ${fileName} (${result.score}/100)\n\n`;
      
      if (result.errors.length > 0) {
        report += `**错误**:\n`;
        result.errors.forEach(error => {
          report += `- ${error.message}\n`;
        });
        report += `\n`;
      }
      
      if (result.warnings.length > 0) {
        report += `**警告**:\n`;
        result.warnings.forEach(warning => {
          report += `- ${warning.message}\n`;
        });
        report += `\n`;
      }
    });
    
    return report;
  }
}

/**
 * 创建文档验证器实例
 * @returns {DocumentValidator} 验证器实例
 */
function createValidator() {
  return new DocumentValidator();
}

module.exports = {
  DocumentValidator,
  createValidator
};