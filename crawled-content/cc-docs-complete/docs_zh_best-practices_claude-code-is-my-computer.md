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

# Claude Code 就是我的电脑

深入探讨如何在无提示模式下使用 Claude Code 进行日常开发任务。学习如何利用 AI 进行内容发布、代码提取、自动化和系统管理。

# [Claude Code 就是我的电脑](#claude-code-就是我的电脑)

![英雄图片](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero.1bdefdce.png&w=3840&q=75)

**TL;DR**: 我在无提示模式下运行 Claude Code；它每天为我节省一小时，两个月来没有破坏我的 Mac。每月 200 美元的 [Max 计划](https://steipete.me/posts/2025/stop-overthinking-ai-subscriptions/)物有所值。

过去两个月，我一直在危险地生活。我启动 [Claude Code](https://claude.ai/code)（[2 月底发布](https://www.anthropic.com/news/claude-3-7-sonnet)）时使用 `--dangerously-skip-permissions` 标志，绕过所有权限提示。根据 [Anthropic 的文档](https://docs.anthropic.com/en/docs/claude-code)，这"仅适用于无互联网的 Docker 容器"，但它在普通 macOS 上运行完美。

是的，一个恶意提示理论上可能会摧毁我的系统。这就是为什么我保持每小时 [Arq](https://www.arqbackup.com/) 快照（加上 [SuperDuper!](https://www.shirt-pocket.com/SuperDuper/SuperDuperDescription.html) 克隆），但两个月后我零事故。

## [从"AI 助手"到一切终端](#从ai-助手到一切终端)

当我第一次安装 Claude Code 时，我以为我得到了一个更智能的命令行来执行编码任务。我实际得到的是一个恰好以文本运行的通用计算机界面。心理转变花了几周时间，但一旦点击，我意识到 Claude 可以字面上做我要求它在我的电脑上做的任何事情。

突破性时刻出现在我迁移到新 Mac 时。我没有做通常的恢复舞蹈，而是将 Claude 指向我的备份磁盘并说："从这个备份磁盘恢复这个 Mac——从 dotfiles 开始，然后是系统偏好设置、CLI 工具，并恢复 Homebrew 公式和全局 npm 包。"Claude 起草迁移计划，逐步执行，并在不到一小时内让我的新机器准备就绪。[1](https://steipete.me/posts/2025/claude-code-is-my-computer#user-content-fn-1)

## [我实际用它做什么](#我实际用它做什么)

我的日常 Claude Code 使用分为几个主要结果：

**发布内容**: "将这里的约 40 篇文章从 Jekyll 转换为 MDX 格式。确保复制图片并保留重定向。"二十分钟后，Claude 处理了每一篇文章，设置了适当的重定向，验证了所有图片路径，并推送了一个可合并的分支。

**提取功能**: "将这个功能提取到 Swift 项目中"（这就是我如何发布 [Demark](https://steipete.me/posts/2025/introducing-demark-html-to-markdown-in-swift/)）Claude 创建包结构，编写测试，文档，并处理整个开源发布过程。

**自动化内容**: 就像这篇文章。我使用 [Wispr Flow](https://wisprflow.ai/) 与 Claude 交谈，解释主题并告诉它阅读我过去的博客文章以我的风格写作。Claude 创建文档，帮助制定想法，并测试一切显示正确，而不是与 Markdown 格式搏斗。

**生成测试数据**: "[为项目创建种子数据](https://x.com/steipete/status/1923897903698887036)"变成 Claude 分析我的代码库，理解数据模型，并生成具有适当关系的真实测试数据。

**发布代码**: 我几周没有输入 `git commit -m`。相反，我说"以逻辑块提交所有内容"，Claude 处理整个流程——暂存更改，编写有意义的提交消息，推送，打开 PR，观看 CI，并修复任何 CI 失败。当构建中断时，它分析错误并自动修补它们。它在解决合并冲突方面也极其出色。

**清理操作系统**: "在 Dock 中隐藏最近的应用"变成单个自然语言命令，而不是谷歌搜索正确的 `defaults write` 咒语。Claude 知道 macOS 内部结构，并愉快地调用 `killall Dock` 在修改 plist 后重启 Dock。

**启动新机器**: 最近在设置 [CodeLooper](https://www.codelooper.app/) 的代码签名和公证时，Claude 处理了安装 Homebrew 包、创建私钥、将它们添加到钥匙串、创建备份、构建项目、上传到 GitHub、运行测试和监控过程。唯一的手动部分是点击更新 UI，但使用我的 [macOS Automator MCP Server](https://github.com/steipete/macos-automator-mcp)，我可能也可以教它那个。

我在 shell 配置中使用别名[2](https://steipete.me/posts/2025/claude-code-is-my-computer#user-content-fn-2)，所以只需输入 `cc` 就运行带权限标志的 Claude。

## [为什么这有效（以及什么时候不有效）](#为什么这有效以及什么时候不有效)

Claude Code 闪耀是因为它是命令行优先构建的，而不是事后添加到 IDE 中。代理可以完全访问我的文件系统（如果你足够大胆…），可以执行命令，读取输出，并根据结果迭代。

Anthropic 的[最佳实践指南](https://www.anthropic.com/engineering/claude-code-best-practices)建议在仓库根目录保持一个 `CLAUDE.md` 文件，包含项目特定上下文。我采用了这种模式，注意到 Claude 问更少的澄清问题，编写更准确的代码。你可以查看[我的 Claude Code 规则](https://github.com/steipete/agent-rules)了解我如何构建这些文件的示例。像这样的小优化快速复合。

主要限制是响应时间。Claude 的思考过程需要几秒钟，对于快速调试会话，我有时会使用传统工具。但是，你可以在命令前加上 `!` 直接运行它们，而不等待 token 评估——Claude 无论如何都会执行你的命令，但当你确切知道你在调用什么时，这更快。对于我不确定需要什么的探索性工作，Claude 的推理能力完全补偿了短暂的停顿。

## [为什么 Warp 缺乏](#为什么-warp-缺乏)

[Warp](https://www.warp.dev/) 的使命是"用 AI 重新发明命令行"。他们构建了美丽的 GPU 加速面板和智能自动完成。

根本区别在于信任和执行流程。Claude 纯粹通过文本操作，在理解上下文和意图方面非常智能。通过这种设置，我可以预先授权 Claude 执行命令，而无需持续确认提示。Warp，虽然优秀，但需要每个命令的单独批准——没有相当于 Claude 的"危险模式"，你可以授予全面执行信任。这意味着 Claude 保持对话流程，而 Warp 仍然用权限请求中断。

我注册了 Warp，因为我喜欢他们的使命，我希望他们最终去 Claude 所在的地方。但他们似乎对安全有根本不同的想法。另外，[Ghostty](https://ghostty.org/) 只是更好的命令行，原生，不是基于 Electron，更快。

## [发展方向](#发展方向)

我们处于 AI 原生开发工具的早期阶段。Claude Code 代表范式转变：从帮助你运行命令的工具到理解意图并采取行动的工具。我不只是更快地输入命令——我在根本上更高层次的抽象上操作。而不是思考"我需要编写 bash 脚本来处理这些文件，chmod 它，测试它，调试它"，我想"按日期组织这些文件并压缩任何超过 30 天的东西"。

这不是关于 AI 替代开发者——而是关于开发者成为极其强大系统的编排者。技能天花板上升：语法消失，系统思维闪耀。

## [你应该尝试这个吗？](#你应该尝试这个吗)

如果你对计算风险感到舒适并有可靠的备份，绝对应该。学习曲线基本上为零——你只是开始像与有能力的同事交谈一样与你的电脑交谈。几天内，你会想知道没有它你曾经是如何工作的。

你的电脑不再只是一台电脑。它是 Claude。而 Claude 荒谬地有能力。

* * *

有更疯狂的 Claude 工作流？联系我 [@steipete](https://twitter.com/steipete)。

* * *

**必读**: [我如何使用 Claude Code](https://spiess.dev/blog/how-i-use-claude-code) 是我的朋友和前员工 Philipp 为每个使用 Claude Code 的人写的必读文章。

## [脚注](#脚注)

1.  注意，完整的备份迁移有时会在较新的 macOS 版本中导致[各种系统问题](https://discussions.apple.com/thread/255759421)。[↩](https://steipete.me/posts/2025/claude-code-is-my-computer#user-content-fnref-1)
    
2.  `alias cc="claude --dangerously-skip-permissions"`[↩](https://steipete.me/posts/2025/claude-code-is-my-computer#user-content-fnref-2)
    

* * *

## [来源和致谢](#来源和致谢)

本文基于 Peter Steinberger 的原创文章 [Claude Code is My Computer](https://steipete.me/posts/2025/claude-code-is-my-computer) 进行扩展和本地化。

**原作者**: Peter Steinberger  
**原始链接**: [https://steipete.me/posts/2025/claude-code-is-my-computer](https://steipete.me/posts/2025/claude-code-is-my-computer)  
**发布日期**: 2025年6月3日

感谢 Peter Steinberger 分享这些宝贵的 Claude Code 使用经验。本文保留了所有技术细节、代码示例和最佳实践说明，同时进行了适当的格式优化和图片本地化处理。

[

Claude Code 最佳实践

使用 Claude Code 进行有效代理式编码的最佳实践。

](/docs/zh/best-practices/claude-code-best-practices)[

掌握 Claude Code 的 33 个必知设置技巧

通过 33 个基础到高级的技巧全面掌握 Claude Code，涵盖快捷键、提示技巧、MCP 服务器、项目规则和自动化钩子。从新手到专家级生产力的完整指南。

](/docs/zh/best-practices/claude-code-setup-tips)

### On this page

[Claude Code 就是我的电脑](#claude-code-就是我的电脑)[从"AI 助手"到一切终端](#从ai-助手到一切终端)[我实际用它做什么](#我实际用它做什么)[为什么这有效（以及什么时候不有效）](#为什么这有效以及什么时候不有效)[为什么 Warp 缺乏](#为什么-warp-缺乏)[发展方向](#发展方向)[你应该尝试这个吗？](#你应该尝试这个吗)[脚注](#脚注)[来源和致谢](#来源和致谢)