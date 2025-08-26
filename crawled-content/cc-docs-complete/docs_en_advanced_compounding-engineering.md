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

# Compounding Engineering: Building Self-Improving Development Systems

Learn how to build development systems that get faster, safer, and better with each iteration. Transform your engineering workflow from short-term gains to permanent improvements.

# [Compounding Engineering: Building Self-Improving Development Systems](#compounding-engineering-building-self-improving-development-systems)

Before I opened my laptop, the code had reviewed itself.

I launched GitHub expecting to dive into my usual routine—flag poorly named [variables](/c/compounding-engineering), trim excessive tests, and suggest simpler ways to handle errors. Instead, I found a few strong comments from [Claude Code](https://www.anthropic.com/claude-code), the AI that writes and edits in my terminal:

"Changed variable naming to match pattern from PR \[pull request\] #234, removed excessive test coverage per feedback on PR #219, added error handling similar to approved approach in PR #241."

In other words, Claude had learned from three prior months of code reviews and applied those lessons without being asked. It had picked up my tastes thoroughly, the way a sharp new teammate would—and with receipts.

It [felt like cheating](https://every.to/working-overtime/ai-phobia-is-really-just-fear-that-easier-equals-cheating), but it wasn't—it was compounding. Every time we fix something, the system learns. Every time we review something, the system learns. Every time we fail in an avoidable way, the system learns. That's how we build **[Cora](https://cora.computer/)**, Every's AI-enabled email assistant, now: Create systems that create systems, then get out of the way.

I call this **compounding engineering**: building self-improving development systems where each iteration makes the next one faster, safer, and better.

Typical AI engineering is about short-term gains. You prompt, it codes, you ship. Then you start over. Compounding engineering is about building systems with memory, where every pull request teaches the system, every bug becomes a permanent lesson, and every code review updates the defaults. AI engineering makes you faster today. Compounding engineering makes you faster tomorrow, and each day after.

Three months of compounding engineering on Cora have completely changed the way I think about code. I can't write a function anymore without thinking about whether I'm teaching the system or just solving today's problem. Every bug fix feels half-done if it doesn't prevent its entire category going forward, and code reviews without extractable lessons seem like wasted time.

When you're done reading this, you'll have the same affliction.

## [The 10-minute investment that pays dividends forever](#the-10-minute-investment-that-pays-dividends-forever)

Compounding engineering asks for an upfront investment: You have to teach your tools before they can teach themselves.

Here's an example of how this works in practice: I'm building a "frustration detector" for Cora; the goal is for our AI assistant to notice when users get annoyed with the app's behavior and automatically file improvement reports. A traditional approach would be to write the detector, test it manually, tweak, and repeat. This takes significant expertise and time, a lot of which is spent context-switching between thinking like a user and thinking like a developer. It'd be better if the system could teach itself.

So I start with a sample conversation where I express frustration—like repeatedly asking the same question with increasingly terse language. Then I hand it off to Claude with a simple prompt: "This conversation shows frustration. Write a test that checks if our tool catches it."

Claude writes the test. The test fails—the natural first step in [test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development). Next, I tell Claude to write the actual detection logic. Once written, it still doesn't work perfectly, which is also to be expected. Now here's the beautiful part: I can tell Claude to _iterate on the frustration detection prompt_ until the test passes.

Not only that—it can keep iterating. Claude adjusts the prompt and runs the test again. It reads the logs, sees why it missed a frustration signal, and adjusts again. After a few rounds, the test passes.

But AI outputs aren't deterministic—a prompt that works once might fail the next time.

So I have Claude run the test 10 times. When it only identifies frustration in four out of 10 passes, Claude analyzes why it failed the other six times. It studies the [chain of thought](https://every.to/also-true-for-humans/7-22) (the step-by-step thinking Claude showed when deciding whether someone was frustrated) from each failed run and discovers a pattern: It's missing hedged language a user might use, like,"Hmm, not quite," which actually signals frustration when paired with repeated requests. Claude then updates the original frustration-detection prompt to specifically look for this polite-but-frustrated language.

On the next iteration, it's able to identify a frustrated user nine times out of 10. Good enough to ship.

We codify this entire workflow—from identifying frustration patterns to iterating prompts to validation—in CLAUDE.md, the special file Claude pulls in for context before each conversation. The next time we need to detect a user's emotion or behavior, we don't start from scratch. We say:"Use the prompt workflow from the frustration detector." The system already knows what to do.

And unlike human-written code, the "implementation" here is a prompt that Claude can endlessly refine based on test results. Every failure teaches the system. Every success becomes a pattern. (We're planning to open-source this prompt testing framework so other teams can build their own compounding workflows.)

## [From terminal to mission control](#from-terminal-to-mission-control)

Most engineers treat AI as an extra set of hands. Compounding engineering turns it into an entire team that gets faster, sharper, and more aligned with every task.

At Cora, we've used this approach to:

1.  **Transform production errors into permanent fixes** by having AI agents automatically investigate crashes, reproduce problems from system logs, and generate both the solution and tests to prevent it from happening again. This turns every failure into a one-time event.
2.  **Extract architectural decisions from collaborative work sessions** by recording design discussions with teammates, then having Claude document why certain approaches were chosen—creating consistent standards that new team members inherit on day one.
3.  **Build review agents with different expertise** by capturing my own preferences in a "Kieran reviewer" that enforces my style choices, then adding specialized perspectives like a "Rails expert reviewer" for framework best practices or a "performance reviewer" for speed optimization.
4.  **Automate visual documentation** by deploying an agent that automatically detects interface changes, captures before/after screenshots across different screen sizes and themes, and generates comprehensive visual documentation—eliminating a 30-minute manual task while ensuring every interface change is properly documented for reviewers.
5.  **Parallelize feedback resolution** by creating a dedicated agent for each piece of reviewer feedback that works simultaneously to address concerns. This compresses a back-and-forth process that could take hours into parallel work where 10 issues get resolved in the time it used to take for one.

![My automated code reviewer](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fautomated-code-reviewer.b99fabae.jpeg&w=3840&q=75)

My automated code reviewer: a file that captures my preferences so Claude can flag issues like 'too many tests' or 'overly complex logic' without being asked. (Source: Kieran Klaassen.)

This way of working signifies a shift in what it means to be an engineer. Your job isn't to type code anymore, but to design the systems that design the systems. It's the only approach I've found where today's work makes tomorrow's work exponentially easier, and where every improvement you make is permanent.

In the three months that we've been running a compounding engineering workflow on [Cora](https://cora.computer/), our metrics have shifted noticeably. We've seen time-to-ship on features drop from over a week to 1-3 days on average, and bugs caught before production have increased substantially. Pull request review cycles that used to drag on for days now finish in hours.

## [The compounding engineering playbook](#the-compounding-engineering-playbook)

Building systems that learn requires rewiring how you think about development. Even if you're sold on compounding engineering, you might be wondering how to start. After months of refinement—and plenty of failed experiments—I've distilled it to five steps.

### [Step 1: Teach through work](#step-1-teach-through-work)

Every time you make a decision, capture it and codify it to stop the AI from making the same mistake again. CLAUDE.md becomes your taste in plain language—why you prefer guard clauses over nested ifs or name things a certain way. Keep it short, keep it alive.

Likewise, the llms.txt file stores your high-level architectural decisions—the design principles and system-wide rules that don't change when you restructure individual features.

These files turn your preferences into permanent system knowledge that Claude applies automatically.

### [Step 2: Turn failures into upgrades](#step-2-turn-failures-into-upgrades)

Something breaks? Good. That's data. But here's where most engineers stop: They fix the immediate issue and move on. Compounding engineers add the test, update the rule, and write the [evaluation](https://every.to/p/how-to-grade-ai-and-why-you-should).

Take a recent example from Cora: A user reported that they never received their daily email Brief—a critical failure! We wrote tests that catch similar delivery lapses, updated our monitoring rules to flag when Briefs aren't sent, and built evaluations that continuously verify the delivery pipeline.

Now the system always watches for this category of problem. What started as a failure has made our tools permanently smarter.

### [Step 3: Orchestrate in parallel](#step-3-orchestrate-in-parallel)

Unlike hiring engineers at $150,000 each, AI workers scale on demand. The only limits are your orchestration skills and compute costs—not headcount, hiring timelines, or team coordination overhead. You can spin up five specialized agents for the cost of a cup of coffee.

My monitor now looks like mission control:

1.  **Left lane: Planning.** A Claude instance reads issues, researches approaches, and writes detailed implementation plans.
2.  **Middle lane: Delegating.** Another Claude takes those plans and writes code, creates tests, and implements features.
3.  **Right lane: Reviewing.** A third Claude reviews the output against CLAUDE.md, suggests improvements, and catches issues.

It feels awkward at first—like juggling while learning to juggle—but within a week it becomes natural.

![My monitor setup](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmonitor-setup-warp.273108dd.png&w=3840&q=75)

My monitor setup in the Warp command line interface (from left): planning in Claude Code; delegating in coding agent Friday; and reviewing in another coding agent, Amp. (Source: Kieran Klaassen.)

### [Step 4: Keep context lean but yours](#step-4-keep-context-lean-but-yours)

The internet is full of "ultimate CLAUDE.md files" you can copy. Don't. Your context should reflect your codebase, your patterns, and your hard-won lessons. Ten specific rules you follow beat 100 generic ones. And when rules stop serving you, delete them. Living context means pruning as much as growing.

When I review my [CLAUDE.md/slash](http://claude.md/slash) command and agent files, it feels like reading my own software philosophy—a reflection of what I've learned, what I value, and how I think code should be built. If it doesn't resonate with you personally, it won't guide the AI effectively.

### [Step 5: Trust the process, verify output](#step-5-trust-the-process-verify-output)

This is the hardest step. Your instinct will be to micromanage and review every line. Instead, trust the system you've built—but verify through tests, evals, and spot checks. It's like learning to be a CEO or a movie director: You can't do everything yourself, but you can build systems that catch problems before they escalate. When something comes back wrong (and it will), teach the system why it was wrong. Next time, it won't be.

## [Stop coding, start compounding](#stop-coding-start-compounding)

Here's what I know: Companies are paying $400 per month for what used to cost $400,000 per year. One-person startups are competing with funded teams. AI is democratizing not just coding, but entire engineering systems. And leverage is shifting to those who teach these systems faster than they type.

Start with one experiment log today. When something fails that shouldn't have, invest the time to prevent it from happening again—build the test, write the rule, and capture the lesson. Open three terminals. Try the three-lane setup: Plan in one, build in another, and review in a third. Say"pull request" and watch the branches bloom.

Then do it again tomorrow, and see what compounds.

* * *

_Thanks to_ **_[Katie Parrott](https://every.to/@katie.parrott12)_** _for editorial support._

**_[Kieran Klaassen](https://every.to/@kieran_1355)_** _is the general manager of_ **_[Cora](https://cora.computer/)_**_, Every's email product. Follow him on X at [@kieranklaassen](https://x.com/kieranklaassen) or on [LinkedIn](https://www.linkedin.com/in/kieran-klaassen/)._

[

Reverse Engineering Claude Code: How to Monitor AI's Every 'Inner Monologue'?

A comprehensive guide to reverse engineering Claude Code, revealing its multi-model collaboration strategy, sophisticated system prompt design, and intelligent tool calling mechanisms.

](/docs/en/advanced/claude-code-reverse-analysis)[

What Makes Claude Code So Damn Good: A Deep Analysis

An in-depth analysis of what makes Claude Code the most delightful AI coding agent, based on intercepted logs and months of usage. Learn the architectural decisions, prompt engineering techniques, and tool design principles that you can apply to your own LLM agents.

](/docs/en/advanced/decoding-claude-code-analysis)

### On this page

[Compounding Engineering: Building Self-Improving Development Systems](#compounding-engineering-building-self-improving-development-systems)[The 10-minute investment that pays dividends forever](#the-10-minute-investment-that-pays-dividends-forever)[From terminal to mission control](#from-terminal-to-mission-control)[The compounding engineering playbook](#the-compounding-engineering-playbook)[Step 1: Teach through work](#step-1-teach-through-work)[Step 2: Turn failures into upgrades](#step-2-turn-failures-into-upgrades)[Step 3: Orchestrate in parallel](#step-3-orchestrate-in-parallel)[Step 4: Keep context lean but yours](#step-4-keep-context-lean-but-yours)[Step 5: Trust the process, verify output](#step-5-trust-the-process-verify-output)[Stop coding, start compounding](#stop-coding-start-compounding)