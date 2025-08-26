页面导航

*   [1️⃣ 基础命令 - 5分钟上手](#_1️⃣-基础命令-5分钟上手 "1️⃣ 基础命令 - 5分钟上手")
    *   [1.1 claude - 启动交互模式](#_1-1-claude-启动交互模式 "1.1 claude - 启动交互模式")
    *   [1.2 claude "问题" - 一次性回答](#_1-2-claude-问题-一次性回答 "1.2 claude \"问题\" - 一次性回答")
    *   [1.3 管道处理 - 这个功能绝了](#_1-3-管道处理-这个功能绝了 "1.3 管道处理 - 这个功能绝了")
    *   [1.4 claude -p - 输出结果](#_1-4-claude-p-输出结果 "1.4 claude -p - 输出结果")
    *   [1.5 claude --help - 查看帮助](#_1-5-claude-help-查看帮助 "1.5 claude --help - 查看帮助")
*   [2️⃣ 配置管理 - 个性化你的Claude](#_2️⃣-配置管理-个性化你的claude "2️⃣ 配置管理 - 个性化你的Claude")
    *   [2.1 查看当前配置](#_2-1-查看当前配置 "2.1 查看当前配置")
    *   [2.2 修改配置](#_2-2-修改配置 "2.2 修改配置")
    *   [2.3 重置配置](#_2-3-重置配置 "2.3 重置配置")
*   [3️⃣ MCP命令 - 让Claude Code开挂](#_3️⃣-mcp命令-让claude-code开挂 "3️⃣ MCP命令 - 让Claude Code开挂")
    *   [3.1 查看MCP列表](#_3-1-查看mcp列表 "3.1 查看MCP列表")
    *   [3.2 查看某个MCP的详细配置](#_3-2-查看某个mcp的详细配置 "3.2 查看某个MCP的详细配置")
    *   [3.3 删除某个MCP](#_3-3-删除某个mcp "3.3 删除某个MCP")
    *   [3.4 查看MCP状态](#_3-4-查看mcp状态 "3.4 查看MCP状态")
    *   [3.5 安装MCP](#_3-5-安装mcp "3.5 安装MCP")
        *   [安装 Playwright](#安装-playwright "安装 Playwright")
        *   [其他常用MCP安装](#其他常用mcp安装 "其他常用MCP安装")
*   [4️⃣ 实战案例 - 连接GitHub](#_4️⃣-实战案例-连接github "4️⃣ 实战案例 - 连接GitHub")
    *   [4.1 安装GitHub MCP](#_4-1-安装github-mcp "4.1 安装GitHub MCP")
    *   [4.2 使用GitHub MCP](#_4-2-使用github-mcp "4.2 使用GitHub MCP")
*   [5️⃣ 高级命令和技巧](#_5️⃣-高级命令和技巧 "5️⃣ 高级命令和技巧")
    *   [5.1 会话管理](#_5-1-会话管理 "5.1 会话管理")
    *   [5.2 输出格式控制](#_5-2-输出格式控制 "5.2 输出格式控制")
    *   [5.3 项目特定配置](#_5-3-项目特定配置 "5.3 项目特定配置")
    *   [5.4 批处理和自动化](#_5-4-批处理和自动化 "5.4 批处理和自动化")
*   [6️⃣ 交互模式的特殊命令](#_6️⃣-交互模式的特殊命令 "6️⃣ 交互模式的特殊命令")
*   [7️⃣ 常见问题和解决方案](#_7️⃣-常见问题和解决方案 "7️⃣ 常见问题和解决方案")
    *   [7.1 连接问题](#_7-1-连接问题 "7.1 连接问题")
    *   [7.2 性能优化](#_7-2-性能优化 "7.2 性能优化")
    *   [7.3 调试模式](#_7-3-调试模式 "7.3 调试模式")
*   [8️⃣ 最佳实践建议](#_8️⃣-最佳实践建议 "8️⃣ 最佳实践建议")
*   [9️⃣ 命令速查表](#_9️⃣-命令速查表 "9️⃣ 命令速查表")
*   [🔟 总结](#🔟-总结 "🔟 总结")

# 10分钟掌握Claude Code所有命令指南 [​](#_10分钟掌握claude-code所有命令指南)

很多人用 Claude Code 只是当聊天工具，白白浪费了它 90% 的能力。本文提供保姆级教程，让你 10 分钟掌握所有核心命令！

![Claude Code 命令指南](/images/458d35493043984fc249fc849214b344.png)

📖 在线参考

可以收藏这个页面作为命令参考：[https://cc-cli-help.pages.dev](https://cc-cli-help.pages.dev)

## 1️⃣ 基础命令 - 5分钟上手 [​](#_1️⃣-基础命令-5分钟上手)

先从最简单的开始，这5个命令能满足你80%的需求。

### 1.1 claude - 启动交互模式 [​](#_1-1-claude-启动交互模式)

最基础但最常用的命令：

bash

```
claude
```

![启动交互模式](/images/25a9657c9e091081092fc44699e42046.png)

就这么简单，敲完回车就进入对话模式了。想退出？输入 `/exit` 或 `/quit` 就可以了。

![退出交互模式](/images/0f4f262b23da5ee43a9ff91637b901fc.png)

### 1.2 claude "问题" - 一次性回答 [​](#_1-2-claude-问题-一次性回答)

不想进入交互模式？直接问：

bash

```
claude "这段代码有什么问题"
claude "帮我写个快速排序"
```

直接就进入问题模式：

![一次性回答](/images/cd5efe05259c40081f5e9a98a2dde859.png)

写完以后还可以继续在命令行输入问题：

![继续提问](/images/98fe5e3888171d8f753a4b2fc1e58c3e.png)

### 1.3 管道处理 - 这个功能绝了 [​](#_1-3-管道处理-这个功能绝了)

这是最实用的功能，可以直接处理文件内容：

bash

```
# 优化代码文件
cat quicksort.py | claude "优化这段代码"

# 翻译文档
cat README.md | claude "翻译成中文"
```

直接就可以开始优化代码了：

![管道处理代码](/images/376335ed27f68627f53a9324d044044d.png)

甚至可以这样玩：

bash

```
git diff | claude "解释这次改动"
```

看到结果没有，不用自己傻乎乎看密密麻麻的代码，一次性帮你总结好：

![Git diff 分析](/images/3e49267d59cf6a4fa70b86b16bb4425c.png)

![改动总结](/images/a3cd7c3a5a3a79ca5a382ec6da5c2eaf.png)

### 1.4 claude -p - 输出结果 [​](#_1-4-claude-p-输出结果)

默认输出会有 Markdown 格式，加上 `-p` 就是纯文本，并且执行完后会直接退出：

bash

```
claude -p "生成MySQL的SQL的JOIN语句案例" > query.sql
```

可以看到，上面的命令执行完后，就直接退出了。没有交互的地方。并且输出内容：

![纯文本输出](/images/436be28bdd2d936bd8f9e512c00db2a5.png)

### 1.5 claude --help - 查看帮助 [​](#_1-5-claude-help-查看帮助)

忘记命令了？一个 help 搞定：

bash

```
claude --help
```

![查看帮助](/images/fb43f6d6cc6f81fcd8097a31cfc58e01.png)

## 2️⃣ 配置管理 - 个性化你的Claude [​](#_2️⃣-配置管理-个性化你的claude)

### 2.1 查看当前配置 [​](#_2-1-查看当前配置)

会显示当前使用的模型、API密钥等信息：

bash

```
claude config list
```

![配置列表](/images/3873f506600a3f5d0d654b38de9b8c85.png)

### 2.2 修改配置 [​](#_2-2-修改配置)

bash

```
# 设置默认模型
claude config set model claude-3-sonnet

# 设置最大tokens
claude config set max-tokens 4000

# 设置温度参数
claude config set temperature 0.7
```

### 2.3 重置配置 [​](#_2-3-重置配置)

bash

```
claude config reset
```

## 3️⃣ MCP命令 - 让Claude Code开挂 [​](#_3️⃣-mcp命令-让claude-code开挂)

MCP (Model Context Protocol) 是 Claude Code 的杀手锏，能连接各种外部工具。

### 3.1 查看MCP列表 [​](#_3-1-查看mcp列表)

bash

```
claude mcp list
```

![MCP 列表](/images/33f4cadef0fb56ed57da3dbb3c209fdd.png)

### 3.2 查看某个MCP的详细配置 [​](#_3-2-查看某个mcp的详细配置)

bash

```
claude mcp get playwright
```

![MCP 详细配置](/images/dd8ed5a5c277781c94201ae3647a1208.png)

### 3.3 删除某个MCP [​](#_3-3-删除某个mcp)

bash

```
claude mcp remove "playwright" -s user
```

### 3.4 查看MCP状态 [​](#_3-4-查看mcp状态)

在交互模式中使用：

bash

```
/mcp
```

![MCP 状态查看](/images/64ba8c95cbfe20cf2495f850d6256416.png)

就会显示 MCP 的状态：

![MCP 状态显示](/images/cfef3a623cfc954f0b8a877c5df1f160.png)

### 3.5 安装MCP [​](#_3-5-安装mcp)

#### 安装 Playwright [​](#安装-playwright)

bash

```
claude mcp add playwright -s user -- npx @playwright/mcp@latest
```

#### 其他常用MCP安装 [​](#其他常用mcp安装)

bash

```
# Sequential Thinking
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking

# 文件系统
claude mcp add filesystem -s user -- npx -y @modelcontextprotocol/server-filesystem ~/Documents ~/Desktop ~/Downloads

# Puppeteer
claude mcp add puppeteer -s user -- npx -y @modelcontextprotocol/server-puppeteer

# Firecrawl (需要替换为实际的API Key)
claude mcp add firecrawl -s user -e FIRECRAWL_API_KEY=fc-YOUR_API_KEY -- npx -y firecrawl-mcp
```

## 4️⃣ 实战案例 - 连接GitHub [​](#_4️⃣-实战案例-连接github)

### 4.1 安装GitHub MCP [​](#_4-1-安装github-mcp)

bash

```
claude mcp add github-server -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN -- npx "@modelcontextprotocol/server-github"
```

⚠️ **注意**：分配 token 的时候，要给适当的权限：

![GitHub Token 权限](/images/68f7f66a4987db2a7694a3c6bbef12a3.png)

不然就会报错：

![GitHub 权限错误](/images/20583c59720ecc78f29abbb1e0bf6bcd.png)

### 4.2 使用GitHub MCP [​](#_4-2-使用github-mcp)

安装完成后，可以直接询问：

bash

```
我的github仓库有哪些项目
```

很精准的列举了仓库里的项目，并且还有中文解释和备注：

![GitHub 仓库列表](/images/b680a3b6d4dd011834232f5be75a0468.png)

bash

```
github的gi-food-friend这个项目最近的提交有哪些
```

![GitHub 提交历史](/images/7b052712b0ee02455c3bff1da1445acf.png)

可以看到很详细的提交信息，包括：

*   提交时间
*   提交者
*   提交信息
*   文件变更统计

![提交详情](/images/b8f15aca3e068f8453280c229c97a976.png)

## 5️⃣ 高级命令和技巧 [​](#_5️⃣-高级命令和技巧)

### 5.1 会话管理 [​](#_5-1-会话管理)

bash

```
# 继续上次会话
claude --continue

# 从历史会话中选择
claude --resume

# 在非交互模式下继续
claude --continue --print "继续之前的任务"
```

### 5.2 输出格式控制 [​](#_5-2-输出格式控制)

bash

```
# JSON 格式输出
claude --output-format json "分析这个错误"

# 流式 JSON 输出
claude --output-format stream-json "处理大文件"

# 纯文本输出（默认）
claude --output-format text "生成代码"
```

### 5.3 项目特定配置 [​](#_5-3-项目特定配置)

bash

```
# 在项目目录中设置
claude config set --project model claude-sonnet-3.5

# 查看项目配置
claude config list --project
```

### 5.4 批处理和自动化 [​](#_5-4-批处理和自动化)

bash

```
# 批处理多个文件
for file in *.py; do
  cat "$file" | claude "检查这个Python文件的代码质量" > "${file%.py}_review.txt"
done

# 管道链式处理
git diff | claude "总结改动" | claude "用中文解释"
```

## 6️⃣ 交互模式的特殊命令 [​](#_6️⃣-交互模式的特殊命令)

在 `claude` 交互模式中，还有一些特殊的斜杠命令：

bash

```
/help              # 显示帮助信息
/exit, /quit       # 退出交互模式
/clear             # 清空当前对话历史
/mcp               # 查看MCP状态
/continue          # 继续之前的对话
/reset             # 重置会话状态
```

## 7️⃣ 常见问题和解决方案 [​](#_7️⃣-常见问题和解决方案)

### 7.1 连接问题 [​](#_7-1-连接问题)

bash

```
# 测试API连接
claude "test connection"

# 检查配置
claude config get api-key
claude config get model
```

### 7.2 性能优化 [​](#_7-2-性能优化)

bash

```
# 启用缓存
claude config set cache-enabled true

# 设置并发限制
claude config set max-concurrent 3

# 调整超时时间
claude config set timeout 30
```

### 7.3 调试模式 [​](#_7-3-调试模式)

bash

```
# 启用详细日志
claude --verbose "你的问题"

# 调试模式
claude --debug "测试命令"
```

## 8️⃣ 最佳实践建议 [​](#_8️⃣-最佳实践建议)

1.  **合理使用管道**：善用 `|` 将其他命令的输出传给 Claude 处理
2.  **配置MCP扩展**：根据需要安装相应的MCP来扩展功能
3.  **保存配置**：为不同项目设置专门的配置文件
4.  **批处理自动化**：将 Claude Code 集成到脚本中处理重复任务
5.  **合理分段**：对于长文本，分段处理效果更好

## 9️⃣ 命令速查表 [​](#_9️⃣-命令速查表)

命令

功能

示例

`claude`

启动交互模式

`claude`

`claude "问题"`

一次性询问

`claude "解释这段代码"`

`claude -p`

纯文本输出

`claude -p "生成SQL" > query.sql`

`claude --help`

查看帮助

`claude --help`

`claude config list`

查看配置

`claude config list`

`claude mcp list`

查看MCP列表

`claude mcp list`

`claude mcp add`

安装MCP

`claude mcp add playwright -s user`

`claude --continue`

继续会话

`claude --continue`

`claude --resume`

选择历史会话

`claude --resume`

## 🔟 总结 [​](#🔟-总结)

通过这10分钟的学习，你已经掌握了 Claude Code 的所有核心命令：

*   **基础命令**：交互模式、一次性询问、管道处理
*   **配置管理**：个性化设置、项目配置
*   **MCP扩展**：连接外部工具，扩展功能
*   **高级技巧**：会话管理、输出控制、自动化处理

现在你可以充分发挥 Claude Code 的强大功能，而不仅仅是把它当作聊天工具使用了！

* * *

💡 **建议**：将这份指南保存为书签，在使用过程中随时查阅。随着使用经验的积累，你会发现更多有趣的玩法！

最后更新于: 2025/7/19 12:53:03

Pager

[上一页Claude Code 最佳实践和使用技巧](/claude-code-best-practices-tips)

[下一页国外大佬是如何使用 Claude Code的？（附最佳技巧）](/claude-code-big-brother)