[Killer Code](/)

Search

⌘K

[Best Practices](/docs)[Cookbook](https://github.com/foreveryh/claude-code-cookbook)[Official Docs](https://claude.ai/code)[Build with Claude](https://www.anthropic.com/learn/build-with-claude)[Author](https://x.com/Stephen4171127)[首页](/docs)

[Claude Code Documentation](/docs/en)

[Advanced](/docs/en/advanced)

[Best Practices](/docs/en/best-practices)

[Community Tips](/docs/en/community-tips)

[Cursor](/docs/en/cursor)

[Sub Agents](/docs/en/sub-agents)

[Tools](/docs/en/tools)

[CCPM: Claude Code Project Manager](/docs/en/tools/ccpm-claude-code-project-manager)[Claude Code Router](/docs/en/tools/claude-code-router)[Claude Code Templates: CLI Tool for Configuring and Monitoring Claude Code](/docs/en/tools/claude-code-templates)[CUI: Claude Code Web UI](/docs/en/tools/cui-web-ui)[Happy: Mobile and Web Client for Claude Code](/docs/en/tools/happy-mobile-claude-code-client)[Claude Code Hook: Preventing敷衍性回复](/docs/en/tools/you-are-not-right-hook)

[Claude Code 文档中心](/docs/zh)

[Claude Code Documentation](/docs/en)/[Tools](/docs/en/tools)

# Claude Code Router

Powerful Claude Code routing tool with multi-model intelligent routing and cost optimization

# [Claude Code Router](#claude-code-router)

Claude Code Router is a powerful routing tool that allows you to build coding infrastructure based on Claude Code, while letting you decide how to interact with models and enjoy updates from Anthropic.

**GitHub**: [musistudio/claude-code-router](https://github.com/musistudio/claude-code-router)  
**Stars**: 10.3k+  
**License**: MIT

## [🚀 Core Features](#-core-features)

### [Multi-Model Intelligent Routing](#multi-model-intelligent-routing)

*   **Smart Routing**: Automatically selects appropriate models based on task type
*   **Cost Optimization**: Uses smaller local models for background tasks
*   **Long Context Handling**: Dedicated models for long context tasks (>60K tokens)
*   **Reasoning Enhancement**: Specialized models for reasoning-intensive tasks

### [Multi-Provider Support](#multi-provider-support)

*   **OpenAI**: Complete OpenAI API support
*   **Anthropic**: Native Claude API support
*   **DeepSeek**: Adapted for DeepSeek API
*   **Gemini**: Google Gemini API support
*   **OpenRouter**: Multi-provider routing support
*   **Groq**: High-performance inference support

### [Transformer System](#transformer-system)

*   **maxtoken**: Sets specific max\_tokens values
*   **tooluse**: Optimizes tool usage via tool\_choice
*   **reasoning**: Processes reasoning\_content field
*   **sampling**: Handles temperature, top\_p, top\_k, and other sampling parameters
*   **enhancetool**: Adds error tolerance layer to tool call parameters

## [📦 Installation and Configuration](#-installation-and-configuration)

### [Quick Start](#quick-start)

```
# Install
bunx @musistudio/claude-code-router@latest

# Create config directory
mkdir -p $HOME/.claude-code-router

# Copy example config
cp config.example.json $HOME/.claude-code-router/config.json
```

### [Basic Configuration](#basic-configuration)

```
{
  "log": true,
  "OPENAI_API_KEY": "your-api-key",
  "OPENAI_BASE_URL": "https://api.deepseek.com",
  "OPENAI_MODEL": "deepseek-chat",
  "router": {
    "default": "openrouter,anthropic/claude-3.5-sonnet",
    "background": "openrouter,anthropic/claude-3-haiku",
    "think": "openrouter,anthropic/claude-3.5-sonnet",
    "longContext": "openrouter,anthropic/claude-3.5-sonnet",
    "longContextThreshold": 60000
  }
}
```

## [🔧 Routing Configuration](#-routing-configuration)

### [Default Routing Scenarios](#default-routing-scenarios)

```
{
  "router": {
    "default": "openrouter,anthropic/claude-3.5-sonnet",
    "background": "openrouter,anthropic/claude-3-haiku",
    "think": "openrouter,anthropic/claude-3.5-sonnet",
    "longContext": "openrouter,anthropic/claude-3.5-sonnet",
    "webSearch": "openrouter,anthropic/claude-3.5-sonnet:online"
  }
}
```

### [Dynamic Model Switching](#dynamic-model-switching)

Use the `/model` command in Claude Code to dynamically switch models:

```
/model openrouter,anthropic/claude-3.5-sonnet
```

## [⚡ Advanced Features](#-advanced-features)

### [Custom Router](#custom-router)

Create custom routing logic:

```
// $HOME/.claude-code-router/custom-router.js
module.exports = async function router(req, config) {
  const userMessage = req.body.messages.find((m) => m.role === "user")?.content;

  if (userMessage && userMessage.includes("explain this code")) {
    return "openrouter,anthropic/claude-3.5-sonnet";
  }

  return null; // Fallback to default router
};
```

### [Subagent Routing](#subagent-routing)

Specify a particular model at the beginning of subagent prompts:

```
<CCR-SUBAGENT-MODEL>openrouter,anthropic/claude-3.5-sonnet</CCR-SUBAGENT-MODEL>
Please help me analyze this code snippet for potential optimizations...
```

### [GitHub Actions Integration](#github-actions-integration)

Integrate Claude Code Router into CI/CD pipelines:

```
name: Claude Code

on:
  issue_comment:
    types: [created]

jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Prepare Environment
        run: |
          curl -fsSL https://bun.sh/install | bash
          mkdir -p $HOME/.claude-code-router
          cat << 'EOF' > $HOME/.claude-code-router/config.json
          {
            "log": true,
            "OPENAI_API_KEY": "${{ secrets.OPENAI_API_KEY }}",
            "OPENAI_BASE_URL": "https://api.deepseek.com",
            "OPENAI_MODEL": "deepseek-chat"
          }
          EOF

      - name: Start Claude Code Router
        run: |
          nohup ~/.bun/bin/bunx @musistudio/claude-code-router@1.0.8 start &

      - name: Run Claude Code
        uses: anthropics/claude-code-action@beta
        env:
          ANTHROPIC_BASE_URL: http://localhost:3456
        with:
          anthropic_api_key: "any-string-is-ok"
```

## [🎯 Use Cases](#-use-cases)

### [1\. Cost Optimization](#1-cost-optimization)

*   Use smaller models for simple tasks
*   Run tasks during off-peak hours
*   Reduce API call costs through intelligent routing

### [2\. Performance Optimization](#2-performance-optimization)

*   Use dedicated models for long context tasks
*   Use high-performance models for reasoning tasks
*   Use lightweight models for background tasks

### [3\. Multi-Provider Support](#3-multi-provider-support)

*   Avoid single provider limitations
*   Leverage advantages of different providers
*   Improve service availability

## [💡 Best Practices](#-best-practices)

### [Configuration Recommendations](#configuration-recommendations)

1.  **Set appropriate thresholds**: Adjust longContextThreshold based on project requirements
2.  **Monitor usage**: Enable logging to monitor model usage
3.  **Regular updates**: Keep tools and configurations up to date
4.  **Test configurations**: Thoroughly test configurations before production

### [Security Considerations](#security-considerations)

1.  **API key management**: Store sensitive information using environment variables
2.  **Access control**: Limit router access permissions
3.  **Log security**: Avoid logging sensitive information

## [🤝 Community Support](#-community-support)

### [Sponsorship Support](#sponsorship-support)

The project supports multiple sponsorship methods:

*   Ko-fi
*   PayPal
*   Alipay
*   WeChat Pay

### [Contribution Guidelines](#contribution-guidelines)

Welcome contributions through:

1.  Submit Issues to report problems
2.  Create Pull Requests to contribute code
3.  Share usage experiences and best practices
4.  Sponsor project development

## [📝 Summary](#-summary)

Claude Code Router provides powerful routing capabilities for Claude Code, enabling you to:

*   **Flexibly select models**: Choose appropriate AI models based on task requirements
*   **Optimize costs**: Reduce API call costs through intelligent routing
*   **Improve performance**: Select optimal models for different task types
*   **Enhance availability**: Support multiple AI providers to avoid single points of failure

This tool is particularly suitable for teams and individual developers who need to handle large amounts of AI interactions, significantly improving development efficiency and cost-effectiveness.

* * *

_Claude Code Router is an indispensable tool in the Claude Code ecosystem, providing developers with flexible, efficient, and economical AI model routing solutions._

[

CCPM: Claude Code Project Manager

A revolutionary project management system for Claude Code that uses GitHub Issues and Git worktrees for parallel agent execution. Transform PRDs into shipped code with full traceability and unprecedented development velocity.

](/docs/en/tools/ccpm-claude-code-project-manager)[

Claude Code Templates: CLI Tool for Configuring and Monitoring Claude Code

A comprehensive CLI tool for configuring and monitoring Claude Code with framework-specific commands, real-time analytics dashboard, and individual component installation.

](/docs/en/tools/claude-code-templates)

### On this page

[Claude Code Router](#claude-code-router)[🚀 Core Features](#-core-features)[Multi-Model Intelligent Routing](#multi-model-intelligent-routing)[Multi-Provider Support](#multi-provider-support)[Transformer System](#transformer-system)[📦 Installation and Configuration](#-installation-and-configuration)[Quick Start](#quick-start)[Basic Configuration](#basic-configuration)[🔧 Routing Configuration](#-routing-configuration)[Default Routing Scenarios](#default-routing-scenarios)[Dynamic Model Switching](#dynamic-model-switching)[⚡ Advanced Features](#-advanced-features)[Custom Router](#custom-router)[Subagent Routing](#subagent-routing)[GitHub Actions Integration](#github-actions-integration)[🎯 Use Cases](#-use-cases)[1\. Cost Optimization](#1-cost-optimization)[2\. Performance Optimization](#2-performance-optimization)[3\. Multi-Provider Support](#3-multi-provider-support)[💡 Best Practices](#-best-practices)[Configuration Recommendations](#configuration-recommendations)[Security Considerations](#security-considerations)[🤝 Community Support](#-community-support)[Sponsorship Support](#sponsorship-support)[Contribution Guidelines](#contribution-guidelines)[📝 Summary](#-summary)