# Prompt Quest

A 3D game that teaches kids (ages 7-11) prompt engineering through play. Built solo with Claude Opus 4.6 for the Claude Code Hackathon (Feb 10-16, 2026).

**Builder:** Drew

## How It Works

Kids explore a 3D village and enter quest zones where they solve comedy puzzles by describing what should happen. Claude interprets their description and brings it to life with 3D characters, props, and animations. Better prompts = better results.

```
Kid types: "Throw a giant birthday cake with balloons, presents, and a dance party"
  -> Claude Opus 4.6 evaluates the prompt against a vocabulary contract
  -> 3D scene assembles: cake spawns, balloons float in, skeleton dances, confetti bursts
  -> Feedback: "Amazing! You described the cake, decorations, AND a celebration!"
```

The AI is invisible. Kids think they're playing a game. They're actually learning specificity, completeness, and creativity.

## The 7 Quests

| # | Quest | Skill Taught | Stages |
|---|-------|-------------|--------|
| 1 | Skeleton's Surprise Birthday | Specificity — details matter | 3 |
| 2 | Knight's Space Mission | Sequencing — order of events | 3 |
| 3 | Mage vs. The Kitchen | Cause & effect — actions have consequences | 3 |
| 4 | Barbarian's School Day | Audience — who is involved matters | 3 |
| 5 | Dungeon Rock Concert | Completeness — cover all the pieces | 4 |
| 6 | Skeleton Pizza Delivery | Constraints — working within limits | 3 |
| 7 | Adventurers' Picnic | Creativity — surprise and delight | 3 |

Each quest has multiple stages with progressive difficulty, 3 progressive hints per stage, and pre-rendered responses for instant feedback during demo.

## Features

- **3D village world** — walk between quest zones with WASD/arrow keys, hold Shift to run
- **28 animated characters** with 139 shared skeletal animations (idle, walk, dance, wave, attack, etc.)
- **4,270+ 3D props** from KayKit + Tiny Treats asset libraries
- **Story curriculum** — 7 stories, 22 stages, 220 pre-rendered responses teaching prompt engineering skills
- **4-tier response system** — Story match (instant) -> Cache -> Live API -> Fallback (demo never errors)
- **Voice input** via Web Speech API (Chrome)
- **TTS narration** reads results aloud with kid-friendly pacing
- **Synthesized SFX** via Web Audio API (no audio files needed)
- **Per-quest atmospheres** — fog, sky color, sparkle particles, bloom, contact shadows
- **Fog walk-through intro** on quest entry with hero character reveal
- **Kid-friendly feedback** — concrete game advice, never raw errors or technical jargon

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + TypeScript + Tailwind CSS |
| 3D Engine | React Three Fiber + Drei |
| State | Zustand |
| AI | Claude Opus 4.6 (scene script generation) |
| Assets | KayKit + Tiny Treats (4,270+ GLTF models) |
| Audio | Web Audio API (synthesized SFX) + SpeechSynthesis (TTS) |
| Voice Input | Web Speech API (Chrome) |
| Build | Vite 5 |
| Deploy | Vercel |

## Architecture

```
                          +-----------------------+
                          |    3D Village World   |
                          |  (R3F + Drei + Three) |
                          +-----------+-----------+
                                      |
                            Player walks to zone
                                      |
                          +-----------v-----------+
                          |     Quest Zone UI     |
                          | Stage question + input|
                          +-----------+-----------+
                                      |
                              Kid types prompt
                                      |
              +-------------------------------------------+
              |         4-Tier Response Resolver           |
              |                                           |
              |  Tier 0: Story Matcher (pre-rendered)     |
              |  Tier 1: Cache (fuzzy keyword matching)   |
              |  Tier 2: Live API (Opus 4.6, 6s timeout)  |
              |  Tier 3: Fallback (safe default, instant)  |
              +-------------------------------------------+
                                      |
                          +-----------v-----------+
                          |   ScenePlayer3D       |
                          | spawn, move, animate, |
                          | react, emote, sfx     |
                          +-----------+-----------+
                                      |
                          +-----------v-----------+
                          |   Narration + Feedback |
                          |   TTS + hint system    |
                          +-----------------------+
```

**Key design decisions:**
- **Vocabulary contract** — Claude can ONLY reference pre-built assets (28 characters, 87 props, 139 animations). This prevents hallucinating assets that don't exist.
- **Scene scripts** — Claude returns structured JSON that the 3D engine executes as animated sequences. Never free text.
- **Story curriculum** — 220 pre-rendered responses mean the demo runs at zero latency with no API dependency. Fuzzy keyword matching ensures variations of expected inputs still match.
- **Error tolerance** — Unknown actors/props are silently skipped, missing characters auto-spawn on reference, SafeModel boundary catches GLTF failures. The demo never crashes.

## Quick Start

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5174
```

For live Claude API calls:
```bash
cp .env.example .env
# Add your VITE_ANTHROPIC_API_KEY
```

Without an API key, story responses, cached responses, and fallbacks all work — the game is fully playable.

## Controls

| Input | Action |
|-------|--------|
| WASD / Arrow keys | Move through village |
| Shift (hold) | Sprint |
| Q / E | Rotate camera |
| Walk to glowing circle | Enter quest zone |
| Type in text box | Describe what should happen |
| Click microphone | Voice input (Chrome) |

## Commands

```bash
cd frontend
npm run dev          # Start dev server (port 5174)
npm run build        # Production build (0 TS errors)
npm run preview      # Preview production build
```

## Project Structure

```
frontend/src/
├── game/                         # 3D game engine (React Three Fiber)
│   ├── R3FGame.tsx               # Root R3F canvas + village
│   ├── VillageWorld.tsx          # Village layout with 7 quest zones
│   ├── VillageCamera.tsx         # Third-person camera + player following
│   ├── PlayerCharacter.tsx       # WASD-controlled player avatar
│   ├── QuestZoneCircle.tsx       # Glowing zone entry rings
│   ├── ScenePlayer3D.tsx         # Core scene script executor (~950 lines)
│   ├── Character3D.tsx           # Animated character with skeleton clone
│   ├── Prop3D.tsx                # GLTF prop loading with bounce entrance
│   ├── AnimationController.ts    # 139 shared animation clips + crossfade
│   ├── TaskAtmosphere.tsx        # Per-quest fog, sky, particles, bloom
│   ├── TaskIntro.tsx             # Fog walk-through intro animation
│   ├── SceneEnvironment3D.tsx    # Dungeon, space, kitchen backdrops
│   └── SoundManager3D.ts        # Synthesized SFX (9 sound types)
├── services/                     # AI + response resolution
│   ├── claude.ts                 # Claude API client (Opus 4.6)
│   ├── cache.ts                  # Fuzzy keyword match cache
│   ├── resolver.ts               # 4-tier response resolver
│   ├── story-matcher.ts          # Fuzzy match to pre-rendered responses
│   ├── story-resolver.ts         # StoryResponse -> SceneScript converter
│   └── block-resolver.ts         # Block format -> SceneScript converter
├── data/                         # Pre-generated content
│   ├── stories/                  # 7 story curricula (220 responses)
│   │   ├── types.ts              # Story, StoryStage, StoryResponse types
│   │   ├── skeleton-birthday.ts  # Specificity curriculum
│   │   ├── knight-space.ts       # Sequencing curriculum
│   │   ├── mage-kitchen.ts       # Cause & effect curriculum
│   │   ├── barbarian-school.ts   # Audience curriculum
│   │   ├── dungeon-concert.ts    # Completeness curriculum
│   │   ├── skeleton-pizza.ts     # Constraints curriculum
│   │   ├── adventurers-picnic.ts # Creativity curriculum
│   │   └── index.ts              # Barrel export + getStoryById
│   ├── block-library.ts          # 87 prop paths + character registry
│   ├── fallback-scripts.ts       # 22 stage fallbacks + 7 zone fallbacks
│   └── asset-manifest.ts         # Full asset registry
├── prompts/                      # Claude system prompts
│   ├── block/                    # Block-format prompts (7 quests)
│   └── *.ts                      # Legacy scene-script prompts
├── stores/
│   └── gameStore.ts              # Zustand: zone nav, stage progression, input
├── components/
│   ├── PromptInput.tsx           # Input + feedback + hint + stage progress
│   ├── VoiceButton.tsx           # Web Speech API mic button
│   ├── LoadingScreen.tsx         # Branded preloader
│   └── ErrorBoundary.tsx         # React error boundary
├── hooks/
│   └── useTTS.ts                 # Text-to-speech narration
└── types/
    ├── scene-script.ts           # SceneScript + action types
    └── block-types.ts            # Block format types
```

## How the Story System Works

Each quest teaches a specific prompt engineering skill through progressive stages:

1. **Enter a zone** - Player walks to a glowing circle, camera flies in, narration introduces the challenge
2. **Read the question** - Each stage poses a specific question (e.g., "Who's invited to the party?")
3. **Type a description** - Kid describes what should happen in natural language
4. **Watch it play out** - Story matcher finds the best pre-rendered response, 3D scene animates
5. **Get feedback** - Success level (Amazing/Almost/Oops), concrete tips, missing elements highlighted
6. **Use hints if stuck** - 3 progressive hints per stage, from gentle nudge to specific suggestion
7. **Advance to next stage** - On success, move to the next stage with increased complexity

The curriculum progresses from simple specificity ("What kind of cake?") to creative expression ("Invent something nobody expects!").

## Build Stats

- 672 modules, 1,465 kB JS (382 kB gzip)
- 0 TypeScript errors
- 17/17 Puppeteer stress tests passed (empty input, XSS, SQL injection, emoji, gibberish, etc.)
- 220 pre-rendered story responses across 22 stages
- 28 character models, 139 animations, 87 props

## License

MIT

## Credits

- **AI:** [Claude Opus 4.6](https://anthropic.com) by Anthropic
- **Build Tool:** [Claude Code](https://claude.ai/code) by Anthropic
- **3D Engine:** [React Three Fiber](https://github.com/pmndrs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei)
- **3D Assets:** [KayKit](https://kaylousberg.com/game-assets) + [Tiny Treats](https://kaylousberg.com/game-assets)
- **Fonts:** [Fredoka](https://fonts.google.com/specimen/Fredoka) + [Nunito](https://fonts.google.com/specimen/Nunito)
