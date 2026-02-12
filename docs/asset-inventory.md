# Asset Inventory

Two lists: (1) assets loaded into the app, (2) assets only in the model zips.

---

## Part 1: Assets Loaded Into the App

Everything under `frontend/public/assets/` — deployed with the build.
**Total: ~4,804 3D models + ~100 2D/audio assets**

### 3D Characters (28 GLB) — `kaykit/characters/`

All use Rig_Medium skeleton. Referenced in `asset-manifest.ts`.

| Character | File | Used In Code |
|-----------|------|:---:|
| Knight | Knight.glb | Yes |
| Barbarian | Barbarian.glb | Yes |
| Barbarian (Large) | Barbarian_Large.glb | No |
| Mage | Mage.glb | Yes |
| Ranger | Ranger.glb | Yes |
| Rogue | Rogue.glb | Yes |
| Rogue Hooded | Rogue_Hooded.glb | Yes |
| Druid | Druid.glb | Yes |
| Engineer | Engineer.glb | Yes |
| Skeleton Warrior | Skeleton_Warrior.glb | Yes |
| Skeleton Mage | Skeleton_Mage.glb | Yes |
| Skeleton Rogue | Skeleton_Rogue.glb | Yes |
| Skeleton Minion | Skeleton_Minion.glb | Yes |
| Skeleton Golem | Skeleton_Golem.glb | Yes |
| Necromancer | Necromancer.glb | Yes |
| Space Ranger | SpaceRanger.glb | Yes |
| Space Ranger (Flight) | SpaceRanger_FlightMode.glb | Yes |
| Ninja | Ninja.glb | Yes |
| Clown | Clown.glb | Yes |
| Robot One | Robot_One.glb | Yes |
| Robot Two | Robot_Two.glb | Yes |
| Survivalist | Survivalist.glb | Yes |
| Witch | Witch.glb | Yes |
| Vampire | Vampire.glb | Yes |
| Black Knight | BlackKnight.glb | Yes |
| Superhero | Superhero.glb | Yes |
| Caveman | Caveman.glb | Yes |
| Frost Golem | FrostGolem.glb | Yes |

### 3D Animation Packs (8 GLB) — `kaykit/animations/`

139 total animation clips across 8 shared GLBs.

| Pack | File | Clips |
|------|------|------:|
| General | Rig_Medium_General.glb | 14 |
| Movement Basic | Rig_Medium_MovementBasic.glb | 11 |
| Movement Advanced | Rig_Medium_MovementAdvanced.glb | 12 |
| Combat Melee | Rig_Medium_CombatMelee.glb | 21 |
| Combat Ranged | Rig_Medium_CombatRanged.glb | 19 |
| Simulation | Rig_Medium_Simulation.glb | 13 |
| Special | Rig_Medium_Special.glb | 13 |
| Tools | Rig_Medium_Tools.glb | 28 |

### KayKit Packs (3,740 GLTF) — `kaykit/packs/`

| Pack | Models | Used in Code |
|------|-------:|:---:|
| forest_nature | 1,588 | Yes (8 models) |
| platformer | 525 | No |
| medieval_hex | 404 | Yes (~75 models) |
| dungeon | 283 | Yes (~30 models) |
| restaurant | 225 | Yes (~20 models) |
| holiday | 138 | Yes (6 models) |
| resource | 132 | No |
| halloween | 102 | Yes (1 model) |
| furniture | 74 | Yes (5 models) |
| city_builder | 73 | No |
| rpg_tools | 69 | Yes (3 models) |
| space_base | 69 | Yes (~20 models) |
| block | 58 | No |

### Tiny Treats Packs (719 GLTF) — `tiny-treats/`

| Pack | Models | Used in Code |
|------|-------:|:---:|
| playful-bedroom | 149 | No |
| charming-kitchen | 118 | Yes (~20 models) |
| bakery-interior | 114 | Yes (1 model) |
| house-plants | 113 | No |
| bakery-building | 50 | No |
| fun-playground | 47 | Yes (~18 models) |
| pleasant-picnic | 41 | Yes (~10 models) |
| baked-goods | 32 | Yes (6 models) |
| pretty-park | 28 | Yes (~15 models) |
| homely-house | 27 | No |

### Living Room Pack (187 GLTF) — `living-room/`

| Pack | Models | Used in Code |
|------|-------:|:---:|
| living-room | 187 | Yes (1 model: book_stack) |

### Quaternius Animals (7 GLB) — `quaternius/animals/`

| Model | File |
|-------|------|
| Cat | kitty_001.glb |
| Dog | dog_001.glb |
| Horse | horse_001.glb |
| Chicken | chicken_001.glb |
| Deer | deer_001.glb |
| Penguin | pinguin_001.glb |
| Tiger | tiger_001.glb |

### Quaternius Food (25 GLB) — `quaternius/food/`

apple, banana, burger, carrot, chips, coffee, donut, drink, eggplant, fish, fork, ice_cream_dish, peach, Plate, sandwich, sausages, sushi_dish, tomato, wineglass, yogurt — plus 5 variant files (coffee_002, drink_002-004, wineglass_002)

### Quaternius Christmas (90 GLB) — `quaternius/christmas/`

All 90 models from the Christmas Pack Free are deployed:
Furniture (armchairs, bed, couch, tables, shelves, nightstand), Christmas decor (tree indoor/outdoor, socks, presents x6, sugar canes, snowman, advent wreath, garland), Kitchen (stove, sink, cabinets, fridge, table), Fireplace set (fireplace, coal, fire, firewood, pipe), Santa (animated), Walls/Floors/Roof/Windows, Decorations (clocks, lights, paintings), Kitchenware (plates, bowls, cups, teapot, utensils, spices, salt shaker)

**16 models referenced in code** (christmas_tree, snowman, present x3, candy_cane, wreath, garland, stocking, fireplace, cookie, teapot, bowl, cup, armchair, couch). The other 74 are deployed but unused.

### 2D Actors (9 PNG) — `assets/actors/`

dog, fish, kid, monster, octopus, robot, squirrel, trex, wizard

### 2D Backdrops (6 files) — `assets/backdrops/`

city-street.svg, classroom.svg, party-room.svg, space.png, underwater-stage.svg, wizard-kitchen.svg

### 2D Props (32 files) — `assets/props/`

**PNG:** cake, cake-giant, cake-tiny, chair, desk, flag, fridge, keyboard, moon, pencil, pizza, pizza-soggy, plates, rocket, soup-bowl, spacesuit, stars, toaster
**SVG:** balloon, bone, drums, fire-extinguisher, flag, guitar, keyboard, lunchbox, microphone, pencil, pillow-fort, present, river, soup-bowl, spacesuit

### 2D Effects (21 PNG) — `assets/effects/`

circle, confetti-burst, exclamation, explosion-cartoon, fire-sneeze, flame, happy, heart, laugh, light, magic, music, question, sad, smoke, spark, sparkle-magic, splash, star, star2, twirl

### 2D Reactions (10 PNG) — `assets/reactions/`

confetti-burst, explosion-cartoon, fire-sneeze, hearts-float, laugh-tears, question-marks, sad-cloud, sparkle-magic, splash, stars-spin

### Sound Effects (19 OGG) — `assets/sfx/`

boing, bong, celebration, click, drop, error, funny-fail, impact, jingle-celebrate, jingle-fail, jingle-start, jingle-success, laser, partial, pop, submit, success, whoosh, zap

### UI Icons (9 PNG) — `assets/ui/`

audio-off, audio-on, checkmark, cross, home, info, settings, star, trophy

---

## Part 2: Assets Only in the Zips (Not Deployed)

Everything in `Model Zips/` that has NOT been extracted to `frontend/public/assets/`.

### The Complete KayKit Collection v3.zip (1.22 GB)

**~4,027 GLTF/GLB models total.** Most environment packs were extracted, but these remain zip-only:

#### Characters NOT Deployed (16 GLB)

| Character | Notes |
|-----------|-------|
| Animatronic_Creepy.glb | Mystery Monthly — horror theme |
| Animatronic_Normal.glb | Mystery Monthly — horror theme |
| Clanker.glb | Mystery Monthly |
| CombatMech.glb | Mystery Monthly |
| Helper_A.glb | Mystery Monthly |
| Helper_B.glb | Mystery Monthly |
| Hiker.glb | Mystery Monthly |
| Mannequin_Large.glb | Rig reference model |
| Mannequin_Medium.glb | Rig reference model |
| Paladin.glb | Mystery Monthly |
| Paladin_with_Helmet.glb | Mystery Monthly |
| Protagonist_A.glb | Mystery Monthly |
| Protagonist_B.glb | Mystery Monthly |
| Tiefling.glb | Mystery Monthly |
| Werewolf_Man.glb | Mystery Monthly |
| Werewolf_Wolf.glb | Mystery Monthly |

#### Rig_Large Animations (NOT Deployed)

All 8 animation packs also have Rig_Large versions for bigger characters (FrostGolem, Golem, etc.). These are in the zip but not extracted.

#### Medieval Hex — Units & Rivers (NOT Deployed)

The medieval_hex pack has additional content not extracted:
- **Units** (soldiers, archers, catapults) in blue/green/red/yellow/neutral color variants
- **River tiles** and **waterless coast/river** variants
- **Road tiles** (roads/ subfolder)

#### KayKit 1.0 Environment Packs — Color Variants (NOT Deployed)

The main `1.0/Assets/gltf/` folder contains the complete environment library in **8 color variants** (Color1-Color8 + blue/green/red/yellow/neutral). Most of these ~3,053 files overlap with the 13 deployed packs, but the additional color variants are NOT deployed.

#### Adventure Props — Additional Items

The zip `2.0/Assets/gltf/` folder has adventure props (backpacks, tools, weapons, potions, crates, torches) that map to deployed packs but may have models not individually extracted.

### Cartoon_City_Free_glb.zip (188 MB) — NOTHING DEPLOYED

**~50 GLB models.** Entirely unextracted.

| Category | Models |
|----------|--------|
| Buildings | Eco_Building (Grid, Slope, Terrace), Regular_Building_TwistedTower_Large |
| Vehicles | Car x4, Futuristic_Car, Van |
| Roads | road x7 |
| Street | Billboard x4, Bus_Stop, Fountain, Graffiti, Signboard, Spotlight x2, Traffic Light x3 |
| Props | Bush x3, Palm, Trash x5, Trash_Can x5 |
| Tiles | Set_B_Tiles x5 |
| Textures | 7 PNG (banners, roads, signs, tiles + normal/roughness maps) |

### Creative_Character_Free_glb.zip (15.7 MB) — NOTHING DEPLOYED

**1 combined GLB** + nested `Separate_assets_glb.zip` with individual character parts. Customizable character system with mix-and-match parts.

### All in One - Quaternius[Patreon].zip (6.6 GB) — MOSTLY NOT DEPLOYED

**~9,292 model files** (1,751 GLTF + 3,932 FBX + 3,607 OBJ + 2 GLB). Only the Animals, Food, and Christmas sub-packs were extracted. Everything else remains zip-only:

| Category | Description |
|----------|-------------|
| **Nature** | Trees (common, dead, palm, willow, birch), bushes, grass, flowers, ferns, rocks, cliffs — thousands of variants |
| **Characters** | Modular character system with hair, eyebrows, body parts (Godot/Unity formats) |
| **FPS Assets** | Guns (pistol, revolver, rifle, SMG, sniper), ammo, enemies (EyeDrone, QuadShell, Trilobite) |
| **Medieval** | Castle parts, weapons, shields, armor pieces |
| **Buildings** | Houses, shops, modern/medieval/fantasy architecture |
| **Vehicles** | Cars, trucks, boats, spaceships |
| **Space** | Planets, satellites, space stations, asteroids |
| **Miscellaneous** | Furniture, electronics, tools, containers, decorations |
| **Game Kits** | Platformer blocks, pickups, mechanics, height maps |

Organized by year (2016-2025) with multiple export formats per model.

### Tiny_Treats_Collection_1_1.0.zip (249 MB) — PARTIALLY DEPLOYED

10 of 12 packs extracted. **2 packs remain zip-only:**

#### Bubbly Bathroom (~84 GLTF) — NOT DEPLOYED

bath, shower, toilet, sink (mirror + cabinet), ducky, slippers, soap dishes, toothbrushes, towels (blue/pink/yellow), toilet rolls, bin, candle, plant, mat, containers (A-D in 3 colors each), modular tiled walls (straight, corner, window, doorway variants), floor

#### Lovely Living Room (~187 GLTF) — DEPLOYED separately

This pack IS deployed (from the standalone zip below), just not from the collection zip. Already at `living-room/`.

### Tiny_Treats_Lovely_Living_Room_1.0.zip (40.3 MB) — ALREADY DEPLOYED

187 GLTF models. Extracted to `frontend/public/assets/3d/living-room/`. Includes: aquarium, books, boxes, candles, chairs (3 colors), clock, closets, couches (3 colors), curtains, cushions, desk, door, fireplace, floor, frames, lamps, mirror, ottoman, painting, piano, plant pots, radio, rug, shelf, side tables, speakers, stairs, stools, table, TV, vases, modular walls, windows.

### Food_FREE_glb.zip (25 MB) — ALREADY DEPLOYED

26 individual GLB models + 1 combined `Food_FREE.glb`. All individual models extracted to `quaternius/food/`. Only `Food_FREE.glb` (combined file) remains zip-only.

### Animals_FREE_glb.zip (8.4 MB) — ALREADY DEPLOYED

8 individual GLB models + 1 combined `Animals_FREE.glb`. All individual models extracted to `quaternius/animals/`. Only `Animals_FREE.glb` (combined file) remains zip-only.

### Christmas_Pack_Free_glb.zip (117 MB) — ALREADY DEPLOYED

90 individual GLB models + 2 combined files. All individual models extracted to `quaternius/christmas/`. Only `One_file_assets.glb` and `Pack_Free.glb` (combined files) remain zip-only.

---

## Summary

| Source | Total Models | Deployed | Zip-Only |
|--------|------------:|----------:|---------:|
| KayKit Characters | 44 | 28 | 16 |
| KayKit Animations | 16 (8 Medium + 8 Large) | 8 | 8 |
| KayKit Environment Packs | ~4,027 | ~3,740 | ~287+ (units, rivers, color variants) |
| Tiny Treats Collection | ~900 | ~719 | ~84 (Bathroom) |
| Tiny Treats Living Room | 187 | 187 | 0 |
| Quaternius Animals | 8 | 7 | 1 (combined) |
| Quaternius Food | 27 | 25 | 2 (combined + variant) |
| Quaternius Christmas | 92 | 90 | 2 (combined) |
| Cartoon City | ~50 | 0 | ~50 |
| Creative Character | 1+ | 0 | 1+ |
| Quaternius All-in-One | ~9,292 | ~122 | ~9,170 |
| **Totals** | **~14,644** | **~4,926** | **~9,618+** |

**~34% of available model files are deployed. ~66% remain in zips.**
Of the deployed models, only ~250 are actually referenced in source code.
