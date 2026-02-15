# Asset Expansion Summary

What was added, where it lives, and what's registered in code.

## Quick Stats

| Category | Files on Disk | Registered in Code | Coverage |
|----------|--------------|-------------------|----------|
| 3D Props (all sources) | 2,359 | 2,186 PROP_PATHS | 93% |
| Audio (OGG) | 665 | 30 (21 SFX + 9 music) | 4.5% |
| Emojis (PNG) | 254 | 254 (all accessible) | 100% |
| **Total new assets** | **3,278** | **2,470** | — |

> 3D prop coverage is 93% — all 1,636 Kenney GLBs are registered with `_kn` suffix
> for collision resolution. Audio files beyond the 30 registered are bonus inventory
> for future SFX expansion.

---

## 1. Pixel-Art Emoji Pack (JoyQuest 2.0)

**Source:** `Model Zips/emoji_comic_pack_Joyquest_2.0.zip`
**License:** Purchased asset pack

### On Disk

| Directory | Files | Format | Size |
|-----------|-------|--------|------|
| `frontend/public/assets/2d/emojis/outline/` | 127 PNGs | 16x16 px | For particle burst effects |
| `frontend/public/assets/2d/emojis/bubble/` | 127 PNGs | 32x32 px | For character emote bubbles |

**Naming:** `em_outline_{1-127}.png` (1-indexed), `bubble_{0-126}.png` (0-indexed)

### Registered

| File | What | Entries |
|------|------|---------|
| `frontend/src/data/emoji-map.ts` | Semantic name to emoji number mapping | 36 names |
| | `getEmojiOutlinePath()` helper | Accepts name or number 1-127 |
| | `getEmojiBubblePath()` helper | Accepts name or number 1-127 |

**Usage in game:** `ScenePlayer3D.tsx` renders pixel-art `<img>` bubbles above characters on
emote actions, and pixel-art particle bursts on react effects. Falls back to Unicode emoji
for unmapped names.

---

## 2. FoodMegaPack (3D Models)

**Source:** `Model Zips/FoodMegaPack_Free.zip`
**License:** Free asset pack

### On Disk

| Directory | Files | Content |
|-----------|-------|---------|
| `frontend/public/assets/3d/food-mega-pack/` | 173 GLBs | Textured 3D food models |

**Structure:** `{Category}/{Item}/{Item}_01.glb` — each subfolder has a `Texture.png`

**Categories:** Fruits (9 + slices), Vegetables (14 + slices), Bread (4 + halves/slices),
Cheese (4 + slices), Meat (3 + slices), Fish (2 + cuts), Dessert (3 + slices),
Drinks (3), Cutlery (8), Jars (3), Mushroom (1 + slice)

### Registered

| Location | Entries | Notes |
|----------|---------|-------|
| `PROP_PATHS` in ScenePlayer3D.tsx | 91 entries | `food-mega-pack/` prefix |
| `PROP_SCALE` in ScenePlayer3D.tsx | Per-category scales | Fruits 3.0, Veg 3.0, Bread/Cheese/Meat 2.5, Fish 2.0, Cutlery 3.0 |

**Collision handling:** Uses `_fmp` suffix where names collide with existing props
(e.g., `apple_fmp`, `banana_fmp`, `lemon_fmp`).

---

## 3. Kenney All-in-1 v3.3.0 (3D Packs)

**Source:** `Model Zips/Kenney Game Assets All-in-1 3.3.0.zip` (456MB)
**License:** CC0 (public domain)

### On Disk

| Directory | GLBs | Relevance |
|-----------|------|-----------|
| `frontend/public/assets/3d/kenney/nature-kit/` | 329 | Trees, rocks, plants — picnic/outdoor |
| `frontend/public/assets/3d/kenney/food-kit/` | 200 | Food items — kitchen/restaurant |
| `frontend/public/assets/3d/kenney/space-station/` | 177 | Station modules — space mission |
| `frontend/public/assets/3d/kenney/fantasy-town/` | 167 | Medieval buildings — village |
| `frontend/public/assets/3d/kenney/space-kit/` | 153 | Vehicles, stations — space |
| `frontend/public/assets/3d/kenney/furniture-kit/` | 140 | Indoor furniture — school/kitchen |
| `frontend/public/assets/3d/kenney/holiday-kit/` | 99 | Decorations, presents — birthday |
| `frontend/public/assets/3d/kenney/graveyard-kit/` | 91 | Tombstones, spooky — skeleton tasks |
| `frontend/public/assets/3d/kenney/survival-kit/` | 80 | Camping gear |
| `frontend/public/assets/3d/kenney/castle-kit/` | 76 | Castle walls, towers — dungeon |
| `frontend/public/assets/3d/kenney/pirate-kit/` | 66 | Ships, treasure |
| `frontend/public/assets/3d/kenney/weapon-pack/` | 37 | Medieval weapons |
| `frontend/public/assets/3d/kenney/mini-dungeon/` | 21 | Small dungeon set |
| **Total** | **1,636** | **~31MB** |

### Registered

**All 1,636 GLBs registered in PROP_PATHS** in `ScenePlayer3D.tsx`.

| Detail | Value |
|--------|-------|
| Total entries | 1,636 |
| Path prefix | `kenney/{pack-name}/` |
| Collision suffix | `_kn` (160 collisions with existing props) |
| Scale system | `KENNEY_PACK_SCALE` lookup by path prefix |

**Per-pack default scales** (via `KENNEY_PACK_SCALE` in `resolvePropScale()`):

| Pack | Scale | Rationale |
|------|-------|-----------|
| fantasy-town, food-kit, holiday-kit | 3.0 | Small models, match hex building scale |
| castle-kit, furniture-kit, graveyard-kit, nature-kit, pirate-kit, survival-kit, weapon-pack | 2.5 | Medium architectural/prop scale |
| mini-dungeon, space-kit, space-station | 2.0 | Already decent native size |

**File naming:** All spaces replaced with hyphens. Example: `chair_01.glb`, `table-round_01.glb`

---

## 4. Kenney All-in-1 v3.3.0 (Audio)

**Source:** Same zip as above
**License:** CC0 (public domain)

### On Disk

| Directory | OGGs | Content |
|-----------|------|---------|
| `frontend/public/assets/audio/ui/` | 151 | Clicks, confirmations, toggles, scrolls |
| `frontend/public/assets/audio/impact/` | 130 | Footsteps (5 surfaces), impacts (metal/wood/glass) |
| `frontend/public/assets/audio/jingles/` | 85 | Victory stingers — 5 styles x 17 each |
| `frontend/public/assets/audio/retro/` | 84 | 8-bit SFX: coins, jumps, explosions, loses |
| `frontend/public/assets/audio/scifi/` | 73 | Space engines, lasers, force fields |
| `frontend/public/assets/audio/sfx/` | 62 | Digital synth: power-ups, phase jumps, zaps |
| `frontend/public/assets/audio/rpg/` | 51 | Books, doors, knives, footsteps, coins |
| `frontend/public/assets/audio/music/` | 29 | Background loops and idents |
| **Total** | **665** | **~20MB** |

### Registered

**SFX (21 files mapped in `SOUND_FILES`):**

| Sound Type | Files | Source |
|------------|-------|--------|
| `spawn` | pepSound1-3.ogg | sfx/ |
| `move` | phaseJump1-3.ogg | sfx/ |
| `react` | powerUp1-3.ogg | sfx/ |
| `success` | jingles-pizzicato_00-01.ogg | jingles/ |
| `partial` | jingles-steel_00-01.ogg | jingles/ |
| `fail` | lose1-3.ogg | retro/ |
| `click` | click_001-003.ogg | ui/ |
| `remove` | minimize_001-002.ogg | ui/ |
| `intro` | *(synthesized — no file)* | — |

**Background Music (9 tracks mapped in `ZONE_MUSIC`):**

| Zone | Track | File |
|------|-------|------|
| Village (overworld) | Mishief Stroll | music/Mishief-Stroll.ogg |
| Skeleton Birthday | Retro Mystic | music/Retro-Mystic.ogg |
| Knight Space | Space Cadet | music/Space-Cadet.ogg |
| Mage Kitchen | Italian Mom | music/Italian-Mom.ogg |
| Barbarian School | Cheerful Annoyance | music/Cheerful-Annoyance.ogg |
| Dungeon Concert | Alpha Dance | music/Alpha-Dance.ogg |
| Skeleton Pizza | Retro Comedy | music/Retro-Comedy.ogg |
| Adventurers Picnic | Farm Frolics | music/Farm-Frolics.ogg |
| Title Screen | Wacky Waiting | music/Wacky-Waiting.ogg |

**Remaining 635 OGGs** are on-disk inventory for future use (additional jingle styles,
RPG ambience, footstep variations, sci-fi effects, etc.).

---

## 5. Existing 3D Prop Sources (Pre-Expansion)

For reference, these were already registered before this expansion:

| Source | PROP_PATHS Entries | Location |
|--------|-------------------|----------|
| **Kenney All-in-1 (new)** | **1,636** | `kenney/` prefix |
| Quaternius | 150 | `quaternius/` prefix |
| Tiny Treats | 96 | `tiny-treats/` prefix |
| Poly Pizza | 95 | `poly-pizza/` prefix |
| KayKit | 92 | `kaykit/` prefix |
| **FoodMegaPack (new)** | **91** | `food-mega-pack/` prefix |
| Living Room | 16 | `living-room/` prefix |
| Cartoon City | 10 | `cartoon-city/` prefix |
| **Grand Total** | **2,186** | |

---

## 6. Key Code Files

| File | Role |
|------|------|
| `frontend/src/game/SoundManager3D.ts` | Audio engine — OGG playback + music + synth fallbacks (470 lines) |
| `frontend/src/game/ScenePlayer3D.tsx` | 3D scene executor — PROP_PATHS, PROP_SCALE, emote/particle rendering |
| `frontend/src/data/emoji-map.ts` | Emoji semantic names to JoyQuest numbers + path helpers |
| `frontend/src/App.tsx` | Music wiring — zone changes trigger `playMusic()` |
| `frontend/src/components/SettingsPanel.tsx` | Mute toggle (controls both SFX and music) |

---

## 7. Architecture Notes

### Audio Fallback Strategy
1. On `play('spawn')`, check AudioBuffer cache for OGG
2. If cached: play instantly via Web Audio API
3. If not cached: play synthesized sound immediately, load OGG in background
4. Next `play('spawn')` uses real audio from cache

### Music System
- HTMLAudioElement streaming (not decoded upfront like SFX)
- `loop = true` for continuous playback
- Fade-in ~1.5s, fade-out ~0.5s via `setInterval`
- Autoplay policy: queues resume on first click/keydown
- Zone changes crossfade between tracks

### Emoji Rendering
- Character emotes: 32x32 bubble PNGs displayed at 48x48 with `image-rendering: pixelated`
- Particle effects: 16x16 outline PNGs displayed at 28x28 with CSS keyframe animations
- Falls back to Unicode emoji text for unmapped names
