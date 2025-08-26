#!/bin/bash

# 清理非中文文档脚本
# 删除所有英文、日文、法文等非中文文档文件

echo "开始清理非中文文档..."

# 定义要删除的非中文文档文件列表
NON_CHINESE_FILES=(
    # English files
    "docs/commands/basic-usage.mdx"
    "docs/commands/comprehensive-pr-review.mdx"
    "docs/commands/auto-create-pr-from-your-changes.mdx"
    "docs/commands/auto-update-pr-for-current-branch.mdx"
    "docs/commands/capture-and-analyze-a-window.mdx"
    "docs/commands/check-ai-writing-style-in-file.mdx"
    "docs/commands/check-ci-status.mdx"
    "docs/commands/check-current-plan.mdx"
    "docs/commands/check-dependency-status-and-request-claude-s-help.mdx"
    "docs/commands/check-project-structure-for-tech-debt.mdx"
    "docs/commands/check-the-quality-of-a-prompt-file.mdx"
    "docs/commands/find-complex-code-to-refactor.mdx"
    "docs/commands/find-performance-issues-comprehensively.mdx"
    "docs/commands/format-for-requesting-claude.mdx"
    "docs/commands/generate-message-from-staged-changes-language-auto.mdx"
    "docs/commands/guard-skip-when-not-inside-a-git-repository.mdx"
    "docs/commands/output-a-standard-checklist-template-for-ci-artifa.mdx"
    "docs/commands/perform-new-additions-and-updates-simultaneously.mdx"
    "docs/commands/request-claude-to-think-sequentially.mdx"
    "docs/commands/request-deep-thinking-from-claude.mdx"
    "docs/commands/request-from-claude.mdx"
    "docs/commands/request-plan-mode-from-claude.mdx"
    "docs/commands/request-spec-mode-from-claude-minimal-requirement-.mdx"
    "docs/commands/request-task-from-claude.mdx"
    "docs/commands/retrieve-and-analyze-review-comments.mdx"
    "docs/commands/run-a-standard-pre-pr-check-on-the-current-change.mdx"
    "docs/commands/run-with-automatic-language-detection.mdx"
    "docs/commands/show-a-file-and-ask-for-explanation.mdx"
    "docs/commands/standard-error-analysis.mdx"
    "docs/commands/start-local-app-and-run-e2e.mdx"
    "docs/commands/web-search-via-gemini-cli-required.mdx"
    "docs/commands/analyze-current-changes-and-commit-in-logical-unit.mdx"
    "docs/commands/analyze-current-directory.mdx"
    "docs/commands/analyze-dependencies-for-entire-project.mdx"
    "docs/commands/analyze-patterns-for-entire-project.mdx"
    "docs/commands/cookbook-commands.mdx"
    
    # French files
    "docs/commands/utilisation-de-base.mdx"
    "docs/commands/mod-le-de-checklist-standard.mdx"
    "docs/workflows/guide-de-flux-de-travail-complet-d-quipe.mdx"
    
    # English role files
    "docs/roles/analyzer.mdx"
    "docs/roles/architect.mdx"
    "docs/roles/cookbook-roles.mdx"
    "docs/roles/dual-analysis-of-security-and-performance-normal.mdx"
    "docs/roles/frontend.mdx"
    "docs/roles/general-guidance.mdx"
    "docs/roles/mobile.mdx"
    "docs/roles/performance.mdx"
    "docs/roles/qa.mdx"
    "docs/roles/reviewer.mdx"
    "docs/roles/security.mdx"
    "docs/roles/security-vs-performance-trade-off.mdx"
    "docs/roles/switch-to-security-audit-mode-normal.mdx"
    "docs/roles/vs.mdx"
    
    # English workflow files
    "docs/workflows/github-actions-ci-workflow.mdx"
    "docs/workflows/release.mdx"
    "docs/workflows/shellcheck-configuration-more-lenient-for-existing.mdx"
    "docs/workflows/team-project-full-workflow-guide.mdx"
    "docs/workflows/cookbook-workflows.mdx"
    "docs/workflows/ctok-workflows.mdx"
    
    # English guide files
    "docs/guides/installation-guide.mdx"
    "docs/guides/claude-code-cookbook.mdx"
    "docs/guides/claude-code-cookbook-documentation.mdx"
    "docs/guides/upstream-synchronization-guide.mdx"
    
    # Top level English files
    "docs/about.mdx"
    "docs/getting-started.mdx"
    "docs/introduction.mdx"
    "introduction.mdx"
)

# 统计删除的文件数量
deleted_count=0

# 删除非中文文档文件
for file in "${NON_CHINESE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "删除文件: $file"
        rm "$file"
        ((deleted_count++))
    else
        echo "文件不存在: $file"
    fi
done

echo "清理完成！共删除 $deleted_count 个非中文文档文件。"
echo "剩余的都是中文文档文件。"