---
name: research
description: "Structured codebase research using parallel agents. Documents what exists without critique. Saves findings to memory for use in planning."
---

# Research Skill

## Purpose

Understand a codebase area thoroughly by dispatching parallel research agents, then synthesize and persist findings. This is Phase 1 of the Conductor workflow.

## When to Use

- Before planning any non-trivial change
- When entering an unfamiliar area of the codebase
- When the user asks "how does X work?" or "where is Y?"
- When `/research` is invoked

## Agent Dispatch Strategy

### For broad exploration (finding files, structure):
Use **codebase-researcher** — it finds locations and maps structure.

### For deep understanding (tracing logic):
Use **codebase-analyzer** — it traces execution paths with file:line precision.

### For memory context:
Use **memory-locator** — it finds related decisions, patterns, and prior research.

### Dispatch in parallel:
```
Task 1: codebase-researcher → "Find all files related to {topic}"
Task 2: codebase-analyzer → "Trace the data flow for {specific path}"
Task 3: memory-locator → "Search memory for {topic keywords}"
```

## Research Document Format

Save to `.claude/memory/research/{YYYY-MM-DD}-{topic-slug}.md`:

```markdown
# Research: {topic}

**Date:** {date}
**Status:** complete
**Tags:** research, {relevant-tags}

## Question
{What we needed to understand}

## Summary
{2-3 sentence answer}

## Detailed Findings
### {Area 1}
{Description with file:line references}

### {Area 2}
...

## Code References
- `path/file.py:42` — {description}

## Prior Knowledge
{Relevant memories found}

## Open Questions
{Anything needing further investigation}
```

## SME Consultation

After synthesizing findings, check whether any existing SME should be consulted for domain expertise:

### Check the Routing Table

| Research topic involves... | Suggest SME |
|---|---|
| 3D scenes, models, camera, lighting | `3d-game-development` |
| Kid-facing text, narration, feedback | `story-writer`, `child-game-design` |
| Educational design, age-appropriateness | `ece-professor` |
| Character casting, animation mapping | `character-director` |
| System prompts, Claude API, caching | `prompt-writer` |
| 3D scale/proportion issues | `3d-scale-tester` |

If relevant, note in the research document:
```markdown
## Recommended SME Consultation
- `/sme {name} "{specific question from findings}"`
```

### Should I Create a New SME?

At the end of every research task, evaluate:

1. **Did a domain come up repeatedly** that no existing SME covers?
2. **Would a specialist improve future work** in this area?
3. **Is there enough domain knowledge** to populate a knowledge base?

If all three are true, add to the research document:

```markdown
## SME Gap Identified
**Domain:** {domain name}
**Evidence:** {what came up during research}
**Recommendation:** Create `.claude/smes/{name}/` with:
  - `sme.yaml` — manifest with capabilities and tools
  - `system-prompt.md` — domain expertise prompt
  - `knowledge/constraints.md` — hard rules
  - `knowledge/heuristics.md` — soft guidelines
**Existing SMEs checked:** {list of SMEs reviewed and why they don't cover this}
```

The user decides whether to create it. Research only identifies the gap.

## Rules

- **Documentarian, not critic.** Describe what IS, not what SHOULD BE.
- Every claim needs a file:line reference.
- Sub-agents research, main agent synthesizes.
- Save everything to memory — research is reusable.
- Read mentioned files in the main context BEFORE dispatching agents.
