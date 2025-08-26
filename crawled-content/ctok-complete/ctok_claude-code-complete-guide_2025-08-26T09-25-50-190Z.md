页面导航

*   [📋 目录导览](#📋-目录导览 "📋 目录导览")
*   [🎯 主要内容](#🎯-主要内容 "🎯 主要内容")
*   [1️⃣ Claude Code 简介](#_1️⃣-claude-code-简介 "1️⃣ Claude Code 简介")
    *   [🆚 核心优势对比](#🆚-核心优势对比 "🆚 核心优势对比")
*   [2️⃣ 安装方法](#_2️⃣-安装方法 "2️⃣ 安装方法")
    *   [2.1 官方安装](#_2-1-官方安装 "2.1 官方安装")
*   [3️⃣ 基础使用](#_3️⃣-基础使用 "3️⃣ 基础使用")
    *   [3.1 首次配置](#_3-1-首次配置 "3.1 首次配置")
        *   [API 配置（镜像站跳过此步骤）](#api-配置-镜像站跳过此步骤 "API 配置（镜像站跳过此步骤）")
        *   [基本配置](#基本配置 "基本配置")
        *   [安全设置（可选，有一定风险）](#安全设置-可选-有一定风险 "安全设置（可选，有一定风险）")
    *   [3.2 基本命令](#_3-2-基本命令 "3.2 基本命令")
        *   [基础交互](#基础交互 "基础交互")
        *   [项目管理](#项目管理 "项目管理")
*   [4️⃣ MCP 集成](#_4️⃣-mcp-集成 "4️⃣ MCP 集成")
    *   [4.1 启用 MCP](#_4-1-启用-mcp "4.1 启用 MCP")
    *   [4.2 常用 MCP 服务器](#_4-2-常用-mcp-服务器 "4.2 常用 MCP 服务器")
        *   [数据库连接](#数据库连接 "数据库连接")
        *   [文件系统](#文件系统 "文件系统")
        *   [Web 服务](#web-服务 "Web 服务")
*   [5️⃣ 配置系统](#_5️⃣-配置系统 "5️⃣ 配置系统")
    *   [5.1 全局配置](#_5-1-全局配置 "5.1 全局配置")
    *   [5.2 项目配置](#_5-2-项目配置 "5.2 项目配置")
    *   [5.3 配置文件](#_5-3-配置文件 "5.3 配置文件")
*   [6️⃣ 安全和权限管理](#_6️⃣-安全和权限管理 "6️⃣ 安全和权限管理")
    *   [6.1 工具权限控制](#_6-1-工具权限控制 "6.1 工具权限控制")
    *   [6.2 文件访问控制](#_6-2-文件访问控制 "6.2 文件访问控制")
    *   [6.3 网络安全](#_6-3-网络安全 "6.3 网络安全")
*   [7️⃣ 思考模式](#_7️⃣-思考模式 "7️⃣ 思考模式")
    *   [7.1 启用思考模式](#_7-1-启用思考模式 "7.1 启用思考模式")
    *   [7.2 思考模式配置](#_7-2-思考模式配置 "7.2 思考模式配置")
*   [8️⃣ Config 命令](#_8️⃣-config-命令 "8️⃣ Config 命令")
    *   [8.1 配置命令语法](#_8-1-配置命令语法 "8.1 配置命令语法")
    *   [8.2 常用配置命令](#_8-2-常用配置命令 "8.2 常用配置命令")
        *   [设置配置](#设置配置 "设置配置")
        *   [查看配置](#查看配置 "查看配置")
        *   [管理配置](#管理配置 "管理配置")
*   [9️⃣ 团队协作与自动化](#_9️⃣-团队协作与自动化 "9️⃣ 团队协作与自动化")
    *   [9.1 Git 集成](#_9-1-git-集成 "9.1 Git 集成")
    *   [9.2 CI/CD 集成](#_9-2-ci-cd-集成 "9.2 CI/CD 集成")
        *   [GitHub Actions 示例](#github-actions-示例 "GitHub Actions 示例")
        *   [Jenkins Pipeline 示例](#jenkins-pipeline-示例 "Jenkins Pipeline 示例")
    *   [9.3 自动化脚本](#_9-3-自动化脚本 "9.3 自动化脚本")
        *   [代码质量检查脚本](#代码质量检查脚本 "代码质量检查脚本")
        *   [文档生成脚本](#文档生成脚本 "文档生成脚本")
*   [🔟 高级特性](#🔟-高级特性 "🔟 高级特性")
    *   [10.1 插件系统](#_10-1-插件系统 "10.1 插件系统")
    *   [10.2 模板系统](#_10-2-模板系统 "10.2 模板系统")
    *   [10.3 工作空间管理](#_10-3-工作空间管理 "10.3 工作空间管理")
    *   [10.4 性能优化](#_10-4-性能优化 "10.4 性能优化")
*   [🛠️ 故障排除](#🛠️-故障排除 "🛠️ 故障排除")
    *   [常见问题解决方案](#常见问题解决方案 "常见问题解决方案")
        *   [1\. 安装问题](#_1-安装问题 "1. 安装问题")
        *   [2\. 配置问题](#_2-配置问题 "2. 配置问题")
        *   [3\. 连接问题](#_3-连接问题 "3. 连接问题")
*   [📚 总结](#📚-总结 "📚 总结")

# Claude Code 完整使用指南 [​](#claude-code-完整使用指南)

本指南整理了 Claude Code 的完整使用方法，内容较长，建议作为工具书使用。

## 📋 目录导览 [​](#📋-目录导览)

1.  [Claude Code 简介](#claude-code-简介)
2.  [安装方法](#安装方法)
3.  [基础使用](#基础使用)
4.  [MCP 集成](#mcp-集成)
5.  [配置系统](#配置系统)
6.  [安全和权限管理](#安全和权限管理)
7.  [思考模式](#思考模式)
8.  [Config 命令](#config-命令)
9.  [团队协作与自动化](#团队协作与自动化)
10.  [高级特性](#高级特性)

## 🎯 主要内容 [​](#🎯-主要内容)

*   **不同平台的详细安装方法**
*   **MCP 集成完整指南，连接外部服务和数据库的配置教程**
*   **完整的命令参考表，覆盖 CLI 命令和交互模式斜杠命令**
*   **安全权限管理和最佳实践，避免数据泄露风险**
*   **自动化脚本示例，适用于 CI/CD 和团队协作场景**
*   **详细的故障排除指南，快速解决常见配置问题**

## 1️⃣ Claude Code 简介 [​](#_1️⃣-claude-code-简介)

Claude Code 不是又一个 AI IDE，而是革命性的 CLI 智能编程助手！

### 🆚 核心优势对比 [​](#🆚-核心优势对比)

对比维度

Cursor 等 AI IDE

Claude Code (CLI)

**AI 能力**

出于成本考虑，提示词工程降智，回答质量差

**原生 Claude 3.5 Sonnet/Opus**

**工具调用**

仅 25 次工具调用，复杂任务被强制中断

**无限工具调用**

**上下文长度**

上下文窗口小，大项目理解不全

**200K+ 上下文**

**Agent 能力**

长任务会被夹断，无法自主完成

**完全自主 Agent**

**调试能力**

只能看代码，看不到系统状态

**直接读取系统日志**

## 2️⃣ 安装方法 [​](#_2️⃣-安装方法)

⚠️ **注意**：Claude 官方不支持中国大陆用户，推荐使用国内镜像站，使用体验完全相同。

### 2.1 官方安装 [​](#_2-1-官方安装)

使用 NPM 安装（Windows 用户仍须在 WSL 中使用）：

bash

```
# 全局安装
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

## 3️⃣ 基础使用 [​](#_3️⃣-基础使用)

### 3.1 首次配置 [​](#_3-1-首次配置)

#### API 配置（镜像站跳过此步骤） [​](#api-配置-镜像站跳过此步骤)

bash

```
# 从 https://console.anthropic.com 获取 API Key
export ANTHROPIC_API_KEY="sk-your-key-here"

# 根据你的 shell 选择配置方式

# Bash
echo 'export ANTHROPIC_API_KEY="sk-your-key-here"' >> ~/.bashrc
source ~/.bashrc

# Zsh
echo 'export ANTHROPIC_API_KEY="sk-your-key-here"' >> ~/.zshrc
source ~/.zshrc

# Fish
echo 'set -gx ANTHROPIC_API_KEY "sk-your-key-here"' >> ~/.config/fish/config.fish
```

#### 基本配置 [​](#基本配置)

bash

```
# 修改默认设置
claude config set -g model claude-sonnet-4
claude config set -g verbose true
claude config set -g outputFormat text

# 测试安装是否成功
claude "Hello, Claude!"
claude /doctor
```

#### 安全设置（可选，有一定风险） [​](#安全设置-可选-有一定风险)

bash

```
# 禁用遥测数据收集
export DISABLE_TELEMETRY=1

# 禁用错误报告
export DISABLE_ERROR_REPORTING=1

# 禁用非必要的模型调用，节约 token
export DISABLE_NON_ESSENTIAL_MODEL_CALLS=1

# 限制工具权限
claude config set allowedTools "Edit,View"

# 跳过对话框
claude config set hasTrustDialogAccepted true
claude config set hasCompletedProjectOnboarding true

# 设置忽略文件模式
claude config set ignorePatterns ".env,.git,node_modules"
```

### 3.2 基本命令 [​](#_3-2-基本命令)

#### 基础交互 [​](#基础交互)

bash

```
# 启动交互模式
claude

# 一次性命令执行
claude "帮我修复这个 bug"

# 单次打印模式
claude -p "分析这段代码的性能问题"

# 管道输入大文件
cat file | claude -p "总结这个文件的主要功能"

# 更新客户端
claude update

# 启动 MCP 向导
claude mcp
```

#### 项目管理 [​](#项目管理)

bash

```
# 在项目目录中启动
cd /path/to/your/project
claude

# 指定项目路径
claude --project /path/to/project

# 查看项目状态
claude /project-info

# 重置项目设置
claude /reset-project
```

## 4️⃣ MCP 集成 [​](#_4️⃣-mcp-集成)

MCP (Model Context Protocol) 允许 Claude Code 连接外部服务和数据库。

### 4.1 启用 MCP [​](#_4-1-启用-mcp)

bash

```
# 启动 MCP 配置向导
claude mcp

# 手动配置 MCP
claude config set mcp.enabled true
```

### 4.2 常用 MCP 服务器 [​](#_4-2-常用-mcp-服务器)

#### 数据库连接 [​](#数据库连接)

bash

```
# PostgreSQL
claude mcp add postgresql --connection-string "postgresql://user:pass@localhost:5432/db"

# MySQL
claude mcp add mysql --host localhost --user root --database mydb

# SQLite
claude mcp add sqlite --database-path ./data.db
```

#### 文件系统 [​](#文件系统)

bash

```
# 本地文件系统
claude mcp add filesystem --root-path /path/to/project

# Git 仓库
claude mcp add git --repository-path /path/to/repo
```

#### Web 服务 [​](#web-服务)

bash

```
# REST API
claude mcp add rest-api --base-url https://api.example.com --auth-token your-token

# GraphQL
claude mcp add graphql --endpoint https://api.example.com/graphql
```

## 5️⃣ 配置系统 [​](#_5️⃣-配置系统)

### 5.1 全局配置 [​](#_5-1-全局配置)

bash

```
# 查看所有配置
claude config list

# 设置全局配置
claude config set --global model claude-opus-3
claude config set --global max-tokens 4000
claude config set --global temperature 0.7

# 重置配置
claude config reset
```

### 5.2 项目配置 [​](#_5-2-项目配置)

bash

```
# 在项目目录中设置
claude config set --project model claude-sonnet-3.5
claude config set --project ignore-patterns "*.log,temp/*"

# 查看项目配置
claude config list --project

# 继承全局配置
claude config inherit --global
```

### 5.3 配置文件 [​](#_5-3-配置文件)

Claude Code 的配置文件位置：

*   全局配置：`~/.claude/config.json`
*   项目配置：`.claude/config.json`

## 6️⃣ 安全和权限管理 [​](#_6️⃣-安全和权限管理)

### 6.1 工具权限控制 [​](#_6-1-工具权限控制)

bash

```
# 查看可用工具
claude /tools

# 限制工具权限
claude config set allowedTools "Edit,View,Terminal"

# 禁用危险工具
claude config set deniedTools "Delete,Execute"

# 设置工具白名单
claude config set toolWhitelist "git,npm,pip,cargo"
```

### 6.2 文件访问控制 [​](#_6-2-文件访问控制)

bash

```
# 设置忽略模式
claude config set ignorePatterns ".env,.secrets,*.key,id_rsa*"

# 设置只读目录
claude config set readOnlyPaths "/etc,/var,/usr"

# 设置禁止访问的目录
claude config set forbiddenPaths "/root,/home/*/private"
```

### 6.3 网络安全 [​](#_6-3-网络安全)

bash

```
# 禁用网络访问
claude config set networkAccess false

# 允许特定域名
claude config set allowedDomains "github.com,stackoverflow.com"

# 设置代理
claude config set proxy "http://proxy.example.com:8080"
```

## 7️⃣ 思考模式 [​](#_7️⃣-思考模式)

Claude Code 支持深度思考模式，适用于复杂问题。

### 7.1 启用思考模式 [​](#_7-1-启用思考模式)

bash

```
# 在交互模式中
> /think 如何优化这个算法的时间复杂度？

# 命令行模式
claude --think "设计一个分布式缓存系统"

# 深度思考
claude --deep-think "分析这个系统的安全漏洞"
```

### 7.2 思考模式配置 [​](#_7-2-思考模式配置)

bash

```
# 设置思考超时时间
claude config set thinkTimeout 300

# 启用思考记录
claude config set saveThoughts true

# 查看思考历史
claude /thoughts
```

## 8️⃣ Config 命令 [​](#_8️⃣-config-命令)

### 8.1 配置命令语法 [​](#_8-1-配置命令语法)

bash

```
claude config <action> [options] [key] [value]
```

### 8.2 常用配置命令 [​](#_8-2-常用配置命令)

#### 设置配置 [​](#设置配置)

bash

```
# 设置字符串值
claude config set model "claude-3-sonnet"

# 设置数值
claude config set maxTokens 4000

# 设置布尔值
claude config set verbose true

# 设置数组
claude config set ignorePatterns "*.log" "temp/*" "node_modules"
```

#### 查看配置 [​](#查看配置)

bash

```
# 查看所有配置
claude config list

# 查看特定配置
claude config get model

# 查看配置源
claude config source model
```

#### 管理配置 [​](#管理配置)

bash

```
# 删除配置
claude config unset verbose

# 重置所有配置
claude config reset

# 导出配置
claude config export > config-backup.json

# 导入配置
claude config import < config-backup.json
```

## 9️⃣ 团队协作与自动化 [​](#_9️⃣-团队协作与自动化)

### 9.1 Git 集成 [​](#_9-1-git-集成)

bash

```
# 自动审查代码
claude "请审查我的最新提交"

# 生成提交信息
git diff --cached | claude -p "生成简洁的提交信息"

# 代码重构建议
claude "分析这个分支的代码质量并提出改进建议"
```

### 9.2 CI/CD 集成 [​](#_9-2-ci-cd-集成)

#### GitHub Actions 示例 [​](#github-actions-示例)

yaml

```
name: Claude Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code
      - name: Code Review
        run: |
          git diff origin/main...HEAD | claude -p "审查这些代码更改" > review.md
          gh pr comment --body-file review.md
```

#### Jenkins Pipeline 示例 [​](#jenkins-pipeline-示例)

groovy

```
pipeline {
    agent any
    stages {
        stage('Code Analysis') {
            steps {
                script {
                    sh 'claude "分析项目代码质量" > analysis.txt'
                    archiveArtifacts 'analysis.txt'
                }
            }
        }
    }
}
```

### 9.3 自动化脚本 [​](#_9-3-自动化脚本)

#### 代码质量检查脚本 [​](#代码质量检查脚本)

bash

```
#!/bin/bash
# code-quality-check.sh

echo "🔍 正在进行代码质量检查..."

# 检查代码风格
claude "检查代码风格是否符合团队规范" > style-check.txt

# 检查安全漏洞
claude "扫描代码中的潜在安全漏洞" > security-check.txt

# 性能分析
claude "分析代码性能瓶颈" > performance-check.txt

echo "✅ 代码质量检查完成，报告已生成"
```

#### 文档生成脚本 [​](#文档生成脚本)

bash

```
#!/bin/bash
# generate-docs.sh

echo "📝 正在生成文档..."

# 生成 API 文档
claude "为这个项目生成详细的 API 文档" > api-docs.md

# 生成使用指南
claude "生成用户使用指南" > user-guide.md

# 生成开发者文档
claude "生成开发者文档和部署指南" > dev-docs.md

echo "✅ 文档生成完成"
```

## 🔟 高级特性 [​](#🔟-高级特性)

### 10.1 插件系统 [​](#_10-1-插件系统)

bash

```
# 查看已安装插件
claude plugin list

# 安装插件
claude plugin install claude-eslint
claude plugin install claude-pytest

# 启用/禁用插件
claude plugin enable claude-eslint
claude plugin disable claude-pytest

# 更新插件
claude plugin update
```

### 10.2 模板系统 [​](#_10-2-模板系统)

bash

```
# 创建代码模板
claude template create --name "react-component" --path ./templates/

# 使用模板
claude template use react-component --name MyComponent

# 列出模板
claude template list

# 分享模板
claude template share react-component
```

### 10.3 工作空间管理 [​](#_10-3-工作空间管理)

bash

```
# 创建工作空间
claude workspace create my-project

# 切换工作空间
claude workspace switch my-project

# 列出工作空间
claude workspace list

# 删除工作空间
claude workspace delete my-project
```

### 10.4 性能优化 [​](#_10-4-性能优化)

bash

```
# 启用缓存
claude config set cache.enabled true
claude config set cache.ttl 3600

# 设置并发限制
claude config set maxConcurrent 5

# 启用增量处理
claude config set incrementalMode true

# 性能监控
claude /performance
```

## 🛠️ 故障排除 [​](#🛠️-故障排除)

### 常见问题解决方案 [​](#常见问题解决方案)

#### 1\. 安装问题 [​](#_1-安装问题)

bash

```
# 权限问题
sudo npm install -g @anthropic-ai/claude-code

# 网络问题
npm config set registry https://registry.npmmirror.com
npm install -g @anthropic-ai/claude-code

# 版本冲突
npm uninstall -g @anthropic-ai/claude-code
npm cache clean --force
npm install -g @anthropic-ai/claude-code@latest
```

#### 2\. 配置问题 [​](#_2-配置问题)

bash

```
# 重置配置
claude config reset

# 检查环境变量
echo $ANTHROPIC_API_KEY

# 验证安装
claude /doctor
```

#### 3\. 连接问题 [​](#_3-连接问题)

bash

```
# 测试连接
claude "test connection"

# 检查代理设置
claude config get proxy

# 更换 API 端点
claude config set apiEndpoint "https://api.anthropic.com"
```

## 📚 总结 [​](#📚-总结)

Claude Code 作为革命性的 CLI 编程助手，提供了：

1.  **强大的 AI 能力** - 原生 Claude 3.5 Sonnet/Opus 支持
2.  **完整的工具生态** - MCP 集成、插件系统、模板管理
3.  **企业级安全** - 权限控制、访问限制、审计日志
4.  **团队协作** - Git 集成、CI/CD 支持、自动化脚本
5.  **高度可配置** - 灵活的配置系统、工作空间管理

通过本指南的学习，你将能够充分发挥 Claude Code 的强大功能，提升开发效率和代码质量。

* * *

💡 **提示**：本指南内容较多，建议收藏并在实际使用中参考相关章节。如有疑问，可使用 `claude /help` 命令获取实时帮助。

最后更新于: 2025/7/19 12:53:03

Pager

[上一页Claude Code 常见工作流程指南](/claude-code-common-workflows)

[下一页Claude Code 订阅用户新的每周使用限制](/claude-weekly-rate-limits)