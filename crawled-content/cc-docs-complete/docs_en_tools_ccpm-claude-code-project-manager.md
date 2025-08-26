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

# CCPM: Claude Code Project Manager

A revolutionary project management system for Claude Code that uses GitHub Issues and Git worktrees for parallel agent execution. Transform PRDs into shipped code with full traceability and unprecedented development velocity.

# [CCPM: Claude Code Project Manager](#ccpm-claude-code-project-manager)

> **⭐ GitHub**: [automazeio/ccpm](https://github.com/automazeio/ccpm) - Project management system for Claude Code

CCPM (Claude Code Project Manager) is a battle-tested system that revolutionizes AI-assisted development by transforming chaotic coding sessions into structured, trackable workflows. Stop losing context, stop blocking on tasks, and stop shipping bugs with this comprehensive project management framework designed specifically for Claude Code.

## [🚀 What is CCPM?](#-what-is-ccpm)

CCPM is a Claude Code workflow system that enables:

*   **Spec-driven development** - Every line of code traces back to specifications
*   **Parallel agent execution** - Multiple AI agents working simultaneously
*   **GitHub Issues integration** - Native collaboration with your existing tools
*   **Full traceability** - Complete audit trail from PRD to production
*   **Context preservation** - Never lose project state between sessions

## [🎯 Core Philosophy: No Vibe Coding](#-core-philosophy-no-vibe-coding)

> **Every line of code must trace back to a specification.**

CCPM follows a strict 5-phase discipline:

1.  **🧠 Brainstorm** - Think deeper than comfortable
2.  **📝 Document** - Write specs that leave nothing to interpretation
3.  **📐 Plan** - Architect with explicit technical decisions
4.  **⚡ Execute** - Build exactly what was specified
5.  **📊 Track** - Maintain transparent progress at every step

No shortcuts. No assumptions. No regrets.

## [🔥 What Makes This Different?](#-what-makes-this-different)

Traditional Development

Claude Code PM System

Context lost between sessions

**Persistent context** across all work

Serial task execution

**Parallel agents** on independent tasks

"Vibe coding" from memory

**Spec-driven** with full traceability

Progress hidden in branches

**Transparent audit trail** in GitHub

Manual task coordination

**Intelligent prioritization** with `/pm:next`

## [🏗️ System Architecture](#️-system-architecture)

```
.claude/
├── CLAUDE.md          # Always-on instructions
├── agents/            # Task-oriented agents
├── commands/          # Command definitions
│   ├── context/       # Create, update, and prime context
│   ├── pm/            # Project management commands
│   └── testing/       # Prime and execute tests
├── context/           # Project-wide context files
├── epics/             # PM's local workspace
│   └── [epic-name]/   # Epic and related tasks
│       ├── epic.md    # Implementation plan
│       ├── [#].md     # Individual task files
│       └── updates/   # Work-in-progress updates
├── prds/              # PRD files
├── rules/             # Rule files for reference
└── scripts/           # Script files
```

## [📋 The 5-Phase Workflow](#-the-5-phase-workflow)

### [1\. Product Planning Phase](#1-product-planning-phase)

```
/pm:prd-new feature-name
```

Launches comprehensive brainstorming to create a Product Requirements Document capturing vision, user stories, success criteria, and constraints.

**Output:** `.claude/prds/feature-name.md`

### [2\. Implementation Planning Phase](#2-implementation-planning-phase)

```
/pm:prd-parse feature-name
```

Transforms PRD into a technical implementation plan with architectural decisions, technical approach, and dependency mapping.

**Output:** `.claude/epics/feature-name/epic.md`

### [3\. Task Decomposition Phase](#3-task-decomposition-phase)

```
/pm:epic-decompose feature-name
```

Breaks epic into concrete, actionable tasks with acceptance criteria, effort estimates, and parallelization flags.

**Output:** `.claude/epics/feature-name/[task].md`

### [4\. GitHub Synchronization](#4-github-synchronization)

```
/pm:epic-sync feature-name
# Or for confident workflows:
/pm:epic-oneshot feature-name
```

Pushes epic and tasks to GitHub as issues with appropriate labels and relationships.

### [5\. Execution Phase](#5-execution-phase)

```
/pm:issue-start 1234  # Launch specialized agent
/pm:issue-sync 1234   # Push progress updates
/pm:next             # Get next priority task
```

Specialized agents implement tasks while maintaining progress updates and an audit trail.

## [⚡ Parallel Execution Revolution](#-parallel-execution-revolution)

### [The Math of Velocity](#the-math-of-velocity)

**Traditional Approach:**

*   Epic with 3 issues
*   Sequential execution
*   Single-threaded development

**CCPM System:**

*   Same epic with 3 issues
*   Each issue splits into ~4 parallel streams
*   **12 agents working simultaneously**

### [Issues Aren't Atomic](#issues-arent-atomic)

A single "Implement user authentication" issue becomes:

*   **Agent 1**: Database tables and migrations
*   **Agent 2**: Service layer and business logic
*   **Agent 3**: API endpoints and middleware
*   **Agent 4**: UI components and forms
*   **Agent 5**: Test suites and documentation

All running **simultaneously** in the same worktree.

### [Context Optimization](#context-optimization)

**Traditional single-thread approach:**

*   Main conversation carries ALL implementation details
*   Context window fills with schemas, API code, UI components
*   Eventually hits context limits and loses coherence

**Parallel agent approach:**

*   Main thread stays clean and strategic
*   Each agent handles its own context in isolation
*   Implementation details never pollute main conversation
*   Main thread maintains oversight without drowning in code

## [🤝 Why GitHub Issues?](#-why-github-issues)

Most Claude Code workflows operate in isolation – a single developer working with AI in their local environment. CCPM unlocks true collaboration:

### [**True Team Collaboration**](#true-team-collaboration)

*   Multiple Claude instances work on same project simultaneously
*   Human developers see AI progress in real-time through issue comments
*   Team members can jump in anywhere – context is always visible
*   Managers get transparency without interrupting flow

### [**Seamless Human-AI Handoffs**](#seamless-human-ai-handoffs)

*   AI can start a task, human can finish it (or vice versa)
*   Progress updates visible to everyone, not trapped in chat logs
*   Code reviews happen naturally through PR comments
*   No "what did the AI do?" meetings

### [**Single Source of Truth**](#single-source-of-truth)

*   No separate databases or project management tools
*   Issue state is the project state
*   Comments are the audit trail
*   Labels provide organization

## [🛠️ Key Commands](#️-key-commands)

### [Initial Setup](#initial-setup)

*   `/pm:init` - Install dependencies and configure GitHub

### [PRD Management](#prd-management)

*   `/pm:prd-new` - Launch brainstorming for new product requirement
*   `/pm:prd-parse` - Convert PRD to implementation epic
*   `/pm:prd-list` - List all PRDs
*   `/pm:prd-status` - Show PRD implementation status

### [Epic Management](#epic-management)

*   `/pm:epic-decompose` - Break epic into task files
*   `/pm:epic-sync` - Push epic and tasks to GitHub
*   `/pm:epic-oneshot` - Decompose and sync in one command
*   `/pm:epic-show` - Display epic and its tasks

### [Issue Execution](#issue-execution)

*   `/pm:issue-start` - Begin work with specialized agent
*   `/pm:issue-sync` - Push updates to GitHub
*   `/pm:issue-status` - Check issue status
*   `/pm:next` - Show next priority issue with epic context

### [Workflow Commands](#workflow-commands)

*   `/pm:status` - Overall project dashboard
*   `/pm:standup` - Daily standup report
*   `/pm:sync` - Full bidirectional sync with GitHub

## [📊 Proven Results](#-proven-results)

Teams using CCPM report:

*   **89% less time** lost to context switching
*   **5-8 parallel tasks** vs 1 previously
*   **75% reduction** in bug rates due to detailed task breakdown
*   **Up to 3x faster** feature delivery based on complexity

## [🚀 Quick Start (2 minutes)](#-quick-start-2-minutes)

### [1\. Clone and Setup](#1-clone-and-setup)

```
cd path/to/your/project/
git clone https://github.com/automazeio/ccpm.git .
```

### [2\. Initialize the System](#2-initialize-the-system)

```
/pm:init
```

This command will:

*   Install GitHub CLI (if needed)
*   Authenticate with GitHub
*   Install gh-sub-issue extension for parent-child relationships
*   Create required directories
*   Update .gitignore

### [3\. Create CLAUDE.md](#3-create-claudemd)

```
/init include rules from .claude/CLAUDE.md
```

### [4\. Prime the System](#4-prime-the-system)

```
/context:create
```

### [5\. Start Your First Feature](#5-start-your-first-feature)

```
/pm:prd-new your-feature-name
```

## [💡 Example Workflow](#-example-workflow)

```
# Start a new feature
/pm:prd-new memory-system

# Review and refine the PRD...

# Create implementation plan
/pm:prd-parse memory-system

# Review the epic...

# Break into tasks and push to GitHub
/pm:epic-oneshot memory-system
# Creates issues: #1234 (epic), #1235, #1236 (tasks)

# Start development on a task
/pm:issue-start 1235
# Agent begins work, maintains local progress

# Sync progress to GitHub
/pm:issue-sync 1235
# Updates posted as issue comments

# Check overall status
/pm:epic-show memory-system
```

## [🔧 Technical Features](#-technical-features)

### [GitHub Integration](#github-integration)

*   Uses **gh-sub-issue extension** for proper parent-child relationships
*   Falls back to task lists if extension not installed
*   Epic issues track sub-task completion automatically
*   Labels provide organization (`epic:feature`, `task:feature`)

### [File Management](#file-management)

*   Tasks start as `001.md`, `002.md` during decomposition
*   After GitHub sync, renamed to `{issue-id}.md` (e.g., `1234.md`)
*   Makes navigation easy: issue #1234 = file `1234.md`

### [Design Philosophy](#design-philosophy)

*   Intentionally avoids GitHub Projects API complexity
*   All commands operate on local files first for speed
*   Synchronization with GitHub is explicit and controlled
*   Worktrees provide clean git isolation for parallel work

## [🎯 Who Should Use CCPM?](#-who-should-use-ccpm)

### [**Solo Developers**](#solo-developers)

*   Maintain context across long development sessions
*   Break complex features into manageable tasks
*   Track progress with professional discipline

### [**Small Teams**](#small-teams)

*   Coordinate multiple developers and AI agents
*   Maintain visibility into AI-assisted development
*   Scale beyond single-person Claude Code workflows

### [**Enterprise Teams**](#enterprise-teams)

*   Ensure compliance and traceability requirements
*   Integrate AI development with existing GitHub workflows
*   Maintain professional standards for AI-assisted code

## [🔮 The Future of AI Project Management](#-the-future-of-ai-project-management)

CCPM represents a paradigm shift from treating AI as a coding assistant to treating it as a **development team member**. By providing structure, context, and collaboration protocols, CCPM enables AI agents to work at the speed of thought while maintaining human oversight and professional standards.

This isn't just project management – it's the foundation for **scalable AI-assisted development** that can grow from solo projects to enterprise-level software delivery.

## [🤝 Community and Support](#-community-and-support)

CCPM was developed at [Automaze](https://automaze.io/) by developers who ship, for developers who ship.

### [**Getting Help**](#getting-help)

*   **GitHub Issues**: [Report bugs or request features](https://github.com/automazeio/ccpm/issues)
*   **Documentation**: Comprehensive command reference included
*   **Community**: Follow [@aroussi](https://x.com/aroussi) for updates and tips

### [**Contributing**](#contributing)

*   **Open Source**: MIT licensed with clear architecture
*   **Battle-Tested**: Used in production by development teams
*   **Extensible**: Modular command system for customization

* * *

**Ready to transform your Claude Code workflow?** Install CCPM today and experience the power of structured, parallel AI-assisted development.

*   ⭐ [Star on GitHub](https://github.com/automazeio/ccpm)
*   🚀 [Get Started Now](https://github.com/automazeio/ccpm#get-started-now)
*   🐦 [Follow for Updates](https://x.com/aroussi)

[

Tools

Explore tools and utilities for ClaudeCode

](/docs/en/tools)[

Claude Code Router

Powerful Claude Code routing tool with multi-model intelligent routing and cost optimization

](/docs/en/tools/claude-code-router)

### On this page

[CCPM: Claude Code Project Manager](#ccpm-claude-code-project-manager)[🚀 What is CCPM?](#-what-is-ccpm)[🎯 Core Philosophy: No Vibe Coding](#-core-philosophy-no-vibe-coding)[🔥 What Makes This Different?](#-what-makes-this-different)[🏗️ System Architecture](#️-system-architecture)[📋 The 5-Phase Workflow](#-the-5-phase-workflow)[1\. Product Planning Phase](#1-product-planning-phase)[2\. Implementation Planning Phase](#2-implementation-planning-phase)[3\. Task Decomposition Phase](#3-task-decomposition-phase)[4\. GitHub Synchronization](#4-github-synchronization)[5\. Execution Phase](#5-execution-phase)[⚡ Parallel Execution Revolution](#-parallel-execution-revolution)[The Math of Velocity](#the-math-of-velocity)[Issues Aren't Atomic](#issues-arent-atomic)[Context Optimization](#context-optimization)[🤝 Why GitHub Issues?](#-why-github-issues)[**True Team Collaboration**](#true-team-collaboration)[**Seamless Human-AI Handoffs**](#seamless-human-ai-handoffs)[**Single Source of Truth**](#single-source-of-truth)[🛠️ Key Commands](#️-key-commands)[Initial Setup](#initial-setup)[PRD Management](#prd-management)[Epic Management](#epic-management)[Issue Execution](#issue-execution)[Workflow Commands](#workflow-commands)[📊 Proven Results](#-proven-results)[🚀 Quick Start (2 minutes)](#-quick-start-2-minutes)[1\. Clone and Setup](#1-clone-and-setup)[2\. Initialize the System](#2-initialize-the-system)[3\. Create CLAUDE.md](#3-create-claudemd)[4\. Prime the System](#4-prime-the-system)[5\. Start Your First Feature](#5-start-your-first-feature)[💡 Example Workflow](#-example-workflow)[🔧 Technical Features](#-technical-features)[GitHub Integration](#github-integration)[File Management](#file-management)[Design Philosophy](#design-philosophy)[🎯 Who Should Use CCPM?](#-who-should-use-ccpm)[**Solo Developers**](#solo-developers)[**Small Teams**](#small-teams)[**Enterprise Teams**](#enterprise-teams)[🔮 The Future of AI Project Management](#-the-future-of-ai-project-management)[🤝 Community and Support](#-community-and-support)[**Getting Help**](#getting-help)[**Contributing**](#contributing)