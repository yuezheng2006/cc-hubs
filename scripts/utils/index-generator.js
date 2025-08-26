/**
 * 文档索引生成器
 * 自动生成文档索引、导航结构和搜索索引
 * @author Claude Code Hub Team
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { createContentProcessor } = require('./content-processor');

/**
 * 文档索引生成器类
 * 负责扫描文档目录并生成各种索引结构
 */
class IndexGenerator {
  constructor(docsPath = './docs') {
    this.docsPath = docsPath;
    this.contentProcessor = createContentProcessor();
    this.index = {
      documents: [],
      categories: {},
      tags: {},
      navigation: []
    };
  }

  /**
   * 扫描文档目录并生成完整索引
   * @returns {Promise<Object>} 生成的索引对象
   */
  async generateIndex() {
    console.log('🔍 开始扫描文档目录...');
    
    try {
      const files = await this.scanDirectory(this.docsPath);
      console.log(`📁 发现 ${files.length} 个文档文件`);

      // 处理所有文档文件
      const documents = await this.processDocuments(files);
      
      // 生成各种索引结构
      this.index.documents = documents;
      this.generateCategoryIndex(documents);
      this.generateTagIndex(documents);
      this.generateNavigation(documents);
      
      console.log('✅ 索引生成完成');
      return this.index;
    } catch (error) {
      console.error('❌ 索引生成失败:', error.message);
      throw error;
    }
  }

  /**
   * 递归扫描目录获取所有文档文件
   * @param {string} dirPath - 目录路径
   * @returns {Promise<Array>} 文件路径数组
   */
  async scanDirectory(dirPath) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // 递归扫描子目录
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        } else if (this.isDocumentFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️ 无法读取目录 ${dirPath}:`, error.message);
    }
    
    return files;
  }

  /**
   * 检查文件是否为文档文件
   * @param {string} fileName - 文件名
   * @returns {boolean} 是否为文档文件
   */
  isDocumentFile(fileName) {
    const supportedExtensions = ['.md', '.mdx'];
    return supportedExtensions.some(ext => fileName.endsWith(ext));
  }

  /**
   * 处理所有文档文件
   * @param {Array} files - 文件路径数组
   * @returns {Promise<Array>} 处理后的文档数组
   */
  async processDocuments(files) {
    const documents = [];
    
    for (const filePath of files) {
      try {
        const doc = await this.processDocument(filePath);
        if (doc) {
          documents.push(doc);
        }
      } catch (error) {
        console.warn(`⚠️ 处理文档失败 ${filePath}:`, error.message);
      }
    }
    
    return documents.sort((a, b) => a.title.localeCompare(b.title));
  }

  /**
   * 处理单个文档文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} 文档对象
   */
  async processDocument(filePath) {
    const document = await this.contentProcessor.loadDocument(filePath);
    if (!document) return null;

    // 生成相对路径和URL路径
    const relativePath = path.relative(this.docsPath, filePath);
    const urlPath = this.generateUrlPath(relativePath);
    
    // 提取目录信息
    const category = this.extractCategory(relativePath);
    const subcategory = this.extractSubcategory(relativePath);
    
    return {
      id: this.generateDocumentId(filePath),
      title: document.data.title || path.basename(filePath, path.extname(filePath)),
      description: document.data.description || document.excerpt || '',
      filePath: relativePath,
      urlPath,
      category,
      subcategory,
      tags: document.data.tags || [],
      icon: document.data.icon || this.getDefaultIcon(category),
      lastUpdated: document.data.lastUpdated || new Date().toISOString().split('T')[0],
      wordCount: document.stats.wordCount,
      readingTime: document.stats.readingTime,
      validation: document.validation,
      metadata: {
        author: document.data.author,
        version: document.data.version,
        difficulty: document.data.difficulty,
        prerequisites: document.data.prerequisites || []
      }
    };
  }

  /**
   * 生成文档ID
   * @param {string} filePath - 文件路径
   * @returns {string} 文档ID
   */
  generateDocumentId(filePath) {
    return path.relative(this.docsPath, filePath)
      .replace(/\.(md|mdx)$/, '')
      .replace(/[/\\]/g, '-')
      .toLowerCase();
  }

  /**
   * 生成URL路径
   * @param {string} relativePath - 相对路径
   * @returns {string} URL路径
   */
  generateUrlPath(relativePath) {
    return '/' + relativePath
      .replace(/\.(md|mdx)$/, '')
      .replace(/\\/g, '/')
      .replace(/\/index$/, '');
  }

  /**
   * 提取文档分类
   * @param {string} relativePath - 相对路径
   * @returns {string} 分类名称
   */
  extractCategory(relativePath) {
    const parts = relativePath.split(path.sep);
    if (parts.length > 1) {
      return parts[0];
    }
    return 'general';
  }

  /**
   * 提取文档子分类
   * @param {string} relativePath - 相对路径
   * @returns {string|null} 子分类名称
   */
  extractSubcategory(relativePath) {
    const parts = relativePath.split(path.sep);
    if (parts.length > 2) {
      return parts[1];
    }
    return null;
  }

  /**
   * 获取默认图标
   * @param {string} category - 分类名称
   * @returns {string} 图标名称
   */
  getDefaultIcon(category) {
    const iconMap = {
      workflows: 'workflow',
      commands: 'terminal',
      roles: 'users',
      guides: 'book-open',
      tutorials: 'graduation-cap',
      examples: 'code',
      reference: 'library',
      general: 'file-text'
    };
    return iconMap[category] || 'file-text';
  }

  /**
   * 生成分类索引
   * @param {Array} documents - 文档数组
   */
  generateCategoryIndex(documents) {
    const categories = {};
    
    documents.forEach(doc => {
      if (!categories[doc.category]) {
        categories[doc.category] = {
          name: doc.category,
          displayName: this.formatCategoryName(doc.category),
          icon: this.getDefaultIcon(doc.category),
          documents: [],
          subcategories: {}
        };
      }
      
      categories[doc.category].documents.push(doc);
      
      // 处理子分类
      if (doc.subcategory) {
        if (!categories[doc.category].subcategories[doc.subcategory]) {
          categories[doc.category].subcategories[doc.subcategory] = {
            name: doc.subcategory,
            displayName: this.formatCategoryName(doc.subcategory),
            documents: []
          };
        }
        categories[doc.category].subcategories[doc.subcategory].documents.push(doc);
      }
    });
    
    this.index.categories = categories;
  }

  /**
   * 生成标签索引
   * @param {Array} documents - 文档数组
   */
  generateTagIndex(documents) {
    const tags = {};
    
    documents.forEach(doc => {
      doc.tags.forEach(tag => {
        if (!tags[tag]) {
          tags[tag] = {
            name: tag,
            count: 0,
            documents: []
          };
        }
        tags[tag].count++;
        tags[tag].documents.push({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          urlPath: doc.urlPath
        });
      });
    });
    
    this.index.tags = tags;
  }

  /**
   * 生成导航结构
   * @param {Array} documents - 文档数组
   */
  generateNavigation(documents) {
    const navigation = [];
    
    // 按分类组织导航
    Object.values(this.index.categories).forEach(category => {
      const navItem = {
        group: category.displayName,
        icon: category.icon,
        pages: []
      };
      
      // 添加分类首页（如果存在）
      const indexDoc = category.documents.find(doc => 
        doc.filePath.endsWith('index.md') || doc.filePath.endsWith('index.mdx')
      );
      
      if (indexDoc) {
        navItem.pages.push(indexDoc.urlPath);
      }
      
      // 添加子分类
      Object.values(category.subcategories).forEach(subcategory => {
        const subNavItem = {
          group: subcategory.displayName,
          pages: subcategory.documents
            .filter(doc => !doc.filePath.endsWith('index.md') && !doc.filePath.endsWith('index.mdx'))
            .map(doc => doc.urlPath)
        };
        
        if (subNavItem.pages.length > 0) {
          navItem.pages.push(subNavItem);
        }
      });
      
      // 添加分类下的其他文档
      const otherDocs = category.documents.filter(doc => 
        !doc.subcategory && 
        !doc.filePath.endsWith('index.md') && 
        !doc.filePath.endsWith('index.mdx')
      );
      
      otherDocs.forEach(doc => {
        navItem.pages.push(doc.urlPath);
      });
      
      if (navItem.pages.length > 0) {
        navigation.push(navItem);
      }
    });
    
    this.index.navigation = navigation;
  }

  /**
   * 格式化分类名称
   * @param {string} categoryName - 分类名称
   * @returns {string} 格式化后的名称
   */
  formatCategoryName(categoryName) {
    const nameMap = {
      workflows: '工作流程',
      commands: '自定义命令',
      roles: '专业角色',
      guides: '使用指南',
      tutorials: '教程',
      examples: '示例',
      reference: '参考文档',
      general: '通用文档'
    };
    
    return nameMap[categoryName] || categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * 生成搜索索引
   * @returns {Object} 搜索索引对象
   */
  generateSearchIndex() {
    const searchIndex = {
      documents: this.index.documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        tags: doc.tags,
        urlPath: doc.urlPath,
        searchText: `${doc.title} ${doc.description} ${doc.tags.join(' ')}`.toLowerCase()
      })),
      categories: Object.keys(this.index.categories),
      tags: Object.keys(this.index.tags)
    };
    
    return searchIndex;
  }

  /**
   * 保存索引到文件
   * @param {string} outputPath - 输出路径
   * @returns {Promise<boolean>} 保存是否成功
   */
  async saveIndex(outputPath = './docs/_index.json') {
    try {
      const indexData = {
        ...this.index,
        searchIndex: this.generateSearchIndex(),
        generatedAt: new Date().toISOString(),
        stats: {
          totalDocuments: this.index.documents.length,
          totalCategories: Object.keys(this.index.categories).length,
          totalTags: Object.keys(this.index.tags).length,
          totalWords: this.index.documents.reduce((sum, doc) => sum + doc.wordCount, 0)
        }
      };
      
      await fs.writeFile(outputPath, JSON.stringify(indexData, null, 2), 'utf8');
      console.log(`✅ 索引已保存到: ${outputPath}`);
      return true;
    } catch (error) {
      console.error('❌ 保存索引失败:', error.message);
      return false;
    }
  }

  /**
   * 更新Mintlify配置文件的导航
   * @param {string} mintConfigPath - mint.json文件路径
   * @returns {Promise<boolean>} 更新是否成功
   */
  async updateMintlifyNavigation(mintConfigPath = './mint.json') {
    try {
      const configContent = await fs.readFile(mintConfigPath, 'utf8');
      const config = JSON.parse(configContent);
      
      // 更新导航结构
      config.navigation = this.index.navigation;
      
      await fs.writeFile(mintConfigPath, JSON.stringify(config, null, 2), 'utf8');
      console.log('✅ Mintlify导航配置已更新');
      return true;
    } catch (error) {
      console.error('❌ 更新Mintlify配置失败:', error.message);
      return false;
    }
  }

  /**
   * 生成统计报告
   * @returns {Object} 统计报告
   */
  generateStats() {
    const stats = {
      overview: {
        totalDocuments: this.index.documents.length,
        totalCategories: Object.keys(this.index.categories).length,
        totalTags: Object.keys(this.index.tags).length,
        totalWords: this.index.documents.reduce((sum, doc) => sum + doc.wordCount, 0),
        averageReadingTime: Math.round(
          this.index.documents.reduce((sum, doc) => sum + doc.readingTime, 0) / this.index.documents.length
        )
      },
      categories: Object.entries(this.index.categories).map(([name, category]) => ({
        name: category.displayName,
        documentCount: category.documents.length,
        subcategoryCount: Object.keys(category.subcategories).length
      })),
      topTags: Object.entries(this.index.tags)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 10)
        .map(([name, tag]) => ({ name, count: tag.count })),
      validation: {
        validDocuments: this.index.documents.filter(doc => doc.validation.isValid).length,
        documentsWithWarnings: this.index.documents.filter(doc => doc.validation.warnings.length > 0).length,
        documentsWithErrors: this.index.documents.filter(doc => !doc.validation.isValid).length
      }
    };
    
    return stats;
  }
}

/**
 * 创建索引生成器实例
 * @param {string} docsPath - 文档目录路径
 * @returns {IndexGenerator} 索引生成器实例
 */
function createIndexGenerator(docsPath) {
  return new IndexGenerator(docsPath);
}

module.exports = {
  IndexGenerator,
  createIndexGenerator
};