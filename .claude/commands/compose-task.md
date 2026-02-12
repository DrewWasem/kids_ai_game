---
description: Orchestrate the full SME pipeline to create a new game task/zone — story-writer → character-director → prompt-writer → ece-professor review
---

# /compose-task — SME Pipeline for New Game Content

Orchestrate all relevant SMEs in sequence to create a complete new game task (zone, story, prompts, cache).

## Usage
`/compose-task "{task concept}"` — e.g., `/compose-task "Dragon's cooking show where the dragon keeps accidentally burning the food"`

## Pipeline

### Stage 1: Story Design (`story-writer`)
**Input:** Task concept from user
**SME:** `/sme story-writer "Design a complete story arc for: {concept}. Include: task title, skill taught, 3-element success formula, 3 stages with questions, FUNNY_FAIL scenarios (must be funnier than success), and character/prop needs."`

**Output:** Story arc document with stages, success criteria, comedy beats

### Stage 2: Character Casting (`character-director`)
**Input:** Story arc from Stage 1
**SME:** `/sme character-director "Cast characters for this story: {story arc}. Assign personalities, map to available KayKit characters, choose signature animations, and plan any evolution across stages."`

**Output:** Character sheet with casting, animations, personality notes

### Stage 3: Prompt Engineering (`prompt-writer`)
**Input:** Story arc + character sheet
**SME:** `/sme prompt-writer "Create the system prompt for this task: {story + characters}. Include success criteria, vocabulary contract (actors, props, animations, effects), JSON schema, and 3 example responses per success level."`

**Output:** System prompt file + vocabulary contract

### Stage 4: Content Generation
Using the system prompt from Stage 3:
1. Generate 10 pre-rendered responses per stage (4 FULL_SUCCESS, 3 PARTIAL_SUCCESS, 3 FUNNY_FAIL)
2. Generate 3 progressive hints per stage
3. Generate fallback scripts (1 per stage + 1 base)
4. Write story data file (`frontend/src/data/stories/{task-id}.ts`)

### Stage 5: Educational Review (`ece-professor`)
**Input:** All content from Stages 1-4
**SME:** `/sme ece-professor "Full developmental review of this game task for ages 7-11: {all content}. Check: age-appropriateness, Piaget alignment, ZPD scaffolding, growth mindset framing, COPPA compliance, no harmful content."`

**Output:** Approval or revision requests

### Stage 6: Brand Voice Audit (`child-game-design`)
**Input:** All kid-facing text from Stages 1-4
**SME:** `/sme child-game-design "Audit all kid-facing text: {narrations, feedback, hints, questions}. Check forbidden words, narration length, exclamation count, tone, and brand voice compliance."`

**Output:** Audit report with fixes needed

### Stage 7: Integration
1. Create story data file in `frontend/src/data/stories/`
2. Add to `STORY_ORDER` in `frontend/src/data/stories/index.ts`
3. Create system prompt in `frontend/src/prompts/`
4. Add fallback scripts to `frontend/src/data/fallback-scripts.ts`
5. Add zone config to `frontend/src/game/VillageWorld.tsx`
6. Run `/test-prompt {task-id}` to verify 100% parse rate
7. Run content-auditor agent on all new files

## Human Checkpoints

- After Stage 1: User reviews story arc before character casting
- After Stage 3: User reviews system prompt before content generation
- After Stage 5: User reviews ece-professor feedback before proceeding
- After Stage 7: User does manual playtest

## Notes

- This pipeline produces a complete, tested, SME-reviewed game task
- Total time: ~30-60 minutes depending on API latency and review cycles
- Each SME runs in isolated context — no conflicts, no context pollution
- The pipeline can be interrupted and resumed at any stage

$ARGUMENTS
