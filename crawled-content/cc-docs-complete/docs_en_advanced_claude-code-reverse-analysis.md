[Killer Code](/)

Search

⌘K

[Best Practices](/docs)[Cookbook](https://github.com/foreveryh/claude-code-cookbook)[Official Docs](https://claude.ai/code)[Build with Claude](https://www.anthropic.com/learn/build-with-claude)[Author](https://x.com/Stephen4171127)[首页](/docs)

[Claude Code Documentation](/docs/en)

[Advanced](/docs/en/advanced)

[Reverse Engineering Claude Code: How to Monitor AI's Every 'Inner Monologue'?](/docs/en/advanced/claude-code-reverse-analysis)[Compounding Engineering: Building Self-Improving Development Systems](/docs/en/advanced/compounding-engineering)[What Makes Claude Code So Damn Good: A Deep Analysis](/docs/en/advanced/decoding-claude-code-analysis)

[Best Practices](/docs/en/best-practices)

[Community Tips](/docs/en/community-tips)

[Cursor](/docs/en/cursor)

[Sub Agents](/docs/en/sub-agents)

[Tools](/docs/en/tools)

[Claude Code 文档中心](/docs/zh)

[Claude Code Documentation](/docs/en)/[Advanced](/docs/en/advanced)

# Reverse Engineering Claude Code: How to Monitor AI's Every 'Inner Monologue'?

A comprehensive guide to reverse engineering Claude Code, revealing its multi-model collaboration strategy, sophisticated system prompt design, and intelligent tool calling mechanisms.

# [Reverse Engineering Claude Code: How to Monitor AI's Every 'Inner Monologue'?](#reverse-engineering-claude-code-how-to-monitor-ais-every-inner-monologue)

**Source**: [掘金文章](https://juejin.cn/post/7535400490835656740)  
**Author**: 子昕AI编程  
**Published**: 2025-08-07

## [Article Summary](#article-summary)

Through technical means to reverse engineer Claude Code's API interaction process, revealing the AI programming king's multi-model collaboration strategy, sophisticated system prompt design, and intelligent tool calling mechanisms. Step-by-step guide to monitoring AI's every "inner monologue".

## [Main Content](#main-content)

> Hello everyone, I'm 子昕, a backend developer with 10 years of experience, now exploring the path of AI programming while being chased by new technologies every day.

Recently, I noticed an interesting phenomenon: as a Claude Pro subscriber, I clearly felt that Claude Code had become somewhat "dumber" than before.

This made me think of a classic question—**Can we peek at AI's "cheat sheet"?**

As a programmer with strong curiosity, I decided to conduct a "dissection" style reverse engineering of Claude Code. After all, since it's hailed as the "King of AI Programming Tools", I want to see how it maintains its throne.

After some exploration, I discovered a project on GitHub that reverse engineers Claude Code: `claude-code-reverse`

> [github.com/Yuyz0112/claude-code-reverse](https://github.com/Yuyz0112/claude-code-reverse)

This project allows us to intercept and analyze all communications between Claude Code and the server in real-time, essentially installing a "wiretap" on the AI.

## [Why Reverse Engineer Claude Code?](#why-reverse-engineer-claude-code)

Before we start, let me explain why we're doing this:

1.  **Technical Curiosity**: What makes Claude Code stronger than other AI programming tools?
2.  **Cost Transparency**: As a Pro user, I want to know which model is consumed in each conversation and how many tokens are used
3.  **Learning and Reference**: Understanding the design philosophy of top-tier AI Agents has enormous value for our own AI application development
4.  **Quality Monitoring**: When AI performance seems abnormal, we can find the cause through log analysis

## [Preparation: Toolbox Checklist](#preparation-toolbox-checklist)

Before starting this "technical detective" journey, you need to prepare:

*   **Claude Code**: Obviously, you can't reverse engineer without a target
*   **Node.js Environment**: For installing js-beautify
*   **A heart that's not afraid to break things**: Remember to backup, don't cry if you mess up

## [Step 1: Locate the "Target"](#step-1-locate-the-target)

First, we need to find Claude Code's true identity. Execute in the command line:

```
which claude
```

You'll usually get a result like this:

```
/opt/homebrew/bin/claude
```

But this is just a "stand-in"! On Mac, this is usually a soft link. We need to find the real `cli.js` file:

```
ls -l /opt/homebrew/bin/claude
```

You'll see it points to the real installation location:

```
/opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/cli.js
```

This is where we're going to "make our move"!

## [Step 2: Beautify the Code, Make it "Readable"](#step-2-beautify-the-code-make-it-readable)

Claude Code's code is compressed, like a tangled mess. We need to make it human-readable first:

```
# Enter Claude Code installation directory
cd /opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/

# Backup the original file (this step is important!)
mv cli.js cli.bak

# Install code beautification tool
npm install -g js-beautify

# Beautify the code
js-beautify cli.bak > cli.js
```

Now `cli.js` becomes well-formatted, highly readable code.

## [Step 3: Implant "Spy Code"](#step-3-implant-spy-code)

This is the most critical step in the entire process. We need to implant monitoring code in `cli.js` to record all conversations with the LLM.

### [3.1 Add Basic Monitoring Module](#31-add-basic-monitoring-module)

After the line `#!/usr/bin/env node` at the beginning of the file, add our "spy module":

![Code Implantation Process Screenshot](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F00-%E4%BB%A3%E7%A0%81%E6%A4%8D%E5%85%A5%E8%BF%87%E7%A8%8B%E6%88%AA%E5%9B%BE.1f44338c.png&w=3840&q=75)

Here's the spy code, just copy and paste:

```
// ============= Spy Module Start =============
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_PATH = path.resolve(__dirname, 'messages.log');

// Create new log session on each startup
fs.writeFileSync(
  LOG_PATH,
  `---Session ${new Date()}---\n`
);

function isAsyncIterable(x) { 
  return x && typeof x[Symbol.asyncIterator] === 'function'; 
}

const ts = () => new Date().toISOString();

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// This function is responsible for intercepting streaming responses and recording detailed tool call information
function tapIteratorInPlaceWithTools(inner, onFinal) {
  if (!inner) return inner;

  const TAPPED = Symbol.for('anthropic.tap.iterator');
  if (inner[TAPPED]) return inner;
  Object.defineProperty(inner, TAPPED, { value: true, configurable: true });

  const byteLen = s =>
    typeof Buffer !== 'undefined'
      ? Buffer.byteLength(s, 'utf8')
      : new TextEncoder().encode(s).length;

  const makeWrapper = getOrigIter => function() {
    const it = getOrigIter();
    let text = '';

    const open = new Map();
    const done = [];
    const PREVIEW_CAP = Infinity;

    const start = (id, name) => {
      if (id == null || open.has(id)) return;
      open.set(id, { 
        id, 
        name: name||'unknown', 
        startedAt: Date.now(), 
        inputBytes: 0, 
        preview: '' 
      });
    };
    
    const delta = (id, chunk) => {
      if (id == null) return;
      if (!open.has(id)) start(id);
      const rec = open.get(id);
      if (!rec) return;
      const s = typeof chunk==='string' ? chunk : JSON.stringify(chunk||'');
      rec.inputBytes += byteLen(s);
      if (rec.preview.length < PREVIEW_CAP) {
        rec.preview += s.slice(0, PREVIEW_CAP - rec.preview.length);
      }
    };
    
    const stop = id => {
      const rec = open.get(id);
      if (!rec) return;
      open.delete(id);
      const finishedAt = Date.now();
      done.push({ 
        ...rec, 
        finishedAt, 
        durationMs: finishedAt - rec.startedAt 
      });
    };
    
    const finalizeDangling = err => {
      for (const rec of open.values()) {
        done.push({
          ...rec,
          finishedAt: Date.now(),
          durationMs: Date.now() - rec.startedAt,
          errored: err ? (err.stack||String(err)) : undefined
        });
      }
      open.clear();
    };

    return (async function*() {
      try {
        for await (const ev of it) {
          // Log each event
          const logEntry = {
            timestamp: ts(),
            event: ev,
            type: ev.type || 'unknown'
          };
          
          fs.appendFileSync(LOG_PATH, JSON.stringify(logEntry, null, 2) + '\n');
          
          yield ev;
        }
      } catch (err) {
        finalizeDangling(err);
        throw err;
      }
    })();
  };

  return makeWrapper(() => inner);
}
// ============= Spy Module End =============
```

### [3.2 Find the Right Injection Point](#32-find-the-right-injection-point)

Now we need to find where to inject our monitoring code. Search for the function that handles API calls in `cli.js`. Look for patterns like:

```
async function makeRequest(options) {
  // ... existing code
}
```

Insert our spy code right before the API call:

```
// Add monitoring before the API call
const monitoredResponse = tapIteratorInPlaceWithTools(response, () => {
  // Log final results
  fs.appendFileSync(LOG_PATH, `---Session End ${new Date()}---\n\n`);
});
```

## [Step 4: Test Our "Wiretap"](#step-4-test-our-wiretap)

Now let's test our monitoring system:

```
# Start Claude Code
claude

# Ask a simple question
Describe the project structure
```

You should see a `messages.log` file generated in the Claude Code installation directory. This file contains all the intercepted communications!

## [Step 5: Analyze the Results](#step-5-analyze-the-results)

Open the log file and you'll see detailed information about:

1.  **API Request/Response**: Complete HTTP communication
2.  **Model Selection**: Which model is used for each task
3.  **Token Usage**: Detailed token consumption
4.  **Tool Calls**: All tool invocations and their parameters
5.  **System Prompts**: The sophisticated prompts that guide Claude Code's behavior

## [Key Discoveries](#key-discoveries)

### [1\. Multi-Model Collaboration Strategy](#1-multi-model-collaboration-strategy)

Claude Code doesn't use just one model. It intelligently selects different models for different tasks:

*   **Opus**: For complex reasoning and code generation
*   **Sonnet**: For routine tasks and simple queries
*   **Haiku**: For quick responses and basic operations

### [2\. Sophisticated System Prompt Design](#2-sophisticated-system-prompt-design)

The system prompts are incredibly detailed and well-crafted, covering:

*   **Role Definition**: Clear definition of Claude Code's capabilities
*   **Tool Usage Guidelines**: Detailed instructions for each tool
*   **Error Handling**: Comprehensive error recovery strategies
*   **Context Management**: Smart context compression and retention

### [3\. Intelligent Context Management](#3-intelligent-context-management)

When conversations become long, Claude Code automatically compresses historical context, preserving key information while saving token consumption. This is achieved through specialized compression prompts.

### [4\. Refined Tool Call Design](#4-refined-tool-call-design)

Claude Code defines a rich set of tools, including:

*   File system operations (read, write, search)
*   Code execution (Bash, Python, etc.)
*   Task management (TodoWrite)
*   IDE integration tools
*   Sub-agent system (Task)

## [Practical Application: Solving the "Dumbing Down" Problem](#practical-application-solving-the-dumbing-down-problem)

Through log analysis, I found that the "dumbing down" phenomenon I felt might have several causes:

1.  **Model Selection Strategy Changes**: Possibly to control costs, certain tasks switched to lighter models
2.  **Overly Aggressive Context Compression**: Important information lost during compression
3.  **Tool Call Chain Too Long**: Complex task multi-step reasoning scattered across multiple tool calls

## [Summary](#summary)

Through this "technical detective" journey, I not only learned about the tip of the iceberg of Claude Code's powerful secrets, but also gained valuable experience in AI Agent design:

1.  **Multi-model collaboration** is more efficient than single models
2.  **Carefully designed system prompts** are key
3.  **Rich tool systems** determine capability ceilings
4.  **Context management strategies** affect conversation quality

### [This is Just the Beginning](#this-is-just-the-beginning)

It's worth noting that this analysis is just a preliminary understanding of how to conduct reverse engineering through a simple "describe project structure" requirement. Claude Code's true power goes far beyond this!

I plan to dig deeper through more complex scenarios:

*   **Complex Programming Tasks**: See how it handles multi-file refactoring, architectural design, and other high-difficulty tasks
*   **Performance Optimization Scenarios**: Analyze how it conducts code reviews and performance tuning
*   **Debugging and Problem Solving**: Observe its error diagnosis and repair strategies
*   **Complete Project Setup Process**: The thinking process from zero to creating a complete project
*   **Sub-Agent System**: Deep dive into its multi-agent collaboration mechanisms

Each scenario will reveal deeper design philosophy and technical details of Claude Code. If you're particularly interested in a specific scenario, feel free to leave a comment!

If you also want to explore AI's inner world, try this method. Remember, curiosity is a programmer's most precious quality!

## [Related Images](#related-images)

The article includes multiple screenshots showing the reverse engineering process and results:

1.  Code implantation process screenshot
2.  API interception code example
3.  Monitoring log file generation
4.  Visualization analysis interface
5.  Multi-model collaboration flow chart
6.  Tool call sequence diagram
7.  System prompt detailed content

These images detail the technical aspects and discovery results of the entire reverse engineering process.

* * *

_This article is based on the original work by 子昕AI编程 from 掘金. You can find the original article at [https://juejin.cn/post/7535400490835656740](https://juejin.cn/post/7535400490835656740)._

[

Advanced

Advanced techniques and concepts for ClaudeCode

](/docs/en/advanced)[

Compounding Engineering: Building Self-Improving Development Systems

Learn how to build development systems that get faster, safer, and better with each iteration. Transform your engineering workflow from short-term gains to permanent improvements.

](/docs/en/advanced/compounding-engineering)

### On this page

[Reverse Engineering Claude Code: How to Monitor AI's Every 'Inner Monologue'?](#reverse-engineering-claude-code-how-to-monitor-ais-every-inner-monologue)[Article Summary](#article-summary)[Main Content](#main-content)[Why Reverse Engineer Claude Code?](#why-reverse-engineer-claude-code)[Preparation: Toolbox Checklist](#preparation-toolbox-checklist)[Step 1: Locate the "Target"](#step-1-locate-the-target)[Step 2: Beautify the Code, Make it "Readable"](#step-2-beautify-the-code-make-it-readable)[Step 3: Implant "Spy Code"](#step-3-implant-spy-code)[3.1 Add Basic Monitoring Module](#31-add-basic-monitoring-module)[3.2 Find the Right Injection Point](#32-find-the-right-injection-point)[Step 4: Test Our "Wiretap"](#step-4-test-our-wiretap)[Step 5: Analyze the Results](#step-5-analyze-the-results)[Key Discoveries](#key-discoveries)[1\. Multi-Model Collaboration Strategy](#1-multi-model-collaboration-strategy)[2\. Sophisticated System Prompt Design](#2-sophisticated-system-prompt-design)[3\. Intelligent Context Management](#3-intelligent-context-management)[4\. Refined Tool Call Design](#4-refined-tool-call-design)[Practical Application: Solving the "Dumbing Down" Problem](#practical-application-solving-the-dumbing-down-problem)[Summary](#summary)[This is Just the Beginning](#this-is-just-the-beginning)[Related Images](#related-images)