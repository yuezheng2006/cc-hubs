#!/usr/bin/env node
/**
 * 内容管理主脚本
 * 整合所有内容处理工具，提供统一的命令行接口
 * @author Claude Code Hub Team
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

// 导入工具模块
const { createContentProcessor } = require('./utils/content-processor');
const { createIndexGenerator } = require('./utils/index-generator');
const { createValidator } = require('./utils/validator');

/**
 * 内容管理器类
 * 提供统一的内容管理和处理功能
 */
class ContentManager {
  constructor() {
    this.contentProcessor = createContentProcessor();
    this.indexGenerator = createIndexGenerator('./docs');
    this.validator = createValidator();
    this.config = {
      docsPath: './docs',
      outputPath: './docs/_generated',
      backupPath: './backups',
      logLevel: 'info'
    };
  }

  /**
   * 初始化内容管理器
   * @param {Object} options - 配置选项
   */
  async initialize(options = {}) {
    this.config = { ...this.config, ...options };
    
    // 确保必要目录存在
    await this.ensureDirectories();
    
    console.log(chalk.blue('📚 Claude Code Hub 内容管理器已初始化'));
    console.log(chalk.gray(`文档目录: ${this.config.docsPath}`));
    console.log(chalk.gray(`输出目录: ${this.config.outputPath}`));
  }

  /**
   * 确保必要目录存在
   */
  async ensureDirectories() {
    const dirs = [
      this.config.docsPath,
      this.config.outputPath,
      this.config.backupPath,
      path.join(this.config.outputPath, 'reports'),
      path.join(this.config.outputPath, 'indexes')
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ 无法创建目录 ${dir}: ${error.message}`));
      }
    }
  }

  /**
   * 处理单个文档
   * @param {string} filePath - 文档文件路径
   * @param {Object} options - 处理选项
   * @returns {Promise<Object>} 处理结果
   */
  async processDocument(filePath, options = {}) {
    const spinner = ora(`处理文档: ${path.basename(filePath)}`).start();
    
    try {
      // 读取和解析文档
      const document = await this.contentProcessor.loadDocument(filePath);
      if (!document) {
        throw new Error('无法加载文档');
      }

      // 验证文档
      const validation = await this.validator.validateDocument(filePath);
      
      // 生成处理后的内容
      const processedContent = this.contentProcessor.generateMintlifyDocument({
        title: document.data.title,
        description: document.data.description,
        content: document.content,
        ...document.data
      });

      // 保存处理后的文档（如果需要）
      if (options.save) {
        const outputPath = options.outputPath || filePath;
        await this.contentProcessor.saveDocument(outputPath, processedContent);
      }

      spinner.succeed(`✅ 文档处理完成: ${path.basename(filePath)}`);
      
      return {
        success: true,
        document,
        validation,
        processedContent,
        filePath
      };
    } catch (error) {
      spinner.fail(`❌ 文档处理失败: ${error.message}`);
      return {
        success: false,
        error: error.message,
        filePath
      };
    }
  }

  /**
   * 批量处理文档
   * @param {Array} filePaths - 文件路径数组
   * @param {Object} options - 处理选项
   * @returns {Promise<Object>} 批量处理结果
   */
  async processBatch(filePaths, options = {}) {
    console.log(chalk.blue(`🔄 开始批量处理 ${filePaths.length} 个文档...`));
    
    const results = [];
    const summary = {
      total: filePaths.length,
      success: 0,
      failed: 0,
      startTime: Date.now()
    };

    for (const filePath of filePaths) {
      const result = await this.processDocument(filePath, options);
      results.push(result);
      
      if (result.success) {
        summary.success++;
      } else {
        summary.failed++;
      }
    }

    summary.endTime = Date.now();
    summary.duration = summary.endTime - summary.startTime;

    console.log(chalk.green(`\n✅ 批量处理完成:`));
    console.log(chalk.gray(`  成功: ${summary.success}/${summary.total}`));
    console.log(chalk.gray(`  失败: ${summary.failed}/${summary.total}`));
    console.log(chalk.gray(`  耗时: ${(summary.duration / 1000).toFixed(2)}s`));

    return { results, summary };
  }

  /**
   * 生成文档索引
   * @param {Object} options - 生成选项
   * @returns {Promise<Object>} 索引生成结果
   */
  async generateIndex(options = {}) {
    const spinner = ora('生成文档索引...').start();
    
    try {
      const index = await this.indexGenerator.generateIndex();
      
      // 保存索引文件
      const indexPath = path.join(this.config.outputPath, 'indexes', 'documents.json');
      await this.indexGenerator.saveIndex(indexPath);
      
      // 更新Mintlify导航
      if (options.updateNavigation !== false) {
        await this.indexGenerator.updateMintlifyNavigation('./mint.json');
      }
      
      // 生成统计报告
      const stats = this.indexGenerator.generateStats();
      const statsPath = path.join(this.config.outputPath, 'reports', 'index-stats.json');
      await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), 'utf8');
      
      spinner.succeed('✅ 文档索引生成完成');
      
      console.log(chalk.blue('📊 索引统计:'));
      console.log(chalk.gray(`  文档总数: ${stats.overview.totalDocuments}`));
      console.log(chalk.gray(`  分类数量: ${stats.overview.totalCategories}`));
      console.log(chalk.gray(`  标签数量: ${stats.overview.totalTags}`));
      console.log(chalk.gray(`  总字数: ${stats.overview.totalWords.toLocaleString()}`));
      
      return { success: true, index, stats };
    } catch (error) {
      spinner.fail(`❌ 索引生成失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 验证所有文档
   * @param {Object} options - 验证选项
   * @returns {Promise<Object>} 验证结果
   */
  async validateAll(options = {}) {
    const spinner = ora('扫描文档文件...').start();
    
    try {
      // 获取所有文档文件
      const files = await this.scanDocuments();
      spinner.text = `验证 ${files.length} 个文档...`;
      
      // 批量验证
      const result = await this.validator.validateBatch(files);
      
      // 生成验证报告
      const report = this.validator.generateReport(result);
      const reportPath = path.join(this.config.outputPath, 'reports', 'validation-report.md');
      await fs.writeFile(reportPath, report, 'utf8');
      
      // 保存详细结果
      const detailsPath = path.join(this.config.outputPath, 'reports', 'validation-details.json');
      await fs.writeFile(detailsPath, JSON.stringify(result, null, 2), 'utf8');
      
      spinner.succeed('✅ 文档验证完成');
      
      console.log(chalk.blue('📋 验证结果:'));
      console.log(chalk.gray(`  通过验证: ${result.summary.valid}/${result.summary.total}`));
      console.log(chalk.gray(`  平均分数: ${result.summary.averageScore}/100`));
      console.log(chalk.gray(`  报告路径: ${reportPath}`));
      
      return { success: true, ...result };
    } catch (error) {
      spinner.fail(`❌ 验证失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 扫描文档目录获取所有文档文件
   * @returns {Promise<Array>} 文档文件路径数组
   */
  async scanDocuments() {
    const files = [];
    
    async function scanDir(dirPath) {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_')) {
            await scanDir(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ 无法扫描目录 ${dirPath}: ${error.message}`));
      }
    }
    
    await scanDir(this.config.docsPath);
    return files;
  }

  /**
   * 清理生成的文件
   * @param {Object} options - 清理选项
   */
  async cleanup(options = {}) {
    const spinner = ora('清理生成的文件...').start();
    
    try {
      const pathsToClean = [
        path.join(this.config.outputPath, 'indexes'),
        path.join(this.config.outputPath, 'reports')
      ];
      
      if (options.all) {
        pathsToClean.push(this.config.outputPath);
      }
      
      for (const cleanPath of pathsToClean) {
        try {
          await fs.rm(cleanPath, { recursive: true, force: true });
        } catch (error) {
          // 忽略不存在的目录
        }
      }
      
      // 重新创建必要目录
      await this.ensureDirectories();
      
      spinner.succeed('✅ 清理完成');
    } catch (error) {
      spinner.fail(`❌ 清理失败: ${error.message}`);
    }
  }

  /**
   * 创建备份
   * @returns {Promise<string>} 备份路径
   */
  async createBackup() {
    const spinner = ora('创建文档备份...').start();
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(this.config.backupPath, `backup-${timestamp}`);
      
      // 复制文档目录
      await this.copyDirectory(this.config.docsPath, backupDir);
      
      spinner.succeed(`✅ 备份创建完成: ${backupDir}`);
      return backupDir;
    } catch (error) {
      spinner.fail(`❌ 备份创建失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 递归复制目录
   * @param {string} src - 源目录
   * @param {string} dest - 目标目录
   */
  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * 显示项目统计信息
   */
  async showStats() {
    console.log(chalk.blue('📊 Claude Code Hub 项目统计\n'));
    
    try {
      const files = await this.scanDocuments();
      const totalSize = await this.calculateTotalSize(files);
      
      console.log(chalk.gray('📁 文档统计:'));
      console.log(chalk.gray(`  文档数量: ${files.length}`));
      console.log(chalk.gray(`  总大小: ${this.formatFileSize(totalSize)}`));
      
      // 按分类统计
      const categories = {};
      files.forEach(file => {
        const relativePath = path.relative(this.config.docsPath, file);
        const category = relativePath.split(path.sep)[0] || 'root';
        categories[category] = (categories[category] || 0) + 1;
      });
      
      console.log(chalk.gray('\n📂 分类统计:'));
      Object.entries(categories)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(chalk.gray(`  ${category}: ${count} 个文档`));
        });
      
    } catch (error) {
      console.error(chalk.red(`❌ 统计失败: ${error.message}`));
    }
  }

  /**
   * 计算文件总大小
   * @param {Array} files - 文件路径数组
   * @returns {Promise<number>} 总大小（字节）
   */
  async calculateTotalSize(files) {
    let totalSize = 0;
    
    for (const file of files) {
      try {
        const stats = await fs.stat(file);
        totalSize += stats.size;
      } catch (error) {
        // 忽略无法访问的文件
      }
    }
    
    return totalSize;
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化的大小
   */
  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

/**
 * 命令行接口配置
 */
function setupCLI() {
  const manager = new ContentManager();
  
  program
    .name('content-manager')
    .description('Claude Code Hub 内容管理工具')
    .version('1.0.0');
  
  // 初始化命令
  program
    .command('init')
    .description('初始化内容管理器')
    .option('-d, --docs <path>', '文档目录路径', './docs')
    .option('-o, --output <path>', '输出目录路径', './docs/_generated')
    .action(async (options) => {
      await manager.initialize(options);
    });
  
  // 处理文档命令
  program
    .command('process <files...>')
    .description('处理指定的文档文件')
    .option('-s, --save', '保存处理后的文档')
    .option('-o, --output <path>', '输出目录')
    .action(async (files, options) => {
      await manager.initialize();
      await manager.processBatch(files, options);
    });
  
  // 生成索引命令
  program
    .command('index')
    .description('生成文档索引和导航')
    .option('--no-navigation', '不更新导航配置')
    .action(async (options) => {
      await manager.initialize();
      await manager.generateIndex(options);
    });
  
  // 验证文档命令
  program
    .command('validate')
    .description('验证所有文档')
    .action(async () => {
      await manager.initialize();
      await manager.validateAll();
    });
  
  // 清理命令
  program
    .command('clean')
    .description('清理生成的文件')
    .option('-a, --all', '清理所有生成的文件')
    .action(async (options) => {
      await manager.initialize();
      await manager.cleanup(options);
    });
  
  // 备份命令
  program
    .command('backup')
    .description('创建文档备份')
    .action(async () => {
      await manager.initialize();
      await manager.createBackup();
    });
  
  // 统计命令
  program
    .command('stats')
    .description('显示项目统计信息')
    .action(async () => {
      await manager.initialize();
      await manager.showStats();
    });
  
  // 全量处理命令
  program
    .command('build')
    .description('执行完整的构建流程')
    .option('--no-backup', '跳过备份')
    .option('--no-validation', '跳过验证')
    .action(async (options) => {
      await manager.initialize();
      
      console.log(chalk.blue('🚀 开始完整构建流程...\n'));
      
      // 创建备份
      if (options.backup !== false) {
        await manager.createBackup();
      }
      
      // 生成索引
      await manager.generateIndex();
      
      // 验证文档
      if (options.validation !== false) {
        await manager.validateAll();
      }
      
      console.log(chalk.green('\n✅ 构建流程完成！'));
    });
  
  return program;
}

// 如果直接运行此脚本
if (require.main === module) {
  const cli = setupCLI();
  cli.parse();
}

module.exports = {
  ContentManager,
  setupCLI
};