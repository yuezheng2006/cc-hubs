# Claude Code 最佳实践文档中心

> 集中化的 Claude Code 最佳实践文档平台，自动爬取和整合优质资源

## 📖 项目简介

本项目旨在构建一个集中化的 Claude Code 最佳实践文档中心，通过自动化爬取和整合现有优质资源，为开发者提供全面、实用的 Claude Code 使用指南。

### 🎯 核心特性

- **自动化内容爬取**: 定期从 [ctok.ai](https://docs.ctok.ai/claude-code-common-workflows) 和 [claude-code-cookbook](https://github.com/foreveryh/claude-code-cookbook) 爬取最新内容
- **现代化文档平台**: 基于 Mintlify 构建的美观、易用的文档站点
- **自动部署**: 通过 GitHub Actions + Vercel 实现内容更新的自动部署
- **全文搜索**: 支持全站文档内容的快速搜索和筛选
- **响应式设计**: 完美适配桌面端、平板和移动设备

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/your-username/claude-code-best-practices-hub.git
cd claude-code-best-practices-hub

# 安装依赖
npm install

# 爬取初始内容
npm run crawl:all

# 启动开发服务器
npm run dev
```

### 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# GitHub Token (用于访问 GitHub API)
GITHUB_TOKEN=your_github_token_here

# 可选：自定义爬取配置
CRAWL_INTERVAL=24h
MAX_PAGES_PER_CRAWL=100
```

## 📁 项目结构

```
├── docs/                    # 文档内容
│   ├── mint.json           # Mintlify 配置
│   ├── introduction.mdx    # 首页内容
│   ├── workflows/          # 工作流程指南
│   ├── commands/           # 命令参考
│   └── roles/              # 角色设置
├── scripts/                # 自动化脚本
│   ├── crawlers/          # 内容爬虫
│   ├── deploy/            # 部署脚本
│   └── utils/             # 工具函数
├── .github/workflows/     # GitHub Actions
└── package.json           # 项目配置
```

## 🔧 可用脚本

```bash
# 开发相关
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 内容爬取
npm run crawl:ctok      # 爬取 ctok.ai 内容
npm run crawl:cookbook  # 爬取 cookbook 内容
npm run crawl:all       # 爬取所有内容

# 内容管理
npm run sync:content     # 同步内容到 GitHub
npm run validate:content # 验证内容格式
```

## 🤖 自动化工作流

项目配置了以下 GitHub Actions 工作流：

- **内容爬取**: 每天自动爬取最新内容并提交到仓库
- **自动部署**: 内容更新时自动触发 Vercel 部署
- **内容验证**: 确保所有文档格式正确且链接有效

## 📚 内容来源

- [ctok.ai Claude Code 工作流程](https://docs.ctok.ai/claude-code-common-workflows)
- [Claude Code Cookbook](https://github.com/foreveryh/claude-code-cookbook)

## 🤝 贡献指南

我们欢迎社区贡献！请参考以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 内容贡献

- 直接编辑 `docs/` 目录下的 Markdown 文件
- 添加新的工作流程或命令文档
- 改进现有文档的质量和准确性
- 报告错误或提出改进建议

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [文档站点](https://your-docs-site.vercel.app)
- [问题反馈](https://github.com/your-username/claude-code-best-practices-hub/issues)
- [Mintlify 文档](https://mintlify.com/docs)

---

**Built with ❤️ by the Claude Code Community**