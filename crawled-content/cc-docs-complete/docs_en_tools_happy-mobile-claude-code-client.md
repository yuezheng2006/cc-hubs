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

# Happy: Mobile and Web Client for Claude Code

A comprehensive mobile and web client that brings Claude Code to your phone with end-to-end encryption, voice control, and multi-session support. Use Claude Code from anywhere with zero workflow disruption.

# [Happy: Mobile and Web Client for Claude Code](#happy-mobile-and-web-client-for-claude-code)

> **⭐ GitHub**: [slopus/happy](https://github.com/slopus/happy) (466 stars)

Happy is a revolutionary mobile and web client that extends Claude Code beyond your desktop, enabling you to access, monitor, and control your AI coding sessions from anywhere. With end-to-end encryption, voice control, and multi-session support, Happy transforms how developers interact with Claude Code.

## [🚀 What is Happy?](#-what-is-happy)

Happy is an open-source solution that allows you to:

*   **Access Claude Code on mobile** - iOS, Android, and web platforms
*   **Control multiple sessions** - Run several Claude Code instances simultaneously
*   **Voice interaction** - Hands-free coding with real-time voice execution
*   **End-to-end encryption** - Your code never leaves your devices unencrypted
*   **Zero workflow disruption** - Works with your existing tools and environments

## [🎯 Key Features](#-key-features)

### [📱 Multi-Platform Access](#-multi-platform-access)

*   **iOS App**: [Download from App Store](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505)
*   **Android App**: [Download from Google Play](https://play.google.com/store/apps/details?id=com.ex3ndr.happy)
*   **Web App**: [Launch Web App](https://app.happy.engineering/)
*   **Desktop**: Works seamlessly with your existing Claude Code setup

### [🔒 Security & Privacy](#-security--privacy)

*   **End-to-end encryption** - Messages encrypted between your devices
*   **No telemetry or tracking** - Your data stays private
*   **Open source** - MIT licensed, auditable codebase
*   **Local processing** - Runs on your hardware

### [🎙️ Voice Control](#️-voice-control)

*   **Real-time voice execution** - Speak commands and watch them execute
*   **Hands-free coding** - True voice-to-action, not just transcription
*   **Voice agent** - Advanced voice interaction beyond simple dictation

### [🔄 Multi-Session Management](#-multi-session-management)

*   **Parallel sessions** - Run multiple Claude Code instances
*   **Context switching** - Switch between frontend, backend, and DevOps tasks
*   **Session continuity** - Resume sessions across devices
*   **Smart notifications** - Get alerted when input is needed

## [🛠️ How It Works](#️-how-it-works)

Happy uses a three-component architecture:

### [1\. CLI Program (`happy`)](#1-cli-program-happy)

```
npm install -g happy-coder
happy
```

The CLI runs on your computer, wrapping Claude Code and encrypting session data before sending it to the relay server.

### [2\. Mobile/Web App](#2-mobileweb-app)

The client apps receive encrypted data from the server and provide the interface for monitoring and controlling Claude Code sessions.

### [3\. Relay Server](#3-relay-server)

A secure server that passes encrypted messages between your computer and mobile devices without being able to read the content.

## [📦 Quick Start](#-quick-start)

### [Step 1: Install CLI](#step-1-install-cli)

```
npm install -g happy-coder
```

### [Step 2: Download Mobile App](#step-2-download-mobile-app)

*   [iOS App Store](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505)
*   [Google Play Store](https://play.google.com/store/apps/details?id=com.ex3ndr.happy)
*   [Web App](https://app.happy.engineering/)

### [Step 3: Start Using](#step-3-start-using)

```
# Instead of 'claude', run 'happy'
happy
```

## [🔥 Why Choose Happy?](#-why-choose-happy)

### [**Zero Workflow Disruption**](#zero-workflow-disruption)

Keep using your favorite tools, editors, and development environments exactly as before. Happy integrates without requiring changes to your existing workflow.

### [**Mobile-First Design**](#mobile-first-design)

Unlike desktop-only solutions, Happy brings the full Claude Code experience to mobile devices with an interface optimized for touch and voice interaction.

### [**True Voice Coding**](#true-voice-coding)

Go beyond dictation with intelligent voice commands that understand coding context and execute actions in real-time.

### [**Multi-Project Management**](#multi-project-management)

Handle multiple projects simultaneously with separate Claude Code sessions, each maintaining its own context and state.

### [**Community-Driven**](#community-driven)

Built by engineers who needed mobile access to their AI coding sessions, with an active community and continuous improvements.

## [🏗️ Project Components](#️-project-components)

Happy is part of a larger ecosystem:

*   **[happy-cli](https://github.com/slopus/happy-cli)** - Command-line interface
*   **[happy-server](https://github.com/slopus/happy-server)** - Backend server for encrypted sync
*   **happy-coder** - Mobile and web client (main repository)

## [📱 Use Cases](#-use-cases)

### [**On-the-Go Monitoring**](#on-the-go-monitoring)

Check how Claude is progressing on your projects during lunch breaks or commutes.

### [**Voice-Driven Development**](#voice-driven-development)

Code hands-free while walking, exercising, or in situations where typing isn't practical.

### [**Multi-Device Workflows**](#multi-device-workflows)

Start a coding session on your desktop, continue on mobile, and switch back seamlessly.

### [**Team Collaboration**](#team-collaboration)

Share encrypted session links with team members for collaborative debugging and code review.

### [**Remote Development**](#remote-development)

Access and control your development environment from anywhere with an internet connection.

## [🎥 Demo and Resources](#-demo-and-resources)

*   **[See a Demo](https://youtu.be/GCS0OG9QMSE)** - Watch Happy in action
*   **[Official Website](https://happy.engineering/)** - Learn more about features
*   **[GitHub Repository](https://github.com/slopus/happy)** - Source code and documentation

## [🤝 Community and Support](#-community-and-support)

Happy is developed by a team of engineers across Bay Area coffee shops and hacker houses, born from the real need to check on Claude Code progress while away from keyboards.

### [**Contributing**](#contributing)

*   **Open source** - MIT licensed with a well-organized codebase
*   **Friendly community** - Welcoming to contributors of all levels
*   **Active development** - Regular updates and feature additions

### [**Getting Help**](#getting-help)

*   **GitHub Issues** - [Report bugs or request features](https://github.com/slopus/happy/issues)
*   **Documentation** - Comprehensive setup and usage guides
*   **Community** - Active developer community for support

## [🔮 The Future of Mobile AI Development](#-the-future-of-mobile-ai-development)

Happy represents the next evolution in AI-assisted development tools, breaking the barrier between desktop and mobile development workflows. As AI coding assistants become more powerful, having mobile access becomes increasingly important for maintaining productivity and staying connected to your projects.

Whether you're a solo developer working on side projects or part of a team building the next big thing, Happy ensures you never lose touch with your AI coding assistant, no matter where you are.

* * *

**Ready to take Claude Code mobile?** Download Happy today and experience the freedom of AI-assisted coding from anywhere.

*   📱 [iOS App](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505)
*   🤖 [Android App](https://play.google.com/store/apps/details?id=com.ex3ndr.happy)
*   🌐 [Web App](https://app.happy.engineering/)
*   ⭐ [Star on GitHub](https://github.com/slopus/happy)

[

CUI: Claude Code Web UI

A modern web UI for Claude Code agents that allows you to access Claude Code anywhere in your browser with parallel background agents and task management.

](/docs/en/tools/cui-web-ui)[

Claude Code Hook: Preventing敷衍性回复

A hook script for Claude Code to prevent敷衍性回复, improving conversation quality by detecting and modifying 'you are right' expressions

](/docs/en/tools/you-are-not-right-hook)

### On this page

[Happy: Mobile and Web Client for Claude Code](#happy-mobile-and-web-client-for-claude-code)[🚀 What is Happy?](#-what-is-happy)[🎯 Key Features](#-key-features)[📱 Multi-Platform Access](#-multi-platform-access)[🔒 Security & Privacy](#-security--privacy)[🎙️ Voice Control](#️-voice-control)[🔄 Multi-Session Management](#-multi-session-management)[🛠️ How It Works](#️-how-it-works)[1\. CLI Program (`happy`)](#1-cli-program-happy)[2\. Mobile/Web App](#2-mobileweb-app)[3\. Relay Server](#3-relay-server)[📦 Quick Start](#-quick-start)[Step 1: Install CLI](#step-1-install-cli)[Step 2: Download Mobile App](#step-2-download-mobile-app)[Step 3: Start Using](#step-3-start-using)[🔥 Why Choose Happy?](#-why-choose-happy)[**Zero Workflow Disruption**](#zero-workflow-disruption)[**Mobile-First Design**](#mobile-first-design)[**True Voice Coding**](#true-voice-coding)[**Multi-Project Management**](#multi-project-management)[**Community-Driven**](#community-driven)[🏗️ Project Components](#️-project-components)[📱 Use Cases](#-use-cases)[**On-the-Go Monitoring**](#on-the-go-monitoring)[**Voice-Driven Development**](#voice-driven-development)[**Multi-Device Workflows**](#multi-device-workflows)[**Team Collaboration**](#team-collaboration)[**Remote Development**](#remote-development)[🎥 Demo and Resources](#-demo-and-resources)[🤝 Community and Support](#-community-and-support)[**Contributing**](#contributing)[**Getting Help**](#getting-help)[🔮 The Future of Mobile AI Development](#-the-future-of-mobile-ai-development)