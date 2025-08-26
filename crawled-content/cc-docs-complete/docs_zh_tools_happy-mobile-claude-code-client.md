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

# Happy：Claude Code 的移动端和网页客户端

一个全面的移动端和网页客户端，为您的手机带来具备端到端加密、语音控制和多会话支持的 Claude Code。让您在任何地方都能使用 Claude Code，无需改变工作流程。

# [Happy：Claude Code 的移动端和网页客户端](#happyclaude-code-的移动端和网页客户端)

> **⭐ GitHub**: [slopus/happy](https://github.com/slopus/happy) (466 stars)

Happy 是一个革命性的移动端和网页客户端，将 Claude Code 扩展到桌面之外，让您能够在任何地方访问、监控和控制您的 AI 编程会话。通过端到端加密、语音控制和多会话支持，Happy 改变了开发者与 Claude Code 的交互方式。

## [🚀 什么是 Happy？](#-什么是-happy)

Happy 是一个开源解决方案，允许您：

*   **在移动设备上访问 Claude Code** - 支持 iOS、Android 和网页平台
*   **控制多个会话** - 同时运行多个 Claude Code 实例
*   **语音交互** - 通过实时语音执行实现免提编程
*   **端到端加密** - 您的代码在设备之间传输时始终保持加密状态
*   **零工作流程中断** - 与您现有的工具和环境完美配合

## [🎯 主要功能](#-主要功能)

### [📱 多平台访问](#-多平台访问)

*   **iOS 应用**: [从 App Store 下载](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505)
*   **Android 应用**: [从 Google Play 下载](https://play.google.com/store/apps/details?id=com.ex3ndr.happy)
*   **网页应用**: [启动网页应用](https://app.happy.engineering/)
*   **桌面端**: 与您现有的 Claude Code 设置无缝配合

### [🔒 安全与隐私](#-安全与隐私)

*   **端到端加密** - 设备之间的消息完全加密
*   **无遥测或跟踪** - 您的数据保持私密
*   **开源** - MIT 许可证，代码可审计
*   **本地处理** - 在您的硬件上运行

### [🎙️ 语音控制](#️-语音控制)

*   **实时语音执行** - 说出命令并观看它们执行
*   **免提编程** - 真正的语音转动作，不仅仅是转录
*   **语音代理** - 超越简单听写的高级语音交互

### [🔄 多会话管理](#-多会话管理)

*   **并行会话** - 运行多个 Claude Code 实例
*   **上下文切换** - 在前端、后端和 DevOps 任务之间切换
*   **会话连续性** - 在设备间恢复会话
*   **智能通知** - 在需要输入时获得提醒

## [🛠️ 工作原理](#️-工作原理)

Happy 使用三组件架构：

### [1\. CLI 程序 (`happy`)](#1-cli-程序-happy)

```
npm install -g happy-coder
happy
```

CLI 在您的计算机上运行，包装 Claude Code 并在发送到中继服务器之前加密会话数据。

### [2\. 移动端/网页应用](#2-移动端网页应用)

客户端应用从服务器接收加密数据，并提供监控和控制 Claude Code 会话的界面。

### [3\. 中继服务器](#3-中继服务器)

一个安全的服务器，在您的计算机和移动设备之间传递加密消息，无法读取内容。

## [📦 快速开始](#-快速开始)

### [步骤 1：安装 CLI](#步骤-1安装-cli)

```
npm install -g happy-coder
```

### [步骤 2：下载移动应用](#步骤-2下载移动应用)

*   [iOS App Store](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505)
*   [Google Play 商店](https://play.google.com/store/apps/details?id=com.ex3ndr.happy)
*   [网页应用](https://app.happy.engineering/)

### [步骤 3：开始使用](#步骤-3开始使用)

```
# 使用 'happy' 替代 'claude'
happy
```

## [🔥 为什么选择 Happy？](#-为什么选择-happy)

### [**零工作流程中断**](#零工作流程中断)

继续使用您最喜欢的工具、编辑器和开发环境。Happy 可以无缝集成，无需更改您现有的工作流程。

### [**移动优先设计**](#移动优先设计)

与仅支持桌面的解决方案不同，Happy 将完整的 Claude Code 体验带到移动设备上，界面针对触摸和语音交互进行了优化。

### [**真正的语音编程**](#真正的语音编程)

超越听写功能，提供理解编程上下文并实时执行操作的智能语音命令。

### [**多项目管理**](#多项目管理)

同时处理多个项目，每个项目都有独立的 Claude Code 会话，保持各自的上下文和状态。

### [**社区驱动**](#社区驱动)

由需要移动访问其 AI 编程会话的工程师构建，拥有活跃的社区和持续改进。

## [🏗️ 项目组件](#️-项目组件)

Happy 是一个更大生态系统的一部分：

*   **[happy-cli](https://github.com/slopus/happy-cli)** - 命令行界面
*   **[happy-server](https://github.com/slopus/happy-server)** - 用于加密同步的后端服务器
*   **happy-coder** - 移动端和网页客户端（主仓库）

## [📱 使用场景](#-使用场景)

### [**移动监控**](#移动监控)

在午休或通勤期间检查 Claude 在您项目上的进展。

### [**语音驱动开发**](#语音驱动开发)

在行走、锻炼或无法打字的情况下免提编程。

### [**多设备工作流程**](#多设备工作流程)

在桌面上开始编程会话，在移动设备上继续，然后无缝切换回来。

### [**团队协作**](#团队协作)

与团队成员分享加密会话链接，进行协作调试和代码审查。

### [**远程开发**](#远程开发)

在任何有互联网连接的地方访问和控制您的开发环境。

## [🎥 演示和资源](#-演示和资源)

*   **[观看演示](https://youtu.be/GCS0OG9QMSE)** - 观看 Happy 的实际操作
*   **[官方网站](https://happy.engineering/)** - 了解更多功能
*   **[GitHub 仓库](https://github.com/slopus/happy)** - 源代码和文档

## [🤝 社区和支持](#-社区和支持)

Happy 由分布在湾区咖啡店和黑客屋的工程师团队开发，源于在远离键盘时查看 Claude Code 进展的真实需求。

### [**贡献**](#贡献)

*   **开源** - MIT 许可证，代码结构良好
*   **友好社区** - 欢迎所有级别的贡献者
*   **积极开发** - 定期更新和功能添加

### [**获得帮助**](#获得帮助)

*   **GitHub Issues** - [报告错误或请求功能](https://github.com/slopus/happy/issues)
*   **文档** - 全面的设置和使用指南
*   **社区** - 活跃的开发者社区提供支持

## [🔮 移动 AI 开发的未来](#-移动-ai-开发的未来)

Happy 代表了 AI 辅助开发工具的下一个演进，打破了桌面和移动开发工作流程之间的障碍。随着 AI 编程助手变得更加强大，拥有移动访问能力对于保持生产力和与项目保持连接变得越来越重要。

无论您是从事副项目的独立开发者，还是构建下一个重大项目的团队成员，Happy 都能确保您在任何地方都不会失去与 AI 编程助手的联系。

* * *

**准备将 Claude Code 移动化了吗？** 立即下载 Happy，体验在任何地方进行 AI 辅助编程的自由。

*   📱 [iOS 应用](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505)
*   🤖 [Android 应用](https://play.google.com/store/apps/details?id=com.ex3ndr.happy)
*   🌐 [网页应用](https://app.happy.engineering/)
*   ⭐ [在 GitHub 上加星](https://github.com/slopus/happy)

[

CUI: Claude Code Web UI

一个现代化的 Claude Code 代理 Web UI，允许您在任何浏览器中访问 Claude Code，支持并行后台代理和任务管理。

](/docs/zh/tools/cui-web-ui)[

Claude Code Hook: 防止敷衍回复

一个用于防止 Claude Code 使用敷衍性回复的钩子脚本，通过检测'你是对的'等表达来提升对话质量

](/docs/zh/tools/you-are-not-right-hook)

### On this page

[Happy：Claude Code 的移动端和网页客户端](#happyclaude-code-的移动端和网页客户端)[🚀 什么是 Happy？](#-什么是-happy)[🎯 主要功能](#-主要功能)[📱 多平台访问](#-多平台访问)[🔒 安全与隐私](#-安全与隐私)[🎙️ 语音控制](#️-语音控制)[🔄 多会话管理](#-多会话管理)[🛠️ 工作原理](#️-工作原理)[1\. CLI 程序 (`happy`)](#1-cli-程序-happy)[2\. 移动端/网页应用](#2-移动端网页应用)[3\. 中继服务器](#3-中继服务器)[📦 快速开始](#-快速开始)[步骤 1：安装 CLI](#步骤-1安装-cli)[步骤 2：下载移动应用](#步骤-2下载移动应用)[步骤 3：开始使用](#步骤-3开始使用)[🔥 为什么选择 Happy？](#-为什么选择-happy)[**零工作流程中断**](#零工作流程中断)[**移动优先设计**](#移动优先设计)[**真正的语音编程**](#真正的语音编程)[**多项目管理**](#多项目管理)[**社区驱动**](#社区驱动)[🏗️ 项目组件](#️-项目组件)[📱 使用场景](#-使用场景)[**移动监控**](#移动监控)[**语音驱动开发**](#语音驱动开发)[**多设备工作流程**](#多设备工作流程)[**团队协作**](#团队协作)[**远程开发**](#远程开发)[🎥 演示和资源](#-演示和资源)[🤝 社区和支持](#-社区和支持)[**贡献**](#贡献)[**获得帮助**](#获得帮助)[🔮 移动 AI 开发的未来](#-移动-ai-开发的未来)