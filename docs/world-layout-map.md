# Prompt Quest — World Layout Map v2

**Player Bounds**: X [-40, 40], Z [-65, 45] = 80w x 110d units
**Player Spawn**: [0, 0, 0] (village center)
**Walk**: 8 u/s | **Run**: 14 u/s | **Zone trigger**: 3.0u
**Character height**: 2.56u (Knight @ Rig_Medium)

---

## Master Map — Full World (1 char ≈ 2 units)

```
              X=-65      X=-40        X=-20       X=0        X=+20       X=+40       X=+65
              :          |            :           :          :            |           :
              :          |            :           :          :            |           :
 Z=-90 ·  ·  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲  ·  · TREE BORDER ROW 3
 Z=-85 ·  ·  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲  ·  · TREE BORDER ROW 2
 Z=-80 ·  ·  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲  ·  · TREE BORDER ROW 1
              :          |            :           :          :            |           :
 Z=-85 ·  ·  ·  ·  ·  ⛰⛰ ·  ·  ·  ·  ·  ⛰ ·  ·  ·  ·  ·  ⛰⛰ ·  ·  ·  ·  · NORTH WALL (behind dungeon)
 Z=-82 ·  ·  ·  ·  ⛰⛰ ·  ·  ·  ·  ·  ·  ·  ⛰ ·  ·  ·  ·  ·  ⛰⛰ ·  ·  ·  ·
              :          |            :           :          :            |           :
 Z=-75 ·  ·  ·  ·  ·  ·│·  ·  ·🌲· 🌲 ·  ·  ·  · 🌲·  🌲·  ·│·  ·  ·  ·  ·  · CLIFF-TOP TREES
 Z=-72 ·  ·  ·  ·  ·  ·│·  ·  ⛰⛰⛰ ⛰⛰⛰ ⛰⛰⛰ ·  ·│·  ·  ·  ·  ·  · DUNGEON BACK WALL
 Z=-70 ·  ·  ·  ·  ·  ·│·  ⛰⛰ · · · · · · · ⛰⛰ ·│·  ·  ·  ·  ·  ·
 Z=-68 ·  ·  ·  ·  ·  ·│· ⛰⛰  ·  ·  ·  ·  ·  ⛰⛰ │·  ·  ·  ·  ·  · DUNGEON LEFT/RIGHT WALLS
              :          |    :       :           :       :   |           :
 Z=-65 ═══════════════════════╬═══════╬═══════════╬═══════╬═══════════════════════ PLAYER BOUND (north)
              :          |    :       :           :       :   |           :
 Z=-62 ·  ·  ·  ·  ⛰🪨 │  ⛰│·  ·  ·  ·  ·  ·│⛰  │🪨⛰·  ·  ·  ·  · DUNGEON SIDE WALLS
 Z=-60 ·  ·  ·  ·  ·  ⛰│ 🏰⛰  ·  ·  ·  ·  ·  ⛰  │⛰ ·  ·  ·  ·  · CASTLE (31.8u tall!)
              :          | [-10,     :           :       :   |           :
 Z=-58 ·  ·  ·  ·  ·  · │  -60]⛰  ·  ·  ·  ·  ·  ⛰  │·  ·  ·  ·  ·
              :          |    :       :           :       :   |           :
 Z=-55 ·  ·  ·  ·  ·  · │  · │ ╔══DUNGEON══╗  · │ ·  · │·  ·  ·  ·  · ← ZONE CENTER [0,0,-55]
              :          |    : │║ walls     ║│  :       :   |           :
 Z=-52 ·  ·  ·  ·  ·  · │  · │ ║ pillars   ║│  · ·  · │·  ·  ·  ·  · 💀 skeleton-birthday
              :          |    : │║ torches   ║│  :       :   |           :
 Z=-49 ·  ·  ·  ·  ·  🪨│  · │ ╚═══════════╝│🪨 ·  · │·  ·  ·  ·  · ENTRANCE BOULDERS
              :          |    :  ⌐approach¬   :       :   |           :
 Z=-46 ·  ·  ·  ·  ·  · │  ·🪨  ·  ·  ·  · 🪨·  · │·  ·  ·  ·  · APPROACH CLIFFS (growing)
 Z=-43 ·  ·  ·  ·  ·  · │  ·⛰🪨 ·  ·  · 🪨⛰·  · │·  ·  ·  ·  ·
 Z=-40 ·  ·  ·  ·  ·  · │  · ⛰  ·  ·  ·  · ⛰ ·  │·  ·  ·  ·  ·
 Z=-37 ·  ·  ·  ·  ·  · │  ·🪨⛰ ·  ·  · ⛰🪨·  · │·  ·  ·  ·  ·
 Z=-34 ·  ·  ·  ·  ·  · │  · ⛰  ║  ║  ║  ⛰ ·  · │·  ·  ·  ·  ·
 Z=-30 ·  ·  ·  ·  ·  · │  · 🪨  ║  ║  ║  🪨 ·  · │·  ·  ·  ·  ·
 Z=-27 ·  ·  ·  ·  ·  · │  · 🪨  ║  ║  ║  🪨 ·  · │·  ·  ·  ·  · APPROACH CLIFFS (start)
              :          |    :   ║MAIN║    :       :   |           :
              :          |    :   ║ROAD║    :       :   |           :
              :          |    :   ║N-S ║    :       :   |           :
 Z=-25 ·  ·  ·  ·  ⛰  ⛰│🌲 ·   ║    ║  · ·🗼🚀·  │·  ·  ·  ·  · ← SPACE ZONE [25,0,-25]
              :          |  🌲:   ║    ╠═══════╝    :   |           :   🗼 = Tower_A_blue (17.5u)
              :          |    : ╔═╩════╗  :       :     |           :
              :          |    : ║spoke ║  :       :     |           :
 Z=-20 ·  ·  ·  ·  ⛰  ⛰│🌲 · ╠══════╬═══════╗  ·  · │⛰  ·  ·  · FOREST RING (inner)
              :          | 🌲 : ║      ║  :   ║   :     |           :
              :          |    : ║      ║  :   ║   :     |           :
 Z=-15 ·  ·  ·  ·  ·  ·│· 🌲 ║ ⛰   ·║  ·  ·║  ·  · │·  ·  ·  · HILLS between spokes
              :          |    : ║      ║  :   ║   :     |           :
              :          |    : ║      ║  :   ║   :     |           :
 Z=-12 ·  ·  ·  ·  ·  ·│·  · ║ ·[STB]·║[HmA] ║  ·  · │·  ·  ·  · [STB]=Stables [HmA]=Home_A
              :          |    : ║ [STG]·║  :   ║   :    |           :  [STG]=Stage
              :          |    : ║      ║  :   ║   :     |           :
              :    KITCHEN│ZONE: ║      ║  :   ║   :  SCHOOL│ZONE   :
 Z=-8  ·  ·  ·  ·  ·  ·│·  · ║· [WCT]║  ·  ·║  ·  ·[🗼]│·  ·  · [WCT]=Watchtower
              :          |    : ║      ║  :   ║   :     |           :  🗼=Tower_B_red (19.9u)
 Z=-7  ·  ·  ·  ·  ·  ·│·  ·[TAV]  · ║  ·  ·║  ·  · │·  ·  ·  · [TAV]=Tavern
 Z=-5  ·  ·  ·  ·  · 🗼│·  · ║[TWN]  ║  ·  ·║  ·  · │·  ·  ·  · [TWN]=Townhall (14.5u)
              :   [-41,  |    : ║      ║  :   ║   :     |[41,-4]    :  🗼=Tower_B_green
              :    -4]   |    : ║      ║  :   ║   :     |           :
═══════╬═══KITCHEN═══════╬════╬═╬══════╬══════╬═══╬════╬═══SCHOOL═══╬════ Z=0 EQUATOR
 Z=0   ║  ·🧙·  ·[WM]·[BK]│·[WL]║  ·  ·║  ·  ·║[CH] · │📚·  ·  ·  ·  [WM]=Windmill [BK]=Blacksmith
              :   [-35,  |    : ║      ║  :   ║   :     |[35,0]     :   [WL]=Well [CH]=Church
              :    0]    |    : ║      ║  :   ║   :     |           :
 Z=2   ║  ·  ·  ·  ·  ·│·  · ║  ·  ·║  ·  ·║  ·  · │·  ·  ·  ║
              :          |    : ║      ║  :   ║   :     |           :
 Z=5   ║  ·  ·  ·  ·  ·│·  · ║  ·  ·║  ·  ·║  ·  · │·  ·  ·  ║
              :          |    : ║      ║  :   ║   :     |           :
 Z=7   ║  ·  ·  ·  ·  ·│[HmA]· ║[MKT]·║  ·  ·║[HmB]· │·  ·  ·  ║  [MKT]=Market
              :          |    : ║      ║  :   ║   :     |           :
 Z=9   ║  ·  ·  ·  ·  ·│·  · ║  ·  ·║  ·  ·║  ·  · │·  ·  ·  ║
              :          |    :╔╩══════╩══╗  ·║  :     |           :
 Z=12  ·  ·  ·  ·  ·  ·│[HmA]·║  ☆POND ·║  ·║[HmB]· │·  ·  ·  · [HmA/B]=Homes
              :          |    : ╚═════════╝  :║   :     |           :
              :          |    : ║      ║  :   ║   :     |           :
 Z=15  ·  ·  ·  ·  ·  ·│·  · ║  ⛰   ·║  ·  ·║  ·  · │·  ·  ·  · HILLS
              :          |    : ║      ║  :   ║   :     |           :
 Z=18  ·  ·  ·  ·  ·  ·│🌲 · ║  ·  🌲║  ·  ·║🌲·  · │·  ·  ·  · ROAD-SIDE TREES
              :          | 🌲  :╠══════╬════╗ ║  :      |           :
 Z=20  ·  ·  ·  ·  ·  ·│· 🌲 ╠══════╬════╬═╬═════╗  │·  ·  ·  · FOREST RING
              :          |  🌲: ║      ║  :║  ║   ║:    |           :
              :          |    : ║      ║  :║  ║   ║:    |           :
              :  CONCERT |    : ║      ║  :║  ║   ║: PIZZA|         :
 Z=25  ·  ·  ·  ·🗼🎸  │🌲 · ║  ·  ·║  ·║  ·  ·║  🍕🏛│·  ·  · ← CONCERT [-25,0,25]
              :   [-25,  | 🌲 : ║      ║  :║  ║   ║:  [25,|25]     :    PIZZA [25,0,25]
              :    25]   |    : ║      ║  :║  ║   ║:    |           :   🗼=Tower_A_yellow
              :          |    : ║      ║  :║  ║   ║:    | 🏛=Shrine_yellow
 Z=28  ·  ·  ·  ·  ·  ·│🌲 · ║  ·  ·║  ·║  ·  ·║  · │·  ·  ·  ·
              :          | 🌲 : ╚══════╩════╩═╩════╝    |           :
              :          |    :       :   ║       :     |           :
              :          |    :       :   ║       :     |           :
 Z=32  ·  ·  ·  ·  ·  ·│🌲 ·  ·  ·  ·  ║  ·  ·  · 🌲│·  ·  ·  ·
              :          |    :       :   ║       :     |           :
 Z=35  ·  ·  ·  ·  ·  ·│· 🌲 ·  · 🏛🧺 ║  ·  · 🌲·│·  ·  ·  · ← PARK ZONE [0,0,35]
              :          | 🌲 :       : [0,0,35]  :     |           :   🏛=Watchtower_green (8.9u)
 Z=38  ·  ·  ·  ·  ·  ·│🌲 ·  ·  ·  ·  ·  ·  ·  · 🌲│·  ·  ·  ·
              :          |    :       :           :     |           :
 Z=40  ·  ·  ·  ·  ·  ⛰│· 🌲 ·  ·  ·  ·  ·  · 🌲· │⛰·  ·  ·  · PERIMETER MOUNTAINS
              :          |    :       :           :     |           :
 Z=45  ═══════════════════════════════════════════════════════════════ PLAYER BOUND (south)
              :          |    :       :           :     |           :
 Z=48  ·  ·  ·  ·  ⛰  ·│·  ·  ⛰  ·  ⛰  ⛰  · ⛰ · │· ⛰·  ·  · SOUTH WALL row 1
 Z=52  ·  ·  ·  ·  ⛰  ⛰ ·🪨· ⛰  ⛰  ⛰  · 🪨 ⛰  ⛰ ⛰ ·  ·  ·  SOUTH WALL row 1 (cont)
 Z=55  ·  ·  ·  ·  ·  · ·  · ⛰⛰ ·  ·  · ⛰⛰ ·  ·  ·  ·  ·  · SOUTH WALL row 2
 Z=60  ·  ·  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲  ·  · TREE BORDER ROW 1
 Z=64  ·  ·  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲  ·  · TREE BORDER ROW 2
 Z=68  ·  ·  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲  ·  · TREE BORDER ROW 3
```

**Legend**: ⛰ Mountain/Hill | 🪨 Rock | 🌲 Tree/Forest | ║═ Cobblestone Road | 🗼 Zone Landmark Tower | 🏰 Castle | 🏛 Shrine/Watchtower

---

## Road Network Detail

```
                              NORTH
                                │
                           ║════║════║  Main N-S Road (3 cols wide, Z=-36 to Z=18)
                           ║    ║    ║
                           ║    ║    ║
                      ╔════╬════╬════╬════╗
                    ╔═╝    ║    ║    ║    ╚═╗
                  ╔═╝      ║    ║    ║      ╚═╗
    W spoke ════╬═╝    ╔═══╬════╬════╬═══╗    ╚═╬════ E spoke
   [-35,0]  ════╬═╗    ║   ║    ║    ║   ║    ╔═╬════ [35,0]
                  ╚═╗   ║   ║  ORIGIN║   ║  ╔═╝
                    ╚═╗ ║Ring║ [0,0,0]║Ring╔═╝
        SW spoke ═══╗ ╚═╬═══╬════╬════╬═══╬═╝ ╔═══ NE spoke
       [-25,25] ════╬═══╝   ║    ║    ║   ╚═══╬════ [25,-25]
                            ║    ║    ║
                            ║    ║    ║
              SE spoke ═════╬════╬════╬═════
             [25,25]  ══════╝    ║    ╚══════
                                 ║
                              S spoke
                              [0,35]

    Ring Road: Circle at R=30, halfWidth=2.0 (skips Z < -35)
    Spoke halfWidth: 2.0
    Main Road: cols [-1, 0, +1], Z range [-36, 18]
    All roads: cobblestone tiles at scale 1.8
```

---

## Village Center Detail (Z=-15 to Z=15, X=-33 to X=33)

```
    X=-33   X=-25   X=-18   X=-10   X=0    X=10    X=18    X=25   X=33
      |       |       |       |      |       |       |       |      |
Z=-14 ·  ·  · │·  · [HmB]·  ·│·  · [STG]·  │· [STB]·│·  · [HmA]│ · ·
      ·       │       │7.0    │      │5.6    │  7.0   │       │7.0  │
Z=-12 ·  ·  · │·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │       │       │      │       │       │       │      │
Z=-10 ·  ·  · │·  ·  ·│·  ·  ·│[STG] ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │       │       │      │       │       │       │      │
Z=-8  ·  ·  · │·  ·  ·│·  · [WCT]·  │·  ·  ·│·  ·  ·│·  ·  ·│[WCT]
      ·       │       │       │  7.0 │       │       │       │  7.0 │
Z=-7  ·  ·  · │·  · [TAV]·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │       │7.0    │      │       │       │       │      │
Z=-5  ·  ·  · │·  ·  ·│·  ·  ·│·  [TWN]║  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │       │       │   7.7║       │       │       │      │
      ·       │       │       │      ║       │       │       │      │
Z=-2  ·  [WM] │·  ·  ·│·  ·  ·│·  ·  ║  ·  ·│·  ·  ·│·  ·  ·│·[CH]
      ·  7.7  │       │       │      ║       │       │       │  7.7 │
Z=0   ·  ·  · │·  [BK]·│·[WL] ·│·  ·  ║  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │   7.0  │  7.0  │      ║       │       │       │      │
Z=2   ·  ·  · │·  ·  ·│·  ·  ·│·  ·  ║  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │       │       │      ║       │       │       │      │
Z=7   ·  ·  · │·  [BK]·│·  ·  ·│·  ·  ║ [MKT]·│·  ·  ·│·  ·  ·│·  ·
      ·       │   7.0  │       │      ║  7.0  │       │       │      │
Z=9   ·  ·  · │·  ·  ·│·  ·  ·│·  ·  ║  ·  ·│·  ·  ·│·  ·  ·│·  ·
      ·       │       │       │      ║       │       │       │      │
Z=12  ·  · [HmA]·  ·  ·│·  ·  ·│·  ·  ☆POND ·│·  ·  ·│·  · [HmB]·  ·
      ·    6.3│       │       │   [12,0,18]   │       │  6.3 │      │
Z=14  ·  ·  · │·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·  ·│·  ·

Building Key (all blue variant):
  TWN = Townhall      14.52u tall  scale 7.7   [18, 0, -5]
  TAV = Tavern          9.78u tall  scale 7.0   [-18, 0, -7]
  MKT = Market          6.87u tall  scale 7.0   [14, 0, 9]
  WL  = Well            5.78u tall  scale 7.0   [-8, 0, 2]     ⚠ TOO TALL (target ~1.5u)
  BK  = Blacksmith      6.90u tall  scale 7.0   [-24, 0, 7]
  HmA = Home_A          5.86u tall  scale 7.0   [24,0,-12] & [-28,0,14] @ 6.3
  HmB = Home_B          8.06u tall  scale 7.0   [-15,0,-14] & [28,0,12] @ 6.3
  CH  = Church         12.67u tall  scale 7.7   [28, 0, 2]
  WM  = Windmill       11.23u tall  scale 7.7   [-30, 0, 0]
  STB = Stables         4.28u tall  scale 7.0   [10, 0, -12]
  WCT = Watchtower      7.79u tall  scale 7.0   [32, 0, -8]
  STG = Stage           2.00u tall  scale 5.6   [-6, 0, -10]
```

---

## Zone Detail Maps

### 1. DUNGEON ZONE — skeleton-birthday [0, 0, -55]

```
    X=-12    X=-8     X=-4     X=0      X=+4     X=+8    X=+12
      |       |        |       |        |        |        |
Z=-63 ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│·  ·  ·  WALLS
Z=-62 ·  ·  · │ ═══════════════════════════════════│·  ·  ·  9 wall_half
      ·       │ ║ ban   ban     ban   ban ║        │              + 1 doorway
Z=-60 · 🏰·  │ ║ [B]·  [B]· [DOOR] [B]· [B] ║   ·│·  ·  ·
      · Castle│ ║                          ║        │
Z=-58 ·  ·  · │ ║ [P]·  ·│·  ·  ·│·  · [P]║        │  PILLARS
      ·       │ ║  ·  ·  ·│·  ·  ·│·  ·  ·║        │
Z=-56 ·  ·  · │ ║ 🔥·  [P]│·  ⬡  ·│[P]· 🔥║        │  ⬡ = zone trigger
      ·       │ ║        │  floor │        ║        │  🔥 = torch
Z=-55 ·  ·  · │ ║ ·  ·  ·│· tiles·│·  ·  ·║        │  ← CENTER
      ·       │ ║  ·  ·  ·│·  ·  ·│·  ·  ·║        │
Z=-53 ·  ·  · │ ║ 🔥·  [P]│·  ·  ·│[P]· 🔥║        │
      ·       │ ║ 🛢 ·  ·│·  ·  ·│·  · 🛢║        │  🛢 = barrels
Z=-51 ·  ·  · │ ║[P]· 💰 ·│·  ·  ·│· 💰·[P]║        │  💰 = chest
      ·       │ ╚═════════╩═══════╩═════════╝       │
Z=-49 ·  ·  · │ · 🚩·  ·  ·  ·  ·  ·  · 🚩·        │  🚩 = flag_red
      ·       │ · ⚔️·  ·  ·  ·  ·  ·  · 🎯·        │  ⚔️ = weaponrack  🎯 = target
Z=-47 ·  ·  · │ ·  ·  ·  ·  ·  ·  ·  ·  ·  ·       │

    Lights: 4 pointLights (orange #ff6600, #ff4400), intensity 2-3
    Floor: 35 tiles (7x5 grid), dungeon/floor_tile_large
    Banners: 4 across back wall (blue, red, green, red patterns)
```

### 2. SPACE ZONE — knight-space [25, 0, -25]

```
    X=19     X=21     X=23    X=25     X=27     X=29     X=31
      |       |        |       |        |        |        |
Z=-31 ·  ·  · │ ·  ·  ·│·  ·[SOL]·  ·  ·│·  ·  ·│·  ·  ·│  [SOL]=solarpanel
      ·       │       │    ·  │  [DOME] │        │        │  [DOME]=dome
Z=-29 ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│
      ·       │ [MOD_A]│ [TUN] │        │ [MOD_B]│        │  [MOD]=basemodule
Z=-28 ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│  [TUN]=tunnel
      ·       │       │        │        │        │        │
Z=-26 ·  ·  · │ ·  ·  ·│·  ·  ·│·  ⬡  · │·  ·  ·│·  ·  ·│  ⬡ = zone trigger
      ·       │[CONT] │        │ [PAD]  │        │[CARGO]│  [PAD]=landing_pad
Z=-25 ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│  ← CENTER
      ·       │       │        │        │        │        │
Z=-23 ·  ·  · │ ·  ·  ·│·  · [DROP]·  · │·  ·  ·│·  ·  ·│  [DROP]=dropship
      ·       │       │        │  1.3u! │        │        │  ⚠ TINY (needs 2-3x)

    Lights: 2 pointLights (blue #38BDF8, purple #7C3AED)
    ⚠ ALL OBJECTS VERY SMALL — dropship 1.3u, modules 1.0u, dome 1.0u
    RECOMMENDATION: Scale space objects 2-3x to be visible from village
```

### 3. SCHOOL ZONE — barbarian-school [35, 0, 0]

```
    X=29     X=31     X=33    X=35     X=37     X=39     X=41
      |       |        |       |        |        |        |
Z=-5  ·  ·  · │ ═══════════════════════════════════│·  ·  ·│  fence (4 sections)
      ·       │ ║ ·  ·  ·│· [TBL]·│·  ·  ·║       │  🗼   │  🗼=Tower_B_red
Z=-3  ·  ·  · │ ║[SWG]·  ·│·  ·  ·│·  · [SLD]║   │ [-4]  │  [SWG]=swing
      ·       │ ║  ·  ·  ·│·  ·  ·│·  ·  ·║       │       │  [SLD]=slide
Z=-1  ·  ·[🌲]│ ║ ·  ·  ·│·  ·  ·│·  ·  ·║ [🌲]  │       │  [TBL]=picnic_table
      ·       │ ║        │  [MGR] │        ║       │       │  [MGR]=merry_go_round
Z=0   ·  ·  · │ ║ ·  ·  ·│·  ⬡  ·│·  ·  ·║       │       │  ⬡ = zone trigger
      ·       │ ║        │        │        ║       │       │
Z=3   ·  ·  · │ ║[SSAW]· ·│·  ·  ·│·  · [SBX]║   │       │  [SSAW]=seesaw
      ·       │ ║        │        │        ║       │       │  [SBX]=sandbox
Z=5   ·  ·  · │ ═══════════════════════════════════│       │  fence
      ·       │        │        │        │        │        │

    No lights (outdoor daylight)
    Enclosed by fence_straight_long (4 sections)
```

### 4. PIZZA ZONE — skeleton-pizza [25, 0, 25]

```
    X=21     X=23     X=25    X=27     X=29     X=31
      |       |        |       |        |        |
Z=21  ·  ·  · │ ═══════════════════════════│·  ·  ·  3 walls + doorway
      ·       │ ║ [WALL][DOOR][WALL] ║     │       │
Z=23  ·  ·  · │ ║ [CTR][CTR_D][CTR] ║     │  🏛   │  🏛=Shrine_yellow
      ·       │ ║  counters          ║     │ [30]  │
Z=24  · [CRT] │ ║ ·  ·  ·│·  ·  ·  ·║    │       │  [CRT]=crate (cheese/tomato)
      ·       │ ║        │  ⬡       ║     │       │  ⬡ = zone trigger
Z=25  · [CRT] │ ║ ·  ·  ·│·  ·  ·  ·║    │       │  ← CENTER
      ·       │ ║        │          ║     │       │
Z=27  ·  ·  · │ ·  ·[CHR]·│·  ·  ·│[CHR]·│       │  [CHR]=chairs
      ·       │ ·  ·  ·  ·│·  🍽  ·│·  ·  │       │  🍽=plate

    Lights: 2 pointLights (warm #FF8C42, yellow #FBBF24)
    ⚠ Looks similar to Kitchen from distance — needs unique identifier
```

### 5. PARK ZONE — adventurers-picnic [0, 0, 35]

```
    X=-7     X=-5     X=-3    X=0      X=+3     X=+5     X=+7
      |       |        |       |        |        |        |
Z=29  ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│·  ·  ·
      ·       │       │        │        │        │        │
Z=30  ·  ·[🌲]│[🌲]· [BSH]│[🌲]·[🌲]│[🌲]· [BSH]│[🌲]·[🌲]│·  ·  ·  TREE RING
      ·       │       │  🌸   │    🌸  │        │        │  🌸=flower
Z=32  ·  ·  · │[LNTRN]·│·  ·  ·│· [FNT]·│·  ·  ·│[LNTRN]│·  ·  ·  [FNT]=fountain
      ·       │       │        │        │        │        │
Z=33  ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│·  ·  ·
      ·       │       │ [BNCH] │   ⬡    │ [BNCH]│        │  ⬡ = zone trigger
Z=35  ·  ·[🌲]│ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│[🌲]·  ·  ← CENTER
      ·       │       │        │        │        │        │
Z=37  ·  ·  · │[HEDGE]═══════════════════════[HEDGE]│·  ·  ·  HEDGES along sides
      ·       │       │        │        │        │        │
Z=38  ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│  🏛nearby
              |       │        │        │        │        │  🏛=Watchtower_green [8,0,40]

    No extra lights (outdoor daylight + lanterns)
```

### 6. CONCERT ZONE — dungeon-concert [-25, 0, 25]

```
    X=-31    X=-29    X=-27   X=-25    X=-23    X=-21    X=-19
      |       |        |       |        |        |        |
Z=21  ·  ·  · │ ══════════════════════════════════│·  ·  ·  5 wall_half
      ·       │ ║ 🔥[BAN_B][BAN_R][BAN_G]🔥║      │       │
Z=23  ·  ·  · │ ║ [PIL]║══ STAGE_A ══║[PIL]║      │       │  [PIL]=pillar (1.3x)
      ·       │ ║      ║  12.9u wide  ║     ║      │       │  STAGE=stage_A (7.0)
Z=25  ·  ·  · │ ·  ·  ·│·  ·  ⬡  ·  ·│·  ·  ·   │  🗼   │  ⬡ = zone trigger
      ·       │       │        │        │        │ [-31,  │  🗼=Tower_A_yellow
Z=27  ·  ·  · │ ·  ·  ·│·  audience ·  │·  ·  ·   │  30]  │
      ·       │       │   area  │        │        │        │
Z=29  ·  ·  · │ ·  ·  ·│·  ·  ·│·  ·  · │·  ·  ·│·  ·  ·│

    Lights: 3 pointLights (purple #7C3AED, pink #EC4899, blue #38BDF8)
    Banners: blue, red, green patterns across back wall
```

### 7. KITCHEN ZONE — mage-kitchen [-35, 0, 0]

```
    X=-41    X=-39    X=-37   X=-35    X=-33    X=-31    X=-29
      |       |        |       |        |        |        |
Z=-4  ·  🗼  │ ═══════════════════════════════════│·  ·  ·  3 walls + doorway
      · [-41, │ ║[WALL][DOOR][WALL]║               │       │
Z=-3  ·  -4]  │ ║[CTR_A][SINK][CTR_B]║[STOV]║[FRDG]│       │  [STOV]=stove
      ·       │ ║  countertops     ║       ║       │       │  [FRDG]=fridge
Z=-2  ·  ·  · │ ║ ·  ·  ·│·  ·  ·│·  ·  ·║       │       │
      ·       │ ║        │       │        ║       │       │
Z=0   ·  ·  · │ ║ ·  ·  ·│·  ⬡  ·│·  ·  ·║       │       │  ⬡ = zone trigger
      ·       │ ║        │       │        ║       │       │  ← CENTER
Z=1   ·  ·  · │ ║[CHR]·  │[TABLE]│  ·[CHR]║       │       │  [TABLE]=table_A
      ·       │ ║  ·  · 🍳│·  ·🫖│·  ·  ·║       │       │  🍳=pot 🫖=kettle
Z=3   ·  ·  · │ ·  ·  ·  ·│·  ·  ·│·  ·  ·│       │       │

    Lights: 1 pointLight (warm yellow #FBBF24)
    🗼=Tower_B_green (19.9u tall) — zone landmark
```

---

## Zone Landmark Positions & Heights

```
                          NORTH
                            |
                     🏰 Castle_red
                     [-10, 0, -60]
                      31.83u tall
                            |
                            |
            ╔═══════════════╬═══════════════╗
           ╔╝               |               ╚╗
          ╔╝                |                ╚╗
  🗼 Tower_B_green          |           🗼 Tower_A_blue
  [-41, 0, -4]              |           [31, 0, -30]
  19.88u tall               |           17.53u tall
          ╚╗                |                ╔╝
           ╚╗      ┌── VILLAGE ──┐          ╔╝
            ╚══════│   CENTER    │══════════╝
                   │  [0, 0, 0]  │
            ╔══════│             │══════════╗
           ╔╝      └─────────────┘          ╚╗
  🗼 Tower_A_yellow         |           🏛 Shrine_yellow
  [-31, 0, 30]              |           [31, 0, 30]
  17.53u tall               |           6.83u tall ⚠ SHORT
           ╚╗               |               ╔╝
            ╚═══════════════╬═══════════════╝
                            |
                     🏛 Watchtower_green
                     [8, 0, 40]
                      8.90u tall
                            |
                          SOUTH

Visibility from village center (Z=0):
  Castle:     31.8u — visible over everything (12x char height)
  Towers A/B: 17-20u — clearly visible above 9-14u village buildings
  Watchtower:  8.9u — visible but short, similar to village buildings
  Shrine:      6.8u — ⚠ barely visible above village scale (needs boost)
```

---

## Perimeter Layers (cross-section from center to edge)

```
  Center                                                         Edge
  X=0        X=18      X=33       X=38-42     X=44-52   X=55-63
   |          |         |           |           |          |
   Village    Buildings  Last       Forest      Mountains  Tree
   Center     end        scatter    Ring        & Cliffs   Border
   |          |         |           |           |          |
   ·  buildings ·  rocks/hills · 🌲🌲🌲🌲 · ⛰⛰⛰⛰ · 🌲🌲🌲🌲
   ·          ·         ·           ·           ·          ·
   |    14u   |   15u   |    6u     |    12u    |   8u     |
   |          |         |           |           |          |
   Player can walk here              Player bounds at X=40
                                     (2u inside forest ring)

North cross-section (special — dungeon):
  Z=0        Z=-20     Z=-27      Z=-45       Z=-55      Z=-70      Z=-85
   |          |         |           |           |          |          |
   Village    Open      Approach   Entrance    Dungeon    Cliff      Mountains
   Center     field     cliffs     boulders    Zone       bowl       (far back)
   |          |         🪨⛰🪨     🪨  🪨       ║walls║     ⛰⛰⛰       ⛰⛰⛰
```

---

## Decoration Density Map

```
    X=-40              X=-20             X=0              X=+20             X=+40
      |                  |                |                 |                 |
Z=-60 ░░░░░░░░░░░░░░░░░░░░██████████████████░░░░░░░░░░░░░░░░░░  DUNGEON (dense)
      ░░░░░░░░░░░░░░░░░░░░██████████████████░░░░░░░░░░░░░░░░░░
Z=-50 ░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░  approach (sparse→dense)
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░
Z=-40 ░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Z=-30 ░░░░░░░░░░░░░░░░▒▒▒▒▒▒░░░░░░░░░░░░░▒▒▒▒▒░░░░░░░░░░░░░░  scatter (light)
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Z=-20 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      ░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░
Z=-10 ░░░░░░░░░░░░░░░░████████████████████████████░░░░░░░░░░░░░  VILLAGE CENTER (dense)
      ░░░░░░░░░░░░░░██████████████████████████████████░░░░░░░░░
Z=0   ░░░░▒▒▒▒▒▒░░████████████████████████████████████░░▒▒▒▒░░  <-- zones on ring
      ░░░░░KITCHEN░████████████████████████████████████░░SCHOOL░
Z=10  ░░░░░░░░░░░░░░░░████████████████████████████████░░░░░░░░░
      ░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░
Z=20  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  scatter (light)
      ░░░░▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒░░░░░
Z=30  ░░░░CONCERT░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░PIZZA░░░░░░  <-- zones on ring
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Z=40  ░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒PARK▒▒▒░░░░░░░░░░░░░░░░░░░░░░
      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  Legend: ░ = empty grass  ▒ = light scatter (2-5 objects)  █ = dense (6+ objects)
```

---

## Run-Time Distance Matrix (seconds at 14 u/s)

```
From → To          Distance    Run Time    Walk Time
─────────────────────────────────────────────────────
Origin → Space       35.4u       2.5s        4.4s
Origin → School      35.0u       2.5s        4.4s
Origin → Pizza       35.4u       2.5s        4.4s
Origin → Park        35.0u       2.5s        4.4s
Origin → Concert     35.4u       2.5s        4.4s
Origin → Kitchen     35.0u       2.5s        4.4s
Origin → Dungeon     55.0u       3.9s        6.9s
Space → School       29.2u       2.1s        3.6s
School → Pizza       25.0u       1.8s        3.1s
Pizza → Park         26.9u       1.9s        3.4s
Park → Concert       26.9u       1.9s        3.4s
Concert → Kitchen    27.0u       1.9s        3.4s
Kitchen → Space      47.2u       3.4s        5.9s
Any ring → Dungeon   ~60-70u     4.3-5.0s    7.5-8.7s
```

---

## Object Count Summary

| Layer | Component | Object Count | Notes |
|-------|-----------|:------------:|-------|
| Terrain | HexTerrain | ~9,800 | 9,600 grass + ~200 cobblestone |
| Buildings | VillageCenter | 32 | 14 buildings + 13 props + 5 trees |
| Zones | DungeonZone | ~76 | 9 walls + 6 pillars + 35 floor + 6 torches + 8 props + 4 banners + 4 lights + 4 entrance markers |
| Zones | ParkZone | ~20 | 9 trees + 2 flowers + 2 benches + fountain + 2 lanterns + 2 hedges + 2 bushes |
| Zones | SpaceZone | ~13 | pad + 2 modules + tunnel + dropship + 2 cargo + solar + dome + 2 lights |
| Zones | SchoolZone | ~13 | swing + slide + merry-go-round + seesaw + sandbox + 2 trees + 4 fences + table |
| Zones | PizzaZone | ~13 | 3 walls + 3 counters + 2 crates + 2 chairs + plate + 2 lights |
| Zones | ConcertZone | ~16 | 5 walls + stage + 2 pillars + 3 banners + 2 torches + 3 lights |
| Zones | KitchenZone | ~13 | 3 walls + 3 counters + stove + fridge + table + 2 chairs + 2 props + 1 light |
| Landmarks | ZoneLandmarks | 7 | 1 castle + 2 tower_A + 2 tower_B + 1 shrine + 1 watchtower |
| Roads | RoadDecoration | ~30 | 3 flags + 4 props + 2 trees + ~20 lanterns + 12 zone flags |
| Scatter | TerrainScatter | ~37 | 32 procedural + 5 strategic hills |
| Water | VillagePond | 12 | 3 water + 5 coast + 2 lilies + 2 plants + 1 bridge |
| Approach | ZoneApproachDecor | 12 | 2 per zone (6 zones) |
| Perimeter | VillagePerimeter | ~75 | mountains, hills, rocks around all 4 edges + corners |
| Forest | ImpenetrableForest | ~50 | 3 concentric rings of procedural trees |
| Border | TreeBorder | ~240 | 3 rows x 4 edges, spacing 5u |
| Debug | DebugClearanceRings | 0 | Toggle with `.` key (dev only) |
| Atmosphere | VillageAtmosphere | 7 | sky + fog + 3 lights + 7 clouds |
| **TOTAL** | | **~10,450** | Dominated by hex tiles (~9,800) |

---

## Known Scale Issues (from SME Analysis)

| Object | Measured | Target | Issue | Fix |
|--------|----------|--------|-------|-----|
| Well | 5.78u | 1.3-1.8u | 3.2x too tall | Scale 7.0 → ~2.5 |
| Flags (all) | 1.94u | 3.9-6.5u | 2x too short | Scale 7.0 → ~15-20 |
| Space dropship | 1.30u | 3-5u | Barely visible | Scale 1.0 → 2.5-3.0 |
| Space modules | 1.00u | 2-3u | Barely visible | Scale 1.0 → 2.0-2.5 |
| Space dome | 1.00u | 2-3u | Barely visible | Scale 1.0 → 2.0-2.5 |
| Shrine_yellow | 6.83u | 10-15u | Short landmark | Scale 8.0 → 12-15 |
| Watchtower_green | 8.90u | 10-15u | Short landmark | Scale 8.0 → 10-12 |
