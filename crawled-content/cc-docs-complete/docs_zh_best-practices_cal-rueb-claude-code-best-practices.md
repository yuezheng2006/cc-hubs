[Killer Code](/)

Search

⌘K

[Best Practices](/docs)[Cookbook](https://github.com/foreveryh/claude-code-cookbook)[Official Docs](https://claude.ai/code)[Build with Claude](https://www.anthropic.com/learn/build-with-claude)[Author](https://x.com/Stephen4171127)[首页](/docs)

[Claude Code Documentation](/docs/en)

[Claude Code 文档中心](/docs/zh)

[高级](/docs/zh/advanced)

[最佳实践](/docs/zh/best-practices)

[我如何使用 Claude Code（+ 我的最佳技巧）](/docs/zh/best-practices/builder-claude-code)[Cal Rueb 的 Claude Code 最佳实践](/docs/zh/best-practices/cal-rueb-claude-code-best-practices)[Claude Code 最佳实践](/docs/zh/best-practices/claude-code-best-practices)[Claude Code 就是我的电脑](/docs/zh/best-practices/claude-code-is-my-computer)[掌握 Claude Code 的 33 个必知设置技巧](/docs/zh/best-practices/claude-code-setup-tips)[使用 Claude 生产真实代码的实战笔记](/docs/zh/best-practices/field-notes-shipping-real-code-claude)[我如何使用 Claude Code](/docs/zh/best-practices/how-i-use-claude-code)[Andrej Karpathy 谈 LLM 辅助编程的演进：哲学与实践的融合](/docs/zh/best-practices/karpathy-llm-coding-evolution)[一个半月高强度 Claude Code 使用后感受](/docs/zh/best-practices/onevcat-claude-code-experience)[使用 Claude Code 的六周回顾](/docs/zh/best-practices/six-weeks-of-claude-code)

[社区技巧](/docs/zh/community-tips)

[Cursor](/docs/zh/cursor)

[子代理](/docs/zh/sub-agents)

[工具](/docs/zh/tools)

[Claude Code 文档中心](/docs/zh)/[最佳实践](/docs/zh/best-practices)

# Cal Rueb 的 Claude Code 最佳实践

来自 Anthropic 技术团队成员 Cal Rueb 的 Claude Code 最佳实践分享，涵盖从基础设置到高级技巧的完整指南。

# [Cal Rueb 的 Claude Code 最佳实践](#cal-rueb-的-claude-code-最佳实践)

**发布于 2025 年 1 月 15 日**

来自 Anthropic 技术团队成员 Cal Rueb 在 'Code w/ Claude' 的主题演讲中，通过自己的使用经历、工具的底层工作原理、适用场景以及最佳实践，为我们全面展示了 Claude Code 的魅力和实用性。他强调的"简单但有效"的设计哲学，以及对安全、权限的重视，说明 Anthropic 在打造实用工具时兼顾了可靠性和用户体验。

## [完整演讲视频](#完整演讲视频)

## [Cal 的亲身经历：从"上瘾"到核心贡献者](#cal-的亲身经历从上瘾到核心贡献者)

Cal 分享了自己如何"迷上" Claude Code 的故事。他是个爱折腾代码但总半途而废的程序员，去年在公司 Slack 里听说这个工具后，迫不及待在周末下载试玩。他用 Claude Code 开发一个笔记应用，整个人像着了魔，抱着笔记本到处跑，边按回车边看应用在眼前成型。那种"看着代码自己长出来"的感觉，让他彻底改变了对编码的看法。

更有趣的是，Claude Code 团队有个内部排行榜，记录员工的使用量。Cal 那周末疯狂"肝"工具，直接冲到榜首，引起了团队注意。他因此认识了开发团队，开始贡献自己的提示工程经验，最终成了核心成员，负责优化系统提示、工具描述和评估方法。

这个故事不仅让人觉得 Claude Code 好玩，还传递了一个信息：它对新手和专家都友好，能迅速提升编码效率。

## [Claude Code 的最佳用例](#claude-code-的最佳用例)

Cal 总结了 Claude Code 的几大"杀手级"应用场景，覆盖了从代码探索到部署的整个开发生命周期：

### [代码库探索](#代码库探索)

跳进一个陌生代码库时，Claude Code 能帮你快速上手。你可以问它"这个功能在哪实现的？"或者"看看 Git 历史，讲讲这文件最近咋改的？"它会像老司机一样带你熟悉项目，省去摸索时间。

### [头脑风暴](#头脑风暴)

在动手写代码前，你可以让 Claude Code 搜索代码库，提出 2-3 种实现方案，帮你理清思路。比如，"我想加个新功能，搜搜看咋搞，给我几个选项。"

### [代码编写](#代码编写)

从零开始建应用（比如写个小游戏）超级爽，Claude Code 能快速搭框架。但更牛的是，它擅长在现有代码库里干活，比如加功能、写单元测试、优化代码。因为它会自动跑测试、检查 TS 和 linting，代码质量有保障。

### [提交与 PR](#提交与-pr)

写完代码后，让 Claude Code 帮你写清晰的 Git 提交信息或 PR 描述，省时又专业。

### [部署与 CI/CD](#部署与-cicd)

通过 Claude Code 的 SDK，你可以把它嵌入 CI/CD 流程，比如用在 GitHub Actions 里，自动处理某些任务。

### [调试与支持](#调试与支持)

遇到错误？让 Claude Code 分析日志，定位问题。卡在 Git rebase 里？它能帮你解套。

### [代码迁移](#代码迁移)

对于大型重构（比如从 Java 老版本升级，或 PHP 转 React），Claude Code 能降低迁移难度，帮你自动化部分工作。

## [最佳实践：如何用好 Claude Code](#最佳实践如何用好-claude-code)

Cal 分享了几个实用技巧，让你能最大化 Claude Code 的价值。这些建议既有基础操作，也有进阶玩法：

### [基础设置](#基础设置)

#### [用 claude.md 文件](#用-claudemd-文件)

这是 Claude Code 的"记忆本"。在项目根目录或子目录放一个 claude.md，写上项目概况、测试运行方式、代码风格指南等。Claude 启动时会自动读这个文件，相当于给它一份"项目说明书"。你也可以在用户主目录放一个全局 claude.md，记录个人偏好。

#### [权限管理](#权限管理)

Claude Code 的默认设置是读操作随便，写操作或跑命令得确认。你可以调权限加速流程，比如设置某些命令（像 npm run test）自动通过，或者用"自动接受模式"（Shift+Tab）让 Claude 直接干活。

#### [善用 CLI 工具](#善用-cli-工具)

Claude Code 擅长终端操作，装上 GitHub 的 gh 工具或公司内部 CLI 工具，能让它干更多活。Cal 建议优先用成熟的 CLI 工具，而不是啥都靠 MCP 服务器。

### [工作流程优化](#工作流程优化)

#### [上下文管理](#上下文管理)

Claude 的上下文窗口有 20 万 token，但长对话可能塞满。如果你看到警告，可以用 `/clear` 清空上下文（保留 claude.md），或者用 `/compact` 让 Claude 总结对话，压缩上下文继续干活。

#### [计划先行](#计划先行)

别直接让 Claude 修 bug，先让它搜搜问题，出一份修复计划。你确认计划靠谱后再动手，能省不少时间。Claude 还能自动生成待办清单（to-do list），你可以边看边调整。

#### [测试驱动开发](#测试驱动开发)

让 Claude 小步快跑，改一点代码就跑测试，检查 TS 和 linting，确保没问题再提交。这样即使出岔子，也能快速回滚。

#### [用截图辅助](#用截图辅助)

Claude 支持多模态输入，遇到 UI 问题可以截图扔给它，比如"照着这个 mock.png 建个网页"。

### [进阶技巧](#进阶技巧)

#### [多 Claude 并行](#多-claude-并行)

高手可以同时跑 2-4 个 Claude 实例（比如用 Tmux 或多标签页），像指挥乐队一样分工合作。Cal 坦言自己最多搞两个，但见过四 Claude 大神。

#### [善用 Escape 键](#善用-escape-键)

Claude 干活时，你可以随时按 Escape 打断，调整方向。双击 Escape 还能回溯对话，改之前的指令。

#### [扩展工具](#扩展工具)

如果默认工具不够用，可以加 MCP 服务器，解锁更多功能。

#### [无头自动化](#无头自动化)

用 Claude Code SDK 在 CI/CD 或其他流程里跑自动化任务，比如自动审代码、写测试。

## [新功能亮点](#新功能亮点)

Cal 在演讲最后展示了几个刚发布的功能，凸显 Claude Code 的快速迭代：

### [切换模型](#切换模型)

用 `/model` 查看当前模型（默认是 Sonnet），可以切到 Opus。`/config` 还能调其他设置。

### [增强思考能力](#增强思考能力)

新模型（Claude 4）支持在工具调用间"思考"，能更聪明地分析问题。比如让它"think hard"去理解项目结构，你会看到它一边搜文件一边推理，过程透明。

### [IDE 集成](#ide-集成)

VS Code 和 JetBrains 的插件更强大，Claude 能感知你当前编辑的文件，上下文更精准。

### [保持更新](#保持更新)

Claude Code 在 GitHub 上有公开项目，Cal 建议每周看下变更日志，紧跟新功能。

## [观众问答：解决实际问题](#观众问答解决实际问题)

演讲最后，Cal 回答了几个观众的疑问，透露了一些实用信息：

### [多 claude.md 文件咋办？](#多-claudemd-文件咋办)

默认只读当前目录的 claude.md，但 Claude 搜子目录时会读相关的 claude.md。你还可以在 claude.md 里用 @ 引用其他文件，灵活组合。

### [Claude 不听 claude.md 咋整？](#claude-不听-claudemd-咋整)

早期模型确实有点"倔"，比如爱加没用的代码注释。Claude 4 改进了指令遵循能力，Cal 建议升级模型并检查 claude.md 内容，删掉过时指令。

### [多智能体协作咋搞？](#多智能体协作咋搞)

目前没原生支持复杂多智能体上下文共享，但可以让智能体写共享文件（比如 ticket.md）来传递状态。未来可能会有更优雅的解决方案。

## [核心洞察](#核心洞察)

Claude Code 使用代理式搜索（grep、find、glob）来自然地探索代码库，就像人类一样。不需要花哨的索引。

演讲涵盖了更多关于上下文管理、集成设置和真实工作流程的详细信息。如果你认真想要最大化 Claude Code 的价值，绝对值得完整观看。

## [总结](#总结)

Cal Rueb 的分享为我们提供了一个全面的 Claude Code 使用指南，从基础设置到高级技巧，从个人使用到团队协作。他的亲身经历和实用建议，让这个强大的工具变得更加亲民和实用。

关键要点：

*   **简单但有效**：Claude Code 的设计哲学
*   **claude.md 文件**：持久化上下文的关键
*   **权限管理**：平衡安全性和效率
*   **计划先行**：不要直接跳入编码
*   **多模态支持**：截图和文本结合使用
*   **持续学习**：跟上新功能和最佳实践

通过这些最佳实践，你可以充分利用 Claude Code 的强大功能，提升你的编码效率和代码质量。

[

我如何使用 Claude Code（+ 我的最佳技巧）

来自 Cursor 高级用户的全面指南，讲述如何切换到 Claude Code，包括实用技巧、工作流程优化和真实使用模式。

](/docs/zh/best-practices/builder-claude-code)[

Claude Code 最佳实践

使用 Claude Code 进行有效代理式编码的最佳实践。

](/docs/zh/best-practices/claude-code-best-practices)

### On this page

[Cal Rueb 的 Claude Code 最佳实践](#cal-rueb-的-claude-code-最佳实践)[完整演讲视频](#完整演讲视频)[Cal 的亲身经历：从"上瘾"到核心贡献者](#cal-的亲身经历从上瘾到核心贡献者)[Claude Code 的最佳用例](#claude-code-的最佳用例)[代码库探索](#代码库探索)[头脑风暴](#头脑风暴)[代码编写](#代码编写)[提交与 PR](#提交与-pr)[部署与 CI/CD](#部署与-cicd)[调试与支持](#调试与支持)[代码迁移](#代码迁移)[最佳实践：如何用好 Claude Code](#最佳实践如何用好-claude-code)[基础设置](#基础设置)[用 claude.md 文件](#用-claudemd-文件)[权限管理](#权限管理)[善用 CLI 工具](#善用-cli-工具)[工作流程优化](#工作流程优化)[上下文管理](#上下文管理)[计划先行](#计划先行)[测试驱动开发](#测试驱动开发)[用截图辅助](#用截图辅助)[进阶技巧](#进阶技巧)[多 Claude 并行](#多-claude-并行)[善用 Escape 键](#善用-escape-键)[扩展工具](#扩展工具)[无头自动化](#无头自动化)[新功能亮点](#新功能亮点)[切换模型](#切换模型)[增强思考能力](#增强思考能力)[IDE 集成](#ide-集成)[保持更新](#保持更新)[观众问答：解决实际问题](#观众问答解决实际问题)[多 claude.md 文件咋办？](#多-claudemd-文件咋办)[Claude 不听 claude.md 咋整？](#claude-不听-claudemd-咋整)[多智能体协作咋搞？](#多智能体协作咋搞)[核心洞察](#核心洞察)[总结](#总结)