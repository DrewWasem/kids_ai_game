---
description: Run educational and brand SMEs on existing content for quality review
---

# /review-content — SME Content Review

Run a multi-SME review pass on existing game content to catch issues before shipping.

## Usage
- `/review-content all` — audit everything (stories, prompts, cache, fallbacks, UI text)
- `/review-content stories` — audit story data files only
- `/review-content prompts` — audit system prompts only
- `/review-content cache` — audit demo-cache.json
- `/review-content {file-path}` — audit a specific file

## Review Pipeline

### Pass 1: Content Auditor (automated)

Dispatch the **content-auditor** agent (`.claude/agents/content-auditor.md`) to scan target files for:
- Forbidden words in kid-facing text
- Asset reference validation (actors, props, animations, effects)
- Narration length violations (>20 words)
- Exclamation count violations (>1 per narration)
- Color compliance (no red for failure)

### Pass 2: Brand Voice (`child-game-design` SME)

Run `/sme child-game-design "Review these for brand voice compliance: {extracted kid-facing text}"`.

Checks:
- Voice test: "Would a funny, encouraging older sibling say this?"
- Concrete feedback (not abstract praise)
- Failure framed as comedy, not judgment
- Appropriate vocabulary for ages 7-11

### Pass 3: Educational Review (`ece-professor` SME)

Run `/sme ece-professor "Developmental review of this content: {content}. Ages 7-11."`.

Checks:
- Age-appropriate language and concepts
- Scaffolding quality (hints progressive, not too revealing)
- Growth mindset framing ("try adding X" not "you forgot X")
- No content that could be scary, exclusionary, or harmful
- COPPA compliance

### Pass 4: Comedy Quality (`story-writer` SME — stories only)

If reviewing stories, run `/sme story-writer "Review comedy quality: {FUNNY_FAIL responses}. Are they funnier than the success responses?"`.

Checks:
- FUNNY_FAIL must be more entertaining than FULL_SUCCESS
- Comedy is visual/physical, not mean-spirited
- Failures create curiosity to try again

## Output

Compile all SME findings into a single review report:

```markdown
## Content Review Report

**Scope:** {what was reviewed}
**Date:** {date}

### Summary
| Check | Pass | Fail | Warning |
|-------|------|------|---------|
| Content Audit | {n} | {n} | {n} |
| Brand Voice | {n} | {n} | {n} |
| Educational | {n} | {n} | {n} |
| Comedy | {n} | {n} | {n} |

### Critical Issues (MUST FIX)
{list}

### Warnings (SHOULD FIX)
{list}

### SME Notes
{any additional observations from SMEs}

### Verdict
{APPROVED | NEEDS_REVISION | BLOCKED}
```

Save to `.claude/memory/research/{date}-content-review.md`.

## When to Use

- Before any deployment (`/pre-demo` should invoke this)
- After creating new story content (`/compose-task` invokes this at Stage 5-6)
- After bulk cache generation (`/build-cache` should suggest this)
- Periodically during development as content accumulates

$ARGUMENTS
