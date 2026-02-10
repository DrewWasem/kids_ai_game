# Asset Library Research

**Created:** 2026-02-10
**Last Updated:** 2026-02-10
**Source:** session
**Confidence:** high
**Tags:** assets, kenney, download, setup, day-1, game-juice, kids-ux

## Summary
29 Kenney.nl CC0 packs downloaded (14,274 files, 221MB). Expanded from initial 13 to 29 packs covering characters, monsters, robots, food, particles, effects, audio, UI, backgrounds, and icons. Research also covers kids game UX patterns and Phaser juice techniques.

## Downloaded Packs (29 total, all CC0)

### Wave 1 — Core (13 packs)
Particle Pack, Toon Characters 1, Food Kit, Emotes Pack, Game Icons, Animal Pack Redux, Space Shooter Redux, Furniture Kit, Fish Pack, RPG Urban Pack, UI Pack, Platformer Enemies, Background Elements

### Wave 2 — Expanded (16 additional packs)
Monster Builder Pack, Robot Pack, Modular Characters, Shape Characters, Smoke Particles, Music Jingles, Interface Sounds, Impact Sounds, Digital Audio, Board Game Icons, Game Icons Expansion, Background Elements Redux, Alien UFO Pack, Pattern Pack, Input Prompts, Platformer Art Deluxe

## Key Asset Mappings

### Monster (SOLVED via Monster Builder Pack)
`kenney_monster-builder-pack/PNG/Default/` — modular parts: body, arms, legs, eyes (6 variants), mouths (A-J), horns, ears, antennae in 6 colors (blue, dark, green, red, white, yellow). Can compose custom monsters.

### Robot (multiple options)
- `kenney_toon-characters-1/Robot/PNG/Poses HD/` — 45 poses (idle, cheer, walk, jump, think, talk, etc.)
- `kenney_robot-pack/PNG/Side view/` — 4-color robots with body/drive/jump/hurt/damage states

### Kid
`kenney_toon-characters-1/Male person/PNG/Poses HD/` — 45 poses

### Dog
`kenney_animal-pack-redux/PNG/Round/dog.png`

### Food (cake, pizza, plates, bowls)
`kenney_food-kit/Previews/` — cake-birthday.png, pizza.png, plate.png, bowl-soup.png

### Furniture (toaster, fridge, desk, chair)
`kenney_furniture-kit/Side/` — toaster.png, kitchenFridge.png, desk.png, chair.png

### Audio
- `kenney_music-jingles/Audio/` — 5 categories: 8-bit, hit, pizzicato, sax, steel
- `kenney_interface-sounds/Audio/` — click, back, bong, close, confirmation, error, scroll
- `kenney_impact-sounds/Audio/` — impact/collision sounds
- `kenney_digital-audio/Audio/` — space/laser sounds

### Effects
- `kenney_particle-pack/PNG (Transparent)/` — star, fire, flame, smoke, spark, magic
- `kenney_smoke-particles/` — smoke and explosion particles
- `kenney_emotes-pack/PNG/Pixel/` — heart, question, exclamation emotes

## Coverage Gaps (Still Needed)
- **trex**: Not in any downloaded pack. Source from OpenGameArt CC0 dino sprites.
- **octopus**: Not in any downloaded pack. Elthen itch.io pack (free).
- **squirrel**: Not in any downloaded pack. OpenGameArt pixel squirrel (CC0).
- **wizard**: No dedicated wizard. Use Modular Characters or LuizMelo Wizard Pack (CC0).
- **balloon, present, instruments**: Not in packs. Need custom SVGs or itch.io sourcing.
- **Backdrops**: All 6 still need composition. Sources identified: ansimuz underwater, Lucky city parallax, NoranekoGames anime backgrounds.

## Kids Game UX Research Findings

### Key Design Rules (ages 8-10)
- Minimum 14pt body text, 24pt headings
- Tap targets minimum 75x75px
- Ages 8-10 prefer **muted** palettes over bright primary (Pixar not Fisher-Price)
- Every interaction needs visual + audio feedback
- No hamburger menus — kids don't recognize them
- Limit 3-5 choices per screen
- Word suggestion chips reduce typing friction 40-60% for kids

### Phaser Juice Techniques
- **Spawn**: Scale 0→1 with Bounce.Out + pop SFX
- **Move**: Cubic.Out easing + whoosh SFX
- **Success**: camera.flash → camera.zoomTo(1.15) → confetti → narration
- **Fail**: camera.shake → sad-trombone → confused anim → feedback
- **Idle**: Sine.InOut yoyo for floating/bobbing

### Priority Upgrades from Research
- `speech-bubble`: MEDIUM → HIGH (critical for narration)
- `arrow-hint`: LOW → HIGH (first-time guidance)
- Sound effects (click, pop, whoosh): should be HIGH priority

## Related
- `frontend/public/assets/ASSET-MANIFEST.md` — full manifest with priorities
- `.claude/memory/context/asset-pack-locations.md` — detailed file paths
- `.claude/memory/decisions/asset-sourcing-strategy.md` — sourcing strategy
