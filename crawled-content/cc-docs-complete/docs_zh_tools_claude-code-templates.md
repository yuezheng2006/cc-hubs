[Killer Code](/)

Search

⌘K

[Best Practices](/docs)[Cookbook](https://github.com/foreveryh/claude-code-cookbook)[Official Docs](https://claude.ai/code)[Build with Claude](https://www.anthropic.com/learn/build-with-claude)[Author](https://x.com/Stephen4171127)[首页](/docs)

[Claude Code Documentation](/docs/en)

[Claude Code 文档中心](/docs/zh)

[高级](/docs/zh/advanced)

[最佳实践](/docs/zh/best-practices)

[社区技巧](/docs/zh/community-tips)

[Cursor](/docs/zh/cursor)

[子代理](/docs/zh/sub-agents)

[工具](/docs/zh/tools)

[CCPM：Claude Code 项目管理器](/docs/zh/tools/ccpm-claude-code-project-manager)[Claude Code Router](/docs/zh/tools/claude-code-router)[Claude Code Templates: 配置和监控 Claude Code 的 CLI 工具](/docs/zh/tools/claude-code-templates)[Context Engineering 模板：让 AI 编码助手真正落地的系统方法](/docs/zh/tools/context-engineering)[CUI: Claude Code Web UI](/docs/zh/tools/cui-web-ui)[Happy：Claude Code 的移动端和网页客户端](/docs/zh/tools/happy-mobile-claude-code-client)[Claude Code Hook: 防止敷衍回复](/docs/zh/tools/you-are-not-right-hook)

[Claude Code 文档中心](/docs/zh)/[工具](/docs/zh/tools)

# Claude Code Templates: 配置和监控 Claude Code 的 CLI 工具

一个全面的 CLI 工具，用于配置和监控 Claude Code，具有框架特定命令、实时分析仪表板和独立组件安装功能。

# [Claude Code Templates: 配置和监控 Claude Code 的 CLI 工具](#claude-code-templates-配置和监控-claude-code-的-cli-工具)

> **⭐ GitHub**: [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) (2.6k stars)

**配置和监控 Claude Code 的 CLI 工具** - 为任何项目提供快速设置，包含框架特定命令和实时监控仪表板。

## [🚀 快速开始](#-快速开始)

```
# 交互式设置（推荐）
npx claude-code-templates@latest

# 实时分析仪表板  
npx claude-code-templates@latest --analytics

# 实时聊天 Web UI
npx claude-code-templates@latest --chats

# 系统健康检查
npx claude-code-templates@latest --health-check
```

## [✨ 核心功能](#-核心功能)

*   **📋 智能项目设置** - 自动检测和配置任何项目，提供框架特定命令
*   **📊 实时分析** - 通过实时状态检测和性能指标监控 Claude Code 会话
*   **🔍 健康检查** - 全面的系统验证，提供可操作的推荐
*   **🧩 独立组件** - 单独安装专门的代理、命令和 MCP

## [🌐 浏览和安装组件](#-浏览和安装组件)

**🎯 浏览所有组件** - 交互式 Web 界面，用于探索和安装模板、代理、命令和 MCP。

访问: [aitmpl.com](https://aitmpl.com)

## [🎯 您将获得什么](#-您将获得什么)

组件

描述

示例

**CLAUDE.md**

项目特定配置

框架最佳实践、编码标准

**Commands**

自定义斜杠命令

/generate-tests, /check-file, /optimize-bundle

**Agents**

领域 AI 专家

API 安全审计、React 性能、数据库优化

**MCPs**

外部服务集成

GitHub、数据库、开发工具

**Analytics**

实时监控仪表板

实时会话跟踪、使用统计、导出

## [📖 文档](#-文档)

**📚 完整文档** - 综合指南、示例和 API 参考

文档: [docs.aitmpl.com](https://docs.aitmpl.com)

快速链接:

*   **开始使用** - 安装和第一步
*   **项目设置** - 配置您的项目
*   **分析仪表板** - 实时监控
*   **独立组件** - 代理、命令、MCP
*   **CLI 选项** - 所有可用命令
*   **🔍 跟踪系统架构** - 带有 Mermaid 图表的技术文档

## [🎯 关键组件](#-关键组件)

### [CLAUDE.md 模板](#claudemd-模板)

项目特定的配置文件，为 Claude Code 提供框架最佳实践和编码标准。

### [自定义命令](#自定义命令)

专门的斜杠命令，扩展 Claude Code 的功能：

*   `/generate-tests` - 自动化测试生成
*   `/check-file` - 文件验证和分析
*   `/optimize-bundle` - 性能优化

### [AI 代理](#ai-代理)

可以集成到您工作流程中的领域特定 AI 专家：

*   **API 安全审计** - 全面的安全分析
*   **React 性能** - 前端优化
*   **数据库优化** - 查询和模式优化

### [MCP（模型上下文协议）集成](#mcp模型上下文协议集成)

将 Claude Code 与开发工具连接的外部服务集成：

*   **GitHub 集成** - 仓库管理和协作
*   **数据库连接** - 直接数据库访问和查询
*   **开发工具** - IDE 和构建系统集成

### [分析仪表板](#分析仪表板)

实时监控功能：

*   **实时会话跟踪** - 监控活跃的 Claude Code 会话
*   **使用统计** - 跟踪使用模式和性能
*   **导出功能** - 生成报告和洞察

## [🤝 贡献](#-贡献)

我们欢迎开源社区的贡献！

**🎯 浏览组件** 查看可用的内容，然后查看我们的贡献指南来添加您自己的模板、代理、命令或 MCP。

**贡献前请阅读我们的行为准则。**

## [归属](#归属)

此集合包含来自多个来源的组件：

**代理集合:**

*   **wshobson/agents Collection** by wshobson - 基于 MIT 许可证（48 个代理）

**命令集合:**

*   **awesome-claude-code Commands** by hesreallyhim - 基于 CC0 1.0 Universal（21 个命令）

## [📄 许可证](#-许可证)

本项目基于 MIT 许可证 - 详情请参阅 LICENSE 文件。

## [🔗 链接](#-链接)

*   **🌐 浏览组件**: [aitmpl.com](https://aitmpl.com)
*   **📚 文档**: [docs.aitmpl.com](https://docs.aitmpl.com)
*   **🐛 问题**: [GitHub Issues](https://github.com/davila7/claude-code-templates/issues)
*   **💬 讨论**: [GitHub Discussions](https://github.com/davila7/claude-code-templates/discussions)
*   **🔒 安全**: [安全政策](https://github.com/davila7/claude-code-templates/security)

## [使用场景](#使用场景)

### [对于开发者](#对于开发者)

*   **快速项目设置** - 在任何框架中开始使用 Claude Code
*   **自定义工作流程** - 为您的开发过程创建专门的命令
*   **性能监控** - 跟踪和优化您的 AI 辅助开发

### [对于团队](#对于团队)

*   **标准化配置** - 确保团队成员之间一致的 Claude Code 设置
*   **分析洞察** - 了解团队使用模式和生产力
*   **协作工具** - 共享和重用自定义命令和代理

### [对于组织](#对于组织)

*   **企业集成** - 与现有开发工具和工作流程连接
*   **安全合规** - 使用专门的代理进行安全审计
*   **可扩展监控** - 跟踪多个团队和项目的使用情况

* * *

## [来源和致谢](#来源和致谢)

本文基于 [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) GitHub 仓库整理而成。

**原作者**: davila7  
**原始链接**: [https://github.com/davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)  
**许可证**: MIT License

感谢 davila7 和所有贡献者创建了这个优秀的 Claude Code 工具集合，为 AI 辅助开发提供了强大的配置和监控能力。

[

Claude Code Router

强大的 Claude Code 路由工具，支持多模型智能路由和成本优化

](/docs/zh/tools/claude-code-router)[

Context Engineering 模板：让 AI 编码助手真正落地的系统方法

基于 coleam00/context-engineering-intro 的上下文工程模板与实践，涵盖 INITIAL/PRP 工作流、示例库与最佳实践

](/docs/zh/tools/context-engineering)

### On this page

[Claude Code Templates: 配置和监控 Claude Code 的 CLI 工具](#claude-code-templates-配置和监控-claude-code-的-cli-工具)[🚀 快速开始](#-快速开始)[✨ 核心功能](#-核心功能)[🌐 浏览和安装组件](#-浏览和安装组件)[🎯 您将获得什么](#-您将获得什么)[📖 文档](#-文档)[🎯 关键组件](#-关键组件)[CLAUDE.md 模板](#claudemd-模板)[自定义命令](#自定义命令)[AI 代理](#ai-代理)[MCP（模型上下文协议）集成](#mcp模型上下文协议集成)[分析仪表板](#分析仪表板)[🤝 贡献](#-贡献)[归属](#归属)[📄 许可证](#-许可证)[🔗 链接](#-链接)[使用场景](#使用场景)[对于开发者](#对于开发者)[对于团队](#对于团队)[对于组织](#对于组织)[来源和致谢](#来源和致谢)