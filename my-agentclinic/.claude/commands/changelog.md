Maintain CHANGELOG.md in the project root, grouped by date (newest first).

## Steps

1. Run `git log --no-merges --format="%as|%s"` to get every non-merge commit as `DATE|SUBJECT` lines.

2. Check whether `CHANGELOG.md` exists at the project root.

### If CHANGELOG.md does not exist

3. Create it. Structure:

```
# Changelog

## YYYY-MM-DD
- subject one
- subject two

## YYYY-MM-DD (older)
- ...
```

   - Include every commit from the git log.
   - Group by date, newest date section first.
   - Within each date section, preserve git log order (most recent commit first).
   - Use the Write tool.

### If CHANGELOG.md exists

3. Read it and find the most recent date heading already recorded (format `## YYYY-MM-DD`).

4. From the git log output, keep only commits whose date is **strictly after** that recorded date.

5. If there are no new commits, report "Changelog is already up to date." and stop.

6. Otherwise, build one new section per new date (newest first) and insert them immediately after the `# Changelog` heading, before the existing first date section. Use the Edit tool.

## Rules

- Never include merge commits (already excluded by `--no-merges`).
- Never re-add commits for a date already present as a heading.
- Date headings are always `## YYYY-MM-DD` (ISO 8601, no time).
- Bullet format: `- <commit subject>` exactly as it appears in git log.
- Do not alter any existing content below the insertion point.

## Finish

Report how many dates and commits were added (or that the log was already current).
