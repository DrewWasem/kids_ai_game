# Asset Gap Analysis

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** assets, gap-analysis, quaternius, kenney, kaykit, tiny-treats, downloads, vocabulary-contract

## Summary

Project has 1.32GB of downloaded 3D assets but only 0.63% (81 files) are actually used. Massive untapped inventory on disk plus recommended new downloads identified.

## Details

### Unused Assets Already On Disk

**Quaternius (607MB, 0% used):**
- FOOD_MODELS dict in asset-manifest.ts: 20+ food items (burger, carrot, chips, donut, ice_cream, sushi, banana, etc.)
- ANIMAL_MODELS dict: 7 animals (cat, dog, horse, chicken, deer, penguin, tiger)
- CHRISTMAS_MODELS dict: 17 holiday items
- All have manifest dictionaries but are NEVER wired into any task's TASK_ASSETS

**Poly-Pizza (415MB, 0% used):**
- 10 category groups with 52+ packs including food, fantasy, interior, nature, space, vehicles
- Entirely unreferenced

**Cartoon City (138MB, 0% used):**
- ~54 city-themed GLB files, entirely unreferenced

**Unused KayKit packs (downloaded but not in manifest):**
- halloween/ (205 files) — spooky props for Dungeon Concert
- rpg_tools/ (142 files) — weapons, tools, gear
- block/ (117 files), city_builder/ (147 files), platformer/ (1,052 files), resource/ (265 files)
- Rig_Large animations (6 packs, only Rig_Medium is used)

**Unused Tiny Treats (downloaded but not in manifest):**
- house-plants/ (227 files) — indoor plants for Mage Kitchen
- bubbly-bathroom/ (169 files) — silly comedy props
- playful-bedroom/ (303 files) — pillows, beds for slapstick
- bakery-building/ (102 files), homely-house/ (55 files)

### Recommended Downloads

1. **Kenney Food Kit** — 200 models, FREE, CC0 — kenney.nl/assets/food-kit
   - Pizza, burger, cake, sushi, taco, hot dog, fries, ice cream, croissant, pancakes, 180+ more
   - Kitchen utensils: frying pan, cutting board, knife block, rolling pin, whisk, spatula
   - Transforms Skeleton Pizza + Mage Kitchen zones

2. **Kenney Fantasy Town Kit** — 160 models, FREE, CC0 — kenney.nl/assets/fantasy-town-kit
   - Medieval market stalls, wagons, barrels, crates, banners, signs, fences, wells, bridges
   - Enriches village world

3. **Poly.pizza Musical Instruments** — FREE, CC0/CC-BY — poly.pizza/search/instrument
   - Guitar, drums, piano, trumpet individually downloadable as GLB
   - Fixes Dungeon Concert zone prop gaps

4. **Kenney Medieval Town (Base)** — 65 models, FREE, CC0 — kenney.nl/assets/medieval-town-base

### Priority Actions

- P0: Wire existing Quaternius food/animals into manifest (code only, no download)
- P0: Wire unused KayKit halloween/rpg_tools packs
- P1: Download Kenney Food Kit + poly.pizza instruments
- P2: Download Kenney Fantasy Town Kit
- P3: Wire unused Tiny Treats packs

## Related
- `frontend/src/data/asset-manifest.ts` — Master vocabulary with unused FOOD_MODELS, ANIMAL_MODELS, CHRISTMAS_MODELS dicts
- `frontend/public/assets/3d/` — All asset directories
- `.claude/memory/context/asset-pack-locations.md` — Existing asset organization reference
- `docs/prompt-quest-analysis.md` — Full analysis report
