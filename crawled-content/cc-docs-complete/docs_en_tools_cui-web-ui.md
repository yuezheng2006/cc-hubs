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

# CUI: Claude Code Web UI

A modern web UI for Claude Code agents that allows you to access Claude Code anywhere in your browser with parallel background agents and task management.

# [CUI: Claude Code Web UI](#cui-claude-code-web-ui)

> **⭐ GitHub**: [wbopan/cui](https://github.com/wbopan/cui) (455 stars)

A modern web UI for Claude Code agents. Start the server and access Claude Code anywhere in your browser.

## [Highlights](#highlights)

*   **Modern Design**: Polished, responsive UI that works anywhere
*   **Parallel Background Agents**: Stream multiple sessions simultaneously
*   **Manage Tasks**: Access all your conversations and fork/resume/archive them
*   **Claude Code Parity**: Familiar autocompletion and interaction with CLI
*   **Push Notifications**: Get notified when your agents are finished
*   **Dictation**: Precise dictation powered by Gemini 2.5 Flash

## [Getting Started](#getting-started)

1.  Ensure you're logged into Claude Code or have a valid Anthropic API key.
2.  With Node.js >= 20.19.0, start the server:
    
    ```
    npx cui-server
    ```
    
    or install it globally:
    
    ```
    npm install -g cui-server
    ```
    
3.  Open `http://localhost:3001/#your-token` in your browser (the token will be displayed in the cui-server command output).
4.  (Optional) Configure the settings for notifications and dictation.

## [Usage](#usage)

### [Tasks](#tasks)

*   **Start a New Task**  
    cui automatically scans your existing Claude Code history in `~/.claude/` and displays it on the home page, allowing you to resume any of your previous tasks. The dropdown menu in the input area shows all your previous working directories.
    
*   **Fork a Task**  
    To create a branch from an existing task (only supported for tasks started from cui), navigate to the "History" tab on the home page, find the session you want to fork, and resume it with new messages.
    
*   **Manage Tasks**  
    Feel free to close the page after starting a task—it will continue running in the background. When running multiple tasks (started from cui), you can check their status in the "Tasks" tab. You can also archive tasks by clicking the "Archive" button. Archived tasks remain accessible in the "Archived" tab.
    

### [Dictation](#dictation)

cui uses Gemini 2.5 Flash to provide highly accurate dictation, particularly effective for long sentences. To enable this feature, you'll need a Gemini API key with generous free-tier usage. Set the `GOOGLE_API_KEY` environment variable before starting the server. Note that using this feature will share your audio data with Google.

### [Notifications](#notifications)

You can receive push notifications when your task is finished or when Claude is waiting for your permission to use tools. Notifications are sent using ntfy. To receive them, install ntfy on any of your devices and subscribe to the topic (see settings).

### [Keyboard Shortcuts](#keyboard-shortcuts)

More keyboard shortcuts are coming. Currently available:

*   `Enter`: Enter a new line
*   `Command/Ctrl + Enter`: Send message
*   `/`: List all commands
*   `@`: List all files in the current working directory

All inline syntaxes like `/init` or `@file.txt` are supported just like in the CLI.

### [Remote Access](#remote-access)

1.  Open `~/.cui/config.json` to set the `server.host` (0.0.0.0) and `server.port`. Alternatively, you can use `--host` and `--port` flags when starting the server.
2.  Ensure you use a secure auth token if accessing the server from outside your local network. The auth token is generated when you start the server and can be changed in the `~/.cui/config.json` file.
3.  Recommended: Use HTTPS to access the server. You can use a reverse proxy like Caddy to set this up. On iOS, the dictation feature is only available when using HTTPS.

### [Configuration](#configuration)

All configuration and data are stored in `~/.cui/`.

*   `config.json` - Server settings
*   `session-info.json` - Session metadata
*   `preferences.json` - User preferences

To uninstall cui, simply delete the `~/.cui/` directory and remove the package with `npm uninstall -g cui-server`.

## [Key Features](#key-features)

### [Web-Based Interface](#web-based-interface)

*   **Browser Access**: Access Claude Code from any device with a web browser
*   **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
*   **Modern UI**: Clean, intuitive interface that matches modern web standards

### [Multi-Session Management](#multi-session-management)

*   **Parallel Processing**: Run multiple Claude Code sessions simultaneously
*   **Background Execution**: Tasks continue running even when you close the browser
*   **Session History**: Automatically scans and displays your existing Claude Code history

### [Advanced Capabilities](#advanced-capabilities)

*   **Voice Dictation**: Powered by Gemini 2.5 Flash for accurate speech-to-text
*   **Push Notifications**: Real-time alerts when tasks complete or require attention
*   **Remote Access**: Secure access from anywhere with proper configuration

### [CLI Parity](#cli-parity)

*   **Familiar Commands**: All CLI commands and shortcuts work in the web interface
*   **File Operations**: Full support for file browsing and manipulation
*   **Tool Integration**: Complete access to all Claude Code tools and capabilities

## [Use Cases](#use-cases)

### [For Developers](#for-developers)

*   **Remote Development**: Access Claude Code from any device or location
*   **Team Collaboration**: Share sessions and collaborate with team members
*   **Mobile Development**: Use Claude Code on tablets and mobile devices

### [For Teams](#for-teams)

*   **Centralized Access**: Provide web-based access to Claude Code for team members
*   **Session Sharing**: Easily share and resume collaborative sessions
*   **Monitoring**: Track team usage and session activity

### [For Organizations](#for-organizations)

*   **Enterprise Deployment**: Deploy CUI on internal servers for secure access
*   **User Management**: Control access and permissions through configuration
*   **Integration**: Integrate with existing development workflows and tools

## [Technical Requirements](#technical-requirements)

*   **Node.js**: >= 20.19.0
*   **Claude Code**: Must be installed and configured
*   **Network Access**: For remote access and notifications
*   **Optional**: Gemini API key for dictation features

## [Contributing](#contributing)

The best way to contribute is to suggest improvements or report bugs in the issues and give us a star ⭐!

Before submitting a PR, please make sure you (or your fellow AI) have read CONTRIBUTING.md.

## [License](#license)

Apache-2.0 license

* * *

## [来源和致谢](#来源和致谢)

本文基于 [wbopan/cui](https://github.com/wbopan/cui) GitHub 仓库整理而成。

**原作者**: wbopan  
**原始链接**: [https://github.com/wbopan/cui](https://github.com/wbopan/cui)  
**许可证**: Apache-2.0 License

感谢 wbopan 创建了这个优秀的 Claude Code Web UI，为 AI 辅助开发提供了现代化的浏览器界面和强大的多会话管理能力。

[

Claude Code Templates: CLI Tool for Configuring and Monitoring Claude Code

A comprehensive CLI tool for configuring and monitoring Claude Code with framework-specific commands, real-time analytics dashboard, and individual component installation.

](/docs/en/tools/claude-code-templates)[

Happy: Mobile and Web Client for Claude Code

A comprehensive mobile and web client that brings Claude Code to your phone with end-to-end encryption, voice control, and multi-session support. Use Claude Code from anywhere with zero workflow disruption.

](/docs/en/tools/happy-mobile-claude-code-client)

### On this page

[CUI: Claude Code Web UI](#cui-claude-code-web-ui)[Highlights](#highlights)[Getting Started](#getting-started)[Usage](#usage)[Tasks](#tasks)[Dictation](#dictation)[Notifications](#notifications)[Keyboard Shortcuts](#keyboard-shortcuts)[Remote Access](#remote-access)[Configuration](#configuration)[Key Features](#key-features)[Web-Based Interface](#web-based-interface)[Multi-Session Management](#multi-session-management)[Advanced Capabilities](#advanced-capabilities)[CLI Parity](#cli-parity)[Use Cases](#use-cases)[For Developers](#for-developers)[For Teams](#for-teams)[For Organizations](#for-organizations)[Technical Requirements](#technical-requirements)[Contributing](#contributing)[License](#license)[来源和致谢](#来源和致谢)