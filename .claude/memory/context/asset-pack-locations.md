# Asset Pack Locations and Organization

**Created:** 2026-02-10
**Last Updated:** 2026-02-10
**Source:** session
**Confidence:** high
**Tags:** assets, kenney, file-paths, packs, vocabulary-contract, organization

## Summary
All 53 vocabulary contract assets organized into final directory structure. 29 Kenney.nl CC0 packs + 5 third-party CC0 packs in `raw-packs/`. All assets extracted and organized into `actors/`, `props/`, `reactions/`, `effects/`, `backdrops/`, `ui/`, and `sfx/` directories.

## Details

### Asset Organization Complete

All 53 vocabulary contract assets are now organized into their final directories:

```
frontend/public/assets/
├── actors/     (9 files: monster.png, dog.png, trex.png, octopus.png, robot.png, wizard.png, kid.png, fish.png, squirrel.png)
├── props/      (28 files: mix of .png from Kenney packs and .svg custom)
├── reactions/  (10 files: confetti-burst.png, explosion-cartoon.png, hearts-float.png, etc.)
├── effects/    (5 files: copies from reactions for particle use)
├── backdrops/  (6 files: space.png from Kenney, 5 custom SVGs)
├── ui/         (9 files: star, trophy, audio, home, settings, etc.)
├── sfx/        (19 files: click, success, error, jingles, etc.)
└── raw-packs/  (29 Kenney + 5 third-party packs)
```

### Source Mapping: Vocabulary Contract → Raw Packs

**Actors (9 total)**
- `robot.png` ← `kenney_toon-characters-1/Robot/PNG/Poses HD/character_robot_idle.png`
- `kid.png` ← `kenney_toon-characters-1/Male person/PNG/Poses HD/character_malePerson_idle.png`
- `dog.png` ← `kenney_animal-pack-redux/PNG/Round/dog.png`
- `fish.png` ← `kenney_fish-pack/PNG/Default/fish_blue.png`
- `monster.png` ← `kenney_monster-builder-pack/PNG/Default/` (assembled body)
- `trex.png` ← Third-party: OpenGameArt free-dino-sprites (CC0)
- `octopus.png` ← Third-party: OpenGameArt (CC0)
- `squirrel.png` ← Third-party: OpenGameArt (CC0)
- `wizard.png` ← Third-party: OpenGameArt (CC0)

**Props (28 total)**
- From Kenney packs (PNG):
  - `cake.png` ← `kenney_food-kit/Previews/cake-birthday.png`
  - `pizza.png` ← `kenney_food-kit/Previews/pizza.png`
  - `plate.png` ← `kenney_food-kit/Previews/plate.png`
  - `soup-bowl.png` ← `kenney_food-kit/Previews/bowl-soup.png`
  - `fridge.png` ← `kenney_furniture-kit/Side/kitchenFridge.png`
  - `desk.png` ← `kenney_furniture-kit/Side/desk.png`
  - `chair.png` ← `kenney_furniture-kit/Side/chair.png`
  - `keyboard.png` ← `kenney_furniture-kit/Side/` (or keyboard icon)
  - `rocket.png` ← `kenney_space-shooter-redux/PNG/playerShip1_blue.png`
  - `spacesuit.png` ← Custom or space shooter asset
  - `moon.png` ← `kenney_space-shooter-redux/Backgrounds/` or custom
  - `pencil.png` ← `kenney_game-icons-expansion/PNG/`
  - `star.png` ← `kenney_particle-pack/PNG (Transparent)/star_01.png`
  - `toaster.png` ← `kenney_furniture-kit/Side/toaster.png`
  - `flag.png` ← `kenney_game-icons/PNG/White/2x/`
- Custom SVG props (17):
  - `balloon.svg`, `bone.svg`, `drums.svg`, `guitar.svg`, `lunchbox.svg`, `microphone.svg`, `present.svg`, `river.svg`, `pillow-fort.svg`, `fire-extinguisher.svg`, and others

**Reactions (10 total)**
- `confetti-burst.png` ← `kenney_particle-pack/PNG (Transparent)/`
- `explosion-cartoon.png` ← `kenney_smoke-particles/PNG/`
- `hearts-float.png` ← `kenney_emotes-pack/PNG/Pixel/Style 1/emote_heart.png`
- `stars-twinkle.png` ← `kenney_particle-pack/PNG (Transparent)/star_*.png`
- `smoke-puff.png` ← `kenney_smoke-particles/PNG/`
- `sparkles.png` ← `kenney_particle-pack/PNG (Transparent)/spark_*.png`
- `question-mark.png` ← `kenney_emotes-pack/PNG/Pixel/Style 1/emote_question.png`
- `exclamation.png` ← `kenney_emotes-pack/PNG/Pixel/Style 1/emote_exclamation.png`
- `music-notes.png` ← `kenney_emotes-pack/PNG/Pixel/Style 1/emote_music.png`
- `laughter.png` ← `kenney_emotes-pack/PNG/Pixel/Style 1/emote_laugh.png`

**Effects (5 total)**
- Copies from reactions for particle system use: `confetti-burst.png`, `explosion-cartoon.png`, `hearts-float.png`, `stars-twinkle.png`, `sparkles.png`

**Backdrops (6 total)**
- `space.png` ← `kenney_space-shooter-redux/Backgrounds/black.png`
- Custom SVG backdrops (5):
  - `party-room.svg`, `wizard-kitchen.svg`, `classroom.svg`, `underwater-stage.svg`, `city-street.svg`

**UI (9 total)**
- `star.png` ← `kenney_game-icons/PNG/White/2x/`
- `trophy.png` ← `kenney_game-icons/PNG/White/2x/`
- `audio-on.png` ← `kenney_game-icons/PNG/White/2x/`
- `audio-off.png` ← `kenney_game-icons/PNG/White/2x/`
- `home.png` ← `kenney_game-icons/PNG/White/2x/`
- `settings.png` ← `kenney_game-icons/PNG/White/2x/`
- `help.png` ← `kenney_game-icons/PNG/White/2x/`
- `check.png` ← `kenney_game-icons/PNG/White/2x/checkmark.png`
- `x.png` ← `kenney_game-icons/PNG/White/2x/cross.png`

**SFX (19 total)**
- `click.ogg` ← `kenney_interface-sounds/Audio/click*.ogg`
- `success.ogg` ← `kenney_interface-sounds/Audio/confirmation*.ogg`
- `error.ogg` ← `kenney_interface-sounds/Audio/error*.ogg`
- `party-jingle.ogg` ← `kenney_music-jingles/Audio/jingle*.ogg`
- `task-complete.ogg` ← `kenney_music-jingles/Audio/`
- `confetti-pop.ogg` ← `kenney_impact-sounds/Audio/`
- `explosion-soft.ogg` ← `kenney_impact-sounds/Audio/`
- `whoosh.ogg` ← `kenney_digital-audio/Audio/`
- `sparkle.ogg` ← `kenney_digital-audio/Audio/`
- And 10 more sound effects

### Pack → Key Asset Paths (Raw Packs Reference)
| Pack Directory | Key Files for Vocabulary Contract |
|---|---|
| `kenney_toon-characters-1/Robot/PNG/Poses HD/` | `character_robot_idle.png`, `character_robot_cheer0.png`, `character_robot_walk*.png`, `character_robot_jump.png`, `character_robot_fall.png`, `character_robot_think.png`, `character_robot_talk.png` |
| `kenney_toon-characters-1/Male person/PNG/Poses HD/` | `character_malePerson_idle.png`, `character_malePerson_cheer0.png`, `character_malePerson_jump.png`, `character_malePerson_talk.png` |
| `kenney_animal-pack-redux/PNG/Round/` | `dog.png` + 29 other animals |
| `kenney_food-kit/Previews/` | `cake-birthday.png`, `cake.png`, `pizza.png`, `bowl-soup.png`, `plate.png`, `cupcake.png` |
| `kenney_furniture-kit/Side/` | `toaster.png`, `kitchenFridge.png`, `desk.png`, `chair.png`, `table.png` |
| `kenney_fish-pack/PNG/Default/` | `fish_blue.png`, `fish_brown.png`, `background_seaweed_*.png`, `bubble_*.png` |
| `kenney_particle-pack/PNG (Transparent)/` | `star_*.png` (9 variants), `fire_*.png`, `flame_*.png`, `smoke_*.png`, `spark_*.png`, `magic_*.png` |
| `kenney_emotes-pack/PNG/Pixel/Style 1/` | `emote_heart.png`, `emote_question.png`, `emote_exclamation.png`, `emote_music.png`, `emote_laugh.png` |
| `kenney_space-shooter-redux/PNG/` | `playerShip*.png` (rockets), `Backgrounds/` (space bg) |
| `kenney_space-shooter-redux/Backgrounds/` | `black.png`, `blue.png`, `darkPurple.png`, `purple.png` |
| `kenney_platformer-enemies/Enemy sprites/` | `slime*.png`, `bat*.png`, `bee*.png`, `frog*.png`, `mouse*.png` (closest to "monster") |
| `kenney_rpg-urban-pack/` | 16x16 urban tiles for city-street backdrop |
| `kenney_background-elements/PNG/` | `cloud*.png`, `castle*.png`, `grass*.png`, `tree*.png`, `fence*.png` |
| `kenney_ui-pack/PNG/Blue/Default/` | `arrow_*.png`, buttons, panels |
| `kenney_game-icons/PNG/White/2x/` | `checkmark.png`, `cross.png`, `exclamation.png`, arrows |
| `kenney_monster-builder-pack/PNG/Default/` | Modular monster parts: body, arm, leg, eye (6 types), mouth (A-J), horn, ear, antenna (6 colors each) |
| `kenney_robot-pack/PNG/Side view/` | 4-color robots: body, drive, jump, hurt, damage states |
| `kenney_modular-characters/PNG/` | Mix-and-match character body parts |
| `kenney_shape-characters/PNG/Default/` | Geometric characters: circle/square/rhombus bodies + faces/hands |
| `kenney_smoke-particles/` | Smoke and explosion particle textures |
| `kenney_music-jingles/Audio/` | Jingles in 5 styles: 8-bit, hit, pizzicato, sax, steel |
| `kenney_interface-sounds/Audio/` | click, back, bong, close, confirmation, error, pluck, scroll |
| `kenney_impact-sounds/Audio/` | Impact and collision sound effects |
| `kenney_digital-audio/Audio/` | Space and laser sounds |
| `kenney_board-game-icons/` | 250 board game themed icons |
| `kenney_game-icons-expansion/` | 60 additional game icons |
| `kenney_background-elements-redux/` | Updated background construction elements |
| `kenney_alien-ufo-pack/PNG/` | Aliens, UFOs, vehicles |
| `kenney_pattern-pack/PNG/` | Tileable background patterns |
| `kenney_input-prompts/` | Keyboard/controller input prompts |
| `kenney_platformer-art-deluxe/` | Plains, candy, ice, mushroom, buildings + enemies (930 assets) |

### Download URLs (for re-download if needed)
- Particle Pack: `https://kenney.nl/media/pages/assets/particle-pack/1dd3d4cbe2-1677578741/kenney_particle-pack.zip`
- Toon Characters 1: `https://kenney.nl/media/pages/assets/toon-characters-1/cc2395dcb3-1677693120/kenney_toon-characters-1.zip`
- Food Kit: `https://kenney.nl/media/pages/assets/food-kit/719eef5f43-1719418518/kenney_food-kit.zip`
- Emotes Pack: `https://kenney.nl/media/pages/assets/emotes-pack/a3823d6799-1677578798/kenney_emotes-pack.zip`
- Game Icons: `https://kenney.nl/media/pages/assets/game-icons/94af1f5c0b-1677661579/kenney_game-icons.zip`
- Animal Pack Redux: `https://kenney.nl/media/pages/assets/animal-pack-redux/c217650a92-1677666936/kenney_animal-pack-redux.zip`
- Space Shooter Redux: `https://kenney.nl/media/pages/assets/space-shooter-redux/b31285e83d-1677669442/kenney_space-shooter-redux.zip`
- Furniture Kit: `https://kenney.nl/media/pages/assets/furniture-kit/e56d2a9828-1677580847/kenney_furniture-kit.zip`
- Fish Pack: `https://kenney.nl/media/pages/assets/fish-pack/6a96d27fb2-1747237960/kenney_fish-pack_2.zip`
- RPG Urban Pack: `https://kenney.nl/media/pages/assets/rpg-urban-pack/63ed57d122-1677578575/kenney_rpg-urban-pack.zip`
- UI Pack: `https://kenney.nl/media/pages/assets/ui-pack/af874291da-1718203990/kenney_ui-pack.zip`
- Platformer Enemies: `https://kenney.nl/media/pages/assets/platformer-art-extended-enemies/75aa9b13aa-1677696504/kenney_platformer-art-extended-enemies.zip`
- Background Elements: `https://kenney.nl/media/pages/assets/background-elements/68a31f3013-1677670395/kenney_background-elements.zip`
- Monster Builder: `https://kenney.nl/media/pages/assets/monster-builder-pack/cc58d3827e-1677495438/kenney_monster-builder-pack.zip`
- Robot Pack: `https://kenney.nl/media/pages/assets/robot-pack/1e347aac66-1677670212/kenney_robot-pack.zip`
- Music Jingles: `https://kenney.nl/media/pages/assets/music-jingles/4f5dd770b7-1677590399/kenney_music-jingles.zip`
- Interface Sounds: `https://kenney.nl/media/pages/assets/interface-sounds/d23a84242e-1677589452/kenney_interface-sounds.zip`
- Impact Sounds: `https://kenney.nl/media/pages/assets/impact-sounds/8aa7b545c9-1677589768/kenney_impact-sounds.zip`
- Smoke Particles: `https://kenney.nl/media/pages/assets/smoke-particles/8edf855f42-1677695171/kenney_smoke-particles.zip`
- Modular Characters: `https://kenney.nl/media/pages/assets/modular-characters/4c0b682062-1677670340/kenney_modular-characters.zip`
- Board Game Icons: `https://kenney.nl/media/pages/assets/board-game-icons/1a6c93ddc0-1721645690/kenney_board-game-icons.zip`
- Game Icons Expansion: `https://kenney.nl/media/pages/assets/game-icons-expansion/9f1915e081-1677661643/kenney_game-icons-expansion.zip`
- Digital Audio: `https://kenney.nl/media/pages/assets/digital-audio/7492b26e77-1677590265/kenney_digital-audio.zip`
- Background Elements Redux: `https://kenney.nl/media/pages/assets/background-elements-redux/8aa07a2b66-1677693164/kenney_background-elements-redux.zip`
- Alien UFO: `https://kenney.nl/media/pages/assets/alien-ufo-pack/5dd630dbb2-1677667399/kenney_alien-ufo-pack.zip`
- Shape Characters: `https://kenney.nl/media/pages/assets/shape-characters/10e737ac29-1698339465/kenney_shape-characters.zip`
- Pattern Pack: `https://kenney.nl/media/pages/assets/pattern-pack/f2f3a959e1-1721940715/kenney_pattern-pack.zip`
- Input Prompts: `https://kenney.nl/media/pages/assets/input-prompts/67c675026d-1763810066/kenney_input-prompts_1.4.1.zip`
- Platformer Art Deluxe: `https://kenney.nl/media/pages/assets/platformer-art-deluxe/749ae05a41-1677696393/kenney_platformer-art-deluxe.zip`

### Third-Party CC0 Asset Packs (in raw-packs/)
- `free-dino-sprites/` — T-Rex sprites from OpenGameArt (CC0)
- `octopus-sprites/` — Octopus sprites from OpenGameArt (CC0)
- `squirrel-sprites/` — Squirrel sprites from OpenGameArt (CC0)
- `wizard-sprites/` — Wizard sprites from OpenGameArt (CC0)
- `additional-cc0-assets/` — Miscellaneous CC0 assets

## Implementation Status
**Organization:** COMPLETE (all 53 vocabulary contract assets in place)
**Phaser preload:** TODO (needs asset loader configuration)
**Scene integration:** TODO (needs SceneScriptPlayer hooks)

## Related
- `frontend/public/assets/ASSET-MANIFEST.md` — full manifest with priorities
- `.claude/memory/research/asset-library.md` — research summary
- Vocabulary contract: `docs/Prompt-Quest-Outrageous-Tasks-Asset-Library.html`
