# Asset Library Research

**Created:** 2026-02-10
**Last Updated:** 2026-02-10
**Source:** session
**Confidence:** high
**Tags:** assets, kenney, sprites, cc0, asset-library

## Summary

Downloaded 13 Kenney.nl asset packs (CC0 license) to `frontend/public/assets/raw-packs/`. Total: 5,161 PNG files, 125MB. Strong coverage for robot, food, furniture, particles, UI. Still need custom SVGs for balloon, present, instruments, and itch.io sourcing for monster, trex, octopus, squirrel.

## Details

### Downloaded Packs (13 total)

**HIGH Priority (5 packs):**
1. `kenney_particle-pack` (15MB) — stars, hearts, sparkles, fire, smoke, magic particles
2. `kenney_toon-characters-1` (6.9MB) — Robot + human characters, 45 poses each (idle, cheer, walk, talk, jump, etc.)
3. `kenney_food-kit` (15MB) — cake, pizza, bowl-soup, plates, cupcake, various food (3D renders as 2D PNGs)
4. `kenney_emotes-pack` (2.2MB) — hearts, question marks, exclamation, sleep, music, anger emotes
5. `kenney_game-icons` (4.7MB) — arrows, buttons, checkmarks, crosses, stars

**MEDIUM Priority (8 packs):**
6. `kenney_animal-pack-redux` (5.2MB) — dog + 29 animals (round/square styles, with/without outlines)
7. `kenney_space-shooter-redux` (2.4MB) — rockets/ships, space backgrounds, meteors, effects
8. `kenney_furniture-kit` (20MB) — chair, desk, fridge, toaster, table, bed + many more (side view)
9. `kenney_fish-pack` (1.8MB) — fish varieties, underwater backgrounds, seaweed, bubbles
10. `kenney_rpg-urban-pack` (2.1MB) — city tiles 16x16 for city-street backdrop
11. `kenney_ui-pack` (5.3MB) — buttons, panels, arrows (blue/green/grey/red/yellow themes)
12. `kenney_platformer-enemies` (1.8MB) — slime, bat, bee, frog, mouse, snake, worm, ladybug sprites
13. `kenney_background-elements` (1.6MB) — clouds, castles, grass, trees, fences, sample backgrounds

**Pack locations:** `/Users/LuffyDMonkey/claude_projects/kids_ai_game/frontend/public/assets/raw-packs/`

### Vocabulary Contract → Pack Mapping

| Asset Key | Best Pack Match | Path |
|-----------|----------------|------|
| `robot` | toon-characters-1 | `Robot/PNG/Poses/character_robot_idle.png` |
| `kid` | toon-characters-1 | `Male person/PNG/Poses/character_malePerson_idle.png` |
| `dog` | animal-pack-redux | `PNG/Round/dog.png` |
| `monster` | platformer-enemies | `Enemy sprites/slime*.png` or custom |
| `cake` | food-kit | `Previews/cake-birthday.png` |
| `pizza` | food-kit | `Previews/pizza.png` |
| `plates` | food-kit | `Previews/plate.png` |
| `soup-bowl` | food-kit | `Previews/bowl-soup.png` |
| `toaster` | furniture-kit | `Side/toaster.png` |
| `fridge` | furniture-kit | `Side/kitchenFridge.png` |
| `desk` | furniture-kit | `Side/desk.png` |
| `chair` | furniture-kit | `Side/chair.png` |
| `fish` | fish-pack | `PNG/Default/fish_blue.png` |
| `rocket` | space-shooter-redux | `PNG/playerShip*.png` |
| Stars/hearts (effects) | particle-pack | `PNG (Transparent)/star_*.png`, etc. |

### Coverage Gaps (Still Needed)

**Not in Kenney packs:**
- `monster`: No dedicated monster sprite (slime/bat are closest). Consider itch.io or custom.
- `trex`: Not found. Need OpenGameArt or itch.io.
- `octopus`: Not found. Need itch.io Elthen pack.
- `squirrel`: Not found. Need OpenGameArt.
- `wizard`: No wizard character. Could use Female/Male adventurer poses.
- `balloon`, `present`, `bone`: Not found. Need custom SVGs.
- `guitar`, `drums`, `keyboard`, `microphone`: Musical instruments not in any pack. Need custom.
- **Backdrops:** No pre-made full backgrounds for party-room, wizard-kitchen, classroom, underwater-stage. Need to compose from tiles or source elsewhere.

### Next Steps

1. Select best asset from each pack per vocabulary contract key
2. Rename and copy to organized `actors/`, `props/`, `backdrops/` directories
3. Create custom SVGs for missing items (balloon, present, instruments)
4. Source monster, trex, octopus, squirrel from itch.io/OpenGameArt
5. Create/compose 6 backdrop images (1024x576)

**Statistics:** 5,161 PNG files, 125MB total (raw, before selection)

## Related

- `/Users/LuffyDMonkey/claude_projects/kids_ai_game/frontend/public/assets/ASSET-MANIFEST.md` (full manifest)
- `/Users/LuffyDMonkey/claude_projects/kids_ai_game/.claude/memory/research/vocabulary-contract.md` (asset contract)
- `/Users/LuffyDMonkey/claude_projects/kids_ai_game/docs/Prompt-Quest-Outrageous-Tasks-Asset-Library.html` (task design doc)
