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

# Claude Code Hook: Preventing敷衍性回复

A hook script for Claude Code to prevent敷衍性回复, improving conversation quality by detecting and modifying 'you are right' expressions

# [Claude Code Hook: Preventing敷衍性回复](#claude-code-hook-preventing敷衍性回复)

**Source**: [GitHub Gist](https://gist.github.com/ljw1004/34b58090c16ee6d5e6f13fce07463a31)  
**Author**: ljw1004  
**Date**: 2025-08-05  
**Type**: Claude Code Hook / Script Tool

## [Overview](#overview)

This is a Claude Code hook script designed to prevent AI assistants from using overly simple or agreeable language when responding to users. The script detects when the assistant uses expressions like "you are right" or "You're right" and automatically inserts a system reminder to provide more in-depth technical analysis.

## [Claude Code Hooks Background](#claude-code-hooks-background)

Claude Code Hooks are event-driven mechanisms that allow custom scripts to execute when specific events occur. Currently supported types include:

### [Hook Types](#hook-types)

*   **UserPromptSubmit**: Triggered when a user submits a prompt, allowing inspection and modification of input content
*   **Other Types**: Used for CI/CD integration, automation workflows, and code review

### [How Hooks Work](#how-hooks-work)

1.  **Event Trigger**: When a specific event occurs (such as user prompt submission)
2.  **Script Execution**: Claude Code automatically executes the configured script
3.  **Input Processing**: The script receives JSON-formatted input data
4.  **Output Processing**: The script's output is appended to Claude's context
5.  **Continue Execution**: Claude Code continues processing with the modified context

## [Script Features](#script-features)

### [1\. Detection Mechanism](#1-detection-mechanism)

*   Reads Claude Code conversation transcript files
*   Examines the last 5 assistant responses
*   Identifies various敷衍性表达:
    *   English: `You're right`, `you are absolutely correct`
    *   Korean: `사용자가 맞다`, `맞습니다`

### [2\. Trigger Conditions](#2-trigger-conditions)

The script triggers when assistant responses contain the following phrases:

*   `You're right` / `you are right`
*   `absolutely correct`
*   `사용자가 맞다` (Korean)
*   `맞습니다` (Korean)

### [3\. System Reminder Content](#3-system-reminder-content)

The script inserts a `<system-reminder>` requiring the assistant to:

**Prohibited Behaviors**:

*   Use "you are right" or similar expressions
*   Avoid reflexive agreement with users

**Required Behaviors**:

*   Provide substantive technical analysis
*   Look for flaws, bugs, loopholes, counter-examples in user input
*   Check for invalid assumptions
*   If the user is indeed correct, state this dispassionately with concrete specific reasons

## [Complete Script Code](#complete-script-code)

**Filename**: `you_are_not_right.sh`

```
#!/bin/bash
set -euo pipefail
trap 'echo "at line $LINENO, exit code $? from $BASH_COMMAND" >&2; exit 1' ERR

# This is a Claude Code hook to stop it saying "you are right".
#
# Installation:
# 1. Save this script and chmod +x it to make it executable.
# 2. Within Claude Code, /hooks / UserPromptSubmit > Add a new hook (this file)
#
# How it works:
# This script checks whether the assistant has recently told the user they are right.
# If so, it appends a system-reminder to the following user prompt,
# reminding the assistant not to do that, and giving it constructive
# examples of how it should respond to the user instead.

stdin=$(cat)
transcript_path=$(echo "$stdin" | jq -r ".transcript_path")

# We'll look through the last 5 items in the transcript.
# Sometimes the final item will be assistant thinking,
# and the previous one will be "you're right".
# We'll look for any triggering phrase like "You're right"
# or "you are absolutely correct".
items=$(grep '"role":"assistant"' "$transcript_path" | tail -n 5)
needs_reminder=false
while IFS= read -r item; do
    [[ "$(jq -r '.type // empty' <<< "$item")" == "assistant" ]] || continue
    [[ "$(jq -r '.message.content[0].type // empty' <<< "$item")" == "text" ]] || continue
    text=$(jq -r '.message.content[0].text' <<< "$item")
    [[ "${text:0:80}" =~ .*[Yy]ou.*(right|correct) ]] && needs_reminder=true
    [[ "${text:0:80}" =~ .*[Aa]bsolutely ]] && needs_reminder=true
    [[ "${text:0:80}" =~ .*사용자가.*맞다 ]] && needs_reminder=true  # Korean
    [[ "${text:0:80}" =~ .*맞습니다 ]] && needs_reminder=true  # Korean
done <<< "$items"
[[ "$needs_reminder" == "true" ]] || exit 0

# upon exit code 0, Claude Code will append stdout to the context
# and proceed.
cat <<'EOF'
<system-reminder>
You MUST NEVER use the phrase 'you are right' or similar.

Avoid reflexive agreement. Instead, provide substantive technical analysis.

You must always look for flaws, bugs, loopholes, counter-examples,
invalid assumptions in what the user writes. If you find none,
and find that the user is correct, you must state that dispassionately
and with a concrete specific reason for why you agree, before
continuing with your work.

<example>
user: It's failing on empty inputs, so we should add a null-check.
assistant: That approach seems to avoid the immediate issue.
However it's not idiomatic, and hasn't considered the edge case
of an empty string. A more general approach would be to check
for falsy values.
</example>
<example>
user: I'm concerned that we haven't handled connection failure.
assistant: [thinks hard] I do indeed spot a connection failure
edge case: if the connection attempt on line 42 fails, then
the catch handler on line 49 won't catch it.
[ultrathinks] The most elegant and rigorous solution would be
to move failure handling up to the caller.
</example>
</system-reminder>
EOF

exit 0
```

## [Installation Method](#installation-method)

### [1\. Download Script](#1-download-script)

```
# Download script to local
curl -s https://gist.githubusercontent.com/ljw1004/34b58090c16ee6d5e6f13fce07463a31/raw/you_are_not_right.sh -o you_are_not_right.sh

# Set execution permissions (required)
chmod +x you_are_not_right.sh
```

### [2\. Script Save Location](#2-script-save-location)

Scripts can be saved in the following locations:

*   **Recommended**: `~/.claude-code/hooks/` directory (if it exists)
*   **Alternative**: Project root directory or any accessible directory
*   **Note**: Ensure the script has execution permissions and the path is accessible to Claude Code

### [3\. Configure in Claude Code](#3-configure-in-claude-code)

1.  **Start Claude Code**:
    
    ```
    claude
    ```
    
2.  **Configure Hook**:
    
    *   Enter `/hooks` in Claude Code
    *   Select `UserPromptSubmit` event type
    *   Select `Add a new hook` option
    *   Choose the downloaded script file path
3.  **Verify Configuration**:
    
    *   Enter `/hooks` to view configured hooks
    *   Confirm the script has been loaded correctly

## [How It Works](#how-it-works)

### [Script Execution Flow](#script-execution-flow)

1.  **Read Input**: Read JSON data from stdin, get conversation transcript path
2.  **Analyze History**: Check the last 5 assistant responses
3.  **Pattern Matching**: Use regular expressions to detect敷衍性表达
4.  **Insert Reminder**: If problems are detected, output system reminder
5.  **Exit**: When script exit code is 0, Claude Code appends output to context

### [Input Data Format](#input-data-format)

The JSON input received by the script contains:

```
{
  "transcript_path": "/path/to/conversation/transcript.json",
  "user_prompt": "User input content",
  "session_id": "Session ID"
}
```

### [Example Effects](#example-effects)

**Before Trigger** (敷衍回复):

```
User: Empty input causes failure, we should add null-check.
Assistant: You're right, this is indeed a problem.
```

**After Trigger** (In-depth Analysis):

```
User: Empty input causes failure, we should add null-check.
Assistant: This approach can avoid the immediate issue, but it's not elegant.
It doesn't consider the edge case of empty strings. A more general approach would be to check for falsy values.
```

## [Why It's Important?](#why-its-important)

### [Problem Background](#problem-background)

Claude Code sometimes uses overly simple or agreeable language when responding to users, which may lead to:

*   Users missing code improvement opportunities
*   Reduced tool professionalism
*   Lack of in-depth technical analysis

### [Solution](#solution)

By forcing the assistant to think more deeply and provide feedback, this script:

*   Enhances Claude Code's practicality in programming scenarios
*   Promotes higher quality conversations
*   Avoids empty agreement, provides constructive suggestions

## [Technical Details](#technical-details)

### [Script Features](#script-features-1)

*   **Multi-language Support**: Detects English and Korean敷衍性表达
*   **Precise Matching**: Only checks the first 80 characters of responses to avoid false positives
*   **Safe Exit**: Exits directly when no problems are detected, doesn't affect normal use
*   **Error Handling**: Includes complete error handling and debugging information

### [Regular Expression Patterns](#regular-expression-patterns)

```
# English patterns
.*[Yy]ou.*(right|correct)
.*[Aa]bsolutely

# Korean patterns  
.*사용자가.*맞다
.*맞습니다
```

### [Dependencies](#dependencies)

*   **jq**: For parsing JSON data
*   **bash**: Script execution environment
*   **grep**: For text searching

## [Usage Recommendations](#usage-recommendations)

1.  **Combine with Other Hooks**: Can be used with other Claude Code hooks
2.  **Regular Updates**: Follow script updates for new features
3.  **Custom Extensions**: Can add detection patterns for other languages as needed
4.  **Effect Evaluation**: Observe changes in conversation quality before and after use
5.  **Debugging Tips**: Use `set -x` to enable debug mode and view execution process

## [Troubleshooting](#troubleshooting)

### [Common Issues](#common-issues)

1.  **Script No Permission**: Ensure `chmod +x you_are_not_right.sh` has been executed
2.  **jq Not Installed**: Install JSON processor `brew install jq` (macOS) or `apt install jq` (Linux)
3.  **Path Error**: Ensure script path is accessible to Claude Code
4.  **No Effect**: Check `/hooks` command to confirm script has been loaded correctly

### [Debugging Methods](#debugging-methods)

```
# Test if script is executable
./you_are_not_right.sh

# Enable debug mode
bash -x you_are_not_right.sh
```

## [Related Resources](#related-resources)

*   [Original GitHub Gist](https://gist.github.com/ljw1004/34b58090c16ee6d5e6f13fce07463a31)
*   [Claude Code Official Documentation](https://docs.anthropic.com/claude/docs/claude-code)
*   [Claude Code Hooks Documentation](https://docs.anthropic.com/claude/docs/claude-code-hooks)
*   [Claude Code Best Practices](https://docs.anthropic.com/claude/docs/claude-code-best-practices)

* * *

_This script is an important contribution to the Claude Code community, demonstrating how to improve AI assistant response quality through hook mechanisms._

[

Happy: Mobile and Web Client for Claude Code

A comprehensive mobile and web client that brings Claude Code to your phone with end-to-end encryption, voice control, and multi-session support. Use Claude Code from anywhere with zero workflow disruption.

](/docs/en/tools/happy-mobile-claude-code-client)[

Claude Code 文档中心

Claude Code 官方文档、指南、教程和最佳实践

](/docs/zh)

### On this page

[Claude Code Hook: Preventing敷衍性回复](#claude-code-hook-preventing敷衍性回复)[Overview](#overview)[Claude Code Hooks Background](#claude-code-hooks-background)[Hook Types](#hook-types)[How Hooks Work](#how-hooks-work)[Script Features](#script-features)[1\. Detection Mechanism](#1-detection-mechanism)[2\. Trigger Conditions](#2-trigger-conditions)[3\. System Reminder Content](#3-system-reminder-content)[Complete Script Code](#complete-script-code)[Installation Method](#installation-method)[1\. Download Script](#1-download-script)[2\. Script Save Location](#2-script-save-location)[3\. Configure in Claude Code](#3-configure-in-claude-code)[How It Works](#how-it-works)[Script Execution Flow](#script-execution-flow)[Input Data Format](#input-data-format)[Example Effects](#example-effects)[Why It's Important?](#why-its-important)[Problem Background](#problem-background)[Solution](#solution)[Technical Details](#technical-details)[Script Features](#script-features-1)[Regular Expression Patterns](#regular-expression-patterns)[Dependencies](#dependencies)[Usage Recommendations](#usage-recommendations)[Troubleshooting](#troubleshooting)[Common Issues](#common-issues)[Debugging Methods](#debugging-methods)[Related Resources](#related-resources)