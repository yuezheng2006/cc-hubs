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

# 我如何使用 Claude Code

一份关于有效 Claude Code 使用模式的综合指南，从线程管理到 MCP 服务器、规划模式和 AI 辅助开发的生产力技巧。

# [我如何使用 Claude Code](#我如何使用-claude-code)

一个月前，我订阅了 Claude Max。我之前一直在使用包括 Claude Code 在内的 AI 代理，但有了固定定价，我的使用量飙升，它已经成为许多任务的日常驱动。我现在发现自己去 VS Code 的次数少了很多。

由于 AI 代理对每个人来说都是新的，我想分享一些我最近注意到的模式可能会很有趣。以下是我如何使用 Claude code。

## [启动新线程](#启动新线程)

如果有一件事我希望你从这里带走，那就是你应该绝对更频繁地调用 `/clear`。

AI 代理在对话时间越长时往往变得越不可预测。当你问不同的问题时尤其如此。我发现创建一个新提示通常更有效，即使这意味着重复一些指令。

一旦我开始更积极地这样做，我的结果显著改善。我绝对不是唯一一个给出这个建议的人。

## [创建精确的提示](#创建精确的提示)

我觉得这不用说，但当你与\_一个有健忘症的新毕业生\_一起工作时（这就是我喜欢思考 Claude 的方式），重要的是你要写出你头脑中所有的上下文。这很难，坦白说我认为我自己还不是很擅长，但你给 Claude 的上下文越多，它就越有效。如果你在想一些边缘情况，绝对要向 Claude 提及。如果你记得"我们过去在这个代码库中为这类问题使用过类似的模式"，写下来！提示越精确，Claude 做得越好。读心技术\_还没有\_到那里。

也要尝试思考任何隐含的上下文。例如，如果你要求 Claude 创建一个\_现代设计\_，它可能不知道你指的是什么现代。给出例子可能更好（例如，创建一个类似 Linear 的应用 UI 设计）。

## [让 Claude Code 使用 Claude Code](#让-claude-code-使用-claude-code)

你知道你可以将 Claude Code 的工具用作 MCP 服务器（`claude mcp serve`）吗？当我发现时，我查看了它暴露的工具，注意到一个叫做 `Task` 的工具。这个工具的前提是启动一个子代理，它将拥有与主代理相同的工具访问权限（除了它不能启动另一个子任务）并报告结果。

知道这个可用对于你有更复杂问题需要监督者时非常方便。以下是我最近如何使用这个功能对同一个问题进行深入研究的例子，使用四个不同的角色：

```
> 读取当前目录中的文件以推断构建 Tailwind Plus 组件的模式。你应该启动 4 个子任务，具有略微不同的优先级（例如设计颜色专家、无障碍专家、移动/响应式专家、整体风格专家）并比较他们的结果。

✻ 思考中…

  现在我将启动 4 个具有不同优先级的专门子任务来分析组件的各个方面。

⏺ 任务（设计颜色专家分析）
  ⎿  完成（24 个工具使用 · 41.5k tokens · 3m 4.4s）

⏺ 任务（无障碍专家分析）
  ⎿  完成（15 个工具使用 · 38.0k tokens · 2m 0.0s）

⏺ 任务（移动/响应式专家分析）
  ⎿  完成（14 个工具使用 · 45.5k tokens · 2m 1.2s）

⏺ 任务（整体风格专家分析）
  ⎿  完成（23 个工具使用 · 58.7k tokens · 2m 22.0s）
```

它很壮观\_而且\_可以并行完成。这是保持主任务上下文窗口有序并让 Claude 专注的好方法。

## [告诉 Claude 思考](#告诉-claude-思考)

就像我们这些有血有肉的老人类一样，Claude 默认是懒惰的。例如，当你告诉 Claude 做某事时，它会选择阻力最小的路径。如果你告诉它做\_至少\_三件事，我打赌它不会多做一件事。

关于使用扩展思考能力也是如此。为了获得更好的结果，特别是在规划过程中，我建议告诉 Claude _超思考_。

## [编辑之前的消息](#编辑之前的消息)

每当你太急于点击发送或只是觉得之前的消息可以更精确以获得更好的结果时，你可以按两次 Escape 跳转到之前的消息并分叉对话。我经常使用这个来完善提示或简单地让 Claude _再试一次_。

哦，如果你以某种方式想回到之前的状态，你可以用 `--resume` 标志启动 Claude 来列出所有之前的线程。

## [Yolo 模式](#yolo-模式)

这可能对我来说极其不负责任，但我现在主要用 `--dangerously-skip-permissions` 运行 Claude（感谢 Peter 的不良影响）。不是所有事情都需要，但如果我有 Claude 在处理一些长期运行的任务，我\_真的\_不想因为它使用新的终端命令而每分钟都要切换焦点。

我在我的 zsh 配置中设置了：

```
alias yolo="claude --dangerously-skip-permissions"
```

有趣的是，现在 Claude 可以做任何它想做的事情，我也更经常地遇到速率限制配额警告。

## [MCP 服务器](#mcp-服务器)

我个人对 MCP 服务器不太兴奋，因为没有哪个真正给我带来价值。在大多数情况下，我发现它们只是用我不需要的东西消耗宝贵的 tokens。Claude Code 中的内置工具对我来说足够了（特别是按照我在这里概述的方式使用时）。

过去，我使用过 Playwright MCP。虽然看到 Claude 启动浏览器、点击按钮和截图非常令人着迷，但我发现它主要是很快填满上下文窗口，而没有真正带来更好的结果。

## [Claude SDK](#claude-sdk)

Claude 有一个 SDK。它相当强大，特别是如果你乐意处理 `stream-json` 输出格式。但即使是小事，能够直接将提示传递给 `claude` 并让它打印回复正在创造很好的快捷方式。

作为一个例子，我在我的路径中有一个 `gcauto` 可执行文件，它做以下事情：

```
#!/bin/bash
git commit -m "$(claude -p "查看暂存的 git 更改并创建一个总结性的 git 提交标题。只回复标题，不要确认。")"
```

所以现在每当我提交东西时，我只是暂存它们并运行 `gcauto`。

## [规划模式](#规划模式)

Claude Code 有一个内置的规划模式，当你按两次 Shift+Tab 时触发。在这种模式下，Claude 不会写入你的文件系统。

我个人喜欢用另一个模型做规划，只是为了增加一点趣味。在过去的几周里，我一直在 Google AI Studio 中直接使用 Gemini 2.5 Pro。我不太知道这是怎么可能的，但我想我甚至不需要为此付费？

## [让 Claude RTFM](#让-claude-rtfm)

我在开始时犯的一个新手错误是告诉 Claude 用\_框架 x\_ 设置一个新项目。它确实有效，但我注意到 Claude 经常使用过时的设置和项目结构，特别是对于快速发展的前端框架！

我现在做的是先让 Claude 阅读手册。这可以通过不同方式完成：

*   粘贴文档链接并让 Claude 先阅读
*   让 Claude 找出最新技术
*   使用 `Task` 工具让 Claude 对特定主题进行深入研究

深度研究任务的例子可以像这样：

```
> 创建一个深度研究任务来找出如何将网站从 tailwind 3 迁移到 4，然后向我展示结果的简短摘要

⏺ 我将创建一个研究任务来调查从 Tailwind CSS v3 到 v4 的迁移，专注于你的 Tailwind UI 代码库的具体上下文。

⏺ 任务（Tailwind v3 到 v4 迁移研究）
  ⎿  完成（4 个工具使用 · 29.9k tokens · 5m 47.6s）

⏺ 摘要

  从 Tailwind CSS v3 迁移到 v4 涉及重大变化，但带来了主要性能改进（构建速度提高 3.5 倍）和更好的开发者体验。

  要点：
  - 使用自动化升级工具：npx @tailwindcss/upgrade@next
  - 配置从 JavaScript 移动到 CSS-first，使用 @theme 指令
  - 破坏性变化包括放弃浏览器支持、新的导入语法和移除已弃用的工具
  - 性能提升：构建现在以微秒为单位测量
  - 容器查询现在内置（不需要插件）

  迁移通过升级工具很简单，但要计划测试时间以确保所有组件正确渲染。
```

## [语音输入](#语音输入)

像 Superwhisper 这样的应用让口述提示变得非常容易。当我想要写一个更长的提示时，我发现这非常有效，因为它会更快地把想法从我的头脑中拿出来。

这真的适用于任何 LLM 输入字段，因为 LLM 通常能理解你的意思，即使转录很差且充满错误。

## [早期暂存，经常暂存](#早期暂存经常暂存)

我在 Claude Code 中缺少的一个功能是自动文件系统快照的能力。对我来说经常发生的是 Claude 变得有点太\_触发快乐\_，开始在我不想要的时候进行大更改。如果这发生在我已经得到一些好更改之后，这可能会搞乱工作目录。

为了避免这种情况，我开始早期且经常地暂存（即 `git add`）更改。如果我在一轮后满意，我通常会暂存所有内容，这样我就知道我可以很容易地回退到它。

## [Git Worktrees](#git-worktrees)

我对 Claude Code 如此着迷，以至于我现在在机器上为每个主要项目至少有两个工作树。这让我可以在\_同一个仓库\_中让 Claude 运行两个不同的问题。

设置也很容易！就像创建一个分支，但代码会在不同的目录中。在你的 git 仓库内，运行：

```
git worktree add ../tailwindcss.com-2 chore/upgrade-next
```

然后，瞧，你现在有另一个工作目录让 Claude Code 绝对疯狂地工作。

## [实验一次性工作](#实验一次性工作)

有了 AI，代码变得\_真的很便宜\_。这意味着你现在可以构建你只使用一次的东西而不感到内疚。你希望让当前任务更容易的一切都可以凭空创造。以下是我最近构建的一些东西的例子，在编码代理之前绝对不值得我的时间：

*   一个可视化我在工作中大型迁移期间当前进度的仪表板
*   一个 chrome 扩展，显示网站使用的 Tailwind CSS 版本（或者，天哪，它根本没有使用 Tailwind CSS）
*   一个 CLI 和后端来上传 Claude Code 转录以公开分享
*   一个 CLI 来总结我的 Claude Code API 成本，看看我从 Max 计划中获得多少价值（哦，太多了...）
*   一个在 git GUI 内实验 Claude Code 的 Electron 应用

## [如果可能，不要尝试一次性完成](#如果可能不要尝试一次性完成)

我目前专注于一个需要我在过程中接触许多 Tailwind Plus 组件的大规模更改。我天真的第一个想法是创建一个令人惊叹的、深思熟虑的提示，有很多细节，肯定能让 AI 一次性完成所有这些...这肯定可能，对吧？

好吧，剧透警告，但我用这种方法惨败了。它不仅没有做我一开始想要它做的事情，还让我无法审查更改或进行任何有意义的更改。我必须重新开始。

这次我先问 Claude Code 关于问题的问题。我们在写任何代码之前讨论了可能的更改。只有当我确定它知道我想要什么时，我才让它更改一个组件。经过一些测试和反馈后，我让它再做两个。然后另外五个，直到我最终让它展开并完成剩余的工作。

虽然这显然不如创建完美提示那么壮观，但它让我更快地到达最终结果，反馈循环更紧密，监督更严格。与手动在数百个不同组件上做这个更改相比，我仍然能够节省大量时间。

这可能是我\_拿错了\_的问题。我看到很多其他人声称在大规模一次性任务中成功（其中一些说 Claude 连续工作\_几个小时\_）。然而，在我自己的经验中，错误快速复合，LLM 经常在上下文窗口增长时失去线索（即使有广泛的子代理调用甚至尝试 Gemini 2.5 Pro）。如果有人能与我分享他们的秘密就好了！

## [自主反馈还是人在循环中？](#自主反馈还是人在循环中)

与上面的问题相关，这也是我仍然挣扎的领域。每当我看到人们赞美 AI 代理时，他们提到一些自主反馈循环的重要性，这样 LLM 可以自己改进结果。

然而，我还不能有效地做到这一点。当我尝试设置单元测试或 linter 反馈时，Claude _会读取它然后建议一切工作正常，尽管还有很多问题/警告_。当我设置它以便它可以导航到页面并截图时，上下文窗口很快就被 tokens 填满了。不用说，体验对我来说不太好。

我更喜欢做的是自己运行开发服务器。每当 Claude 回到我身边时，我自己看看，要么按原样复制粘贴任何堆栈跟踪，要么给出一些关于我想要不同完成的提示。我个人发现这种方法更有可能让我得到我想要的。

## [早期中断，经常中断](#早期中断经常中断)

每当我看到事情出错时，我通常按 Escape 立即中断 Claude，要求它回退最新更改，然后更引导它到我想要的方向。当然，这只有在你保持关注时才有效，坦白说我经常不这样做。

## [配置你的终端](#配置你的终端)

Claude Code 有一个隐藏的 `/terminal-setup` 命令，它会查看你当前的终端设置并进行一些更改，比如使 Shift+Enter 添加换行符或注册正确的铃声类型。虽然我无法用 Warp 解决换行符问题，但我的终端现在在 Claude 需要一些人工输入时会发出哔哔声。

## [连接你的 IDE](#连接你的-ide)

另一个相对较新的功能是你可以连接 Claude 来查看你在 IDE 中打开的文件并读取 linter 警告等。这可以通过在 IDE 的终端内运行 `claude` 或运行 `/ide` 命令来设置。如果你想告诉 Claude "修复我的 linter 问题"，这很方便。

## [自定义命令](#自定义命令)

你可以在 Claude Code 中创建自定义斜杠命令。如果你发现自己多次写类似的提示，这可能是你节省更多时间的机会。

我设置了一些东西来清理 Claude 非常热衷于创建的临时脚本或辅助文件，无论好坏。

## [将图片粘贴到 Claude](#将图片粘贴到-claude)

你可以将图片粘贴到 Claude Code 中。只需直接复制图片或将文件拖到终端，它就会作为附件添加到你的下一条消息中。我有时在想要进行小的视觉更改时使用这个。

## [结论](#结论)

Claude Code 从根本上改变了我处理许多编程任务的方式。虽然它不完美，需要适应你的工作流程，但生产力提升是真实的。关键是找到自动化和人工监督之间的正确平衡，并愿意尝试不同的方法。

随着 AI 编码助手继续发展，我预计这些模式中的许多都会改变。但现在，这些技术让我的日常编码生活显著更有生产力，而且，我敢说，更有趣。

* * *

## [来源和致谢](#来源和致谢)

本文基于 Philipp Spiess 的原创文章 [How I Use Claude Code](https://spiess.dev/blog/how-i-use-claude-code) 进行扩展和本地化。

**原作者**: Philipp Spiess  
**原始链接**: [https://spiess.dev/blog/how-i-use-claude-code](https://spiess.dev/blog/how-i-use-claude-code)  
**发布日期**: 2025年6月11日

感谢 Philipp Spiess 分享这些宝贵的 Claude Code 使用模式和技巧。本文保留了所有技术细节、代码示例和最佳实践说明，同时进行了适当的格式优化。

[

使用 Claude 生产真实代码的实战笔记

一份关于 AI 辅助开发在生产环境中真正有效的综合指南。学习三种 vibe-coding 模式、基础设施设置，以及人类编写测试的神圣规则。

](/docs/zh/best-practices/field-notes-shipping-real-code-claude)[

Andrej Karpathy 谈 LLM 辅助编程的演进：哲学与实践的融合

AI 传奇人物 Andrej Karpathy 对多层次 LLM 编程工作流的深度洞察，结合实用的 Claude Code 技巧和策略，探索最佳 AI 辅助开发方案。

](/docs/zh/best-practices/karpathy-llm-coding-evolution)

### On this page

[我如何使用 Claude Code](#我如何使用-claude-code)[启动新线程](#启动新线程)[创建精确的提示](#创建精确的提示)[让 Claude Code 使用 Claude Code](#让-claude-code-使用-claude-code)[告诉 Claude 思考](#告诉-claude-思考)[编辑之前的消息](#编辑之前的消息)[Yolo 模式](#yolo-模式)[MCP 服务器](#mcp-服务器)[Claude SDK](#claude-sdk)[规划模式](#规划模式)[让 Claude RTFM](#让-claude-rtfm)[语音输入](#语音输入)[早期暂存，经常暂存](#早期暂存经常暂存)[Git Worktrees](#git-worktrees)[实验一次性工作](#实验一次性工作)[如果可能，不要尝试一次性完成](#如果可能不要尝试一次性完成)[自主反馈还是人在循环中？](#自主反馈还是人在循环中)[早期中断，经常中断](#早期中断经常中断)[配置你的终端](#配置你的终端)[连接你的 IDE](#连接你的-ide)[自定义命令](#自定义命令)[将图片粘贴到 Claude](#将图片粘贴到-claude)[结论](#结论)[来源和致谢](#来源和致谢)