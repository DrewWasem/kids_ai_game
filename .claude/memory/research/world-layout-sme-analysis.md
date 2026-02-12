# Prompt Quest World Layout — SME Analysis

**Date**: 2026-02-11
**Scope**: Gap analysis comparing current VillageWorld layout against kid-game hub-world best practices
**Sources**: Spatial inventory of VillageWorld.tsx + game design research (Mario 64, Spyro, Banjo-Kazooie, A Hat in Time, LEGO games)

---

## Executive Summary

The current world has strong foundations — 7 themed zones in a circular ring, a detailed medieval village center, dramatic dungeon approach with cliffs, and a three-ring forest boundary system. However, **the world is approximately 2-3x too large for the target audience (ages 8-10)**, zone entrances lack visual distinctness from the center, and the flat terrain creates navigation confusion from the isometric camera. The most impactful improvements are: shrinking the world radius, adding unique landmark silhouettes per zone, and introducing height variation.

---

## 1. Current World Metrics vs Best Practices

### Scale Comparison

| Metric | Current Value | Best Practice | Gap | Severity |
|--------|--------------|---------------|-----|----------|
| Character height | 2.61 units | 1.0 unit (reference) | — | — |
| Village building height | ~18 units (scale 7×) | 5.2-7.8 units (2-3× char) | ~2.5× too tall | **HIGH** |
| Hub center to nearest zone | 25 units (~10 char-lengths) | 15-20 char-lengths (39-52u) | OK for NE/SE/SW, **too far for N** | MEDIUM |
| Hub center to dungeon (N) | 55 units (~21 char-lengths) | 15-20 char-lengths | **~30% too far** | **HIGH** |
| Total playable area | 80×110 = 8,800 sq units | ~60×60 = 3,600 sq units | **~2.4× too large** | **CRITICAL** |
| Path width (main road) | 3 hex cols ≈ 4.5 units (~1.7 char-widths) | 4-5 char-widths (10-13u) | **~2.5× too narrow** | **HIGH** |
| Village center extent | X[-32,32] Z[-14,15] ≈ 64×29 | 21-31 unit radius (compact) | Width OK, but elongated N-S by road | LOW |
| World radius (playable) | 65 units (to dungeon) | 25-35 units total | **~2× too large** | **CRITICAL** |
| Walk time center→dungeon | ~7 sec walk / ~4 sec run | 3-8 sec max | Borderline at run speed | MEDIUM |

### Character-to-Object Ratios (char = 2.61u)

| Ratio | Current | Best Practice | Status |
|-------|---------|---------------|--------|
| Char:Building | 1:6.9 (18u buildings) | 1:2-3 | **Too tall** — buildings dominate, player feels ant-sized |
| Char:Tree | 1:4.6-6.1 (scale 5.6-7.5) | 1:2.5-4 | Slightly oversized |
| Char:Path width | 1:1.7 (4.5u road) | 1:3-5 | **Way too narrow** |
| Char:Landmark | N/A (no distinct landmarks) | 1:5-8 | **Missing entirely** |
| Char:Fence/wall | ~1:2.7 (scale 7 walls) | 1:0.5-0.7 | **Too tall** — walls block all sightlines |

### Key Insight: The Scale 7× Problem
Buildings are scaled 7× to match the character model proportions (established in a prior session). But this means **everything is 7× original, including walls, fences, and props**. A fence that should be waist-high (1.3u) is instead 9.1u — taller than the character. This breaks sightlines from the center.

---

## 2. Gap Analysis by Category

### A. Spatial Readability — Grade: D

**Issues:**
1. **No unique landmark silhouettes per zone.** From village center, all zones look like variations of "small structures at a distance." Research says each zone needs ONE tall, unique, impossible-to-miss landmark visible from center
2. **Flat terrain.** The entire playable area is at Y=0. Research recommends 0.5-2 character-heights of undulation (1.3-5.2 units)
3. **Building heights block sightlines.** Scale-7 buildings in the village (18u tall) completely block views to zone entrances from inside the village
4. **No color coding in terrain.** All zones sit on the same green hex-grass tiles. Best practice: each zone's ground color should shift (purple for dungeon, blue for space, etc.)

**What works:**
- Zone emojis and colors defined in ZONE_META
- North corridor through forest is visually clear
- Dungeon cliffs create strong directional marker

### B. Zone Transitions — Grade: C

**Issues:**
1. **Proximity-based auto-entry (3.0u trigger)** — Players get sucked into zones by walking near them. Research strongly recommends explicit interaction (gate/portal approach) especially for kids who "veer off paths constantly"
2. **No visual gradient approaching zones.** The hex-grass terrain is uniform until you're inside the zone. Research recommends 3-5 second walk corridors with gradually shifting theme
3. **No signposts or wayfinding at path junctions.** Research: "T-intersections should always have a visible landmark at the decision point"

**What works:**
- Dungeon approach with cliff walls creates dramatic transition
- Zone intro scripts provide narrative context
- Cooldown timer prevents immediate re-entry after exit

### C. World Size — Grade: F

**The most critical issue.** Research is unanimous: "Make it 50% smaller than you think. A child walking for more than 10 seconds without reaching something interesting will lose engagement."

Current measurements:
- Center to dungeon: 55 units = ~7 sec running, ~10 sec walking
- Center to far zones (E/W at 35u): ~4.5 sec running
- Total traversal north-south: 100 units = ~12 sec running

The dungeon is the special case — it's intentionally far with a dramatic approach. But the **overall playable area of 8,800 sq units is 2.4× the recommended ~3,600 sq units.** This means vast empty stretches between the village and zones.

### D. Visual Density — Grade: C+

**Issues:**
1. **Empty stretches between village and zones.** The area between village buildings (X±32) and zone entrances (radius 25-35) is mostly just hex-grass with sparse road decoration
2. **Road decoration only covers Z[-12, 26]** — the northern and southern portions of the road have no decoration
3. **Forest ring is a hard, opaque wall** rather than a natural density gradient

**What works:**
- Village center has good density — 14 buildings + 14 props
- Dungeon zone is well-furnished (35 floor tiles, 8 props, 6 torches, 4 banners)
- Park zone has varied objects (trees, benches, fountain, hedges)

### E. Path Design — Grade: C-

**Issues:**
1. **Path is perfectly straight.** A single north-south road with zero curvature. Research: "Perfectly straight paths feel artificial and boring. A gentle S-curve adds visual interest"
2. **No ring road connecting zones.** Research specifically recommends a ring road with spoke paths, not just a single axis road
3. **No secondary paths.** Only the main N-S road exists. No paths to E/W zones (Space, School, Kitchen, Concert, Pizza)
4. **Path too narrow** for character scale (1.7× char width vs recommended 3-5×)
5. **No breadcrumbs along paths** (collectibles, light sources, particles)

**What works:**
- Road has clear hex-tile contrast vs grass
- Road extends the full playable length

### F. Boundaries — Grade: B+

**Issues:**
1. **Player bounds (minZ=-65) are very close to dungeon cliffs** — feels tight
2. **No water features** (research recommends water as a secondary boundary layer)
3. **East/West bounds (X=±40) are invisible** — the forest ring is at R=38-62 but the player bound is at ±40, so players hit an invisible wall before the forest in many directions

**What works:**
- Three-ring forest system with corridor exclusions — naturalistic and effective
- Dungeon cliff bowl — dramatic and clearly communicates boundary
- Perimeter mountains at edges
- No invisible walls on the main N-S axis (forest corridors + bounds aligned)

### G. Vertical Interest — Grade: D-

**Issues:**
1. **The entire playable area is at Y=0.** This is the single biggest visual problem from an isometric camera. Research: "Flat hub worlds are disorienting from isometric/overhead cameras because everything is at the same visual depth"
2. **No elevated zone entrances.** Research: "Raised zone entrances create natural sightlines"
3. **No bridges, stairs, or multi-level structures**
4. **No terrain undulation.** The hex grid is flat

**What works:**
- Dungeon cliff bowl adds dramatic height at the north edge
- Perimeter mountains provide distant vertical backdrop
- Clouds at Y=25-45 add some vertical interest

### H. Zone Distinctiveness — Grade: C

**Issues:**
1. **Most zones are tiny** (12×12 to 10×8 local units). SpaceZone has a landing pad and base modules; SchoolZone has playground equipment; PizzaZone has counter and chairs — but from a distance, they all read as "a few small objects in grass"
2. **No zone-specific terrain coloring.** All zones sit on default green hex-grass
3. **No themed entrance archways/gates.** Research: "A visually distinct archway marks 'you're entering the fire zone'"
4. **ConcertZone stage uses a hex building (stage_A)** at scale 7 — this is one of the taller zone features, which is good

**What works:**
- Each zone uses thematically appropriate props (space modules, kitchen counters, playground equipment)
- Dungeon zone has the most complete theming (walls, pillars, banners, torches, ambient lighting)
- Zone-specific point lights provide color differentiation

---

## 3. Prioritized Recommendations

### Priority 1: CRITICAL (Do First)

#### 1A. Shrink the World
**Problem:** 8,800 sq unit playable area is 2.4× too large
**Solution:** Bring outer zones inward from radius 35 to radius 18-22
- Move zone centers: `knight-space [15,0,-15]`, `barbarian-school [20,0,0]`, `skeleton-pizza [15,0,15]`, `adventurers-picnic [0,0,20]`, `dungeon-concert [-15,0,15]`, `mage-kitchen [-20,0,0]`
- Keep dungeon at [0,0,-40] (shorter approach but still dramatic)
- Shrink player bounds to X[-30,30] Z[-50,30]
- Reduces playable area to ~4,800 sq units (~55% reduction)
**Impact:** Walk times drop to 2-4 seconds per zone. Kids maintain engagement.

#### 1B. Add Unique Zone Landmark Silhouettes
**Problem:** Zones are indistinguishable from village center
**Solution:** Each zone gets ONE tall, unique landmark piece at 2-3× the zone's other objects:
- Dungeon: Already has cliff bowl (good)
- Space: Tall antenna/tower piece (5-6u)
- School: Clock tower or flagpole (4-5u)
- Pizza: Giant spinning pizza sign / tall chimney (4-5u)
- Park: Large tree or fountain column (4-5u)
- Concert: Speaker tower or stage lighting rig (5-6u)
- Kitchen: Tall chimney with steam/smoke (4-5u)
**Impact:** Players can orient from center. "I want to go to the one with the rocket tower"

#### 1C. Widen the Path
**Problem:** Path is 4.5u wide with 2.61u character = 1.7× ratio (need 3-5×)
**Solution:** Expand road from 3 hex columns to 5 hex columns (cols -2 to +2)
- New width: ~7.5 units = 2.87× character width
- Better, though still below ideal. Alternatively, use larger hex tiles
**Impact:** Kids stay on path more easily, camera never makes path ambiguous

### Priority 2: HIGH (Do Next)

#### 2A. Add Height Variation
**Problem:** Everything at Y=0, world reads as flat pancake from camera
**Solution:**
- Raise village center by 1-2u (slight hill)
- Zone entrances sit at Y=0 (natural level)
- Add gentle terrain undulation along paths (Y=0 to Y=0.5 variation)
- Dungeon approach dips down slightly (descending into the dungeon)
**Impact:** Dramatically improves depth perception from isometric camera

#### 2B. Create Ring Road Connecting Zones
**Problem:** Only one N-S road; no paths to 5 of 7 zones
**Solution:** Add a curved ring road at radius ~20 connecting all zone entrances
- Spoke paths from center to 3-4 key zones (N, E, W, S)
- Ring road connects remaining zones
- Width: 3 hex columns (secondary path)
**Impact:** Players have clear routes to every zone, not just north/south

#### 2C. Add Zone-Specific Ground Colors
**Problem:** All zones sit on identical green grass
**Solution:** Replace grass hex tiles within ~8u of each zone center with themed tiles:
- Dungeon: dark stone/gravel tiles
- Space: metallic/grey tiles
- School: sandy/playground tiles
- Pizza: warm terracotta tiles
- Park: lush garden tiles (different green)
- Concert: dark purple/stage tiles
- Kitchen: checkered/tile pattern
**Impact:** Zones are distinguishable even before seeing props. Color guides navigation

#### 2D. Add Zone Entrance Archways
**Problem:** No clear "entering a zone" signal; proximity auto-triggers
**Solution:**
- Place a themed archway/gate at each zone entrance (2 pillars + connecting beam)
- Use zone's color for the archway tint
- Consider switching from auto-trigger to interaction-based entry (press E/Space near archway)
**Impact:** Prevents accidental zone entry, adds visual wayfinding markers

### Priority 3: MEDIUM (Polish)

#### 3A. Break Path Straightness
Add gentle curves to the main road. Instead of straight col [-2,2] road, offset middle sections by ±1 column every 8-10 rows to create S-curves.

#### 3B. Add Wayfinding Breadcrumbs
- Lanterns/torches along paths every 4-5 units
- Small signpost pieces at path junctions pointing to zones
- Particle effects (fireflies, sparkles) near zone entrances

#### 3C. Fill Empty Stretches
The area between village (X±32) and zones has little content. Add:
- Scattered props (haybales, crates, flowers) along paths
- Small NPC placement spots (benches, campfires)
- Terrain variety (flower patches, rock clusters)

#### 3D. Add Water Feature
A small stream or pond near the village adds:
- Visual interest and ambient sound potential
- Natural secondary boundary element
- Reflection effects for visual polish

#### 3E. Progressive Zone Disclosure
Not all 7 zones need to be "active" at start. Consider:
- 3 zones glowing/lit initially (N, E, S)
- Others visually muted (grey/fog) until progression
- Prevents "7 choices, where do I start?" overwhelm

### Priority 4: LOW (Nice-to-Have)

#### 4A. Arrival Lookout Point
Place player spawn at a slightly elevated NW position looking down at the village. First impression = panoramic view of the whole world.

#### 4B. Multi-Level Village Structures
Add a bridge connecting two buildings, or a raised walkway/balcony. Creates depth layers visible from isometric camera.

#### 4C. NPC Placement Along Paths
Stationary character models at key junctions. Kids gravitate toward characters.

#### 4D. Moving Elements
Butterflies, floating particles, windmill rotation — small animated elements that draw the eye along intended paths.

---

## 4. ASCII Map: Current Layout

```
                    NORTH (-Z)
                        |
         -65 ┌──────────────────────────────────────┐
             │   ▓▓▓   DUNGEON CLIFF BOWL   ▓▓▓    │ Mountains (scale 11-13)
         -72 │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
         -55 │     ╔═══════════════════╗            │
             │  ▓▓ ║  DUNGEON ZONE 💀  ║ ▓▓        │ [0,0,-55]
         -45 │  ▓▓ ║   18u × 10u      ║ ▓▓        │ Cliff bowl wraps around
             │  ▓▓ ╚═══════════════════╝ ▓▓        │
         -27 │     ⌐ Approach Cliffs  ¬             │ Cliffs start Z=-27
             │🌲🌲🌲🌲🌲  ║ ROAD ║  🌲🌲🌲🌲🌲     │ Forest ring R=38-62
         -25 │🌲🌲       🚀 SPACE          🌲🌲    │ [25,0,-25]
             │  🌲🌲      [25,0,-25]     🌲🌲      │
         -15 │    🌲🌲                 🌲🌲         │
             │                                      │
          -5 │    ┌─── VILLAGE CENTER ───┐          │
             │    │ Townhall  Church     │          │ 14 buildings @ scale 7
     W    0  │🧙 │ Well  Tavern Market  │ 📚      │ Kitchen[-35,0,0] School[35,0,0]
             │[-35]│ Blacksmith Stables  │ [35]     │
         +10 │    │ Homes  Windmill     │          │
             │    └──────────────────────┘          │
         +20 │  🌲🌲  🎸          🍕   🌲🌲       │ Concert[-25,0,25] Pizza[25,0,25]
             │      [-25,0,25]  [25,0,25]           │
         +30 │    🌲🌲🌲  ║ ROAD ║  🌲🌲🌲        │
         +35 │           🧺 PARK              │ [0,0,35]
             │          [0,0,35]                │
         +45 │ 🏔  🏔  🌲🌲🌲🌲🌲🌲🌲  🏔  🏔   │ South boundary
             └──────────────────────────────────────┘
            -40               0                   +40
          WEST (-X)     ←────→     EAST (+X)
```

## 5. ASCII Map: Recommended Layout (After Priority 1-2 Changes)

```
                    NORTH (-Z)
                        |
         -50 ┌──────────────────────────────┐
             │  ▓▓▓ DUNGEON CLIFFS ▓▓▓     │ (compressed bowl)
         -40 │  ▓╔═══════════════╗▓         │ DungeonZone [0,0,-40]
             │  ▓║  DUNGEON 💀   ║▓         │
             │  ▓╚═══════════════╝▓         │
         -30 │    ⌐  Cliffs  ¬              │
             │🌲🌲 ║ ROAD  ║ 🌲🌲          │
         -20 │  🌲  ╱        ╲  🌲          │ Ring road curves
             │     ╱ 🚀SPACE  ╲             │ [15,0,-15]
         -10 │    ╱              ╲           │
             │   │  ┌─VILLAGE─┐   │         │ Compact village
     W    0  │🧙│  │  Center  │  │📚       │ Kitchen[-20,0,0]  School[20,0,0]
             │[-20] │  (hill)  │ [20]       │ Center raised 1-2u
         +10 │   │  └─────────┘   │         │
             │    ╲              ╱           │
         +15 │  🎸 ╲          ╱ 🍕          │ Concert[-15,0,15] Pizza[15,0,15]
             │     ╲  ║ROAD║ ╱              │
         +20 │  🌲🌲 ║     ║ 🌲🌲          │
             │       🧺 PARK                │ [0,0,20]
         +30 │ 🏔  🌲🌲🌲🌲🌲🌲🌲  🏔     │
             └──────────────────────────────┘
            -30              0             +30

     Zones pulled to radius 15-20  |  Ring road connecting all
     Village compact (~20u diam)   |  5-col wide road (~7.5u)
     Center raised for sightlines  |  ~4,200 sq unit playable area
```

---

## 6. Quick-Win Implementation Checklist

These changes can be made in VillageWorld.tsx + gameStore.ts:

- [ ] **Shrink zone radii** in ZONE_CENTERS (gameStore.ts)
- [ ] **Shrink player bounds** in PlayerCharacter.tsx
- [ ] **Widen road** from 3 to 5 hex columns (HexTerrain)
- [ ] **Add one tall landmark per zone** (new Piece placements per zone component)
- [ ] **Push forest ring inward** to match new smaller radius (ImpenetrableForest)
- [ ] **Compress dungeon approach** (DungeonCliffs + DungeonZone position)
- [ ] **Add ring road hex tiles** at radius ~18 connecting zones
- [ ] **Add zone ground color** (different hex tile types near zone centers)
- [ ] **Add entrance archways** (2 pillars per zone entrance)
- [ ] **Add path decoration** (lanterns every 4-5u along roads)

---

## 7. Key Numbers to Remember

| Design Constant | Value | Source |
|----------------|-------|--------|
| Character height | 2.61u | Measured in game |
| Ideal building height | 5.2-7.8u (2-3× char) | Game design research |
| Ideal path width | 8-13u (3-5× char) | Game design research |
| Ideal hub radius | 15-20 char-lengths (39-52u) | Game design research |
| Max walk time to zone | 3-8 seconds | Game design research |
| Zone trigger distance | 3.0u (current) | gameStore.ts |
| Ideal terrain undulation | 1.3-5.2u (0.5-2× char) | Game design research |
| Min landmark height | 13-21u (5-8× char) | Game design research |
| Ideal zone count (initial) | 3 open, rest locked | Progressive disclosure |
