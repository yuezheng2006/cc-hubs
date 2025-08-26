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

# Claude Code 最佳实践

使用 Claude Code 进行有效代理式编码的最佳实践。

# [Claude Code：代理式编码的最佳实践](#claude-code代理式编码的最佳实践)

**发布于 2025 年 4 月 18 日**

Claude Code 是一款用于代理式编码的命令行工具。本文涵盖了在使用 Claude Code 过程中，在各种代码库、语言和环境中被证明行之有效的技巧和窍门。我们最近发布了 Claude Code，这是一款用于代理式编码的命令行工具。

作为一项研究项目，Claude Code 为 Anthropic 的工程师和研究人员提供了一种更原生的方式，将 Claude 集成到他们的编码工作流程中。Claude Code 刻意保持低层级和无固定模式，提供近乎原始模型的访问权限，而不强加特定的工作流程。这种设计理念创造了一个灵活、可定制、可编写脚本且功能强大的安全工具。

虽然功能强大，但这种灵活性给刚接触代理式编码工具的工程师带来了一定的学习曲线——至少在他们形成自己的最佳实践之前是这样。本文概述了在 Anthropic 的内部团队和在各种代码库、语言和环境中使用 Claude Code 的外部工程师中都行之有效的通用模式。此列表中的任何内容都不是一成不变的，也不是普遍适用的；请将这些建议视为起点。我们鼓励您进行试验，找到最适合您的方法！

想要了解更详细的信息吗？我们在 claude.ai/code 的综合文档涵盖了本文提到的所有功能，并提供了额外的示例、实现细节和高级技术。

## [1\. 自定义您的设置](#1-自定义您的设置)

Claude Code 是一款代理式编码助手，可自动将上下文引入提示中。这种上下文收集会消耗时间和 token，但您可以通过环境调整来优化它。

### [a. 创建 `CLAUDE.md` 文件](#a-创建-claudemd-文件)

`CLAUDE.md` 是一个特殊文件，Claude 在开始对话时会自动将其引入上下文。这使其成为记录以下内容的理想场所：

*   常用的 bash 命令
*   核心文件和实用程序函数
*   代码风格指南
*   测试说明
*   存储库礼仪（例如，分支命名、合并与变基等）
*   开发环境设置（例如，pyenv 的使用、哪些编译器有效）
*   特定于项目的任何意外行为或警告
*   您希望 Claude 记住的其他信息

`CLAUDE.md` 文件没有必需的格式。我们建议保持其简洁易读。例如：

```
# Bash 命令
- npm run build：构建项目
- npm run typecheck：运行类型检查器

# 代码风格
- 使用 ES 模块 (import/export) 语法，而不是 CommonJS (require)
- 尽可能解构导入（例如 `import { foo } from 'bar'`）

# 工作流程
- 在完成一系列代码更改后，请务必进行类型检查
- 为提高性能，首选运行单个测试，而不是整个测试套件
```

您可以将 `CLAUDE.md` 文件放置在多个位置：

*   **您的存储库根目录，或您运行 `claude` 的任何位置（最常见的用法）。** 将其命名为 `CLAUDE.md` 并将其检入 git，以便您可以在会话之间以及与您的团队共享（推荐），或者将其命名为 `CLAUDE.local.md` 并将其添加到 `.gitignore` 中。
*   **您运行 `claude` 的目录的任何父目录。** 这对于 monorepo 最为有用，您可能从 `root/foo` 运行 `claude`，并在 `root/CLAUDE.md` 和 `root/foo/CLAUDE.md` 中都有 `CLAUDE.md` 文件。这两者都将自动被引入上下文。
*   **您运行 `claude` 的目录的任何子目录。** 这与上述情况相反，在这种情况下，当您使用子目录中的文件时，Claude 会按需引入 `CLAUDE.md` 文件。
*   **您的主文件夹 (`~/.claude/CLAUDE.md`)**，这会将其应用于您的所有 `claude` 会话。

当您运行 `/init` 命令时，Claude 会自动为您生成一个 `CLAUDE.md`。

### [b. 调整您的 `CLAUDE.md` 文件](#b-调整您的-claudemd-文件)

您的 `CLAUDE.md` 文件会成为 Claude 提示的一部分，因此应像任何经常使用的提示一样对其进行优化。一个常见的错误是在没有迭代其有效性的情况下添加大量内容。花时间进行试验，确定什么能让模型产生最佳的指令遵循效果。您可以手动将内容添加到 `CLAUDE.md` 中，也可以按 `#` 键向 Claude 发出指令，它会自动将其合并到相关的 `CLAUDE.md` 中。许多工程师在编码时经常使用 `#` 来记录命令、文件和样式指南，然后将 `CLAUDE.md` 的更改包含在提交中，以便团队成员也能受益。在 Anthropic，我们偶尔会通过提示改进器来优化 `CLAUDE.md` 文件，并经常调整指令（例如，用"IMPORTANT"或"YOU MUST"来强调）以提高遵循度。

### [c. 管理 Claude 的允许工具列表](#c-管理-claude-的允许工具列表)

默认情况下，Claude Code 会请求任何可能修改您系统的操作的权限：文件写入、许多 bash 命令、MCP 工具等。我们设计 Claude Code 时采用了这种刻意保守的方法，以优先考虑安全性。您可以自定义允许列表，以允许您知道是安全的其他工具，或者允许易于撤消的潜在不安全工具（例如，文件编辑、`git commit`）。有四种方法可以管理允许的工具：

![Claude Code 工具允许列表](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclaude-code-tool-allowlist.444ba5c7.png&w=3840&q=75)

*   在会话期间出现提示时选择"始终允许"。
*   启动 Claude Code 后使用 `/permissions` 命令从允许列表中添加或删除工具。例如，您可以添加 `Edit` 以始终允许文件编辑，添加 `Bash(git commit:*)` 以允许 git 提交，或添加 `mcp__puppeteer__puppeteer_navigate` 以允许使用 Puppeteer MCP 服务器进行导航。
*   手动编辑您的 `.claude/settings.json` 或 `~/.claude.json`（我们建议将前者检入源代码管理以与您的团队共享）。
*   使用 `--allowedTools` CLI 标志进行会话特定的权限设置。

### [d. 如果使用 GitHub，请安装 gh CLI](#d-如果使用-github请安装-gh-cli)

Claude 知道如何使用 `gh` CLI 与 GitHub 交互，以创建问题、打开拉取请求、阅读评论等。如果未安装 `gh`，Claude 仍然可以使用 GitHub API 或 MCP 服务器（如果您已安装）。

## [2\. 为 Claude 提供更多工具](#2-为-claude-提供更多工具)

Claude 可以访问您的 shell 环境，您可以在其中为它构建便利脚本和函数集，就像为自己构建一样。它还可以通过 MCP 和 REST API 利用更复杂的工具。

### [a. 将 Claude 与 bash 工具结合使用](#a-将-claude-与-bash-工具结合使用)

Claude Code 继承了您的 bash 环境，使其可以访问您的所有工具。虽然 Claude 知道像 unix 工具和 `gh` 这样的常用实用程序，但如果没有说明，它不会知道您的自定义 bash 工具：

*   告诉 Claude 工具名称和使用示例
*   告诉 Claude 运行 `--help` 查看工具文档
*   在 `CLAUDE.md` 中记录常用工具

### [b. 将 Claude 与 MCP 结合使用](#b-将-claude-与-mcp-结合使用)

Claude Code 同时充当 MCP 服务器和客户端。作为客户端，它可以通过三种方式连接到任意数量的 MCP 服务器以访问其工具：

*   在项目配置中（在运行 Claude Code 的目录中可用）
*   在全局配置中（在所有项目中可用）
*   在检入的 `.mcp.json` 文件中（对在您的代码库中工作的任何人可用）。例如，您可以将 Puppeteer 和 Sentry 服务器添加到您的 `.mcp.json` 中，以便在您的存储库上工作的每个工程师都可以开箱即用地使用这些。

在使用 MCP 时，使用 `--mcp-debug` 标志启动 Claude 以帮助识别配置问题也很有帮助。

### [c. 使用自定义斜杠命令](#c-使用自定义斜杠命令)

对于重复的工作流程（调试循环、日志分析等），将提示模板存储在 `.claude/commands` 文件夹中的 Markdown 文件中。当您键入 `/` 时，这些命令可通过斜杠命令菜单使用。您可以将这些命令检入 git，以使其对您团队的其他成员可用。

自定义斜杠命令可以包含特殊关键字 `$ARGUMENTS`，以从命令调用中传递参数。例如，这是一个可用于自动拉取和修复 Github 问题的斜杠命令：

```
请分析并修复 GitHub 问题：$ARGUMENTS。
请按照以下步骤操作：
1. 使用 `gh issue view` 获取问题详细信息
2. 理解问题中描述的问题
3. 在代码库中搜索相关文件
4. 实施必要的更改以修复问题
5. 编写并运行测试以验证修复
6. 确​​保代码通过 linting 和类型检查
7. 创建描述性的提交消息
8. 推送并创建 PR
请记住使用 GitHub CLI (`gh`) 执行所有与 GitHub 相关的任务。
```

将以上内容放入 `.claude/commands/fix-github-issue.md` 中，使其在 Claude Code 中作为 `/project:fix-github-issue` 命令可用。然后，您可以使用例如 `/project:fix-github-issue 1234` 来让 Claude 修复问题 #1234。同样，您可以将自己的个人命令添加到 `~/.claude/commands` 文件夹中，以便在所有会话中都可用。

## [3\. 尝试常见的工作流程](#3-尝试常见的工作流程)

Claude Code 不强加特定的工作流程，让您可以灵活地按照自己的方式使用它。在这种灵活性提供的空间内，在我们的用户社区中出现了几种有效使用 Claude Code 的成功模式：

### [a. 探索、计划、编码、提交](#a-探索计划编码提交)

这个通用的工作流程适用于许多问题：

1.  **让 Claude 阅读相关文件、图片或 URL**，可以提供一般性指引（"阅读处理日志记录的文件"）或特定文件名（"阅读 logging.py"），但明确告诉它暂时不要编写任何代码。这是工作流程中您应该考虑大量使用子代理的部分，尤其是在处理复杂问题时。让 Claude 使用子代理来验证细节或调查它可能有的特定问题，尤其是在对话或任务的早期，往往可以在不怎么损失效率的情况下保持上下文的可用性。
2.  **让 Claude 制定一个解决特定问题的方法的计划。** 我们建议使用"思考（think）"一词来触发扩展思考模式，这会给 Claude 额外的计算时间来更彻底地评估替代方案。这些特定的短语直接映射到系统中不断增加的思考预算级别："思考（think）" < "努力思考（think hard）" < "更努力思考（think harder）" < "超级思考（ultrathink）"。每个级别都会分配逐步增加的思考预算供 Claude 使用。如果此步骤的结果看起来合理，您可以让 Claude 创建一个包含其计划的文档或 GitHub 问题，以便如果实施（步骤 3）不符合您的要求，您可以重置到该点。
3.  **让 Claude 用代码实现其解决方案。** 这也是一个让它在实施解决方案的各个部分时明确验证其解决方案合理性的好时机。
4.  **让 Claude 提交结果并创建拉取请求。** 如果相关，这也是让 Claude 更新任何 README 或变更日志并解释其刚刚所做工作的好时机。

步骤 #1-#2至关重要——没有它们，Claude 往往会直接跳到编码解决方案。虽然有时这正是您想要的，但让 Claude 先研究和计划可以显著提高需要预先进行更深入思考的问题的性能。

### [b. 编写测试、提交；编码、迭代、提交](#b-编写测试提交编码迭代提交)

这是 Anthropic 最喜欢的工作流程，适用于可以通过单元、集成或端到端测试轻松验证的更改。测试驱动开发 (TDD) 在代理式编码中变得更加强大：

1.  **让 Claude 根据预期的输入/输出对编写测试。** 明确说明您正在进行测试驱动开发，以便它避免创建模拟实现，即使是对于代码库中尚不存在的功能。
2.  **告诉 Claude 运行测试并确认它们失败。** 在这个阶段明确告诉它不要编写任何实现代码通常很有帮助。
3.  **当您对测试满意时，让 Claude 提交测试。**
4.  **让 Claude 编写通过测试的代码，并指示它不要修改测试。** 告诉 Claude 继续，直到所有测试都通过。Claude 通常需要几次迭代才能编写代码、运行测试、调整代码并再次运行测试。在这个阶段，让它使用独立的子代理来验证实现没有对测试过度拟合会很有帮助。
5.  **一旦您对更改感到满意，就让 Claude 提交代码。**

当 Claude 有一个明确的目标可以迭代时，它的表现最好——一个视觉模型、一个测试用例或另一种输出。通过提供像测试这样的预期输出，Claude 可以进行更改、评估结果并逐步改进，直到成功。

### [c. 编写代码、截图结果、迭代](#c-编写代码截图结果迭代)

与测试工作流程类似，您可以为 Claude 提供视觉目标：

1.  **为 Claude 提供一种截取浏览器截图的方法**（例如，使用 Puppeteer MCP 服务器、iOS 模拟器 MCP 服务器，或手动将截图复制/粘贴到 Claude 中）。
2.  **通过复制/粘贴或拖放图片，或为 Claude 提供图片文件路径，为 Claude 提供视觉模型。**
3.  **让 Claude 在代码中实现设计，对结果进行截图，并进行迭代，直到其结果与模型匹配。**
4.  **当您满意时，让 Claude 提交。**

像人类一样，Claude 的输出往往会通过迭代得到显著改善。虽然第一个版本可能不错，但经过 2-3 次迭代后，它通常会看起来好得多。为 Claude 提供查看其输出的工具以获得最佳结果。

### [d. 安全的"YOLO"模式](#d-安全的yolo模式)

您可以不监督 Claude，而是使用 `claude --dangerously-skip-permissions` 来绕过所有权限检查，让 Claude 不间断地工作直到完成。这对于修复 lint 错误或生成样板代码等工作流程非常有效。

![安全的 YOLO 模式](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsafe-yolo-mode.3cb6f5f8.png&w=3840&q=75)

**让 Claude 运行任意命令是有风险的，可能导致数据丢失、系统损坏甚至数据泄露（例如，通过提示注入攻击）。为了将这些风险降到最低，请在没有互联网访问的容器中使用 `--dangerously-skip-permissions`。您可以遵循使用 Docker Dev Containers 的此参考实现。**

### [e. 代码库问答](#e-代码库问答)

在熟悉新的代码库时，使用 Claude Code 进行学习和探索。您可以向 Claude 提出与您会向项目中的其他工程师提出的同类问题...

### [f. 使用 Claude 与 git 交互](#f-使用-claude-与-git-交互)

![使用 Claude 与 git 交互](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclaude-git-interaction.75756203.png&w=3840&q=75)

Claude 可以有效处理许多 git 操作。许多 Anthropic 工程师使用 Claude 处理 90%+ 的 git 交互：

*   **搜索 git 历史** 来回答诸如"v1.2.3 中包含了哪些更改？"、"谁拥有这个特定功能？"或"为什么这个 API 是这样设计的？"等问题。明确提示 Claude 查看 git 历史来回答此类查询会很有帮助。
*   **编写提交消息**。Claude 会自动查看您的更改和最近的历史记录，以编写考虑所有相关上下文的消息
*   **处理复杂的 git 操作**，如还原文件、解决变基冲突以及比较和嫁接补丁

### [g. 使用 Claude 与 GitHub 交互](#g-使用-claude-与-github-交互)

Claude Code 可以管理许多 GitHub 交互：

*   **创建拉取请求**：Claude 理解简写"pr"，并将根据差异和周围上下文生成适当的提交消息。
*   **实施一次性解决方案** 用于简单的代码审查评论：只需告诉它修复您 PR 上的评论（可选地，给它更具体的说明），完成后推回 PR 分支。
*   **修复失败的构建** 或 linter 警告
*   **分类和分类开放问题** 通过让 Claude 循环处理开放的 GitHub 问题

这消除了记住 `gh` 命令行语法的需要，同时自动化了日常任务。

### [h. 使用 Claude 处理 Jupyter 笔记本](#h-使用-claude-处理-jupyter-笔记本)

Anthropic 的研究人员和数据科学家使用 Claude Code 来读取和编写 Jupyter 笔记本。Claude 可以解释输出，包括图像，提供快速探索和交互数据的方式。没有必需的提示或工作流程，但我们推荐的工作流程是在 VS Code 中并排打开 Claude Code 和 `.ipynb` 文件。

您还可以在向同事展示之前让 Claude 清理或对您的 Jupyter 笔记本进行美学改进。明确告诉它使笔记本或其数据可视化"美观"往往有助于提醒它正在为人类观看体验进行优化。

## [4\. 有效提示的技巧](#4-有效提示的技巧)

### [a. 包含所有相关信息](#a-包含所有相关信息)

Claude 只能访问您提供给它的信息，因此请确保包含任何相关上下文...

### [b. 使用图片](#b-使用图片)

在适当的情况下，提供视觉信息可以显著提高 Claude 的性能... 特别是，将设计模型作为 UI 开发的参考点，以及将视觉图表用于分析和调试，可以极大地帮助 Claude。如果您没有向上下文中添加视觉效果，向 Claude 明确说明结果在视觉上具有吸引力的重要性仍然很有帮助。

![给 Claude 图片](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclaude-give-images.9d27dfe1.png&w=3840&q=75)

### [c. 提及您希望 Claude 查看或处理的文件](#c-提及您希望-claude-查看或处理的文件)

使用 Tab 自动补全功能快速引用存储库中任何位置的文件或文件夹，帮助 Claude 找到或更新正确的资源。

![提及您希望 Claude 查看或处理的文件](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclaude-mention-files.69a1df85.png&w=3840&q=75)

### [d. 给 Claude URL](#d-给-claude-url)

将特定 URL 与您的提示一起粘贴，供 Claude 获取和阅读。为避免对相同域（例如，docs.foo.com）的权限提示，请使用 `/permissions` 将域添加到您的允许列表中。

![给 Claude URL](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclaude-give-urls.8d043be9.png&w=3840&q=75)

### [e. 尽早并经常纠正](#e-尽早并经常纠正)

虽然自动接受模式（按 shift+tab 切换）让 Claude 自主工作，但通过成为积极的协作者并指导 Claude 的方法，您通常会获得更好的结果。您可以通过在开始时向 Claude 彻底解释任务来获得最佳结果，但您也可以随时纠正 Claude。这四个工具有助于纠正：

*   **在编码前让 Claude 制定计划。** 明确告诉它在您确认其计划看起来不错之前不要编码。
*   **在任何阶段（思考、工具调用、文件编辑）按 Escape 键中断 Claude**，保留上下文，以便您可以重定向或扩展指令。
*   **双击 Escape 键跳回历史记录**，编辑先前的提示，并探索不同的方向。您可以编辑提示并重复，直到获得您想要的结果。
*   **让 Claude 撤消更改**，通常与选项 #2 结合使用以采取不同的方法。

虽然 Claude Code 偶尔会在第一次尝试时完美解决问题，但使用这些纠正工具通常可以更快地产生更好的解决方案。

### [f. 使用 `/clear` 保持上下文集中](#f-使用-clear-保持上下文集中)

在长时间的会话中，Claude 的上下文窗口可能会充满不相关的对话、文件内容和命令。这会降低性能，有时还会分散 Claude 的注意力。在任务之间频繁使用 `/clear` 命令来重置上下文窗口。

### [g. 对复杂工作流程使用清单和草稿板](#g-对复杂工作流程使用清单和草稿板)

对于具有多个步骤或需要详尽解决方案的大型任务（如代码迁移、修复大量 lint 错误或运行复杂的构建脚本），可以通过让 Claude 使用 Markdown 文件（甚至 GitHub 问题！）作为清单和工作草稿板来提高性能：

例如，要修复大量的 lint 问题，您可以执行以下操作：

1.  告诉 Claude 运行 lint 命令，并将所有结果错误（包括文件名和行号）写入 Markdown 清单。
2.  指示 Claude 逐一解决每个问题，在勾选并移至下一个问题之前进行修复和验证。

### [h. 将数据传递给 Claude](#h-将数据传递给-claude)

有几种方法可以向 Claude 提供数据：

*   直接复制并粘贴到您的提示中（最常见的方法）
*   通过管道传输到 Claude Code（例如，`cat foo.txt | claude`），特别适用于日志、CSV 和大数据
*   告诉 Claude 通过 bash 命令、MCP 工具或自定义斜杠命令拉取数据
*   让 Claude 读取文件或获取 URL（对图片也有效）

大多数会话都涉及这些方法的组合。例如，您可以通过管道传输一个日志文件，然后告诉 Claude 使用一个工具来引入额外的上下文来调试日志。

## [5\. 使用无头模式自动化您的基础架构](#5-使用无头模式自动化您的基础架构)

Claude Code 包括用于非交互式上下文（如 CI、预提交挂钩、构建脚本和自动化）的无头模式。将 `-p` 标志与提示一起使用以启用无头模式，并使用 `--output-format stream-json` 进行流式 JSON 输出。请注意，无头模式在会话之间不持久。您必须在每个会话中触发它。

### [a. 使用 Claude 进行问题分类](#a-使用-claude-进行问题分类)

无头模式可以为由 GitHub 事件触发的自动化提供支持，例如当您的存储库中创建新问题时。例如，公共 Claude Code 存储库使用 Claude 来检查新出现的问题并分配适当的标签。

### [b. 使用 Claude 作为 linter](#b-使用-claude-作为-linter)

Claude Code 可以提供传统 linting 工具无法检测到的主观代码审查，识别诸如拼写错误、过时的注释、误导性的函数或变量名等问题。

## [6\. 通过多 Claude 工作流程提升水平](#6-通过多-claude-工作流程提升水平)

除了独立使用之外，一些最强大的应用程序涉及并行运行多个 Claude 实例：

### [a. 让一个 Claude 编写代码；使用另一个 Claude 进行验证](#a-让一个-claude-编写代码使用另一个-claude-进行验证)

一种简单而有效的方法是让一个 Claude 编写代码，而另一个则对其进行审查或测试。与与多位工程师合作类似，有时拥有独立的上下文是有益的：

*   使用 Claude 编写代码
*   运行 `/clear` 或在另一个终端中启动第二个 Claude
*   让第二个 Claude 审查第一个 Claude 的代码

### [b. 使用 git worktrees 并行运行多个 Claude](#b-使用-git-worktrees-并行运行多个-claude)

与其等待 Claude 完成每一步，Anthropic 的许多工程师会这样做：

*   在单独的文件夹中创建 3-4 个 git checkout。
*   在不同的终端标签页中打开每个文件夹。
*   在每个文件夹中启动 Claude 并分配不同的任务。
*   循环检查进度并批准/拒绝权限请求。

一些技巧：

*   使用一致的命名约定。
*   每个 worktree 维护一个终端标签页。
*   如果您在 Mac 上使用 iTerm2，请设置当 Claude 需要您注意时的通知。
*   为不同的 worktrees 使用不同的 IDE 窗口。
*   完成后清理：`git worktree remove ../project-feature-a`。

### [c. 让一个 Claude 负责前端，另一个负责后端](#c-让一个-claude-负责前端另一个负责后端)

对于全栈任务，您可以并行运行两个 Claude 实例，并为它们提供不同的 `CLAUDE.md` 文件，以便它们专注于各自领域的任务：

*   **前端 Claude**：专注于 UI/UX，使用 Storybook 或其他可视化工具，并以视觉效果为目标。
*   **后端 Claude**：处理 API、数据库和基础架构任务，使用测试作为其目标。

当您需要 Claude 在两个领域之间进行协调时（例如，在前端和后端之间传递数据），请将它们指向一个共享的规范，例如 OpenAPI 规范或 TypeScript 类型定义文件，作为它们之间沟通的"契约"。

### [d. 使用带有自定义套件的无头模式](#d-使用带有自定义套件的无头模式)

*   让 Claude 编写一个脚本来生成任务列表。例如，生成一个需要从框架 A 迁移到框架 B 的 2000 个文件的列表。
*   循环执行任务，为每个任务以编程方式调用 Claude，并为其提供一个任务和一组它可以使用的工具。例如：`claude -p "将 foo.py 从 React 迁移到 Vue。完成后，如果成功，你必须返回字符串 OK，如果任务失败，则返回 FAIL。" --allowedTools Edit Bash(git commit:*)`
*   多次运行该脚本并优化您的提示以获得期望的结果。

## [7\. 加入社区](#7-加入社区)

我们希望这些最佳实践能帮助您入门。当您使用 Claude Code 时，您可能会发现新的、更好的工作方式。我们鼓励您在我们的社区论坛中分享您的发现，在这里您可以与其他 Claude 用户联系，提出问题，并分享您的工作流程。

[

Cal Rueb 的 Claude Code 最佳实践

来自 Anthropic 技术团队成员 Cal Rueb 的 Claude Code 最佳实践分享，涵盖从基础设置到高级技巧的完整指南。

](/docs/zh/best-practices/cal-rueb-claude-code-best-practices)[

Claude Code 就是我的电脑

深入探讨如何在无提示模式下使用 Claude Code 进行日常开发任务。学习如何利用 AI 进行内容发布、代码提取、自动化和系统管理。

](/docs/zh/best-practices/claude-code-is-my-computer)

### On this page

[Claude Code：代理式编码的最佳实践](#claude-code代理式编码的最佳实践)[1\. 自定义您的设置](#1-自定义您的设置)[a. 创建 `CLAUDE.md` 文件](#a-创建-claudemd-文件)[b. 调整您的 `CLAUDE.md` 文件](#b-调整您的-claudemd-文件)[c. 管理 Claude 的允许工具列表](#c-管理-claude-的允许工具列表)[d. 如果使用 GitHub，请安装 gh CLI](#d-如果使用-github请安装-gh-cli)[2\. 为 Claude 提供更多工具](#2-为-claude-提供更多工具)[a. 将 Claude 与 bash 工具结合使用](#a-将-claude-与-bash-工具结合使用)[b. 将 Claude 与 MCP 结合使用](#b-将-claude-与-mcp-结合使用)[c. 使用自定义斜杠命令](#c-使用自定义斜杠命令)[3\. 尝试常见的工作流程](#3-尝试常见的工作流程)[a. 探索、计划、编码、提交](#a-探索计划编码提交)[b. 编写测试、提交；编码、迭代、提交](#b-编写测试提交编码迭代提交)[c. 编写代码、截图结果、迭代](#c-编写代码截图结果迭代)[d. 安全的"YOLO"模式](#d-安全的yolo模式)[e. 代码库问答](#e-代码库问答)[f. 使用 Claude 与 git 交互](#f-使用-claude-与-git-交互)[g. 使用 Claude 与 GitHub 交互](#g-使用-claude-与-github-交互)[h. 使用 Claude 处理 Jupyter 笔记本](#h-使用-claude-处理-jupyter-笔记本)[4\. 有效提示的技巧](#4-有效提示的技巧)[a. 包含所有相关信息](#a-包含所有相关信息)[b. 使用图片](#b-使用图片)[c. 提及您希望 Claude 查看或处理的文件](#c-提及您希望-claude-查看或处理的文件)[d. 给 Claude URL](#d-给-claude-url)[e. 尽早并经常纠正](#e-尽早并经常纠正)[f. 使用 `/clear` 保持上下文集中](#f-使用-clear-保持上下文集中)[g. 对复杂工作流程使用清单和草稿板](#g-对复杂工作流程使用清单和草稿板)[h. 将数据传递给 Claude](#h-将数据传递给-claude)[5\. 使用无头模式自动化您的基础架构](#5-使用无头模式自动化您的基础架构)[a. 使用 Claude 进行问题分类](#a-使用-claude-进行问题分类)[b. 使用 Claude 作为 linter](#b-使用-claude-作为-linter)[6\. 通过多 Claude 工作流程提升水平](#6-通过多-claude-工作流程提升水平)[a. 让一个 Claude 编写代码；使用另一个 Claude 进行验证](#a-让一个-claude-编写代码使用另一个-claude-进行验证)[b. 使用 git worktrees 并行运行多个 Claude](#b-使用-git-worktrees-并行运行多个-claude)[c. 让一个 Claude 负责前端，另一个负责后端](#c-让一个-claude-负责前端另一个负责后端)[d. 使用带有自定义套件的无头模式](#d-使用带有自定义套件的无头模式)[7\. 加入社区](#7-加入社区)