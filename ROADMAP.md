# Prompt Quest — Roadmap

**Builder:** Drew (solo)
**Hackathon:** Built with Opus 4.6 (Feb 10-16, 2026)
**Goal:** A 3D game that teaches kids (7-11) prompt engineering through play

---

## Current State (Feb 11)

### Engine: React Three Fiber + Drei (3D)
- Migrated from Phaser 2D to full 3D with KayKit + Tiny Treats assets (4,270+ models)
- 28 character GLBs with 139 shared skeletal animations
- Per-task atmospheric scenes (fog, sky, sparkles, bloom, contact shadows)
- Fog walk-through intro transition on task selection

### What's Working
- **7 playable 3D tasks** — all with unique atmosphere, hero characters, and cached responses
- **166 golden cache entries** in demo-cache.json (instant response for demo)
- **13 fallback scripts** — demo never shows an error screen
- **3-tier response system** — Cache (instant) → Live API (1-8s) → Fallback (instant)
- **Synthesized SFX** via Web Audio API (no audio files needed)
- **TTS narration** with SpeechSynthesis
- **Voice input** (Chrome) with quest-themed styling
- **Error-tolerant scene player** — unknown actors/props skipped, auto-spawn on animate/emote
- **Production build passes** — 0 TS errors, 739 modules, ~3,044 kB JS (~769 kB gzip)

### The 7 Tasks
| # | Task | Characters | Props |
|---|------|-----------|-------|
| 1 | Skeleton's Surprise Birthday | Skeleton + Adventurers | Dungeon, Holiday |
| 2 | Knight's Space Mission | Knight, SpaceRanger | Space Base |
| 3 | Mage vs. Kitchen | Mage, Witch | Kitchen, Bakery |
| 4 | Barbarian's School | Barbarian + all | Playground, Furniture |
| 5 | Dungeon Rock Concert | All + Skeleton + Clown | Dungeon |
| 6 | Skeleton Pizza Delivery | Skeletons | Restaurant |
| 7 | Adventurers' Picnic | All 5 Adventurers | Picnic, Park |

---

## Completed Phases

### Phase 1-2: Foundation + Core Loop (Day 1)
- React + Zustand + Claude API integration
- Scene script format (spawn, move, animate, react, emote, sfx)
- EventBus bridge between React and game engine
- Monster Party + Robot Pizza (original 2D tasks)

### Phase 3: Cache + Feedback + 4 More Tasks (Day 1-2)
- 3-tier response resolver (cache → live → fallback)
- Golden response cache system with fuzzy matching
- 6 tasks total with Phaser scenes, system prompts, fallbacks
- Card grid task selector (2x3 layout)

### Phase 4: 3D Migration — R3F Engine (Day 2-3)
- Replaced Phaser with React Three Fiber + Drei
- Character3D component with SkeletonUtils clone + animation crossfade
- Prop3D component with GLTF loading + bounce entrance
- AnimationController managing 139 shared clips
- ScenePlayer3D (~950 lines) — error-tolerant action executor
- SafeModel error boundary per GLTF model
- 87 prop paths (68 unique .gltf), all verified on disk
- 7 new 3D tasks replacing old 2D scenes

### Phase 5: Game Juice (Day 3-4)
- SoundManager3D — synthesized SFX via Web Audio API (9 sound types)
- Auto-spawn for missing actors on animate/emote/move
- Multi-emoji particle burst reactions (7 emojis with CSS animations)
- Environment backdrops per task (dungeon torches, space modules, etc.)
- TTS narration hook (kid-friendly pacing)
- Voice input with quest-purple/orange styling
- Branded loading screen with preload

### Phase 6: Scene Atmosphere (Day 4)
- TaskAtmosphere.tsx — data-driven per-task configs
- Fog (per-task color/near/far), HemisphereLight (sky+ground)
- GPU-shader sparkle particles per task
- ContactShadows, Stars, procedural Sky, HDR Environment presets
- Clouds, colored point lights (torches, stage lights)
- Bloom + Vignette post-processing
- Circular ground plane with cast shadows

### Phase 7: Task Intro Transition (Day 4-5)
- TaskIntro.tsx — fog walk-through animation on task selection
- 5s sequence: dense fog → title → title disperses → fog clears → camera dolly → settle
- Hero characters spawn idle before prompt input
- Skip-on-click, intro sound (filtered noise sweep + ascending chime)
- PromptInput disabled + OrbitControls locked during intro

---

## Remaining Work (Feb 11-16)

### Story Curriculum System (Feb 11-12)

Each zone becomes a multi-stage guided experience teaching a specific prompt engineering skill. 220 pre-rendered responses across 7 stories, 22 stages.

**Plan:** [`docs/story-curriculum-plan.md`](docs/story-curriculum-plan.md) — Full curriculum design + integration plan (consolidated)

**Completed:**
- [x] Story types (`data/stories/types.ts`) — Story, StoryStage, StoryResponse, StoryElement
- [x] 7 story data files (220 pre-rendered responses total)
- [x] Barrel export (`data/stories/index.ts`) — STORY_ORDER, getStoryById

**Integration (complete):**
- [x] Wire 4 missing props into block-library (bench, desk, table_round, plate)
- [x] Story element resolver — convert StoryResponse → SceneScript via block-resolver
- [x] Story matcher — fuzzy match user input to pre-rendered StoryResponse
- [x] Game store stage progression — currentStageIndex, advanceStage, getHint
- [x] Stage-level fallback scripts (22 entries)
- [x] UI: stage question, progress indicator, hint button, next stage button
- [x] App.tsx: stage badge in zone header

### Final Polish (Feb 12-13)
- [x] Stress test all 7 tasks with edge cases (empty, 500 chars, gibberish, non-English, XSS, SQL injection, emoji)
- [x] Verify every failure path hits Tier 3 fallback gracefully — 0 errors across 17 Puppeteer tests
- [ ] Test voice input on Chrome
- [x] Visual regression test — Puppeteer tests all 22 stages across 7 stories. 22/22 PASS, 27 cosmetic overlap warnings (non-blocking)
- [ ] 30 minutes free-play testing per task
- [x] Performance audit — memoized getStoryById, hoisted stopwords Set, bundle at 382 kB gzip
- [x] Mobile/responsive layout check — tested iPhone SE, iPad, Desktop. Canvas scales via maxWidth:100%/maxHeight:60vh. Header slightly crowded on iPhone SE but functional. Debug coords dev-only.
- [x] Review all kid-facing text — fixed "fail"→"stumble" in feedback, replaced raw error display with kid-friendly message, added fallback prompt for unknown tasks

### Demo Prep (Feb 14-15)
- [ ] Record backup demo video (2-3 min) showing 2-3 tasks
- [x] Write 2-minute pitch script (see below)
- [ ] Practice pitch 3x
- [x] Prepare GitHub README with screenshots
- [ ] Run pre-demo checklist

### Buffer (Feb 15-16)
- Emergency fixes only
- Rest before demo

---

## 2-Minute Pitch Script

```
[Title slide]
"Hi, I'm Drew. I built Prompt Quest — solo, in one week, with Claude Opus 4.6."

[Problem]
"Every AI tool for kids is just ChatGPT with a cute skin. Kids chat WITH AI,
but they're not learning HOW to communicate with AI. What if AI was invisible?
What if it was the game engine?"

[Solution]
"Prompt Quest teaches prompt engineering through 3D gameplay. Kids solve
comedy puzzles by describing what should happen. Claude interprets their
description and brings it to life — skeletons throw birthday parties,
barbarians attend school, knights blast off to space."

[Demo — pick Skeleton Birthday]
"Watch. I'll type 'have a party'..."
→ Partial success — confused skeleton, tiny cake.
"The feedback says: 'The skeleton looks around wondering where the balloons
and music went.' Not abstract AI tips — game advice."

"Now: 'Throw a giant birthday cake with balloons, presents, and a dance party'"
→ Full success — cake flies in, balloons spawn, skeleton dances, confetti.

[Tech]
"Under the hood: Opus 4.6 evaluates every input against a vocabulary
contract — every 3D model, animation, and effect the game can actually
render. It never hallucinates assets that don't exist. 166 responses are
pre-cached so the demo is instant. If the API fails, a fallback fires.
The demo never breaks."

"7 tasks, 4,270 3D models, 139 animations, all assembled live from a
kid's description. They're learning specificity, completeness, and
creativity — and they don't even know it."
```

---

## Pre-Demo Checklist

```
[ ] Open Chrome (voice input only works here)
[ ] Navigate to deployed URL (or localhost:5174)
[ ] Verify app loads — task grid with 7 cards visible
[ ] Test cached input on Skeleton Birthday → instant response
[ ] Test cached input on Skeleton Pizza → instant response
[ ] Verify fog intro plays on task selection
[ ] Verify hero characters visible before typing
[ ] Check sound effects fire (unmuted)
[ ] Test voice button → mic permission granted
[ ] Verify TTS narration reads result
[ ] Close all other tabs
[ ] Disable notifications
[ ] Maximize browser window
[ ] Have backup video in separate tab
[ ] Charge laptop to 100%
```

---

## Emergency Fallbacks

**Claude API down during demo:** Cache serves everything — mention "pre-cached for speed"
**Vercel slow:** Run `npm run dev` locally on port 5174
**3D model fails to load:** SafeModel boundary skips it, scene continues
**Browser crash:** Play backup video, narrate over it
**Running out of time in pitch:** Focus on ONE task (Skeleton Birthday), skip the rest

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React + TypeScript + Vite |
| 3D Engine | React Three Fiber + Drei |
| State | Zustand |
| AI | Claude Opus 4.6 |
| Assets | KayKit + Tiny Treats (4,270+ GLTF models) |
| Audio | Web Audio API (synthesized) + SpeechSynthesis (TTS) |
| Styling | Tailwind CSS + Fredoka/Nunito fonts |
| Deploy | Vercel |

---

## Success Metric

**One perfect interaction that makes someone smile.**

Kid types something creative → Claude interprets it → 3D scene comes alive → kid laughs.

Everything else is in service of that moment.
