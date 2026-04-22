---
name: changelog
description: Maintains CHANGELOG.md in the project root using git commit history. Use when the user invokes /changelog, asks to "update the changelog", "generate a changelog", or wants to record what changed before merging a branch. Creates the file from scratch if it doesn't exist (all commits grouped by date); otherwise appends only commits newer than the last recorded date.
---

# Changelog Skill

## Workflow

1. Run the script from the project root:

```bash
python3 <skill-dir>/scripts/changelog.py
```

Where `<skill-dir>` is the directory containing this skill.

2. The script handles both cases automatically:
   - **No CHANGELOG.md**: reads full git history, writes the file with all dates
   - **CHANGELOG.md exists**: finds the newest `## YYYY-MM-DD` heading, fetches commits after that date, prepends new sections

3. Review the output, edit bullet wording if needed, then commit `CHANGELOG.md` as part of the merge commit.

## Format

```markdown
# Changelog

## 2026-04-22

- feat: establish responsive design baseline
- feat: add Vitest test suite

## 2026-04-20

- Initial project scaffold
```

- One `# Changelog` title at the top
- Date headings as `## YYYY-MM-DD`, newest first
- Each commit is one bullet; wording may be cleaned up manually after generation

## Notes

- Run from the **project root** (same directory as `.git/`)
- Merge commits are excluded automatically
- The script is idempotent: re-running when nothing is new prints a message and exits without modifying the file
