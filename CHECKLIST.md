# Prompt Quest — Build Checklist

Track progress against the 7-day roadmap. Updated as work completes.

## Day 1: Foundation (Mon Feb 10)

### Morning — Phaser + React Setup
- [ ] Clone Phaser React template, verify default scene renders
- [ ] Install dependencies: Zustand, Anthropic SDK, shadcn/ui

### Afternoon — Claude API + System Prompt
- [ ] Set up Claude API client (`src/services/claude.ts`)
- [ ] Write Monster Party system prompt (`src/prompts/monster-party.ts`)
- [ ] Test Claude returns valid JSON for 5 test inputs

### Evening — Asset Sourcing
- [x] Source assets from Kenney.nl (CC0)
  - [x] Download 5 HIGH priority packs (Particle, Toon Characters, Food Kit, Emotes, Game Icons)
  - [x] Download 8 MEDIUM priority packs (Animal, Space, Furniture, Fish, RPG Urban, UI, Platformer Enemies, Background Elements)
  - [x] Extract all 13 packs to `public/assets/raw-packs/` (5,161 PNGs, 125MB)
  - [x] Create directory structure: `actors/`, `props/`, `backdrops/`, `reactions/`, `effects/`, `ui/`, `sfx/`
  - [x] Create comprehensive `ASSET-MANIFEST.md` (141 assets, 4 priority levels)
- [ ] Select and rename best assets per vocabulary contract key
- [ ] Source missing actors: monster, trex, octopus, squirrel (itch.io/OpenGameArt)
- [ ] Create custom SVGs for missing props: balloon, present, instruments

**Gate:** Phaser scene loads, Claude returns valid JSON for "throw a huge cake"

---

## Day 2: Core Loop (Tue Feb 11)

### Morning — Phaser Scene + Script Player
- [ ] Create MonsterPartyScene with preload for all assets
- [ ] Build SceneScriptPlayer (spawn, move, animate, react)
- [ ] Wire EventBus between React and Phaser

### Afternoon — React UI
- [ ] Build minimal input UI (textarea + submit button)
- [ ] Connect to Claude API via resolver
- [ ] Show narration text during animation

### Evening — Integration Test
- [ ] Test full loop 10 times with varied inputs
- [ ] Add confetti celebration on FULL_SUCCESS

**Gate:** Type input → Claude → cake animates → monster reacts → confetti

---

## Day 3: Cache + Feedback (Wed Feb 12)

- [ ] Build response cache system with fuzzy matching
- [ ] Add three-tier resolver (cache → API → fallback)
- [ ] Build prompt feedback panel
- [ ] Pre-cache 10 responses manually

**Gate:** Cached inputs return instantly, feedback shows concrete tips

---

## Day 4: Polish + Second Task (Thu Feb 13)

- [ ] Monster Party polish: 20+ edge cases tested
- [ ] Error boundary around Phaser
- [ ] Handle malformed Claude responses gracefully
- [ ] Loading states (spinner or animation)
- [ ] Voice input button (optional, Chrome-only)
- [ ] **Decision:** Is Monster Party flawless? → Start Robot Pizza (conditional)

**Gate:** Monster Party is demo-ready

---

## Day 5: Deploy + Stress Test (Fri Feb 14)

- [ ] Deploy to Vercel with `VITE_ANTHROPIC_API_KEY`
- [ ] Add task selector (if 2 tasks)
- [ ] Stress test weird inputs (empty, 500 chars, gibberish, non-English)
- [ ] Verify all failure modes gracefully handled
- [ ] Test Chrome, Firefox, Safari

**Gate:** Deployed, no crashes in 30 min free-play

---

## Day 6: Golden Response Cache (Sat Feb 15)

- [ ] Build cache generation script (`scripts/build-cache.ts`)
- [ ] Generate 20-30 Opus responses
- [ ] Load cache on app startup
- [ ] Final bug fixes
- [ ] Optimize asset loading (compress PNGs, verify <100KB each)
- [ ] Create fallback responses for each task

**Gate:** Cache loaded with 20+ responses, deployed version uses cache

---

## Day 7: Demo Prep (Sun Feb 16)

- [ ] Record backup demo video (2-3 min)
- [ ] Write 2-min pitch script
- [ ] Practice pitch 3 times
- [ ] Create pitch deck (3-5 slides)
- [ ] Prepare GitHub README with screenshots
- [ ] Run pre-demo checklist
- [ ] Sleep 8 hours

**Gate:** Pitch practiced, backup video recorded, checklist complete

---

## Asset Library Status

### Downloaded Packs (13 total, all CC0)
| # | Pack | Size | Priority |
|---|------|------|----------|
| 1 | Kenney Particle Pack | 15MB | HIGH |
| 2 | Kenney Toon Characters 1 | 6.9MB | HIGH |
| 3 | Kenney Food Kit | 15MB | HIGH |
| 4 | Kenney Emotes Pack | 2.2MB | HIGH |
| 5 | Kenney Game Icons | 4.7MB | HIGH |
| 6 | Kenney Animal Pack Redux | 5.2MB | MEDIUM |
| 7 | Kenney Space Shooter Redux | 2.4MB | MEDIUM |
| 8 | Kenney Furniture Kit | 20MB | MEDIUM |
| 9 | Kenney Fish Pack | 1.8MB | MEDIUM |
| 10 | Kenney RPG Urban Pack | 2.1MB | MEDIUM |
| 11 | Kenney UI Pack | 5.3MB | MEDIUM |
| 12 | Kenney Platformer Enemies | 1.8MB | MEDIUM |
| 13 | Kenney Background Elements | 1.6MB | MEDIUM |

### Coverage Gaps
- **Actors needed from other sources:** monster, trex, octopus, squirrel, wizard
- **Props needing custom SVGs:** balloon, present, bone, guitar, drums, keyboard, microphone, lunchbox, river, pillow-fort, fire-extinguisher
- **Backdrops:** All 6 need composition or sourcing (party-room, space, wizard-kitchen, classroom, underwater-stage, city-street)

Full manifest: `frontend/public/assets/ASSET-MANIFEST.md`
