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

# 使用 Claude 生产真实代码的实战笔记

一份关于 AI 辅助开发在生产环境中真正有效的综合指南。学习三种 vibe-coding 模式、基础设施设置，以及人类编写测试的神圣规则。

# [使用 Claude 生产真实代码的实战笔记](#使用-claude-生产真实代码的实战笔记)

## [Vibe Coding 不仅仅是一种感觉](#vibe-coding-不仅仅是一种感觉)

![闪烁的物质 - 杰克逊·波洛克](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F8da4f924-0f2a-44c4-91f6-d285ace5e8a4.faa77902.jpg&w=3840&q=75)

> **注意**: 这篇文章配有 _NotebookLM_ 播客（底部链接），以及 _三个_ 生成的音频录制。
> 
> 你可以阅读我在准备这篇文章草稿时与 ChatGPT 的[对话](https://chatgpt.com/share/6844eaae-07d0-8001-a7f7-e532d63bf8a3)。
> 
> 在[相关 HN 帖子](https://news.ycombinator.com/item?id=44211417)上的评论和讨论。

将这篇文章视为你构建软件新方式的实地指南。当你读完时，你将不仅理解 AI 辅助开发如何工作，更重要的是理解其背后的原因。

### [你将学到什么](#你将学到什么)

首先，我们将探索如何真正实现 10 倍生产力提升——不是通过魔法，而是通过放大 AI 优势同时补偿其弱点的刻意实践。

接下来，我将带你了解我们在 [Julep](https://git.new/julep) 使用的、每天在 Claude 帮助下发布生产代码的基础设施。你将看到我们的 `CLAUDE.md` 模板、提交策略和防护措施。

最重要的是，你将理解为什么编写自己的测试仍然绝对神圣，特别是在 AI 时代。这一单一原则将让你免于许多深夜调试会话。

> **这是主要洞察**: 良好的开发实践不仅仅是锦上添花——它们是 AI 放大你能力与制造混乱之间的区别。研究证实了这一点。使用严格实践的团队部署频率提高 46 倍，从提交到部署的速度提高 440 倍。当你将强大的 AI 助手加入其中时，这种效果更加明显。

## [这篇文章存在的原因：从梗到方法](#这篇文章存在的原因从梗到方法)

让我带你回到这一切开始的时候。_Andrej Karpathy_ 发推文谈论"vibe-coding"——让 AI 编写代码而你只是感受氛围的想法。开发者社区都笑了。这听起来像是终极开发者幻想：放松，喝咖啡，让机器做工作。

![vibe coding 的诞生](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fe482b99a-9e1e-4f5b-b968-0bf6255566d2.a878d308.png&w=3840&q=75)

然后 _Anthropic_ 发布了 Sonnet 3.7 和 Claude Code，意想不到的事情发生了。这个笑话不再好笑，因为它开始变得……可能？当然，我们可靠的朋友 [Cursor](https://www.cursor.com/) 已经存在一段时间了，但这个新界面最终感觉像 _真正的 vibe coding_。

在 [Julep](https://git.new/julep)，我们构建 AI 工作流编排。我们的后端有多年积累的决策、模式和偶尔的技术债务。我们极其小心地保持代码质量高，并为自己提供充足的文档。然而，代码的庞大规模和 _为什么_ 不同部分以特定方式组织的历史背景，需要优秀工程师数周时间才能理解。

> 在使用 Claude 时没有适当的防护措施，你基本上是在和一个过度热心的实习生玩打地鼠游戏。

## [理解 Vibe-Coding](#理解-vibe-coding)

!['pls fix'](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fe771b36e-bdb6-4c99-8949-0a3583bc6259.331e54ec.png&w=3840&q=75)

_Steve Yegge_ 巧妙地创造了术语 _CHOP_——聊天导向编程，在一个稍微戏剧性的标题帖子["初级开发者的死亡"](https://sourcegraph.com/blog/the-death-of-the-junior-developer)中。这是对与 Claude 一起编程体验的完美、直白的描述。

将传统编程想象成雕刻大理石。你从空白块开始，仔细地一点一点凿刻，逐行逐函数。每一笔都是深思熟虑的，每一个决定都是你的。这很满足但很慢。

Vibe-coding 更像是指挥管弦乐队。你不是演奏每一种乐器——你在指导、塑造、引导。AI 提供原始的音乐天赋，但没有你的愿景，它只是噪音。

在 vibe-coding 时，你可以采取三种不同的姿态，每种都适合开发周期的不同阶段：

1.  **AI 作为初稿者**: 在这里，AI 生成初始实现，而你专注于架构和设计。这就像有一个可以以思维速度打字的初级开发者，但需要持续指导。完美适用于样板代码、CRUD 操作和标准模式。
    
2.  **AI 作为结对程序员**: 这是大多数开发的甜蜜点。你积极协作，来回弹跳想法。AI 建议方法，你完善它们。你勾勒轮廓，AI 填充细节。这就像与一个读过所有编程书籍但从未真正发布过代码的人结对编程。
    
3.  **AI 作为验证者**: 有时你编写代码并想要理智检查。AI 审查错误，建议改进，发现你可能错过的模式。将其视为一个永远不会疲倦或暴躁的极其博学的代码审查者。
    

> 你不是在精心制作每一行，而是在审查、完善、指导。但是——这一点不能过分强调——你仍然是架构师。Claude 是你的实习生，拥有百科全书般的知识，但对你的特定系统、用户、业务逻辑零上下文。

## [Vibe-Coding 的三种模式：实用框架](#vibe-coding-的三种模式实用框架)

经过数月的实验和不止几次的生产事故，我确定了三种不同的操作模式。每种都有自己的节奏、自己的防护措施和自己的用例。

### [模式 1：_游乐场_](#模式-1游乐场)

![打火机液体](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fede9227b-cd8d-4505-ba93-21c9c7fcb31a.35a8e5c9.png&w=3840&q=75)

**何时使用**: 周末黑客、个人脚本、概念验证，以及那些让编程变得有趣的"我想知道如果…"时刻。

在 _游乐场模式_ 中，你拥抱混乱。Claude 编写 80-90% 的代码，而你提供足够的指导来保持正轨。这很解放，也稍微可怕。_专业提示_: 查看 [claude-composer](https://github.com/possibilities/claude-composer) 进行全 YOLO 模式。

游乐场模式是这样的：你有一个分析 Spotify 历史脚本的想法。你打开 Claude，用简单的英语描述你想要什么，然后看着它生成完整的解决方案。没有 `CLAUDE.md` 文件，没有仔细的提示——只是原始、未过滤的 AI 编写的代码。

游乐场模式的美在于速度。你可以在几分钟内从想法到工作原型。危险在于这种牛仔编码风格绝对不适合任何重要的事情。将其用于实验，永远不要用于生产。相信我，虽然令人惊叹的人们宣扬相反的观点，但良好的工程原则仍然重要，[现在比以往任何时候都更重要](https://www.ikangai.com/vibe-coding-in-software-engineering/)。

### [模式 2：_结对编程_](#模式-2结对编程)

![编译中](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fd84d1867-c2b4-4ef9-8904-b7c69cf12154.33bbabd4.webp&w=3840&q=75)

**何时使用**: \_约 5,000 行代码以下\_的项目、有真实用户的副项目、演示（你不想破坏），或大型系统中范围明确的小服务。

这是 vibe-coding 开始发光的地方。你需要结构，但不要太多以至于减慢你的速度。这里的关键创新是 `CLAUDE.md` 文件——Claude 在调用时自动读取的自定义文档。来自 Anthropic 的 [Claude Code 最佳实践](https://www.anthropic.com/engineering/claude-code-best-practices):

> `CLAUDE.md` 是一个特殊文件，Claude 在开始对话时自动拉入上下文：
> 
> *   常见的 bash 命令
> *   核心文件和实用函数
> *   代码风格指南
> *   测试说明
> *   仓库礼仪（例如，分支命名、merge vs. rebase 等）
> *   你希望 Claude 记住的其他信息

你不是重复解释项目的约定，而是记录一次。这是一个最近副项目的真实例子：

```
## 项目：分析仪表板  

这是一个用于可视化用户分析的 Next.js 仪表板：  

### 架构决策  
- 默认使用服务器组件，仅在必要时使用客户端组件  
- 使用 tRPC 进行类型安全的 API 调用  
- 使用 Prisma 进行数据库访问，使用显式 select 语句  
- 使用 Tailwind 进行样式设计（无自定义 CSS 文件）  

### 代码风格  
- 格式化：使用 100 字符行的 Prettier  
- 导入：使用 simple-import-sort 排序  
- 组件：Pascal 命名法，与测试共置  
- Hooks：始终以 'use' 前缀  

### 要遵循的模式  
- 数据获取发生在服务器组件中  
- 客户端组件接收数据作为 props  
- 对所有外部数据使用 Zod 模式  
- 在每个数据显示组件周围使用错误边界  

### 不要做什么  
- 不要使用 useEffect 进行数据获取  
- 不要在没有明确批准的情况下创建全局状态  
- 不要用 'any' 类型绕过 TypeScript
```

有了这个上下文，Claude 变得非常有效。这就像每天向新员工解释项目与让他们读一次入职文档的区别。

但 _结对编程模式_ 需要的不仅仅是文档。你需要用我称之为"锚点注释"的东西积极指导 AI——防止 Claude 迷失在荒野中的面包屑：

```
// AIDEV-NOTE: 此组件使用虚拟滚动以提高性能  
// 参见：https://tanstack.com/virtual/latest  
// 不要转换为常规映射——我们处理 10k+ 项目  

export function DataTable({ items }: DataTableProps) {  
  // Claude，当你编辑这个时，保持虚拟滚动  
  ...  
}
```

这些注释服务于双重目的：它们指导 AI 并为人类记录代码。这是双向都有回报的文档。这种"锚点注释"与常规注释的**关键区别**：这些是\_编写的\_、_维护的_，并且\_旨在被\_ Claude 本身使用。这是我们[项目 CLAUDE.md](https://github.com/julep-ai/julep/blob/dev/AGENTS.md) 的\_实际片段\_：

```
## 锚点注释  

在代码库中适当位置添加特殊格式的注释，作为可以轻松 `grep` 的内联知识。  

### 指南：  

- 使用 `AIDEV-NOTE:`、`AIDEV-TODO:` 或 `AIDEV-QUESTION:`（全大写前缀）作为针对 AI 和开发者的注释。  
- 保持简洁（≤ 120 字符）。  
- **重要：** 在扫描文件之前，始终首先尝试在相关子目录中**定位现有锚点** `AIDEV-*`。  
- **更新相关锚点**当修改相关代码时。  
- **不要删除 `AIDEV-NOTE`s**除非有明确的人工指令。  

示例：  
# AIDEV-NOTE: perf-hot-path; 避免额外分配（参见 ADR-24）  
async def render_feed(...):  
    ...
```

### [模式 3：_生产/单体仓库规模_](#模式-3生产单体仓库规模)

![RTFM](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F97c55ab9-c876-4018-841f-ee014757e908.b6f3d795.webp&w=3840&q=75)

**何时使用**: 大型代码库、有真实用户的系统、任何错误会花费金钱或声誉的地方。

Claude 可以生成大量代码，但将其集成到复杂系统中需要仔细编排。

让我先说明一个大警告：**在这个规模上的 vibe coding 还不太好扩展，** 目前。我确实看到这些系统在处理更大代码库方面变得显著更好，_但_，为了让它们有效，需要大量努力来帮助它们导航、理解和\_安全地\_在它们上工作，而不会在迷宫中迷失。一般来说，最好将它们分成单独的服务，并在可能时使用子模块。

作为通用原则，良好的工程实践适用于大型项目，无论是否 vibe coded。例如，在生产规模上，边界变得关键。每个集成点都需要明确的文档：

```
# AIDEV-NOTE: API 合约边界 - v2.3.1  
# 任何更改都需要版本升级和迁移计划  
# 参见：docs/api-versioning.md  

@router.get("/users/{user_id}/feed")  
async def get_user_feed(user_id: UUID) -> FeedResponse:  
    # Claude：这里的响应形状是神圣的  
    # 更改会破坏生产中的真实应用  
    ...
```

没有这些边界，Claude 会愉快地"改进"你的 API 并破坏生产中的每个客户端。底线：更大的项目应该\_绝对\_开始在部分中采用 vibe coding，并采用增强这种体验的方法，但，不要期望可靠地落地大型功能。（截至 _2025 年 6 月 7 日 / AI 时代_）

## [基础设施：可持续 AI 开发的基础](#基础设施可持续-ai-开发的基础)

### [`CLAUDE.md`：你的单一真相来源](#claudemd你的单一真相来源)

让我绝对清楚这一点：`CLAUDE.md` 不是可选的文档。你花在更新它上的每一分钟都节省了以后一小时的清理工作。

将 `CLAUDE.md` 视为你代码库的宪法。它建立了管理代码应该如何编写、系统如何交互以及要遵循或避免什么模式的基本法律。投资于发展团队技能和能力的组织会获得更好的结果——你的 `CLAUDE.md` 就是这种投资结晶成文档。

这是我们[生产 `CLAUDE.md`](https://github.com/julep-ai/julep/blob/dev/AGENTS.md) 结构的精简版本，经过数千次 AI 辅助提交的完善：

```
# `CLAUDE.md` - Julep 后端服务  

## 黄金法则  
当不确定实现细节时，始终询问开发者。  

## 项目上下文  
Julep 使开发者能够使用声明式工作流构建有状态的 AI 代理。  

## 关键架构决策  

### 为什么使用 Temporal？  
我们使用 Temporal 进行工作流编排，因为：  
1. 工作流可以运行数天/数周，具有完美的可靠性  
2. 从任何失败点自动恢复  

### 为什么使用 PostgreSQL + pgvector？  
1. 工作流状态的 ACID 合规性（不能丢失用户数据）  
2. 代理记忆的向量相似性搜索  

### 为什么使用 TypeSpec？  
API 定义的单一真相来源：  
- OpenAPI 规范  
- TypeScript/Python 客户端  
- 验证模式  

## 代码风格和模式  

### 锚点注释  

在代码库中适当位置添加特殊格式的注释，作为可以轻松 `grep` 的内联知识。  

### 指南：  

- 使用 `AIDEV-NOTE:`、`AIDEV-TODO:` 或 `AIDEV-QUESTION:`（全大写前缀）作为针对 AI 和开发者的注释。  
- **重要：** 在扫描文件之前，始终首先尝试**grep 现有锚点** `AIDEV-*` 在相关子目录中。  
- **更新相关锚点**当修改相关代码时。  
- **不要删除 `AIDEV-NOTE`s**除非有明确的人工指令。  
- 确保在以下情况下添加相关锚点注释，每当文件或代码片段：  
  * 太复杂，或  
  * 非常重要，或  
  * 令人困惑，或  
  * 可能有错误  

## 领域词汇表（Claude，学习这些！）  

- **代理**: 具有记忆、工具和定义行为的 AI 实体  
- **任务**: 由步骤组成的工作流定义（不是 Celery 任务）  
- **执行**: 任务的运行实例  
- **工具**: 代理可以调用的函数（浏览器、API 等）  
- **会话**: 具有记忆的对话上下文  
- **条目**: 会话中的单个交互  

## AI 绝不能做的事情  

1. **永远不要修改测试文件** - 测试编码人类意图  
2. **永远不要更改 API 合约** - 破坏真实应用  
3. **永远不要更改迁移文件** - 数据丢失风险  
4. **永远不要提交秘密** - 使用环境变量  
5. **永远不要假设业务逻辑** - 始终询问  
6. **永远不要删除 AIDEV- 注释** - 它们在那里是有原因的  

记住：我们优化可维护性而不是聪明。  
当有疑问时，选择无聊的解决方案。
```

这个文档成为你和 Claude 之间的共享上下文。这就像有一个高级开发者在整个编码会话中在 Claude 耳边轻声指导。

随着你的代码库增长，仅 `CLAUDE.md` 是不够的。你需要内联指导——我称之为锚点注释。这些作为防止 AI 做出局部错误决策的本地上下文。

将你的代码库想象成一个城市，锚点注释作为路标。没有它们，即使聪明的访客也会迷路。以下是我们有效使用它们的方式：

```
# AIDEV-NOTE: 关键性能路径 - 这服务于 100k req/sec  
# 不要在这里添加数据库查询  
def get_user_feed(user_id: UUID, cached_data: FeedCache) -> List[FeedItem]:  
    # 我们需要避免修改缓存数据  
    items = cached_data.items[:]  

    # AIDEV-TODO: 实现分页（票据：FEED-123）  
    # 需要基于游标的分页用于无限滚动  

    # AIDEV-QUESTION: 为什么我们在这里而不是在缓存中过滤私有项目？  
    # AIDEV-ANSWER: 历史上下文：隐私规则可能在缓存更新之间改变  
    filtered = [item for item in items if user_has_access(user_id, item)]  

    return filtered
```

这些注释创建了一个叙述，帮助 AI 和人类理解不仅仅是代码做什么，而是为什么这样做。

### [AI 开发的 Git 工作流](#ai-开发的-git-工作流)

AI 辅助开发最被低估的方面之一是它如何改变你的 git 工作流。你现在以可能快速污染 git 历史的速度生成代码，如果你不小心的话。

它真的只适用于非常大的代码库，因为它不是非常直接的工具，但我建议使用 [git worktrees](https://www.anthropic.com/engineering/claude-code-best-practices#c-use-git-worktrees) 为 AI 实验创建隔离环境：

```
# 创建 AI 游乐场而不污染主分支  
git worktree add ../ai-experiments/cool-feature -b ai/cool-feature  

# 让 Claude 在隔离的 worktree 中疯狂  
cd ../ai-experiments/cool-feature  
# ... 大量实验性提交 ...  

# 将好东西 cherry-pick 回主分支  
cd ../main-repo  
git cherry-pick abc123  # 只是有效的提交  

# 完成后清理  
git worktree remove ../ai-experiments/cool-feature
```

> **专业提示**: 阅读[如何使用 worktrees](https://dev.to/yankee/practical-guide-to-git-worktree-58o0)，并查看巧妙的 [`wt`](https://github.com/taecontrol/wt) 工具。

这种方法给你两全其美：Claude 可以自由实验，而你的主分支历史保持清洁和有意义。

对于提交消息，我们已经标准化了标记 AI 辅助提交：

```
feat: 实现用户 feed 缓存 [AI]  

- 为用户 feeds 添加基于 Redis 的缓存  
- 在用户登录时实现缓存预热  
- 添加缓存命中率指标  

AI 辅助：核心逻辑生成，测试人工编写
```

这种透明度在代码审查期间有帮助——审查者知道要特别注意 AI 生成的代码。

## [神圣规则：人类编写测试](#神圣规则人类编写测试)

现在我们来到 AI 辅助开发中最重要的原则。它如此重要，我将以多种方式重复它，直到它烙印在你的记忆中：

**永远。不要。让。AI。编写。你的。测试。**

测试不仅仅是验证其他代码工作的代码。测试是可执行的规范。它们编码你的实际意图、你的边缘情况、你对问题领域的理解。高绩效者在速度和稳定性方面都表现出色——没有权衡。测试是你实现两者的方式。

![当心…](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F5dd77e55-5b53-412a-a169-e61d88eff60a.97afb0aa.png&w=3840&q=75)

让我用一个例子说明为什么这很重要。假设我们要求 Claude 实现一个速率限制器：

```
class RateLimiter:  
    def __init__(self, max_requests: int, window_seconds: int):  
        self.max_requests = max_requests  
        self.window_seconds = window_seconds  
        self.requests = defaultdict(list)  

    def is_allowed(self, user_id: str) -> bool:  
        now = time.time()  
        user_requests = self.requests[user_id]  

        # 清理旧请求  
        self.requests[user_id] = [  
            req_time for req_time in user_requests  
            if now - req_time < self.window_seconds  
        ]  

        if len(self.requests[user_id]) < self.max_requests:  
            self.requests[user_id].append(now)  
            return True  
        return False
```

看起来合理，对吧？Claude 甚至有帮助地生成了测试：

```
def test_rate_limiter():  
    limiter = RateLimiter(max_requests=3, window_seconds=60)  

    assert limiter.is_allowed("user1") == True  
    assert limiter.is_allowed("user1") == True  
    assert limiter.is_allowed("user1") == True  
    assert limiter.is_allowed("user1") == False  # 达到限制
```

但这是 Claude 的测试错过的——只有理解业务需求的人类才会测试的：Claude 的实现有内存泄漏。只访问 API 一次且永不返回的用户会在内存中永远留下他们的数据。AI 生成的测试检查快乐路径但错过了这个关键的生产问题。

![Vibe coding 的最佳状态](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fa4c32be3-f91c-44e3-aebd-c65f50fbd379.3cd08737.png&w=3840&q=75)

这就是为什么人类编写测试。我们理解上下文、生产环境、重要的边缘情况。在 Julep，我们的规则是绝对的：

```
## 测试纪律  

| 什么 | AI 可以做什么 | AI 绝不能做什么 |  
|------|-----------|----------------|  
| 实现 | 生成业务逻辑 | 触摸测试文件 |  
| 测试规划 | 建议测试场景 | 编写测试代码 |  
| 调试 | 分析测试失败 | 修改测试期望 |  

如果 AI 工具触摸测试文件，PR 被拒绝。没有例外。
```

你的测试是你的规范。它们是你的安全网。它们是每个你修复的 bug 和每个你发现的边缘情况的编码智慧。狂热地保护它们。

## [不溺水地扩展：Token 经济学和上下文管理](#不溺水地扩展token-经济学和上下文管理)

AI 辅助开发中最违反直觉的教训之一是，为了节省 token 而在上下文上吝啬实际上会让你付出更多代价。这就像试图通过只加半箱油来节省汽油钱——你最终只会去加油站更多次。

Token 预算很重要。提供重点提示，减少差异长度，通过提前总结意图来避免大文件膨胀。但"重点"并不意味着"最小"——它意味着"相关和完整"。

让我向你展示饥饿提示的虚假经济：

**饥饿提示尝试：**

`"为用户端点添加缓存"` **Claude 的响应:** 实现缓存…但是：

*   使用内存缓存（不适用于多个服务器）
*   没有缓存失效策略
*   没有指标或监控
*   没有考虑缓存雪崩

**结果:** 3 轮修复，_花费了 4 倍的 token_。

**适当丰富的上下文提示：**

```
为 GET /users/{id} 端点添加 Redis 缓存。  

上下文：  
- 此端点服务于 50k 请求/分钟  
- 我们在负载均衡器后面运行 12 个 API 服务器  
- 用户数据很少变化（每天几次）  
- 我们已经在 cache.redis.internal:6379 有 Redis  
- 使用我们的标准缓存键模式："user:v1:{id}"  
- 包含缓存命中/未命中指标（我们使用 Prometheus）  
- 实现缓存旁路模式，TTL 1 小时  
- 使用概率早期过期处理缓存雪崩  

参见我们的缓存指南：docs/patterns/caching.md
```

教训？预先加载上下文以避免迭代周期。将 token 视为投资好工具——前期成本会多次回报。

事实上，我建议所有项目都应该定期要求 Claude 查看代码库更改，并向 `CLAUDE.md` 添加上下文

### [新会话和心理模型](#新会话和心理模型)

这是另一个违反直觉的实践：为不同任务使用新的 Claude 会话。保持一个长期运行的对话很诱人，但这会导致上下文污染。

这样想：你不会在切生鸡肉后用同一个砧板切蔬菜。同样，不要在讨论前端样式后使用同一个 Claude 会话进行数据库迁移。上下文会以微妙的方式渗透。

我们的规则：一个任务，一个会话。当任务完成时，重新开始。这保持 Claude 的"心理模型"清洁和专注。

## [案例研究：在生产中发布结构化错误](#案例研究在生产中发布结构化错误)

让我带你了解我们在 Julep 做的一个真实重构，展示了生产规模的 vibe-coding。我们需要用结构化错误层次结构替换我们临时错误处理，跨越 500+ 端点。

**人类决策（为什么）：**

首先，我们必须决定我们的错误分类法。这是纯粹的架构工作——Claude 不能做出这些决定，因为它们涉及理解我们的业务、用户和运营需求：

```
# SPEC.md - 错误层次结构设计（人工编写）  

## 错误哲学  
- 客户端错误（4xx）必须包含可操作的反馈  
- 系统错误（5xx）必须包含用于调试的跟踪 ID  
- 所有错误必须是 JSON 可序列化的  
- 错误代码必须稳定（客户端依赖它们）  

## 层次结构  
BaseError  
├── ClientError (4xx)  
│   ├── ValidationError  
│   │   ├── SchemaValidationError - 请求不匹配模式  
│   │   ├── BusinessRuleError - 有效模式，无效业务逻辑  
│   │   └── RateLimitError - 请求过多  
│   └── AuthError  
│       ├── AuthenticationError - 你是谁？  
│       └── AuthorizationError - 你不能那样做  
└── SystemError (5xx)  
    ├── DatabaseError - 连接、超时、死锁  
    ├── ExternalServiceError - API、webhook 失败  
    └── InfrastructureError - 磁盘满、OOM 等  

## 错误响应格式  
{  
  "error": {  
    "code": "VALIDATION_FAILED",     // 客户端的稳定代码  
    "message": "邮箱已存在", // 人类可读  
    "details": { ... },               // 结构化数据  
    "trace_id": "abc-123-def"         // 用于调试  
  }  
}
```

**AI 执行（如何）：**

有了明确的规范，我们让 Claude 处理机械重构：

```
### 给 Claude 的提示：  

重构我们的错误处理以匹配 SPEC.md。  

当前状态：  
- raise ValueError("无效邮箱")  
- return {"error": "出错了"}, 500  

目标状态：  
- 使用 SPEC.md 中的错误层次结构  
- 包含适当的错误代码  
- 为所有 5xx 错误添加 trace_id  

从 auth 模块开始。在实现之前向我展示计划。
```

Claude 的计划很扎实：

```
1. 在 `common/errors.py` 中创建错误层次结构  
2. 创建错误响应格式化器  
3. 系统性地更新每个模块  
4. 添加错误处理中间件
```

Claude 能够处理查找和更新 500+ 错误站点的繁琐工作，而我们专注于审查：

```
# 之前（Claude 找到这些模式）：  
if not user:  
    raise Exception("用户未找到")  

# 之后（Claude 的重构）：  
if not user:  
    raise AuthenticationError(  
        message="用户未找到",  
        code="USER_NOT_FOUND",  
        details={"identifier": email}  
    )
```

> 结合我们精心编写的 `CLAUDE.md` 文件、细致的文档、定期更新的锚点注释和清晰的指令，结果：
> 
> *   时间：4 小时而不是 2 天
> *   覆盖：所有 500+ 错误站点已更新

## [AI 时代的领导力和文化](#ai-时代的领导力和文化)

你作为高级工程师的角色已经根本性地转变。你不再只是编写代码——你在策划知识、设定边界，并教导人类和 AI 系统如何有效工作。

精益管理和持续交付实践有助于改善软件交付性能，进而改善组织性能——这包括你如何管理 AI 协作。

### [新的入职检查清单](#新的入职检查清单)

当新开发者加入我们的团队时，他们获得两个入职轨道：一个针对人类，一个针对与 AI 合作。这是我们的组合检查清单：

**第 1 周：基础**

```
□ 阅读团队 `CLAUDE.md` 文件（从根开始，然后是特定服务）  
□ 设置开发环境  
□ 制作第一个 PR（人工编写，无 AI）
```

**第 2 周：引导 AI 协作**

```
□ 使用团队模板设置 Claude  
□ 在 AI 协助下完成"玩具问题"  
□ 练习提示模式  
□ 创建第一个 AI 辅助 PR（有监督）
```

**第 3 周：独立工作**

```
□ 发布第一个重要的 AI 辅助功能  
□ 为另一个开发者的 AI 输出编写测试  
□ 领导一个代码审查会话
```

### [建立透明度文化](#建立透明度文化)

一个必要的文化转变：标准化 AI 协助的披露。我们不是试图隐藏我们使用 AI——我们试图负责任地使用它。每个包含 AI 工作的提交消息都被标记：

```
# 我们的 .gitmessage 模板  
# feat/fix/docs: <描述> [AI]?  
#  
# [AI] - 重要的 AI 协助（>50% 生成）  
# [AI-minor] - 轻微的 AI 协助（<50% 生成）  
# [AI-review] - 仅用于代码审查的 AI  
#   
# 示例：  
# feat: 为用户服务添加 Redis 缓存 [AI]  
#  
# AI 生成了缓存实现和 Redis 客户端设置。  
# 我设计了缓存键结构并编写了所有测试。  
# 手动验证缓存失效逻辑工作正常。
```

这种透明度服务于多个目的：

1.  审查者知道要特别注意
2.  未来的调试者理解代码的来源
3.  没有人对使用可用工具感到羞耻

创建一个开发者可以有效地利用 AI 的环境，没有恐惧或羞耻，是建立高绩效文化的一部分。

## [Claude 永远不应该碰的东西（刻在石头上）](#claude-永远不应该碰的东西刻在石头上)

让我们对边界非常清楚。这些不是建议——它们是戒律。违反它们会带来危险。

### [神圣的永不触碰清单](#神圣的永不触碰清单)

**❌ 测试文件**

```
# 这是神圣的土地  
# 没有 AI 可以通过  
def test_critical_business_logic():  
    """这个测试编码了价值 1000 万美元的领域知识"""  
    pass
```

测试编码人类理解。它们是你的安全网、你的规范、你积累的智慧。当 Claude 编写测试时，它只是验证代码做了代码做的事情——而不是它应该做的事情。

**❌ 数据库迁移**

```
-- migrations/2024_01_15_restructure_users.sql  
-- 不要让 AI 碰这个  
-- 一个错误的举动 = 数据丢失 = 职业生涯丢失  
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20);  
UPDATE users SET subscription_tier = 'free' WHERE subscription_tier IS NULL;  
ALTER TABLE users ALTER COLUMN subscription_tier SET NOT NULL;
```

迁移在生产中是不可逆的。它们需要理解数据模式、部署时间和回滚策略，这是 AI 无法掌握的。

**❌ 安全关键代码**

```
# auth/jwt_validator.py  
# 仅限人类眼睛 - 安全边界  
def validate_token(token: str) -> Optional[UserClaims]:  
    # 这里的每一行都经过安全审查  
    # 更改需要安全团队批准  
    # AI 建议在这里主动危险
```

**❌ 没有版本控制的 API 合约**

```
# openapi.yaml  
# 破坏这个 = 破坏每个客户端  
# AI 不理解移动应用发布周期  
paths:  
  /api/v1/users/{id}:  
    get:  
      responses:  
        200:  
          schema:  
            $ref: '#/definitions/UserResponse'  # 冻结直到 v2
```

**❌ 配置和秘密**

```
# config/production.py  
DATABASE_URL = os.environ["DATABASE_URL"]  # 永远不要硬编码  
STRIPE_SECRET_KEY = os.environ["STRIPE_SECRET_KEY"]  # 显然  
FEATURE_FLAGS = {  
    "new_pricing": False,  # 需要产品决策  
}
```

### [AI 错误的层次结构](#ai-错误的层次结构)

并非所有 AI 错误都相等。以下是我们如何分类它们：

**第 1 级：烦人但无害**

*   错误的格式化（你的 linter 会捕获）
*   冗长的代码（稍后重构）
*   次优算法（分析会揭示）

**第 2 级：修复昂贵**

*   破坏内部 API（需要协调）
*   改变既定模式（混淆团队）
*   添加不必要的依赖（膨胀）

**第 3 级：限制职业生涯**

*   修改测试以使其通过
*   破坏 API 合约
*   泄露秘密或 PII
*   破坏数据迁移

你的防护措施应该与错误级别成比例。第 1 级错误教导初级开发者。第 3 级错误教导你更新 LinkedIn。

## [开发的未来：走向何方](#开发的未来走向何方)

当我写这篇文章时是 2025 年，我们正处于 AI 辅助开发的尴尬青春期。工具强大但笨拙，就像一个刚经历生长突增的青少年。但轨迹是明确的，而且正在加速。

良好的文档是成功实施 DevOps 能力的基础。表现出色的团队将是那些将文档视为代码、以与测试套件相同的严格性维护 `CLAUDE.md` 文件的团队。

我看到即将到来的东西（~大致按到达顺序）：

*   主动建议改进而不需要提示的 AI
*   学习你团队模式和偏好的 AI
*   跨会话和项目的持久记忆
*   理解整个代码库而不仅仅是文件的 AI

但即使能力扩展，基础仍然存在：人类设定方向，AI 提供杠杆。我们是工具使用者，这些只是我们创造的最强大的工具。

## [底线：从这里开始，今天开始](#底线从这里开始今天开始)

如果你已经读到这里，你可能感到兴奋和恐惧的混合。这是正确的反应。AI 辅助开发很强大，但需要纪律和意图。

这是你的行动计划：

**今天：**

1.  为你当前项目创建一个 `CLAUDE.md`
2.  自己为你最棘手的代码添加三个锚点注释
3.  尝试一个具有适当边界的 AI 辅助功能

**本周：**

1.  与你的团队建立 AI 提交消息约定
2.  与初级开发者运行 AI 辅助编码会话
3.  为一段 AI 生成的代码编写测试

**本月：**

1.  测量采用 AI 前后的部署频率
2.  为常见任务创建提示模式库
3.  运行关于 AI 辅助开发的团队回顾

最重要的事情？开始。从小开始，谨慎开始，但要开始。掌握这个工作流的开发者不一定更聪明或更有才华——他们只是更早开始并从更多错误中学习的人。

软件交付性能预测组织性能。在一个速度和质量决定成功的行业中，AI 协助不是锦上添花——它是竞争必需品。但只有在你做得对的情况下。

Vibe-coding，尽管名字有趣，但这是严肃的业务。这是思考软件开发的新方式，它放大人类能力而不是替代它们。掌握它，你将比以往想象的更快地发布更好的软件。忽略它，你会看着竞争对手在你还在输入样板代码时超越你。

工具在这里。模式已证明。唯一的问题是：你将是指挥管弦乐队，还是仍然自己演奏每一种乐器？

### [准备深入？开始资源：](#准备深入开始资源)

📄 **我们经过战斗测试的 `CLAUDE.md` 模板：**  
[github.com/julep-ai/julep/blob/main/AGENTS.md](https://github.com/julep-ai/julep/blob/main/AGENTS.md)

🤝 **问题？在 Twitter 上找到我：** [@diwanksingh](https://twitter.com/diwanksingh)

💬 **加入讨论：** 分享你自己的模式和学习

📚 **推荐阅读：**

*   Peter Senge – _第五项修炼_ (2010)
*   _["超越 70%：最大化 AI 辅助编码中的人类 30%"](https://addyo.substack.com/p/future-proofing-your-software-engineering?utm_source=chatgpt.com)_ (2025 年 3 月 13 日) – Addy Osmani
*   Mark Richards & Neal Ford – _[软件架构基础](https://books.google.com/books/about/Fundamentals_of_Software_Architecture.html)_，第 2 版 (2025)
*   Nicole Forsgren, Jez Humble, Gene Kim - _[加速：精益软件和 DevOps 的科学](https://itrevolution.com/product/accelerate/)_

**记住**：完美是已发布产品的敌人。从一个小项目开始，建立你的边界，然后迭代。开发的未来在这里——只是分布不均匀。

> 成为分布的一部分。

* * *

## [来源和致谢](#来源和致谢)

本文基于 Diwank Singh 的原创文章 [Field Notes From Shipping Real Code With Claude](https://diwank.space/field-notes-from-shipping-real-code-with-claude) 进行扩展和本地化。

**原作者**: Diwank Singh  
**原始链接**: [https://diwank.space/field-notes-from-shipping-real-code-with-claude](https://diwank.space/field-notes-from-shipping-real-code-with-claude)  
**发布日期**: 2025年6月7日

感谢 Diwank Singh 分享这些宝贵的 AI 辅助开发实践经验。本文保留了所有技术细节、代码示例和最佳实践说明，同时进行了适当的格式优化和图片本地化处理。

[

掌握 Claude Code 的 33 个必知设置技巧

通过 33 个基础到高级的技巧全面掌握 Claude Code，涵盖快捷键、提示技巧、MCP 服务器、项目规则和自动化钩子。从新手到专家级生产力的完整指南。

](/docs/zh/best-practices/claude-code-setup-tips)[

我如何使用 Claude Code

一份关于有效 Claude Code 使用模式的综合指南，从线程管理到 MCP 服务器、规划模式和 AI 辅助开发的生产力技巧。

](/docs/zh/best-practices/how-i-use-claude-code)

### On this page

[使用 Claude 生产真实代码的实战笔记](#使用-claude-生产真实代码的实战笔记)[Vibe Coding 不仅仅是一种感觉](#vibe-coding-不仅仅是一种感觉)[你将学到什么](#你将学到什么)[这篇文章存在的原因：从梗到方法](#这篇文章存在的原因从梗到方法)[理解 Vibe-Coding](#理解-vibe-coding)[Vibe-Coding 的三种模式：实用框架](#vibe-coding-的三种模式实用框架)[模式 1：_游乐场_](#模式-1游乐场)[模式 2：_结对编程_](#模式-2结对编程)[模式 3：_生产/单体仓库规模_](#模式-3生产单体仓库规模)[基础设施：可持续 AI 开发的基础](#基础设施可持续-ai-开发的基础)[`CLAUDE.md`：你的单一真相来源](#claudemd你的单一真相来源)[AI 开发的 Git 工作流](#ai-开发的-git-工作流)[神圣规则：人类编写测试](#神圣规则人类编写测试)[不溺水地扩展：Token 经济学和上下文管理](#不溺水地扩展token-经济学和上下文管理)[新会话和心理模型](#新会话和心理模型)[案例研究：在生产中发布结构化错误](#案例研究在生产中发布结构化错误)[AI 时代的领导力和文化](#ai-时代的领导力和文化)[新的入职检查清单](#新的入职检查清单)[建立透明度文化](#建立透明度文化)[Claude 永远不应该碰的东西（刻在石头上）](#claude-永远不应该碰的东西刻在石头上)[神圣的永不触碰清单](#神圣的永不触碰清单)[AI 错误的层次结构](#ai-错误的层次结构)[开发的未来：走向何方](#开发的未来走向何方)[底线：从这里开始，今天开始](#底线从这里开始今天开始)[准备深入？开始资源：](#准备深入开始资源)[来源和致谢](#来源和致谢)