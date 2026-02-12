---
name: conductor
description: "Orchestration skill that routes complex tasks through Research → Plan → Implement. Check this skill BEFORE responding to any non-trivial request. Like Superpowers' using-superpowers skill, this is injected at session start to establish the workflow discipline."
---

# Conductor Skill

## The Rule

Before implementing any non-trivial change, STOP and assess whether the task needs orchestration. This is not optional — skipping orchestration on complex tasks leads to wasted context, rework, and wrong approaches.

## Assessment Checklist

**On EVERY non-trivial request, run these two checks before doing anything:**

### Check 1: Orchestration needed?

**Orchestrate (Research → Plan → Implement) when ANY of these are true:**
- The task touches 3+ files
- You're unfamiliar with the relevant code area
- Multiple valid approaches exist
- The task involves architectural decisions
- The user asks for orchestration (`/conductor`)
- You're about to write more than ~50 lines of new code
- The task requires understanding data flow across components

**Just do it when ALL of these are true:**
- Single file change
- The solution is obvious and unambiguous
- The user gave specific instructions
- No architectural impact

### Check 2: SME needed? (runs even on "just do it" tasks)

Scan the task against the SME routing table below. If a match exists:
- **For "just do it" tasks:** Mention the relevant SME once — "This touches kid-facing text. Want me to run it by `child-game-design`?" If the user says no or ignores it, proceed without.
- **For orchestrated tasks:** SME consultation is woven into each phase (see SME Routing below).

This check is **lightweight** — one sentence, not a ceremony. The goal is awareness, not friction.

## The Orchestrated Workflow

```
┌───────────┐     ┌─────────┐     ┌──────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│ BRAINSTORM│────▶│ RESEARCH │────▶│ PLAN │────▶│  APPROVE  │────▶│IMPLEMENT │────▶│ VALIDATE │
│/brainstorm│     │ /research│     │/create│     │  (human)  │     │/implement│     │/validate │
│ (optional)│     │          │     │ -plan │     │           │     │  -plan   │     │  -plan   │
└───────────┘     └─────────┘     └──────┘     └───────────┘     └──────────┘     └──────────┘
                       │               │                               │                │
                       ▼               ▼                               ▼                ▼
                    memory/         memory/                         memory/          memory/
                    research/       plans/                          sessions/        research/
```

### Phase 0: Brainstorm (`/brainstorm` — optional)
- Use when requirements are ambiguous or multiple approaches exist
- Ask questions one at a time (Socratic, not a questionnaire)
- Propose 2-3 approaches with trade-offs
- Get alignment before committing to research scope
- Save architectural decisions to `.claude/memory/decisions/`

### Phase 1: Research (`/research {topic}`)
- Dispatch parallel agents to understand the codebase
- Check memory for prior knowledge
- Save structured findings to `.claude/memory/research/`
- Present findings to user
- **Human reviews research before planning begins**

### Phase 2: Plan (`/create-plan`)
- Use research findings as input
- Design phased approach with 2-5 minute tasks
- Every task has exact file paths and verification steps
- Save plan to `.claude/memory/plans/`
- **Human reviews and approves plan before implementation begins**

### Phase 3: Implement (`/implement-plan {filename}`)
- Execute plan one phase at a time
- Verify each task before moving on
- Stop on mismatches — never improvise
- **Human reviews each phase before the next begins**

### Phase 4: Validate (`/validate-plan {filename}`)
- Independent verification of all success criteria
- Two-pass review: spec compliance, then code quality
- Save validation report to memory

### Phase 5: Remember (`/remember`)
- Capture decisions, patterns, and bugs from the session
- Write session summary
- Persist learnings for future sessions

## Agent Roster

| Agent | Role | When Used |
|-------|------|-----------|
| **memory-locator** | Find relevant memories | Research, Planning |
| **memory-writer** | Write entries to memory tree | Remember, Research |
| **codebase-researcher** | Find files and components | Research |
| **codebase-analyzer** | Trace code paths in depth | Research |
| **plan-architect** | Design implementation plans | Planning |
| **implementer** | Execute plan tasks precisely | Implementation |
| **reviewer** | Verify spec compliance + quality | Validation |
| **content-auditor** | Validate brand voice + asset refs | Validation, Pre-demo |

## SME Routing

**Every orchestrated workflow MUST check whether an SME should be consulted.** SMEs are domain specialists that run as isolated subagents — zero cost when not invoked, high value when relevant.

### SME Routing Table

| Task involves... | Consult SME | When |
|---|---|---|
| Writing/editing narration, feedback, or any kid-facing text | `story-writer` + `child-game-design` | Planning, Implementation |
| Creating/modifying story stages, responses, or curriculum | `story-writer` + `character-director` | Planning |
| System prompts, cache entries, or Claude API interaction | `prompt-writer` | Planning, Validation |
| 3D scenes, models, scale, positioning, camera, lighting | `3d-game-development` | Research, Planning |
| Measuring or adjusting 3D model proportions | `3d-scale-tester` | Implementation |
| Casting characters, assigning animations, personality | `character-director` | Planning |
| Anything shipping to kids (final review gate) | `ece-professor` | Validation |
| Educational content, age-appropriateness, pedagogy | `ece-professor` | Planning, Validation |

### How to Consult

Use `/sme <name> "<task>"` — this spawns an isolated subagent with domain knowledge. The SME's response returns to the parent context, and the subagent is released.

**Multiple SMEs can run in parallel** — they don't conflict.

### Auto-Suggest Protocol

At each phase transition, the Conductor SHOULD check the routing table and suggest relevant SMEs:

1. **Before Research:** "This involves 3D scenes — consider `/sme 3d-game-development` for architecture guidance."
2. **Before Planning:** "This touches kid-facing text — I'll consult `story-writer` and `child-game-design` for the plan."
3. **Before Validation:** "This is shipping to kids — running `ece-professor` for final review."

If the user declines an SME suggestion, proceed without it. SMEs are recommended, not mandatory (except `ece-professor` for kid-facing content, which should be strongly recommended).

### SME Gap Detection (automatic)

This check runs passively during ANY work — not just `/research`. Watch for these signals:

**Trigger:** You find yourself needing domain knowledge that no existing SME covers, AND this has happened more than once (in this session or across sessions via memory).

**Signals that a new SME is needed:**
- You're looking up the same domain docs/patterns repeatedly
- You're making judgment calls in a domain you're not confident about
- The user keeps correcting you on domain-specific conventions
- A memory search shows prior sessions hit the same knowledge gap

**When triggered (keep it lightweight):**
1. Mention it naturally: "I keep needing {domain} expertise and we don't have an SME for that. Want me to create one?"
2. If yes → scaffold it from the template at `.claude/smes/` (sme.yaml + system-prompt.md + knowledge/)
3. If no → drop it, don't ask again this session

**Do NOT:**
- Ask about SME creation for one-off questions
- Create an SME without asking first
- Turn this into a ceremony — one sentence is enough

## Context Management

The Conductor workflow is designed for **context efficiency**:

1. **Research agents run in subagent context** — their file reads and searches don't pollute the parent window.
2. **Plans are saved to disk** — if context fills, compact and resume from the plan file.
3. **Implementation tracks progress with checkboxes** — you can always see what's done and what's next.
4. **Memory persists across sessions** — `/recall` recovers context from previous sessions.

### Intentional Compaction

If context is getting full mid-workflow:
1. Save current progress: update plan checkboxes, write session notes.
2. Let compaction happen — the post-compact hook will re-inject key context.
3. Resume from the plan file: read it, find the first unchecked task, continue.

**SME state across compaction:**
- Pre-compact hook saves the SME session log (which SMEs were consulted + outcomes)
- Post-compact hook re-injects: SME session log, SME gap alerts, full SME roster
- You do NOT need to re-consult SMEs that were already consulted pre-compaction
- Check the `--- SME STATE ---` block in post-compact output before re-invoking

## Anti-Rationalization

Watch for these thoughts — they are signals to STOP and follow the workflow, not skip it.

| Thought | Reality |
|---------|---------|
| "This is simple, I'll just..." | If it touches 3+ files, it's not simple. Orchestrate. |
| "I know how to do this" | In unfamiliar code, you're guessing. Research first. |
| "Let me just try something" | Trying without reading the code first = rework. |
| "I'll fix this other thing while I'm here" | That's scope creep. Finish the current task. |
| "The user wants it fast, not perfect" | Building the wrong thing is the slowest path. |
| "I'll test after I implement" | Tests written after rationalize the implementation. Test-first. |
| "Planning will slow us down" | A 5-minute plan saves a 30-minute redo. |
| "I already explored this area before" | Context decays. Check memory or re-read the code. |
| "This doesn't need a brainstorm" | If there are 2+ valid approaches, it does. Run `/brainstorm`. |
| "I can hold all this in my head" | Context windows compact. Save state to disk. |

## Announcement Protocol

When orchestrating, always announce the phase transition:
- "**Conducting: Research** — investigating {topic} using parallel agents."
- "**Conducting: Planning** — designing implementation approach."
- "**Conducting: Implementation** — executing Phase {N} of the plan."
- "**Conducting: Validation** — verifying implementation against plan."
