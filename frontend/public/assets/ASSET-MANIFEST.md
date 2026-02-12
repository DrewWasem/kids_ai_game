# Quest AI - Complete Asset Library Manifest

> Generated 2026-02-10. All assets mapped to vocabulary contract in `frontend/src/types/scene-script.ts`.
> Source priority: Kenney.nl (CC0) > OpenGameArt (CC0) > itch.io (check license per pack)

## Priority Legend
- **HIGH** = Required for Monster Birthday Party (core demo) — MUST have Day 1
- **MEDIUM** = Required for stretch tasks or general polish — Need by Day 3
- **LOW** = Nice-to-have, expanded library — Only if time allows
- **BONUS** = Beyond current vocabulary contract — future expansion

---

## 1. ACTORS (Character Sprites)

Each actor needs at minimum an idle state. Animation states are implemented via tweens in SceneScriptPlayer.ts (not sprite atlas frames), so a single good image per actor is sufficient for MVP. Sprite atlas with animation frames is stretch.

| # | Actor Key | Animations Needed | Priority | Source Pack | Status |
|---|-----------|-------------------|----------|-------------|--------|
| 1 | `monster` | idle, happy, sad, eat, dance, cry, sneeze-fire, confused, wave | **HIGH** | Kenney Platformer Enemies / itch.io monster packs | ⬜ |
| 2 | `kid` | idle, cheer, laugh, point, clap | **HIGH** | Kenney Toon Characters 1 | ⬜ |
| 3 | `dog` | idle, bark, float, fetch, wag, helmet-on, spin, sleep | **MEDIUM** | Kenney Animal Pack Redux | ⬜ |
| 4 | `robot` | idle, walk, trip, dance, deliver, short-circuit, fly, celebrate | **MEDIUM** | Kenney Toon Characters 1 | ⬜ |
| 5 | `wizard` | idle, cast, surprised, facepalm | **MEDIUM** | Kenney Modular Characters / itch.io wizard packs | ⬜ |
| 6 | `trex` | idle, walk, stuck, blush, roar, sit-break, wave, pencil-try | **MEDIUM** | OpenGameArt Free Dino Sprites (CC0) | ⬜ |
| 7 | `octopus` | idle, play-drums, play-guitar, tangle, rock, wave, bow | **LOW** | Elthen itch.io octopus sprites | ⬜ |
| 8 | `fish` | idle, swim, cheer, cover-ears, crowd-surf | **LOW** | Kenney Fish Pack | ⬜ |
| 9 | `squirrel` | idle, steal, run, celebrate | **LOW** | OpenGameArt Pixel Squirrel (CC0) | ⬜ |

### Expanded Actor Ideas (BONUS — beyond current contract)
| # | Actor Key | Use Case | Priority |
|---|-----------|----------|----------|
| 10 | `cat` | General fun, could be party guest | BONUS |
| 11 | `dragon` | Fire-breathing party crasher | BONUS |
| 12 | `alien` | Space mission companion | BONUS |
| 13 | `penguin` | Cute animal for various tasks | BONUS |
| 14 | `ghost` | Halloween themed task | BONUS |
| 15 | `pirate` | Pirate adventure task | BONUS |
| 16 | `unicorn` | Rainbow/magic themed | BONUS |
| 17 | `bear` | Forest/camping themed | BONUS |
| 18 | `chicken` | Farm comedy | BONUS |
| 19 | `frog` | Pond/swamp themed | BONUS |

---

## 2. PROPS (Static Objects)

Props are static PNG images. No animation needed — Phaser tweens handle all movement.

### Monster Birthday Party Props (HIGH)
| # | Prop Key | Description | Priority | Source Pack |Status |
|---|----------|-------------|----------|-------------|-------|
| 1 | `cake` | Regular birthday cake | **HIGH** | Kenney Food Kit | ⬜ |
| 2 | `cake-giant` | Oversized monster cake | **HIGH** | Kenney Food Kit (scaled up) | ⬜ |
| 3 | `cake-tiny` | Comically small cake | **HIGH** | Kenney Food Kit (scaled down) | ⬜ |
| 4 | `balloon` | Party balloon (single) | **HIGH** | Custom SVG / Kenney Emotes | ⬜ |
| 5 | `present` | Wrapped gift box | **HIGH** | Kenney Game Icons | ⬜ |
| 6 | `plates` | Stack of party plates | **HIGH** | Kenney Food Kit | ⬜ |
| 7 | `stars` | Decorative stars | **HIGH** | Kenney Particle Pack | ⬜ |

### Dog Space Mission Props (MEDIUM)
| # | Prop Key | Description | Priority | Source Pack | Status |
|---|----------|-------------|----------|-------------|--------|
| 8 | `rocket` | Space rocket | **MEDIUM** | Kenney Space Shooter Redux | ⬜ |
| 9 | `spacesuit` | Dog-sized spacesuit | **MEDIUM** | Custom SVG / Space Shooter | ⬜ |
| 10 | `moon` | The moon | **MEDIUM** | Kenney Space Shooter Redux | ⬜ |
| 11 | `flag` | Flag to plant on moon | **MEDIUM** | Custom SVG | ⬜ |
| 12 | `bone` | Dog bone / treat | **MEDIUM** | Kenney Animal Pack | ⬜ |

### Wizard Kitchen Props (MEDIUM)
| # | Prop Key | Description | Priority | Source Pack | Status |
|---|----------|-------------|----------|-------------|--------|
| 13 | `soup-bowl` | Bowl of sentient soup | **MEDIUM** | Kenney Food Kit | ⬜ |
| 14 | `toaster` | Angry toaster | **MEDIUM** | Kenney Furniture Kit | ⬜ |
| 15 | `fridge` | Singing fridge | **MEDIUM** | Kenney Furniture Kit | ⬜ |
| 16 | `fire-extinguisher` | Emergency prop | **MEDIUM** | Custom SVG | ⬜ |

### Dinosaur School Props (MEDIUM)
| # | Prop Key | Description | Priority | Source Pack | Status |
|---|----------|-------------|----------|-------------|--------|
| 17 | `desk` | School desk | **MEDIUM** | Kenney Furniture Kit | ⬜ |
| 18 | `pencil` | Writing pencil | **MEDIUM** | Kenney Game Icons | ⬜ |
| 19 | `chair` | Small school chair | **MEDIUM** | Kenney Furniture Kit | ⬜ |
| 20 | `lunchbox` | Dino lunchbox | **MEDIUM** | Custom SVG | ⬜ |

### Octopus Band Props (LOW)
| # | Prop Key | Description | Priority | Source Pack | Status |
|---|----------|-------------|----------|-------------|--------|
| 21 | `guitar` | Electric guitar | **LOW** | Custom SVG | ⬜ |
| 22 | `drums` | Drum kit | **LOW** | Custom SVG | ⬜ |
| 23 | `keyboard` | Music keyboard | **LOW** | Custom SVG | ⬜ |
| 24 | `microphone` | Mic on stand | **LOW** | Custom SVG | ⬜ |

### Robot Pizza Props (MEDIUM)
| # | Prop Key | Description | Priority | Source Pack | Status |
|---|----------|-------------|----------|-------------|--------|
| 25 | `pizza` | Delicious pizza | **MEDIUM** | Kenney Food Kit | ⬜ |
| 26 | `pizza-soggy` | Soggy ruined pizza | **MEDIUM** | Kenney Food Kit (modified) | ⬜ |
| 27 | `river` | River obstacle | **MEDIUM** | Custom SVG / tileset | ⬜ |
| 28 | `pillow-fort` | Pillow fort obstacle | **LOW** | Custom SVG | ⬜ |

### Expanded Props (BONUS — beyond current contract)
| # | Prop Key | Use Case | Priority |
|---|----------|----------|----------|
| 29 | `party-hat` | Party decoration | BONUS |
| 30 | `confetti-cannon` | Party prop | BONUS |
| 31 | `banner` | "Happy Birthday" banner | BONUS |
| 32 | `candles` | Birthday candles | BONUS |
| 33 | `ice-cream` | Party food | BONUS |
| 34 | `cupcake` | Party food | BONUS |
| 35 | `cookies` | Party food | BONUS |
| 36 | `candy` | Party food | BONUS |
| 37 | `streamer` | Party decoration | BONUS |
| 38 | `table` | Party table | BONUS |
| 39 | `crown` | Party crown/tiara | BONUS |
| 40 | `trophy` | Achievement prop | BONUS |
| 41 | `medal` | Achievement prop | BONUS |
| 42 | `treasure-chest` | Reward prop | BONUS |
| 43 | `magic-wand` | Wizard prop | BONUS |
| 44 | `potion` | Wizard prop | BONUS |
| 45 | `cauldron` | Wizard prop | BONUS |
| 46 | `telescope` | Space prop | BONUS |
| 47 | `satellite` | Space prop | BONUS |
| 48 | `asteroid` | Space prop | BONUS |
| 49 | `planet` | Space prop | BONUS |
| 50 | `helmet` | Space/safety prop | BONUS |
| 51 | `skateboard` | Fun transport | BONUS |
| 52 | `trampoline` | Fun prop | BONUS |
| 53 | `rainbow` | Celebration effect | BONUS |
| 54 | `cloud` | Sky/weather prop | BONUS |
| 55 | `sun` | Sky prop | BONUS |
| 56 | `tree` | Nature prop | BONUS |
| 57 | `flower` | Nature/decoration | BONUS |
| 58 | `butterfly` | Nature animation | BONUS |
| 59 | `paintbrush` | Art/creative prop | BONUS |
| 60 | `book` | School/magic prop | BONUS |

---

## 3. BACKDROPS (Full-Scene Backgrounds)

1024x576 resolution to match canvas size. Static PNG images.

| # | Backdrop Key | Scene | Priority | Source | Status |
|---|-------------|-------|----------|--------|--------|
| 1 | `party-room` | Monster Birthday Party | **HIGH** | Kenney / itch.io indoor bg | ⬜ |
| 2 | `city-street` | Robot Pizza Delivery | **MEDIUM** | Kenney RPG Urban Pack | ⬜ |
| 3 | `space` | Dog Space Mission | **MEDIUM** | Kenney Space Shooter Redux | ⬜ |
| 4 | `wizard-kitchen` | Wizard's Kitchen Disaster | **MEDIUM** | Kenney Indoor Pack / custom | ⬜ |
| 5 | `classroom` | Dinosaur's First Day | **MEDIUM** | Kenney Indoor Pack / custom | ⬜ |
| 6 | `underwater-stage` | Octopus Rock Band | **LOW** | Kenney Fish Pack / itch.io | ⬜ |

### Expanded Backdrops (BONUS)
| # | Backdrop Key | Use Case | Priority |
|---|-------------|----------|----------|
| 7 | `forest` | Nature adventures | BONUS |
| 8 | `beach` | Beach/ocean tasks | BONUS |
| 9 | `castle` | Medieval/fantasy tasks | BONUS |
| 10 | `playground` | School/play tasks | BONUS |
| 11 | `cave` | Adventure/explore tasks | BONUS |
| 12 | `farm` | Animal tasks | BONUS |
| 13 | `carnival` | Fun/games tasks | BONUS |
| 14 | `library` | Learning tasks | BONUS |
| 15 | `jungle` | Exploration tasks | BONUS |
| 16 | `arctic` | Cold weather tasks | BONUS |

---

## 4. REACTIONS / EFFECTS

Currently implemented as emoji text objects in SceneScriptPlayer.ts. Upgrading to actual particle sprites or Lottie animations would be a visual improvement.

| # | Effect Key | Current Impl | Priority | Upgrade Source | Status |
|---|-----------|-------------|----------|----------------|--------|
| 1 | `confetti-burst` | 🎉🎊⭐✨🎈 emojis | **HIGH** | Kenney Particle Pack / Lottie | ⬜ |
| 2 | `hearts-float` | ❤️ emojis | **HIGH** | Kenney Particle Pack (heart) | ⬜ |
| 3 | `stars-spin` | ⭐ emojis | **HIGH** | Kenney Particle Pack (star) | ⬜ |
| 4 | `sparkle-magic` | ✨ emojis | **HIGH** | Kenney Particle Pack (magic) | ⬜ |
| 5 | `question-marks` | ❓ emojis | **MEDIUM** | Kenney Emotes Pack | ⬜ |
| 6 | `explosion-cartoon` | 💥 emoji | **MEDIUM** | Kenney Particle Pack (fire) | ⬜ |
| 7 | `laugh-tears` | 😂 emojis | **MEDIUM** | Kenney Emotes Pack | ⬜ |
| 8 | `sad-cloud` | 😢 emojis | **MEDIUM** | Kenney Emotes Pack / custom | ⬜ |
| 9 | `fire-sneeze` | 🔥 emojis | **LOW** | Kenney Particle Pack (fire) | ⬜ |
| 10 | `splash` | 💦 emojis | **LOW** | Kenney Particle Pack | ⬜ |

### Expanded Effects (BONUS)
| # | Effect Key | Description | Priority |
|---|-----------|-------------|----------|
| 11 | `rainbow` | Rainbow arc appears | BONUS |
| 12 | `snow` | Snowflakes falling | BONUS |
| 13 | `rain` | Rain drops | BONUS |
| 14 | `bubbles` | Floating bubbles | BONUS |
| 15 | `lightning` | Lightning flash | BONUS |
| 16 | `tornado` | Spinning wind | BONUS |
| 17 | `music-notes` | Musical notes floating | BONUS |
| 18 | `leaves` | Falling leaves | BONUS |
| 19 | `smoke` | Puff of smoke | BONUS |
| 20 | `glow` | Magical glow aura | BONUS |

---

## 5. UI ELEMENTS

| # | UI Asset | Description | Priority | Source | Status |
|---|----------|-------------|----------|--------|--------|
| 1 | `panel-bg` | Dialog/feedback panel bg | **HIGH** | Kenney UI Pack | ⬜ |
| 2 | `button-primary` | Main action button | **HIGH** | Kenney UI Pack | ⬜ |
| 3 | `button-secondary` | Secondary button | **MEDIUM** | Kenney UI Pack | ⬜ |
| 4 | `star-filled` | Filled star (scoring) | **MEDIUM** | Kenney Game Icons | ⬜ |
| 5 | `star-empty` | Empty star (scoring) | **MEDIUM** | Kenney Game Icons | ⬜ |
| 6 | `speech-bubble` | Character speech | **MEDIUM** | Kenney UI Pack | ⬜ |
| 7 | `thought-bubble` | Character thought | **LOW** | Kenney UI Pack | ⬜ |
| 8 | `loading-spinner` | Loading indicator | **MEDIUM** | Custom / Lottie | ⬜ |
| 9 | `frame-ornate` | Task card frame | **LOW** | Kenney UI Pack | ⬜ |
| 10 | `arrow-hint` | Tutorial arrow | **LOW** | Kenney UI Pack | ⬜ |

---

## 6. SOUND EFFECTS (SFX)

| # | SFX Key | Description | Priority | Source | Status |
|---|---------|-------------|----------|--------|--------|
| 1 | `whoosh` | Movement / throw | **MEDIUM** | Kenney Audio | ⬜ |
| 2 | `pop` | Spawn / appear | **MEDIUM** | Kenney Audio | ⬜ |
| 3 | `celebration` | Success fanfare | **MEDIUM** | Kenney Audio | ⬜ |
| 4 | `sad-trombone` | Funny fail | **MEDIUM** | FilmCow SFX | ⬜ |
| 5 | `chomp` | Eating sound | **MEDIUM** | Kenney Audio | ⬜ |
| 6 | `boing` | Bounce | **LOW** | Kenney Audio | ⬜ |
| 7 | `splash` | Water effect | **LOW** | Kenney Audio | ⬜ |
| 8 | `magic-sparkle` | Magic cast | **LOW** | Kenney Audio | ⬜ |
| 9 | `explosion` | Cartoon explosion | **LOW** | Kenney Audio | ⬜ |
| 10 | `bark` | Dog bark | **LOW** | Kenney Audio | ⬜ |
| 11 | `roar` | Monster/dino roar | **LOW** | Kenney Audio | ⬜ |
| 12 | `guitar-riff` | Rock band moment | **LOW** | FilmCow SFX | ⬜ |
| 13 | `crowd-cheer` | Audience reaction | **LOW** | Kenney Audio | ⬜ |
| 14 | `typing` | Input feedback | **LOW** | Kenney Audio | ⬜ |
| 15 | `click` | Button click | **LOW** | Kenney Audio | ⬜ |

---

## 7. DOWNLOADED PACKS (29 Kenney CC0 Packs)

All CC0 (public domain). No attribution required. 14,274 files, 221MB total.
Located in `frontend/public/assets/raw-packs/`.

### Wave 1 — HIGH Priority (5 packs, downloaded Day 1)
| Pack | Size | Assets | Covers |
|------|------|--------|--------|
| Particle Pack | 15MB | 80 | Stars, hearts, sparkles, fire, smoke, magic particles |
| Toon Characters 1 | 6.9MB | 270 | Robot (45 poses), Kid/Human (45 poses each) |
| Food Kit | 15MB | 200+ | Cake, pizza, bowls, plates, various food (3D renders) |
| Emotes Pack | 2.2MB | 480 | Hearts, question marks, expressions, music, sleep |
| Game Icons | 4.7MB | 105 | Arrows, buttons, checkmarks, crosses, stars |

### Wave 2 — MEDIUM Priority (8 packs, downloaded Day 1)
| Pack | Size | Assets | Covers |
|------|------|--------|--------|
| Animal Pack Redux | 5.2MB | 240 | Dog + 29 animals (round/square styles) |
| Space Shooter Redux | 2.4MB | 295 | Rockets, space backgrounds, meteors, effects |
| Furniture Kit | 20MB | 140 | Desk, chair, fridge, toaster, table (side view) |
| Fish Pack | 1.8MB | 120 | Fish varieties, underwater seaweed, bubbles |
| RPG Urban Pack | 2.1MB | 480 | City street tiles (16x16) |
| UI Pack | 5.3MB | 430 | Buttons, panels, arrows (blue/green/grey/red/yellow) |
| Platformer Enemies | 1.8MB | 165 | Slime, bat, bee, frog, mouse, snake sprites |
| Background Elements | 1.6MB | 110 | Clouds, castles, grass, trees, fences |

### Wave 3 — Expanded Library (16 packs, downloaded Day 1)
| Pack | Size | Assets | Key Contents |
|------|------|--------|-------------|
| **Monster Builder Pack** | 1.2MB | 170 | Modular monster: body, arms, legs, eyes, mouth, horns, ears (6 colors!) |
| **Robot Pack** | 361K | 50 | Side-view robots (4 colors): body, drive, jump, hurt, damage |
| **Modular Characters** | 1.7MB | 425 | Mix-and-match character parts (heads, bodies, accessories) |
| **Shape Characters** | 534K | 100 | Geometric characters: circles, squares, rhombus + faces/hands |
| **Smoke Particles** | 5.7MB | 70 | Smoke and explosion particle textures |
| **Music Jingles** | 1.2MB | 85 | Victory/failure audio (8-bit, pizzicato, sax, steel, hit jingles) |
| **Interface Sounds** | 815K | 100 | Click, back, bong, close, confirmation, error, pluck, scroll sounds |
| **Impact Sounds** | 782K | 130 | Impact, collision, hit effects |
| **Digital Audio** | 967K | 60 | Space/laser sound effects |
| **Board Game Icons** | 1.0MB | 250 | Board game themed icons (dice, cards, resources) |
| **Game Icons Expansion** | 1.9MB | 60 | Gamepad, joystick, prompt icons |
| **Background Elements Redux** | 1.0MB | 90 | Updated clouds, castles, trees, mountains |
| **Alien UFO Pack** | 409K | 50 | Aliens, UFOs, vehicles (for space scenes) |
| **Pattern Pack** | 1.2MB | 80 | Tileable background patterns |
| **Input Prompts** | 4.3MB | 100+ | Keyboard/controller input prompt graphics |
| **Platformer Art Deluxe** | 6.3MB | 930 | Plains, candy, ice, mushroom, buildings + enemies |

### Not Yet Downloaded (available if needed)
| Pack | URL | Covers |
|------|-----|--------|
| Platformer Pack Redux | https://kenney.nl/assets/platformer-pack-redux | Extra characters at 360px |
| Roguelike Indoor | https://kenney.nl/assets/roguelike-interior-pack | Kitchen/classroom tiles |
| RPG Audio | https://kenney.nl/assets/rpg-audio | Foley, footsteps |
| Voiceover Pack | https://kenney.nl/assets/voiceover-pack | Male/female voice clips |
| Pirate Pack | https://kenney.nl/assets/pirate-pack | Pirate-themed tiles |
| Nature Kit | https://kenney.nl/assets/nature-kit | Trees, rocks, plants (3D isometric) |
| Tiny Town | https://kenney.nl/assets/tiny-town | 16x16 town tiles |
| Scribble Platformer | https://kenney.nl/assets/scribble-platformer | Hand-drawn style |

### Third-Party Sources (not yet downloaded, check license per pack)
| Asset | URL | License | Covers |
|-------|-----|---------|--------|
| Monsters Creatures Fantasy (LuizMelo) | luizmelo.itch.io/monsters-creatures-fantasy | CC0 | Animated monsters (skeleton, mushroom, goblin, eye) |
| Wizard Pack (LuizMelo) | luizmelo.itch.io/wizard-pack | CC0 | Animated wizard with full anims |
| Evil Wizard 2 (LuizMelo) | luizmelo.itch.io/evil-wizard-2 | CC0 | Evil wizard variant |
| Cute Platformer Robot (Foozle) | foozlecc.itch.io/cute-platformer-robot | Free | Animated robot: idle, walk, run, jump |
| Pixel Art Octopus (Elthen) | elthen.itch.io/2d-pixel-art-octopus-sprites | Free | Octopus with idle/eat/movement |
| Pixel Art Squirrel (Elthen) | elthen.itch.io/2d-pixel-art-squirrel-sprites | Free | Squirrel with idle/eat/dig |
| OpenGameArt Free Dino | opengameart.org/content/free-dino-sprites | CC0 | Cute dinosaur (5 states) |
| OpenGameArt Pixel Squirrel | opengameart.org/content/pixel-squirrel | CC0 | 32x32 squirrel |
| OpenGameArt Monster CC0 | opengameart.org/content/monster-cc0 | CC0 | 10+ cartoon monster sprites |
| Underwater Fantasy BG (ansimuz) | ansimuz.itch.io/underwater-fantasy-pixel-art-environment | Free | 3-layer parallax underwater |
| Parallax City BG (Lucky) | lucky-loops.itch.io/parallax-city-background | Free | Layered city background |
| Anime Backgrounds (NoranekoGames) | noranekogames.itch.io/yumebackground | Free+credit | Kitchen, classroom, city |
| Balloons (Qookie Games) | qookie-games.itch.io/balloons | Check | Balloon sprites multi-style |
| Musical Instruments (100 icons) | itch.io search "musical instrument icons" | Check | Pixel art instruments |

### LottieFiles (Free Lottie JSON, for reactions upgrade)
| Animation | URL | Use |
|-----------|-----|-----|
| Confetti Blast | lottiefiles.com/2608-confetti-blast | Victory celebration |
| Cartoon Explosion | lottiefiles.com/114782-cartoon-explosion | Explosion effect |
| Star Success | lottiefiles.com/3152-star-success | Achievement |
| Magic Wand | lottiefiles.com/2024-magic-wand | Wizard theme |
| Floating Hearts | lottiefiles.com (search floating-hearts) | Positive feedback |
| Rain Cloud | lottiefiles.com/9222-rain-cloud-animation | Sad/fail |
| Sparkle | lottiefiles.com/58771-sparkle-animation | Magic effects |
| Trophy | lottiefiles.com/74703-trophy | Reward moment |

---

## 8. ASSET COUNT SUMMARY

### Vocabulary Contract Assets
| Category | In Contract | Expanded | Total |
|----------|------------|----------|-------|
| Actors | 9 | +10 | 19 |
| Props | 29 | +32 | 61 |
| Backdrops | 6 | +10 | 16 |
| Effects | 10 | +10 | 20 |
| UI Elements | 0 | +10 | 10 |
| Sound Effects | 0 | +15 | 15 |
| **TOTAL** | **54** | **+87** | **141** |

### Downloaded Raw Library
| Metric | Count |
|--------|-------|
| Kenney packs downloaded | 29 |
| Total PNG images | 11,630 |
| Total SVG vectors | 2,252 |
| Total OGG audio | 392 |
| **Grand total files** | **14,274** |
| Total size on disk | 221MB |

### By Priority
| Priority | Count | Status |
|----------|-------|--------|
| HIGH | 22 | Must have Day 1 |
| MEDIUM | 38 | Need by Day 3 |
| LOW | 18 | Time permitting |
| BONUS | 63 | Future expansion |

---

## 9. DIRECTORY STRUCTURE

```
frontend/public/assets/
├── actors/           ← Character sprites (PNG, ideally with atlas JSON)
│   ├── monster.png
│   ├── kid.png
│   ├── dog.png
│   ├── robot.png
│   ├── wizard.png
│   ├── trex.png
│   ├── octopus.png
│   ├── fish.png
│   └── squirrel.png
├── props/            ← Static object PNGs
│   ├── cake.png
│   ├── cake-giant.png
│   ├── ...
│   └── fire-extinguisher.png
├── backdrops/        ← Full 1024x576 backgrounds
│   ├── party-room.png
│   ├── space.png
│   └── ...
├── reactions/        ← Effect overlays (Lottie JSON or spritesheet)
│   ├── confetti-burst.json
│   └── ...
├── effects/          ← Particle textures (small PNGs)
│   ├── heart.png
│   ├── star.png
│   └── ...
├── ui/               ← UI elements
│   ├── panel-bg.png
│   └── ...
├── sfx/              ← Sound effects (OGG/MP3)
│   ├── whoosh.ogg
│   └── ...
└── raw-packs/        ← Downloaded zip files (not served)
    ├── kenney_particle-pack.zip
    └── ...
```

---

## 10. STYLE GUIDELINES

- **Consistent art style**: Pick ONE style (toon/cartoon recommended) and stick with it
- **Resolution**: Actors ~128x128 to 256x256, Props ~64x64 to 128x128
- **Backdrops**: Exactly 1024x576 (or larger, cropped to fit)
- **Transparency**: All actors and props MUST have transparent backgrounds (PNG-24)
- **Naming**: Match vocabulary contract keys exactly (lowercase, hyphenated)
- **Size**: Keep each asset under 100KB for fast loading
