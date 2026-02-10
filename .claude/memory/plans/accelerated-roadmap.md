# Accelerated Roadmap — Prompt Quest

**Created:** 2026-02-10
**Status:** PENDING APPROVAL
**Scope:** Assets + 4 new tasks + game juice + SFX + polish
**Estimate:** 5 phases across Days 1-5 (Day 6-7 = cache + demo prep)

---

## Current State

- Days 1-2 of original 7-day roadmap COMPLETE
- 2 tasks working (Monster Party + Robot Pizza)
- 20+ cached responses, three-tier resolver, voice input, error boundaries
- 23 Kenney raw packs downloaded (5,161 PNGs + audio files)
- Organized asset directories empty (actors/, props/, backdrops/, sfx/)
- 165 tests passing, 0 TypeScript errors, production build works

## Architecture for Adding a New Task

Each new task requires exactly 7 file changes:
1. `types/scene-script.ts` — Add actors/props to vocabulary (if new)
2. `prompts/{task-name}.ts` — System prompt (clone existing, ~55 lines)
3. `game/scenes/{TaskName}Scene.ts` — Phaser scene (clone existing, ~250 lines)
4. `stores/gameStore.ts` — Add to SYSTEM_PROMPTS dictionary (1 line)
5. `data/fallback-scripts.ts` — Add Tier 3 fallback (12 lines)
6. `App.tsx` — Add to TASKS dictionary (1 line)
7. `game/PhaserGame.tsx` — Register scene in config (1 line + 1 import)

SceneScriptPlayer and resolver need ZERO changes — they're task-agnostic.

---

## Phase 1: Asset Pipeline (Day 1 Morning)

**Goal:** Extract assets from raw packs → organized directories. Wire into scenes. Replace all placeholders.

### Task 1.1: Extract & organize actor sprites
**Files:** `public/assets/actors/`
**Source mappings:**
| Actor | Source Pack | Source File |
|-------|-----------|-------------|
| `monster` | kenney_monster-builder-pack | Composite: body + arms + eyes + mouth |
| `kid` | kenney_toon-characters-1 | `character_malePerson_idle.png` |
| `robot` | kenney_robot-pack | `robot_yellowDrive1.png` (side view) |
| `dog` | kenney_animal-pack-redux | `dog.png` |
| `wizard` | kenney_toon-characters-1 | `character_maleAdventurer_idle.png` |
| `trex` | kenney_platformer-enemies | Best monster/dinosaur sprite available |
| `octopus` | kenney_platformer-enemies | Use a slime/creature sprite as proxy |
| `fish` | kenney_fish-pack | `fish_blue.png` |
| `squirrel` | kenney_animal-pack-redux | `squirrel.png` or closest match |

**Verification:** `ls public/assets/actors/` shows 9 PNG files matching ActorKey type names

### Task 1.2: Extract & organize prop sprites
**Files:** `public/assets/props/`
**Source mappings (HIGH + MEDIUM priority):**
| Prop | Source Pack | Source File |
|------|-----------|-------------|
| `cake` | kenney_food-kit | `cake.png` |
| `cake-giant` | kenney_food-kit | `cake-birthday.png` (or scale cake) |
| `cake-tiny` | kenney_food-kit | `cupcake.png` |
| `balloon` | kenney_emotes-pack | Closest match or custom SVG |
| `present` | kenney_game-icons | Gift/box icon |
| `pizza` | kenney_food-kit | `pizza.png` |
| `pizza-soggy` | kenney_food-kit | Modified pizza |
| `rocket` | kenney_space-shooter-redux | `playerShip1_blue.png` |
| `moon` | kenney_background-elements | `moon_full.png` |
| `desk` | kenney_furniture-kit | `desk.png` |
| `chair` | kenney_furniture-kit | `chair.png` |
| `fridge` | kenney_furniture-kit | `kitchenFridgeLarge.png` |
| `toaster` | kenney_furniture-kit | `toaster.png` |
| `soup-bowl` | kenney_food-kit | Closest bowl/food item |
| `plates` | kenney_food-kit | Plate-like food item |
| `pencil` | kenney_game-icons | Pencil/writing icon |
| `guitar` | Custom SVG | Simple guitar |
| `drums` | Custom SVG | Simple drum kit |
| `microphone` | Custom SVG | Simple mic |
| `bone` | kenney_game-icons | Bone icon or custom |
| `stars` | kenney_particle-pack | `star_01.png` |
| `lunchbox` | Custom SVG | Simple lunchbox |
| `fire-extinguisher` | Custom SVG | Simple extinguisher |
| `keyboard` | Custom SVG | Music keyboard |
| `spacesuit` | Custom SVG | Simple spacesuit |
| `flag` | Custom SVG | Simple flag |
| `river` | Custom SVG | Water strip |
| `pillow-fort` | Custom SVG | Pillow pile |

**Verification:** `ls public/assets/props/` shows PNG files for all PropKey values

### Task 1.3: Create backdrop images
**Files:** `public/assets/backdrops/`
**Need 6 backdrops at 1024x576:**
| Backdrop | Approach |
|----------|----------|
| `party-room.png` | Kenney background-elements composite or SVG |
| `city-street.png` | Kenney rpg-urban-pack tiles composite |
| `space.png` | Kenney space-shooter-redux starfield |
| `wizard-kitchen.png` | Kenney furniture-kit composite |
| `classroom.png` | Kenney furniture-kit composite |
| `underwater-stage.png` | Kenney fish-pack background layers |

**Note:** Can also use solid color gradients with a few props if compositing is too slow. The procedural backgrounds in MonsterPartyScene and RobotPizzaScene already look good.

**Verification:** `ls public/assets/backdrops/` shows 6 PNG files

### Task 1.4: Extract audio assets
**Files:** `public/assets/sfx/`
**Source mappings:**
| SFX Key | Source | File |
|---------|--------|------|
| `click` | kenney_interface-sounds | `select_003.ogg` |
| `submit` | kenney_digital-audio | `phaseJump2.ogg` |
| `success` | kenney_music-jingles | `jingles_PIZZI09.ogg` (upbeat) |
| `funny-fail` | kenney_interface-sounds | `error_008.ogg` |
| `whoosh` | kenney_digital-audio | `phaserUp7.ogg` |
| `pop` | kenney_interface-sounds | `toggle_001.ogg` |
| `boing` | kenney_impact-sounds | `impactSoft_medium_002.ogg` |

**Verification:** `ls public/assets/sfx/` shows 7+ OGG files

### Task 1.5: Wire assets into existing scenes
**Files to modify:**
- `game/scenes/MonsterPartyScene.ts` — Add `preload()` calls for monster, cake, balloon, present, party-room backdrop
- `game/scenes/RobotPizzaScene.ts` — Add `preload()` calls for robot, pizza, city-street backdrop

**Verification:** Run `npm run dev`, both scenes show real sprites instead of colored rectangles

---

## Phase 2: Game Juice (Day 1 Afternoon)

**Goal:** Typewriter narration, loading states, celebration upgrades, SFX system.

### Task 2.1: Add SFX manager to SceneScriptPlayer
**File:** `frontend/src/game/SoundManager.ts` (NEW, ~60 lines)
**Changes:**
- Create simple SoundManager class that wraps Phaser.Sound
- Preload all sfx/ files in each scene's `preload()`
- Wire into SceneScriptPlayer's `doSfx()` method (currently a no-op at line 99)
- Play `pop` on spawn, `whoosh` on move, `success`/`funny-fail` on post-effects
- Respect a mute toggle (stored in Zustand)

**File:** `frontend/src/game/SceneScriptPlayer.ts`
- Update `doSfx()` to actually play sounds via SoundManager
- Add sound triggers in `doSpawn()`, `doMove()`, `doReact()`

**Verification:** Sounds play on spawn/move/success. Mute button silences all.

### Task 2.2: Typewriter narration effect
**File:** `frontend/src/game/scenes/MonsterPartyScene.ts` (modify `showNarration`)
**File:** `frontend/src/game/scenes/RobotPizzaScene.ts` (same)
**Changes:**
- Current narration appears instantly via `setText()`
- Change to reveal 1 character at a time (40ms/char per brand brief)
- Use `scene.time.addEvent` with delay loop
- Wait for full text before proceeding to actions

**Verification:** Narration text types out letter-by-letter in both scenes

### Task 2.3: Loading state with funny messages
**File:** `frontend/src/components/PromptInput.tsx`
**Changes:**
- When `isLoading: true`, show rotating funny messages instead of static spinner
- Messages rotate every 2s: "The monster is warming up...", "Setting up the scene...", "This is gonna be good...", "Almost ready..."
- Per-task message sets (monster vs robot vs wizard etc.)
- Pulsing animation on the loading text

**Verification:** Submit input → see rotating funny messages during loading → result appears

### Task 2.4: Celebration upgrade
**File:** `frontend/src/game/SceneScriptPlayer.ts` (modify `doReact` for confetti-burst)
**Changes:**
- Current confetti-burst uses 15 emoji text objects
- Upgrade: Spawn 30+ small particle sprites from particle-pack (star, spark textures)
- Add screen shake (2px, 200ms) on FUNNY_FAIL
- Add golden flash overlay (100ms) on FULL_SUCCESS before confetti

**Verification:** FULL_SUCCESS shows enhanced confetti + flash. FUNNY_FAIL shows screen shake.

### Task 2.5: Mute button in UI
**File:** `frontend/src/App.tsx`
**File:** `frontend/src/stores/gameStore.ts`
**Changes:**
- Add `isMuted: boolean` to Zustand store
- Add mute/unmute icon button in header (top-right)
- SoundManager reads from store

**Verification:** Mute button toggles all game audio on/off

---

## Phase 3: New Tasks — Wizard Kitchen + Dinosaur School (Day 2)

**Goal:** Add 2 more tasks. Total: 4 tasks.

### Task 3.1: Wizard's Kitchen Disaster
**New files:**
- `frontend/src/prompts/wizard-kitchen.ts` (~55 lines)
  - Context: Wizard's spell went wrong, kitchen appliances are alive
  - FULL_SUCCESS: Fix ALL chaos (plates, soup, toaster, fridge) with specific solutions
  - PARTIAL_SUCCESS: Fix 1-2 items, others stay chaotic
  - FUNNY_FAIL: Vague ("fix kitchen") → wizard makes it worse
  - Vocab: wizard, kid actors + plates, soup-bowl, toaster, fridge, fire-extinguisher props
- `frontend/src/game/scenes/WizardKitchenScene.ts` (~250 lines)
  - Clone RobotPizzaScene structure
  - Scene key: `'WizardKitchenScene'`
  - Background: kitchen theme (purple/blue tones)
  - Persistent wizard character (drawn procedurally or loaded from asset)
  - Floating plates animation in background

**Modified files:**
- `stores/gameStore.ts` — Add `WIZARD_KITCHEN_PROMPT` to SYSTEM_PROMPTS
- `data/fallback-scripts.ts` — Add `'wizard-kitchen'` fallback
- `App.tsx` — Add to TASKS: `{ label: "Wizard's Kitchen", emoji: "🧙‍♂️🍳", scene: "WizardKitchenScene" }`
- `game/PhaserGame.tsx` — Import + register WizardKitchenScene

**Verification:** Click Wizard Kitchen tab → see kitchen scene → type "fix the kitchen" → get PARTIAL_SUCCESS → type detailed fix → FULL_SUCCESS

### Task 3.2: Dinosaur's First Day of School
**New files:**
- `frontend/src/prompts/dinosaur-school.ts` (~55 lines)
  - Context: T-Rex starting kindergarten, everything is too small
  - FULL_SUCCESS: Solve door, pencil, lunch, chair problems specifically
  - PARTIAL_SUCCESS: Solve 1-2 problems
  - FUNNY_FAIL: Vague → T-Rex breaks everything
  - Vocab: trex, kid actors + desk, pencil, chair, lunchbox props
- `frontend/src/game/scenes/DinosaurSchoolScene.ts` (~250 lines)
  - Clone MonsterPartyScene structure
  - Scene key: `'DinosaurSchoolScene'`
  - Background: classroom theme (warm yellows/greens)
  - Persistent T-Rex character

**Modified files:**
- `stores/gameStore.ts` — Add `DINOSAUR_SCHOOL_PROMPT` to SYSTEM_PROMPTS
- `data/fallback-scripts.ts` — Add `'dinosaur-school'` fallback
- `App.tsx` — Add to TASKS
- `game/PhaserGame.tsx` — Import + register DinosaurSchoolScene

**Verification:** Click Dinosaur School tab → see classroom scene → play through all 3 success levels

### Task 3.3: Generate cache entries for new tasks
**File:** `frontend/src/data/demo-cache.json`
**Changes:**
- Run `scripts/build-cache.ts` with new task prompts
- Add 10-12 entries per new task (4 FULL_SUCCESS, 4 PARTIAL, 4 FUNNY_FAIL)
- Total cache: ~44 entries (20 existing + 24 new)

**Verification:** Type cached input for wizard/dino → instant response from Tier 1

---

## Phase 4: New Tasks — Dog Space + Octopus Band (Day 3)

**Goal:** Add 2 more tasks. Total: 6 tasks (complete game).

### Task 4.1: Dog Space Mission
**New files:**
- `frontend/src/prompts/dog-space.ts` (~55 lines)
  - Context: Launch a dog into space safely
  - FULL_SUCCESS: Rocket + spacesuit + snacks + window problem solved
  - Vocab: dog, kid actors + rocket, spacesuit, moon, flag, bone props
- `frontend/src/game/scenes/DogSpaceScene.ts` (~250 lines)
  - Starfield background with twinkling stars
  - Persistent dog character

**Modified files:** Same pattern as Phase 3 (gameStore, fallback-scripts, App.tsx, PhaserGame.tsx)

**Verification:** Dog Space task works through all 3 success levels

### Task 4.2: Octopus Rock Band
**New files:**
- `frontend/src/prompts/octopus-band.ts` (~55 lines)
  - Context: Octopus wants to start a band with 8 arms
  - FULL_SUCCESS: Instruments + stage + song + audience
  - Vocab: octopus, fish actors + guitar, drums, keyboard, microphone props
- `frontend/src/game/scenes/OctopusBandScene.ts` (~250 lines)
  - Underwater stage background
  - Persistent octopus character

**Modified files:** Same pattern

**Verification:** Octopus Band task works through all 3 success levels

### Task 4.3: Task selector card grid
**File:** `frontend/src/App.tsx` (major UI change)
**Changes:**
- Replace header tab buttons with card-grid task selector
- 6 cards in 2x3 or 3x2 grid
- Each card: emoji (48px), title, short description
- Hover: border glow, emoji bounce (scale 1.15)
- Active: scale(0.97) press effect
- Card click → switches scene + hides grid → shows game
- "Back to tasks" button to return to grid

**Verification:** App opens to card grid → click a task → game loads → back button returns to grid

### Task 4.4: Generate cache for all 6 tasks
- Run build-cache.ts for dog-space and octopus-band
- Total cache: ~66 entries (20 + 24 + 22 new)

---

## Phase 5: Polish + Deploy (Day 4)

**Goal:** Final polish, accessibility, deploy to Vercel.

### Task 5.1: Keyboard navigation
**File:** `frontend/src/components/PromptInput.tsx`
**File:** `frontend/src/App.tsx`
**Changes:**
- Tab through all interactive elements
- Enter to submit (already works in textarea? verify)
- Escape to close feedback panel
- Visible focus indicators (2px purple outline)
- Arrow keys to navigate task cards

**Verification:** Complete full game flow using only keyboard

### Task 5.2: prefers-reduced-motion
**File:** `frontend/src/game/SceneScriptPlayer.ts`
**Changes:**
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')`
- If true: skip tween animations, instant position changes, no screen shake
- Still show narration and feedback (just no movement)

**Verification:** Enable reduced motion in OS settings → game still playable, no animations

### Task 5.3: Clean up SaaS template leftovers
**Delete files:**
- `frontend/src/components/Layout.tsx`, `DataTable.tsx`, `Modal.tsx`, `Toast.tsx`, `FileUploader.tsx`, `Pagination.tsx`
- `frontend/src/services/authApi.ts`, `itemsApi.ts`
- `frontend/src/types/auth.ts`, `items.ts`
- `frontend/src/pages/*`, `frontend/src/contexts/*`
- `scripts/setup.sh`, `scripts/backup_database.sh`, `scripts/install-hooks.sh`
- `CHECKLIST.md`, `IMPLEMENTATION_SUMMARY.md`

**Verification:** `npm run build` still succeeds with 0 errors

### Task 5.4: Deploy to Vercel
**Commands:**
```bash
cd frontend && npm run build
vercel --prod
```
- Set `VITE_ANTHROPIC_API_KEY` env var in Vercel
- Test deployed URL on Chrome

**Verification:** Deployed URL loads, all 6 tasks work, cache serves instant responses

### Task 5.5: Stress test
- Test all 6 tasks with: empty string, 500 chars, gibberish, non-English, unrelated questions
- Verify every failure mode → Tier 3 fallback (never error screen)
- Test on Chrome, Firefox, Safari
- Test voice input on Chrome

**Verification:** 30 minutes of free-play testing finds no crashes

---

## Days 5-6: Golden Cache + Final Polish

### Task 6.1: Regenerate full cache
- Run build-cache.ts for ALL 6 tasks
- Target: 15-20 entries per task = 90-120 total cached responses
- Fuzzy matching extends coverage to ~3x that many inputs

### Task 6.2: Final bug fixes from stress testing

### Task 6.3: README update with screenshots

---

## Day 7: Demo Prep

- Record backup demo video
- Write 2-minute pitch script (updated for 6 tasks)
- Practice 3x
- Run pre-demo checklist
- Rest

---

## File Change Summary

### New Files (12)
| File | Lines | Purpose |
|------|-------|---------|
| `game/SoundManager.ts` | ~60 | SFX playback wrapper |
| `prompts/wizard-kitchen.ts` | ~55 | Wizard Kitchen system prompt |
| `prompts/dinosaur-school.ts` | ~55 | Dinosaur School system prompt |
| `prompts/dog-space.ts` | ~55 | Dog Space system prompt |
| `prompts/octopus-band.ts` | ~55 | Octopus Band system prompt |
| `game/scenes/WizardKitchenScene.ts` | ~250 | Wizard Kitchen Phaser scene |
| `game/scenes/DinosaurSchoolScene.ts` | ~250 | Dinosaur School Phaser scene |
| `game/scenes/DogSpaceScene.ts` | ~250 | Dog Space Phaser scene |
| `game/scenes/OctopusBandScene.ts` | ~250 | Octopus Band Phaser scene |
| `public/assets/actors/*.png` | — | 9 actor sprites |
| `public/assets/props/*.png` | — | 28 prop sprites |
| `public/assets/sfx/*.ogg` | — | 7+ sound effects |

### Modified Files (8)
| File | Changes |
|------|---------|
| `types/scene-script.ts` | No changes needed — vocabulary already includes all 6 tasks |
| `stores/gameStore.ts` | +4 entries in SYSTEM_PROMPTS |
| `data/fallback-scripts.ts` | +4 fallback entries |
| `App.tsx` | +4 TASKS entries, task selector card grid |
| `game/PhaserGame.tsx` | +4 scene imports + registrations |
| `game/SceneScriptPlayer.ts` | SFX hooks, celebration upgrade, reduced-motion |
| `game/scenes/MonsterPartyScene.ts` | Asset preload, typewriter narration |
| `game/scenes/RobotPizzaScene.ts` | Asset preload, typewriter narration |
| `components/PromptInput.tsx` | Loading messages, keyboard nav |

### Deleted Files (~15)
SaaS template leftovers (Layout, DataTable, Modal, Toast, etc.)

---

## Risk Assessment

| Risk | Mitigation | Impact |
|------|------------|--------|
| Asset extraction takes too long | Placeholder system means demo works NOW. Assets are polish, not blocker. | Low |
| Some Kenney assets don't match style | Use placeholder system for mismatched ones, custom SVGs for gaps | Low |
| 4 new tasks = 4x more edge cases | Each task reuses SceneScriptPlayer (tested). Only prompts are new. Cache covers demo paths. | Medium |
| Task selector UI change breaks layout | Keep current tab UI as fallback. Card grid is enhancement. | Low |
| SFX causes browser autoplay issues | Require user interaction before playing audio (click to start). Mute by default option. | Low |

## Success Criteria

- [ ] 6 tasks playable with real assets (not placeholders)
- [ ] Sound effects on spawn/move/success/fail
- [ ] Typewriter narration in all scenes
- [ ] Funny loading messages during API calls
- [ ] 90+ cached responses across all tasks
- [ ] Task selector card grid
- [ ] Deployed to Vercel
- [ ] 30 minutes of stress testing finds no crashes
- [ ] Keyboard navigable
- [ ] Mute button works
