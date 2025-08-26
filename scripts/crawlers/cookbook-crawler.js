/**
 * claude-code-cookbook 内容爬虫脚本
 * 用于从 https://github.com/foreveryh/claude-code-cookbook 爬取 Claude Code 最佳实践文档
 * 
 * 功能特性:
 * - 通过 GitHub API 获取仓库内容
 * - 解析 Markdown 文件和目录结构
 * - 提取角色配置和命令定义
 * - 生成符合 Mintlify 格式的文档文件
 * - 支持增量更新和版本控制
 * - 处理 GitHub API 限制和认证
 * 
 * @author Claude Code Best Practices Hub
 * @version 1.0.0
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const { createHash } = require('crypto');

/**
 * claude-code-cookbook 爬虫类
 * 负责从 GitHub 仓库爬取 Claude Code 相关文档和配置
 */
class CookbookCrawler {
  /**
   * 构造函数
   * @param {Object} options - 爬虫配置选项
   * @param {string} options.repoOwner - 仓库所有者
   * @param {string} options.repoName - 仓库名称
   * @param {string} options.branch - 分支名称
   * @param {string} options.outputDir - 输出目录
   * @param {string} options.githubToken - GitHub API Token（可选）
   * @param {number} options.delay - 请求间隔（毫秒）
   * @param {number} options.timeout - 请求超时时间（毫秒）
   */
  constructor(options = {}) {
    this.repoOwner = options.repoOwner || 'foreveryh';
    this.repoName = options.repoName || 'claude-code-cookbook';
    this.branch = options.branch || 'main';
    this.outputDir = options.outputDir || path.join(__dirname, '../../docs');
    this.githubToken = options.githubToken || process.env.GITHUB_TOKEN;
    this.delay = options.delay || 1000; // 1秒间隔，遵守 GitHub API 限制
    this.timeout = options.timeout || 10000; // 10秒超时
    
    // GitHub API 基础配置
    this.apiBase = 'https://api.github.com';
    this.rawBase = 'https://raw.githubusercontent.com';
    
    // 配置 axios 实例
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Claude-Code-Hub-Crawler/1.0.0'
    };
    
    if (this.githubToken) {
      headers['Authorization'] = `token ${this.githubToken}`;
    }
    
    this.client = axios.create({
      timeout: this.timeout,
      headers
    });
    
    // 爬取统计信息
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      skippedFiles: 0,
      failedFiles: 0,
      rolesFound: 0,
      commandsFound: 0,
      workflowsFound: 0,
      startTime: null,
      endTime: null
    };
    
    // 内容分类
    this.contentTypes = {
      roles: [],
      commands: [],
      workflows: [],
      guides: [],
      examples: []
    };
  }

  /**
   * 开始爬取流程
   * 主入口函数，协调整个爬取过程
   */
  async crawl() {
    try {
      console.log('🚀 开始爬取 claude-code-cookbook 仓库...');
      this.stats.startTime = new Date();
      
      // 确保输出目录存在
      await this.ensureOutputDirectories();
      
      // 获取仓库信息
      const repoInfo = await this.getRepositoryInfo();
      console.log(`📚 仓库信息: ${repoInfo.full_name} (${repoInfo.default_branch})`);
      console.log(`📝 描述: ${repoInfo.description || '无描述'}`);
      
      // 获取仓库文件树
      const fileTree = await this.getRepositoryTree();
      console.log(`📁 发现 ${fileTree.length} 个文件`);
      
      this.stats.totalFiles = fileTree.length;
      
      // 处理每个文件
      for (let i = 0; i < fileTree.length; i++) {
        const file = fileTree[i];
        console.log(`📄 正在处理 (${i + 1}/${fileTree.length}): ${file.path}`);
        
        try {
          await this.processFile(file);
          this.stats.processedFiles++;
        } catch (error) {
          console.error(`❌ 处理文件失败: ${file.path}`, error.message);
          this.stats.failedFiles++;
        }
        
        // 添加延迟，避免触发 GitHub API 限制
        if (i < fileTree.length - 1) {
          await this.sleep(this.delay);
        }
      }
      
      // 生成索引文件
      await this.generateIndexFiles();
      
      // 生成统计报告
      await this.generateStatsReport(repoInfo);
      
      this.stats.endTime = new Date();
      this.printStats();
      
      console.log('✅ claude-code-cookbook 文档爬取完成!');
      
    } catch (error) {
      console.error('💥 爬取过程中发生错误:', error);
      throw error;
    }
  }

  /**
   * 确保输出目录存在
   * 创建必要的目录结构
   */
  async ensureOutputDirectories() {
    const directories = [
      path.join(this.outputDir, 'roles'),
      path.join(this.outputDir, 'commands'),
      path.join(this.outputDir, 'workflows'),
      path.join(this.outputDir, 'guides'),
      path.join(this.outputDir, 'examples')
    ];
    
    for (const dir of directories) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 创建输出目录: ${dir}`);
      }
    }
  }

  /**
   * 获取仓库基本信息
   * @returns {Object} 仓库信息
   */
  async getRepositoryInfo() {
    const url = `${this.apiBase}/repos/${this.repoOwner}/${this.repoName}`;
    
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn('⚠️  GitHub API 限制，建议设置 GITHUB_TOKEN 环境变量');
      }
      throw new Error(`获取仓库信息失败: ${error.message}`);
    }
  }

  /**
   * 获取仓库文件树
   * @returns {Array} 文件列表
   */
  async getRepositoryTree() {
    const url = `${this.apiBase}/repos/${this.repoOwner}/${this.repoName}/git/trees/${this.branch}?recursive=1`;
    
    try {
      const response = await this.client.get(url);
      
      // 过滤出我们感兴趣的文件
      return response.data.tree.filter(item => {
        return item.type === 'blob' && (
          item.path.endsWith('.md') ||
          item.path.endsWith('.mdx') ||
          item.path.endsWith('.txt') ||
          item.path.endsWith('.json') ||
          item.path.endsWith('.yaml') ||
          item.path.endsWith('.yml')
        );
      });
    } catch (error) {
      throw new Error(`获取文件树失败: ${error.message}`);
    }
  }

  /**
   * 处理单个文件
   * @param {Object} file - 文件信息
   */
  async processFile(file) {
    const { path: filePath, sha } = file;
    
    // 根据文件路径和名称判断内容类型
    const contentType = this.classifyContent(filePath);
    
    if (!contentType) {
      console.log(`⏭️  跳过文件: ${filePath}`);
      this.stats.skippedFiles++;
      return;
    }
    
    // 获取文件内容
    const content = await this.getFileContent(filePath);
    
    if (!content) {
      console.log(`⚠️  文件内容为空: ${filePath}`);
      this.stats.skippedFiles++;
      return;
    }
    
    // 处理不同类型的内容
    switch (contentType) {
      case 'role':
        await this.processRoleFile(filePath, content, sha);
        this.stats.rolesFound++;
        break;
      case 'command':
        await this.processCommandFile(filePath, content, sha);
        this.stats.commandsFound++;
        break;
      case 'workflow':
        await this.processWorkflowFile(filePath, content, sha);
        this.stats.workflowsFound++;
        break;
      case 'guide':
        await this.processGuideFile(filePath, content, sha);
        break;
      case 'example':
        await this.processExampleFile(filePath, content, sha);
        break;
      default:
        console.log(`❓ 未知内容类型: ${filePath}`);
        this.stats.skippedFiles++;
    }
  }

  /**
   * 分类文件内容
   * @param {string} filePath - 文件路径
   * @returns {string|null} 内容类型
   */
  classifyContent(filePath) {
    const lowerPath = filePath.toLowerCase();
    
    // 角色配置文件
    if (lowerPath.includes('role') || lowerPath.includes('persona') || lowerPath.includes('character')) {
      return 'role';
    }
    
    // 命令文件
    if (lowerPath.includes('command') || lowerPath.includes('cmd') || lowerPath.includes('instruction')) {
      return 'command';
    }
    
    // 工作流程文件
    if (lowerPath.includes('workflow') || lowerPath.includes('process') || lowerPath.includes('procedure')) {
      return 'workflow';
    }
    
    // 指南文件
    if (lowerPath.includes('guide') || lowerPath.includes('tutorial') || lowerPath.includes('howto')) {
      return 'guide';
    }
    
    // 示例文件
    if (lowerPath.includes('example') || lowerPath.includes('sample') || lowerPath.includes('demo')) {
      return 'example';
    }
    
    // README 文件通常包含重要信息
    if (lowerPath.includes('readme')) {
      return 'guide';
    }
    
    // 根据目录结构判断
    const pathParts = filePath.split('/');
    for (const part of pathParts) {
      const lowerPart = part.toLowerCase();
      if (['roles', 'commands', 'workflows', 'guides', 'examples'].includes(lowerPart)) {
        return lowerPart.slice(0, -1); // 去掉复数形式的 's'
      }
    }
    
    return null;
  }

  /**
   * 获取文件内容
   * @param {string} filePath - 文件路径
   * @returns {string} 文件内容
   */
  async getFileContent(filePath) {
    const url = `${this.rawBase}/${this.repoOwner}/${this.repoName}/${this.branch}/${filePath}`;
    
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error(`获取文件内容失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 处理角色配置文件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {string} sha - 文件哈希
   */
  async processRoleFile(filePath, content, sha) {
    const roleData = this.parseRoleContent(content, filePath);
    
    if (!roleData) {
      console.log(`⚠️  无法解析角色文件: ${filePath}`);
      return;
    }
    
    // 生成 Mintlify 格式的角色文档
    const markdownContent = this.generateRoleMarkdown(roleData, filePath, sha);
    
    // 保存文件
    const fileName = `${roleData.slug}.mdx`;
    const outputPath = path.join(this.outputDir, 'roles', fileName);
    
    const shouldUpdate = await this.shouldUpdateFile(outputPath, markdownContent);
    
    if (shouldUpdate) {
      await fs.writeFile(outputPath, markdownContent, 'utf8');
      console.log(`✅ 已保存角色: ${fileName}`);
    } else {
      console.log(`⏭️  跳过（无变化）: ${fileName}`);
      this.stats.skippedFiles++;
    }
    
    // 添加到内容分类
    this.contentTypes.roles.push({
      ...roleData,
      filePath,
      fileName,
      sha
    });
  }

  /**
   * 处理命令文件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {string} sha - 文件哈希
   */
  async processCommandFile(filePath, content, sha) {
    const commandData = this.parseCommandContent(content, filePath);
    
    if (!commandData) {
      console.log(`⚠️  无法解析命令文件: ${filePath}`);
      return;
    }
    
    // 生成 Mintlify 格式的命令文档
    const markdownContent = this.generateCommandMarkdown(commandData, filePath, sha);
    
    // 保存文件
    const fileName = `${commandData.slug}.mdx`;
    const outputPath = path.join(this.outputDir, 'commands', fileName);
    
    const shouldUpdate = await this.shouldUpdateFile(outputPath, markdownContent);
    
    if (shouldUpdate) {
      await fs.writeFile(outputPath, markdownContent, 'utf8');
      console.log(`✅ 已保存命令: ${fileName}`);
    } else {
      console.log(`⏭️  跳过（无变化）: ${fileName}`);
      this.stats.skippedFiles++;
    }
    
    // 添加到内容分类
    this.contentTypes.commands.push({
      ...commandData,
      filePath,
      fileName,
      sha
    });
  }

  /**
   * 处理工作流程文件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {string} sha - 文件哈希
   */
  async processWorkflowFile(filePath, content, sha) {
    const workflowData = this.parseWorkflowContent(content, filePath);
    
    if (!workflowData) {
      console.log(`⚠️  无法解析工作流程文件: ${filePath}`);
      return;
    }
    
    // 生成 Mintlify 格式的工作流程文档
    const markdownContent = this.generateWorkflowMarkdown(workflowData, filePath, sha);
    
    // 保存文件
    const fileName = `${workflowData.slug}.mdx`;
    const outputPath = path.join(this.outputDir, 'workflows', fileName);
    
    const shouldUpdate = await this.shouldUpdateFile(outputPath, markdownContent);
    
    if (shouldUpdate) {
      await fs.writeFile(outputPath, markdownContent, 'utf8');
      console.log(`✅ 已保存工作流程: ${fileName}`);
    } else {
      console.log(`⏭️  跳过（无变化）: ${fileName}`);
      this.stats.skippedFiles++;
    }
    
    // 添加到内容分类
    this.contentTypes.workflows.push({
      ...workflowData,
      filePath,
      fileName,
      sha
    });
  }

  /**
   * 处理指南文件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {string} sha - 文件哈希
   */
  async processGuideFile(filePath, content, sha) {
    const guideData = this.parseGuideContent(content, filePath);
    
    if (!guideData) {
      console.log(`⚠️  无法解析指南文件: ${filePath}`);
      return;
    }
    
    // 生成 Mintlify 格式的指南文档
    const markdownContent = this.generateGuideMarkdown(guideData, filePath, sha);
    
    // 保存文件
    const fileName = `${guideData.slug}.mdx`;
    const outputPath = path.join(this.outputDir, 'guides', fileName);
    
    const shouldUpdate = await this.shouldUpdateFile(outputPath, markdownContent);
    
    if (shouldUpdate) {
      await fs.writeFile(outputPath, markdownContent, 'utf8');
      console.log(`✅ 已保存指南: ${fileName}`);
    } else {
      console.log(`⏭️  跳过（无变化）: ${fileName}`);
      this.stats.skippedFiles++;
    }
    
    // 添加到内容分类
    this.contentTypes.guides.push({
      ...guideData,
      filePath,
      fileName,
      sha
    });
  }

  /**
   * 处理示例文件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {string} sha - 文件哈希
   */
  async processExampleFile(filePath, content, sha) {
    const exampleData = this.parseExampleContent(content, filePath);
    
    if (!exampleData) {
      console.log(`⚠️  无法解析示例文件: ${filePath}`);
      return;
    }
    
    // 生成 Mintlify 格式的示例文档
    const markdownContent = this.generateExampleMarkdown(exampleData, filePath, sha);
    
    // 保存文件
    const fileName = `${exampleData.slug}.mdx`;
    const outputPath = path.join(this.outputDir, 'examples', fileName);
    
    const shouldUpdate = await this.shouldUpdateFile(outputPath, markdownContent);
    
    if (shouldUpdate) {
      await fs.writeFile(outputPath, markdownContent, 'utf8');
      console.log(`✅ 已保存示例: ${fileName}`);
    } else {
      console.log(`⏭️  跳过（无变化）: ${fileName}`);
      this.stats.skippedFiles++;
    }
    
    // 添加到内容分类
    this.contentTypes.examples.push({
      ...exampleData,
      filePath,
      fileName,
      sha
    });
  }

  /**
   * 解析角色内容
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   * @returns {Object|null} 解析后的角色数据
   */
  parseRoleContent(content, filePath) {
    try {
      // 尝试解析 front matter
      const parsed = matter(content);
      const { data: frontMatter, content: mainContent } = parsed;
      
      // 提取角色信息
      const title = frontMatter.title || 
                   frontMatter.name || 
                   this.extractTitleFromContent(mainContent) ||
                   path.basename(filePath, path.extname(filePath));
      
      const description = frontMatter.description || 
                         frontMatter.summary ||
                         this.extractDescriptionFromContent(mainContent);
      
      const expertise = frontMatter.expertise || 
                       frontMatter.skills ||
                       this.extractExpertiseFromContent(mainContent);
      
      const personality = frontMatter.personality || 
                         frontMatter.traits ||
                         this.extractPersonalityFromContent(mainContent);
      
      return {
        title: this.sanitizeTitle(title),
        description: description || '专业角色配置',
        expertise: Array.isArray(expertise) ? expertise : (expertise ? [expertise] : []),
        personality: Array.isArray(personality) ? personality : (personality ? [personality] : []),
        content: mainContent,
        slug: this.generateSlug(title),
        category: frontMatter.category || 'general',
        tags: frontMatter.tags || ['role', 'claude-code'],
        difficulty: frontMatter.difficulty || 'intermediate'
      };
    } catch (error) {
      console.error(`解析角色内容失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 解析命令内容
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   * @returns {Object|null} 解析后的命令数据
   */
  parseCommandContent(content, filePath) {
    try {
      const parsed = matter(content);
      const { data: frontMatter, content: mainContent } = parsed;
      
      const title = frontMatter.title || 
                   frontMatter.command ||
                   this.extractTitleFromContent(mainContent) ||
                   path.basename(filePath, path.extname(filePath));
      
      const description = frontMatter.description ||
                         this.extractDescriptionFromContent(mainContent);
      
      const usage = frontMatter.usage ||
                   this.extractUsageFromContent(mainContent);
      
      const examples = frontMatter.examples ||
                      this.extractExamplesFromContent(mainContent);
      
      return {
        title: this.sanitizeTitle(title),
        description: description || '自定义命令',
        usage: usage || '',
        examples: Array.isArray(examples) ? examples : (examples ? [examples] : []),
        content: mainContent,
        slug: this.generateSlug(title),
        category: frontMatter.category || 'general',
        tags: frontMatter.tags || ['command', 'claude-code'],
        difficulty: frontMatter.difficulty || 'beginner'
      };
    } catch (error) {
      console.error(`解析命令内容失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 解析工作流程内容
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   * @returns {Object|null} 解析后的工作流程数据
   */
  parseWorkflowContent(content, filePath) {
    try {
      const parsed = matter(content);
      const { data: frontMatter, content: mainContent } = parsed;
      
      const title = frontMatter.title ||
                   this.extractTitleFromContent(mainContent) ||
                   path.basename(filePath, path.extname(filePath));
      
      const description = frontMatter.description ||
                         this.extractDescriptionFromContent(mainContent);
      
      const steps = frontMatter.steps ||
                   this.extractStepsFromContent(mainContent);
      
      return {
        title: this.sanitizeTitle(title),
        description: description || '工作流程指南',
        steps: Array.isArray(steps) ? steps : [],
        content: mainContent,
        slug: this.generateSlug(title),
        category: frontMatter.category || 'workflow',
        tags: frontMatter.tags || ['workflow', 'claude-code'],
        difficulty: frontMatter.difficulty || 'intermediate',
        estimatedTime: frontMatter.estimatedTime || frontMatter.duration
      };
    } catch (error) {
      console.error(`解析工作流程内容失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 解析指南内容
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   * @returns {Object|null} 解析后的指南数据
   */
  parseGuideContent(content, filePath) {
    try {
      const parsed = matter(content);
      const { data: frontMatter, content: mainContent } = parsed;
      
      const title = frontMatter.title ||
                   this.extractTitleFromContent(mainContent) ||
                   path.basename(filePath, path.extname(filePath));
      
      const description = frontMatter.description ||
                         this.extractDescriptionFromContent(mainContent);
      
      return {
        title: this.sanitizeTitle(title),
        description: description || '使用指南',
        content: mainContent,
        slug: this.generateSlug(title),
        category: frontMatter.category || 'guide',
        tags: frontMatter.tags || ['guide', 'claude-code'],
        difficulty: frontMatter.difficulty || 'beginner',
        readingTime: frontMatter.readingTime
      };
    } catch (error) {
      console.error(`解析指南内容失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 解析示例内容
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   * @returns {Object|null} 解析后的示例数据
   */
  parseExampleContent(content, filePath) {
    try {
      const parsed = matter(content);
      const { data: frontMatter, content: mainContent } = parsed;
      
      const title = frontMatter.title ||
                   this.extractTitleFromContent(mainContent) ||
                   path.basename(filePath, path.extname(filePath));
      
      const description = frontMatter.description ||
                         this.extractDescriptionFromContent(mainContent);
      
      return {
        title: this.sanitizeTitle(title),
        description: description || '实践示例',
        content: mainContent,
        slug: this.generateSlug(title),
        category: frontMatter.category || 'example',
        tags: frontMatter.tags || ['example', 'claude-code'],
        difficulty: frontMatter.difficulty || 'intermediate',
        useCase: frontMatter.useCase || frontMatter.scenario
      };
    } catch (error) {
      console.error(`解析示例内容失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 生成角色 Markdown 文档
   * @param {Object} roleData - 角色数据
   * @param {string} filePath - 原始文件路径
   * @param {string} sha - 文件哈希
   * @returns {string} Markdown 内容
   */
  generateRoleMarkdown(roleData, filePath, sha) {
    const { title, description, expertise, personality, content, category, tags, difficulty } = roleData;
    
    let markdown = `---
title: '${title}'
description: '${description}'
icon: 'user-tie'
source: 'claude-code-cookbook'
sourceUrl: 'https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}'
category: '${category}'
difficulty: '${difficulty}'
tags:
${tags.map(tag => `  - '${tag}'`).join('\n')}
extractedAt: '${new Date().toISOString()}'
sha: '${sha}'
---

`;
    
    // 添加来源说明
    markdown += `<Note>
本角色配置来源于 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath})，由自动化爬虫提取并格式化。
最后更新时间: ${new Date().toLocaleString('zh-CN')}
</Note>

`;
    
    // 添加角色概览
    if (expertise.length > 0 || personality.length > 0) {
      markdown += `## 🎭 角色概览

`;
      
      if (expertise.length > 0) {
        markdown += `### 专业技能

`;
        expertise.forEach(skill => {
          markdown += `- ${skill}
`;
        });
        markdown += `
`;
      }
      
      if (personality.length > 0) {
        markdown += `### 角色特征

`;
        personality.forEach(trait => {
          markdown += `- ${trait}
`;
        });
        markdown += `
`;
      }
    }
    
    // 添加主要内容
    if (content) {
      markdown += `## 📋 角色配置

${content}

`;
    }
    
    // 添加使用指南
    markdown += `## 🚀 使用方法

使用 \`@${this.generateSlug(title)}\` 激活此角色：

\`\`\`
@${this.generateSlug(title)} 你的问题或请求
\`\`\`

`;
    
    // 添加页脚
    markdown += `---

<Info>
如果您发现内容有误或需要更新，请访问 [原始文件](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}) 查看最新信息。
</Info>
`;
    
    return markdown;
  }

  /**
   * 生成命令 Markdown 文档
   * @param {Object} commandData - 命令数据
   * @param {string} filePath - 原始文件路径
   * @param {string} sha - 文件哈希
   * @returns {string} Markdown 内容
   */
  generateCommandMarkdown(commandData, filePath, sha) {
    const { title, description, usage, examples, content, category, tags, difficulty } = commandData;
    
    let markdown = `---
title: '${title}'
description: '${description}'
icon: 'terminal'
source: 'claude-code-cookbook'
sourceUrl: 'https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}'
category: '${category}'
difficulty: '${difficulty}'
tags:
${tags.map(tag => `  - '${tag}'`).join('\n')}
extractedAt: '${new Date().toISOString()}'
sha: '${sha}'
---

`;
    
    // 添加来源说明
    markdown += `<Note>
本命令来源于 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath})，由自动化爬虫提取并格式化。
最后更新时间: ${new Date().toLocaleString('zh-CN')}
</Note>

`;
    
    // 添加使用方法
    if (usage) {
      markdown += `## 📖 使用方法

\`\`\`
${usage}
\`\`\`

`;
    }
    
    // 添加示例
    if (examples.length > 0) {
      markdown += `## 💡 使用示例

`;
      examples.forEach((example, index) => {
        markdown += `### 示例 ${index + 1}

\`\`\`
${example}
\`\`\`

`;
      });
    }
    
    // 添加主要内容
    if (content) {
      markdown += `## 📋 详细说明

${content}

`;
    }
    
    // 添加页脚
    markdown += `---

<Info>
如果您发现内容有误或需要更新，请访问 [原始文件](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}) 查看最新信息。
</Info>
`;
    
    return markdown;
  }

  /**
   * 生成工作流程 Markdown 文档
   * @param {Object} workflowData - 工作流程数据
   * @param {string} filePath - 原始文件路径
   * @param {string} sha - 文件哈希
   * @returns {string} Markdown 内容
   */
  generateWorkflowMarkdown(workflowData, filePath, sha) {
    const { title, description, steps, content, category, tags, difficulty, estimatedTime } = workflowData;
    
    let markdown = `---
title: '${title}'
description: '${description}'
icon: 'workflow'
source: 'claude-code-cookbook'
sourceUrl: 'https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}'
category: '${category}'
difficulty: '${difficulty}'
tags:
${tags.map(tag => `  - '${tag}'`).join('\n')}
extractedAt: '${new Date().toISOString()}'
sha: '${sha}'
`;
    
    if (estimatedTime) {
      markdown += `estimatedTime: '${estimatedTime}'
`;
    }
    
    markdown += `---

`;
    
    // 添加来源说明
    markdown += `<Note>
本工作流程来源于 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath})，由自动化爬虫提取并格式化。
最后更新时间: ${new Date().toLocaleString('zh-CN')}
</Note>

`;
    
    // 添加步骤
    if (steps.length > 0) {
      markdown += `## 🔄 工作流程步骤

<Steps>
`;
      steps.forEach((step, index) => {
        markdown += `  <Step title="步骤 ${index + 1}">
    ${step}
  </Step>
`;
      });
      markdown += `</Steps>

`;
    }
    
    // 添加主要内容
    if (content) {
      markdown += `## 📋 详细说明

${content}

`;
    }
    
    // 添加页脚
    markdown += `---

<Info>
如果您发现内容有误或需要更新，请访问 [原始文件](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}) 查看最新信息。
</Info>
`;
    
    return markdown;
  }

  /**
   * 生成指南 Markdown 文档
   * @param {Object} guideData - 指南数据
   * @param {string} filePath - 原始文件路径
   * @param {string} sha - 文件哈希
   * @returns {string} Markdown 内容
   */
  generateGuideMarkdown(guideData, filePath, sha) {
    const { title, description, content, category, tags, difficulty, readingTime } = guideData;
    
    let markdown = `---
title: '${title}'
description: '${description}'
icon: 'book-open'
source: 'claude-code-cookbook'
sourceUrl: 'https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}'
category: '${category}'
difficulty: '${difficulty}'
tags:
${tags.map(tag => `  - '${tag}'`).join('\n')}
extractedAt: '${new Date().toISOString()}'
sha: '${sha}'
`;
    
    if (readingTime) {
      markdown += `readingTime: '${readingTime}'
`;
    }
    
    markdown += `---

`;
    
    // 添加来源说明
    markdown += `<Note>
本指南来源于 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath})，由自动化爬虫提取并格式化。
最后更新时间: ${new Date().toLocaleString('zh-CN')}
</Note>

`;
    
    // 添加主要内容
    if (content) {
      markdown += `${content}

`;
    }
    
    // 添加页脚
    markdown += `---

<Info>
如果您发现内容有误或需要更新，请访问 [原始文件](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}) 查看最新信息。
</Info>
`;
    
    return markdown;
  }

  /**
   * 生成示例 Markdown 文档
   * @param {Object} exampleData - 示例数据
   * @param {string} filePath - 原始文件路径
   * @param {string} sha - 文件哈希
   * @returns {string} Markdown 内容
   */
  generateExampleMarkdown(exampleData, filePath, sha) {
    const { title, description, content, category, tags, difficulty, useCase } = exampleData;
    
    let markdown = `---
title: '${title}'
description: '${description}'
icon: 'code'
source: 'claude-code-cookbook'
sourceUrl: 'https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}'
category: '${category}'
difficulty: '${difficulty}'
tags:
${tags.map(tag => `  - '${tag}'`).join('\n')}
extractedAt: '${new Date().toISOString()}'
sha: '${sha}'
`;
    
    if (useCase) {
      markdown += `useCase: '${useCase}'
`;
    }
    
    markdown += `---

`;
    
    // 添加来源说明
    markdown += `<Note>
本示例来源于 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath})，由自动化爬虫提取并格式化。
最后更新时间: ${new Date().toLocaleString('zh-CN')}
</Note>

`;
    
    // 添加使用场景
    if (useCase) {
      markdown += `## 🎯 使用场景

${useCase}

`;
    }
    
    // 添加主要内容
    if (content) {
      markdown += `## 💡 示例内容

${content}

`;
    }
    
    // 添加页脚
    markdown += `---

<Info>
如果您发现内容有误或需要更新，请访问 [原始文件](https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}) 查看最新信息。
</Info>
`;
    
    return markdown;
  }

  /**
   * 生成索引文件
   */
  async generateIndexFiles() {
    // 生成各类型的索引文件
    await this.generateRolesIndex();
    await this.generateCommandsIndex();
    await this.generateWorkflowsIndex();
    await this.generateGuidesIndex();
    await this.generateExamplesIndex();
  }

  /**
   * 生成角色索引文件
   */
  async generateRolesIndex() {
    if (this.contentTypes.roles.length === 0) return;
    
    const indexContent = `---
title: 'Cookbook 角色配置'
description: '从 claude-code-cookbook 收集的专业角色配置'
icon: 'users'
---

## 🎭 角色配置列表

以下是从 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}) 收集的专业角色配置：

<CardGroup cols={2}>
${this.contentTypes.roles.map(role => `  <Card title="${role.title}" href="/roles/${role.slug}">
    ${role.description}
    
    **难度**: ${role.difficulty} | **类别**: ${role.category}
  </Card>`).join('\n')}
</CardGroup>

## 📊 统计信息

- **总角色数**: ${this.contentTypes.roles.length}
- **来源**: claude-code-cookbook
- **最后更新**: ${new Date().toLocaleString('zh-CN')}

<Note>
这些角色配置通过自动化爬虫从 claude-code-cookbook 收集，内容会定期更新。
</Note>
`;
    
    const indexPath = path.join(this.outputDir, 'roles', 'cookbook-roles.mdx');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('📋 已生成角色索引文件');
  }

  /**
   * 生成命令索引文件
   */
  async generateCommandsIndex() {
    if (this.contentTypes.commands.length === 0) return;
    
    const indexContent = `---
title: 'Cookbook 自定义命令'
description: '从 claude-code-cookbook 收集的自定义命令库'
icon: 'terminal'
---

## 💻 命令列表

以下是从 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}) 收集的自定义命令：

<CardGroup cols={2}>
${this.contentTypes.commands.map(command => `  <Card title="${command.title}" href="/commands/${command.slug}">
    ${command.description}
    
    **难度**: ${command.difficulty} | **类别**: ${command.category}
  </Card>`).join('\n')}
</CardGroup>

## 📊 统计信息

- **总命令数**: ${this.contentTypes.commands.length}
- **来源**: claude-code-cookbook
- **最后更新**: ${new Date().toLocaleString('zh-CN')}

<Note>
这些命令通过自动化爬虫从 claude-code-cookbook 收集，内容会定期更新。
</Note>
`;
    
    const indexPath = path.join(this.outputDir, 'commands', 'cookbook-commands.mdx');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('📋 已生成命令索引文件');
  }

  /**
   * 生成工作流程索引文件
   */
  async generateWorkflowsIndex() {
    if (this.contentTypes.workflows.length === 0) return;
    
    const indexContent = `---
title: 'Cookbook 工作流程'
description: '从 claude-code-cookbook 收集的工作流程指南'
icon: 'workflow'
---

## 🔄 工作流程列表

以下是从 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}) 收集的工作流程：

<CardGroup cols={2}>
${this.contentTypes.workflows.map(workflow => `  <Card title="${workflow.title}" href="/workflows/${workflow.slug}">
    ${workflow.description}
    
    **难度**: ${workflow.difficulty} | **类别**: ${workflow.category}
    ${workflow.estimatedTime ? `| **预计时间**: ${workflow.estimatedTime}` : ''}
  </Card>`).join('\n')}
</CardGroup>

## 📊 统计信息

- **总工作流程数**: ${this.contentTypes.workflows.length}
- **来源**: claude-code-cookbook
- **最后更新**: ${new Date().toLocaleString('zh-CN')}

<Note>
这些工作流程通过自动化爬虫从 claude-code-cookbook 收集，内容会定期更新。
</Note>
`;
    
    const indexPath = path.join(this.outputDir, 'workflows', 'cookbook-workflows.mdx');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('📋 已生成工作流程索引文件');
  }

  /**
   * 生成指南索引文件
   */
  async generateGuidesIndex() {
    if (this.contentTypes.guides.length === 0) return;
    
    const indexContent = `---
title: 'Cookbook 使用指南'
description: '从 claude-code-cookbook 收集的使用指南'
icon: 'book-open'
---

## 📚 指南列表

以下是从 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}) 收集的使用指南：

<CardGroup cols={2}>
${this.contentTypes.guides.map(guide => `  <Card title="${guide.title}" href="/guides/${guide.slug}">
    ${guide.description}
    
    **难度**: ${guide.difficulty} | **类别**: ${guide.category}
    ${guide.readingTime ? `| **阅读时间**: ${guide.readingTime}` : ''}
  </Card>`).join('\n')}
</CardGroup>

## 📊 统计信息

- **总指南数**: ${this.contentTypes.guides.length}
- **来源**: claude-code-cookbook
- **最后更新**: ${new Date().toLocaleString('zh-CN')}

<Note>
这些指南通过自动化爬虫从 claude-code-cookbook 收集，内容会定期更新。
</Note>
`;
    
    const indexPath = path.join(this.outputDir, 'guides', 'cookbook-guides.mdx');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('📋 已生成指南索引文件');
  }

  /**
   * 生成示例索引文件
   */
  async generateExamplesIndex() {
    if (this.contentTypes.examples.length === 0) return;
    
    const indexContent = `---
title: 'Cookbook 实践示例'
description: '从 claude-code-cookbook 收集的实践示例'
icon: 'code'
---

## 💡 示例列表

以下是从 [claude-code-cookbook](https://github.com/${this.repoOwner}/${this.repoName}) 收集的实践示例：

<CardGroup cols={2}>
${this.contentTypes.examples.map(example => `  <Card title="${example.title}" href="/examples/${example.slug}">
    ${example.description}
    
    **难度**: ${example.difficulty} | **类别**: ${example.category}
    ${example.useCase ? `| **使用场景**: ${example.useCase}` : ''}
  </Card>`).join('\n')}
</CardGroup>

## 📊 统计信息

- **总示例数**: ${this.contentTypes.examples.length}
- **来源**: claude-code-cookbook
- **最后更新**: ${new Date().toLocaleString('zh-CN')}

<Note>
这些示例通过自动化爬虫从 claude-code-cookbook 收集，内容会定期更新。
</Note>
`;
    
    const indexPath = path.join(this.outputDir, 'examples', 'cookbook-examples.mdx');
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('📋 已生成示例索引文件');
  }

  /**
   * 生成统计报告
   * @param {Object} repoInfo - 仓库信息
   */
  async generateStatsReport(repoInfo) {
    const reportContent = `---
title: 'Cookbook 爬取报告'
description: 'claude-code-cookbook 内容爬取统计报告'
icon: 'chart-bar'
---

# 📊 爬取统计报告

## 仓库信息

- **仓库**: [${repoInfo.full_name}](${repoInfo.html_url})
- **描述**: ${repoInfo.description || '无描述'}
- **主分支**: ${repoInfo.default_branch}
- **Stars**: ${repoInfo.stargazers_count}
- **Forks**: ${repoInfo.forks_count}
- **最后更新**: ${new Date(repoInfo.updated_at).toLocaleString('zh-CN')}

## 爬取统计

### 文件处理统计

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-blue-600">${this.stats.totalFiles}</div>
    <div className="text-sm text-gray-600">总文件数</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-green-600">${this.stats.processedFiles}</div>
    <div className="text-sm text-gray-600">已处理</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-yellow-600">${this.stats.skippedFiles}</div>
    <div className="text-sm text-gray-600">已跳过</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-red-600">${this.stats.failedFiles}</div>
    <div className="text-sm text-gray-600">失败</div>
  </div>
</div>

### 内容类型统计

<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-purple-600">${this.stats.rolesFound}</div>
    <div className="text-sm text-gray-600">角色配置</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-blue-600">${this.stats.commandsFound}</div>
    <div className="text-sm text-gray-600">自定义命令</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-green-600">${this.stats.workflowsFound}</div>
    <div className="text-sm text-gray-600">工作流程</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-orange-600">${this.contentTypes.guides.length}</div>
    <div className="text-sm text-gray-600">使用指南</div>
  </div>
  <div className="text-center p-4 border rounded-lg">
    <div className="text-2xl font-bold text-pink-600">${this.contentTypes.examples.length}</div>
    <div className="text-sm text-gray-600">实践示例</div>
  </div>
</div>

## 爬取详情

- **开始时间**: ${this.stats.startTime?.toLocaleString('zh-CN')}
- **结束时间**: ${this.stats.endTime?.toLocaleString('zh-CN')}
- **总耗时**: ${this.stats.endTime && this.stats.startTime ? Math.round((this.stats.endTime - this.stats.startTime) / 1000) : 0} 秒
- **成功率**: ${this.stats.totalFiles > 0 ? ((this.stats.processedFiles / this.stats.totalFiles) * 100).toFixed(1) : 0}%

<Note>
本报告由自动化爬虫生成，记录了从 claude-code-cookbook 仓库爬取内容的详细统计信息。
</Note>
`;
    
    const reportPath = path.join(this.outputDir, 'cookbook-crawl-report.mdx');
    await fs.writeFile(reportPath, reportContent, 'utf8');
    console.log('📊 已生成爬取统计报告');
  }

  // 辅助方法
  extractTitleFromContent(content) {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return trimmed.substring(2).trim();
      }
    }
    return null;
  }

  extractDescriptionFromContent(content) {
    const lines = content.split('\n');
    let foundTitle = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        foundTitle = true;
        continue;
      }
      if (foundTitle && trimmed && !trimmed.startsWith('#')) {
        return trimmed.substring(0, 200);
      }
    }
    return null;
  }

  extractExpertiseFromContent(content) {
    const expertise = [];
    const lines = content.split('\n');
    let inExpertiseSection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('expertise') || 
          trimmed.toLowerCase().includes('skills') ||
          trimmed.toLowerCase().includes('专业技能')) {
        inExpertiseSection = true;
        continue;
      }
      
      if (inExpertiseSection) {
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          expertise.push(trimmed.substring(2).trim());
        } else if (trimmed.startsWith('#')) {
          break;
        }
      }
    }
    
    return expertise;
  }

  extractPersonalityFromContent(content) {
    const personality = [];
    const lines = content.split('\n');
    let inPersonalitySection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('personality') || 
          trimmed.toLowerCase().includes('traits') ||
          trimmed.toLowerCase().includes('特征')) {
        inPersonalitySection = true;
        continue;
      }
      
      if (inPersonalitySection) {
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          personality.push(trimmed.substring(2).trim());
        } else if (trimmed.startsWith('#')) {
          break;
        }
      }
    }
    
    return personality;
  }

  extractUsageFromContent(content) {
    const lines = content.split('\n');
    let inUsageSection = false;
    let usage = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('usage') || 
          trimmed.toLowerCase().includes('使用方法')) {
        inUsageSection = true;
        continue;
      }
      
      if (inUsageSection) {
        if (trimmed.startsWith('```')) {
          continue;
        }
        if (trimmed.startsWith('#')) {
          break;
        }
        if (trimmed) {
          usage += trimmed + '\n';
        }
      }
    }
    
    return usage.trim();
  }

  extractExamplesFromContent(content) {
    const examples = [];
    const lines = content.split('\n');
    let inExampleSection = false;
    let currentExample = '';
    let inCodeBlock = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().includes('example') || 
          trimmed.toLowerCase().includes('示例')) {
        inExampleSection = true;
        continue;
      }
      
      if (inExampleSection) {
        if (trimmed.startsWith('```')) {
          if (inCodeBlock) {
            if (currentExample.trim()) {
              examples.push(currentExample.trim());
              currentExample = '';
            }
            inCodeBlock = false;
          } else {
            inCodeBlock = true;
          }
          continue;
        }
        
        if (inCodeBlock) {
          currentExample += line + '\n';
        } else if (trimmed.startsWith('#')) {
          break;
        }
      }
    }
    
    if (currentExample.trim()) {
      examples.push(currentExample.trim());
    }
    
    return examples;
  }

  extractStepsFromContent(content) {
    const steps = [];
    const lines = content.split('\n');
    let inStepsSection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().includes('steps') || 
          trimmed.toLowerCase().includes('步骤')) {
        inStepsSection = true;
        continue;
      }
      
      if (inStepsSection) {
        if (trimmed.match(/^\d+\./)) {
          steps.push(trimmed.substring(trimmed.indexOf('.') + 1).trim());
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          steps.push(trimmed.substring(2).trim());
        } else if (trimmed.startsWith('#')) {
          break;
        }
      }
    }
    
    return steps;
  }

  sanitizeTitle(title) {
    return title.replace(/["']/g, '').trim();
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  async shouldUpdateFile(filePath, newContent) {
    try {
      const existingContent = await fs.readFile(filePath, 'utf8');
      const existingHash = createHash('md5').update(existingContent).digest('hex');
      const newHash = createHash('md5').update(newContent).digest('hex');
      return existingHash !== newHash;
    } catch {
      return true; // 文件不存在，需要创建
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printStats() {
    console.log('\n📊 爬取统计:');
    console.log(`   总文件数: ${this.stats.totalFiles}`);
    console.log(`   已处理: ${this.stats.processedFiles}`);
    console.log(`   已跳过: ${this.stats.skippedFiles}`);
    console.log(`   失败: ${this.stats.failedFiles}`);
    console.log(`   角色配置: ${this.stats.rolesFound}`);
    console.log(`   自定义命令: ${this.stats.commandsFound}`);
    console.log(`   工作流程: ${this.stats.workflowsFound}`);
    console.log(`   使用指南: ${this.contentTypes.guides.length}`);
    console.log(`   实践示例: ${this.contentTypes.examples.length}`);
    
    if (this.stats.startTime && this.stats.endTime) {
      const duration = Math.round((this.stats.endTime - this.stats.startTime) / 1000);
      console.log(`   总耗时: ${duration} 秒`);
    }
    
    const successRate = this.stats.totalFiles > 0 ? 
      ((this.stats.processedFiles / this.stats.totalFiles) * 100).toFixed(1) : 0;
    console.log(`   成功率: ${successRate}%`);
  }
}

/**
 * 主函数 - 执行爬取任务
 */
async function main() {
  try {
    const crawler = new CookbookCrawler({
      outputDir: path.join(__dirname, '../../docs'),
      delay: 1000,
      timeout: 10000
    });
    
    await crawler.crawl();
    
    console.log('\n🎉 claude-code-cookbook 爬取任务完成!');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 爬取任务失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  main();
}

module.exports = CookbookCrawler;