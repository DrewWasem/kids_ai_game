/**
 * 3D Asset Manifest — maps every character, animation pack, and prop to its file path.
 * All paths are relative to /assets/3d/
 *
 * Characters: KayKit Adventurers 2.0, Skeletons 1.1, Mystery Monthly Series 4 & 5
 * Animations: KayKit Character Animations 1.1 (Rig_Medium — shared across all characters)
 * Props: KayKit environment packs + Tiny Treats Collection
 */

// ─── CHARACTERS ─────────────────────────────────────────────────────────────

export const CHARACTERS = {
  // Core Adventurers (Rig_Medium)
  knight: 'kaykit/characters/Knight.glb',
  barbarian: 'kaykit/characters/Barbarian.glb',
  mage: 'kaykit/characters/Mage.glb',
  ranger: 'kaykit/characters/Ranger.glb', // a.k.a. Archer
  rogue: 'kaykit/characters/Rogue.glb',
  rogue_hooded: 'kaykit/characters/Rogue_Hooded.glb',
  druid: 'kaykit/characters/Druid.glb',
  engineer: 'kaykit/characters/Engineer.glb',

  // Skeletons (Rig_Medium — use Skeletons_* animation clips)
  skeleton_warrior: 'kaykit/characters/Skeleton_Warrior.glb',
  skeleton_mage: 'kaykit/characters/Skeleton_Mage.glb',
  skeleton_rogue: 'kaykit/characters/Skeleton_Rogue.glb',
  skeleton_minion: 'kaykit/characters/Skeleton_Minion.glb',
  skeleton_golem: 'kaykit/characters/Skeleton_Golem.glb',
  necromancer: 'kaykit/characters/Necromancer.glb',

  // Series 4 Bonus Characters (Rig_Medium)
  space_ranger: 'kaykit/characters/SpaceRanger.glb',
  space_ranger_flight: 'kaykit/characters/SpaceRanger_FlightMode.glb',
  ninja: 'kaykit/characters/Ninja.glb',
  clown: 'kaykit/characters/Clown.glb',
  robot: 'kaykit/characters/Robot_One.glb',
  robot_two: 'kaykit/characters/Robot_Two.glb',
  survivalist: 'kaykit/characters/Survivalist.glb',

  // Series 5 Bonus Characters (Rig_Medium)
  witch: 'kaykit/characters/Witch.glb',
  vampire: 'kaykit/characters/Vampire.glb',
  black_knight: 'kaykit/characters/BlackKnight.glb',
  superhero: 'kaykit/characters/Superhero.glb',
  caveman: 'kaykit/characters/Caveman.glb',
  frost_golem: 'kaykit/characters/FrostGolem.glb',
} as const;

export type CharacterKey = keyof typeof CHARACTERS;

// ─── ANIMATION PACKS ────────────────────────────────────────────────────────
// All use Rig_Medium. Load from shared GLBs, apply to any character.

export const ANIMATION_PACKS = {
  general: 'kaykit/animations/Rig_Medium_General.glb',
  movement_basic: 'kaykit/animations/Rig_Medium_MovementBasic.glb',
  movement_advanced: 'kaykit/animations/Rig_Medium_MovementAdvanced.glb',
  combat_melee: 'kaykit/animations/Rig_Medium_CombatMelee.glb',
  combat_ranged: 'kaykit/animations/Rig_Medium_CombatRanged.glb',
  simulation: 'kaykit/animations/Rig_Medium_Simulation.glb',
  special: 'kaykit/animations/Rig_Medium_Special.glb',
  tools: 'kaykit/animations/Rig_Medium_Tools.glb',
} as const;

// ─── ANIMATION CLIP NAMES ───────────────────────────────────────────────────
// Complete catalog of 139 clips across 8 packs.
// Used by system prompts to constrain Claude's vocabulary.

export const ANIMATION_CLIPS = {
  // General (15 clips) — essential for every scene
  Idle_A: 'general',
  Idle_B: 'general',
  Death_A: 'general',
  Death_A_Pose: 'general',
  Death_B: 'general',
  Death_B_Pose: 'general',
  Hit_A: 'general',
  Hit_B: 'general',
  Interact: 'general',
  PickUp: 'general',
  Spawn_Air: 'general',
  Spawn_Ground: 'general',
  Throw: 'general',
  Use_Item: 'general',

  // Movement Basic (11 clips)
  Walking_A: 'movement_basic',
  Walking_B: 'movement_basic',
  Walking_C: 'movement_basic',
  Running_A: 'movement_basic',
  Running_B: 'movement_basic',
  Jump_Full_Long: 'movement_basic',
  Jump_Full_Short: 'movement_basic',
  Jump_Idle: 'movement_basic',
  Jump_Land: 'movement_basic',
  Jump_Start: 'movement_basic',

  // Movement Advanced (13 clips)
  Crawling: 'movement_advanced',
  Crouching: 'movement_advanced',
  Dodge_Backward: 'movement_advanced',
  Dodge_Forward: 'movement_advanced',
  Dodge_Left: 'movement_advanced',
  Dodge_Right: 'movement_advanced',
  Running_HoldingBow: 'movement_advanced',
  Running_HoldingRifle: 'movement_advanced',
  Running_Strafe_Left: 'movement_advanced',
  Running_Strafe_Right: 'movement_advanced',
  Sneaking: 'movement_advanced',
  Walking_Backwards: 'movement_advanced',

  // Combat Melee (22 clips)
  Melee_1H_Attack_Chop: 'combat_melee',
  Melee_1H_Attack_Jump_Chop: 'combat_melee',
  Melee_1H_Attack_Slice_Diagonal: 'combat_melee',
  Melee_1H_Attack_Slice_Horizontal: 'combat_melee',
  Melee_1H_Attack_Stab: 'combat_melee',
  Melee_2H_Attack_Chop: 'combat_melee',
  Melee_2H_Attack_Slice: 'combat_melee',
  Melee_2H_Attack_Spin: 'combat_melee',
  Melee_2H_Attack_Spinning: 'combat_melee',
  Melee_2H_Attack_Stab: 'combat_melee',
  Melee_2H_Idle: 'combat_melee',
  Melee_Block: 'combat_melee',
  Melee_Block_Attack: 'combat_melee',
  Melee_Block_Hit: 'combat_melee',
  Melee_Blocking: 'combat_melee',
  Melee_Dualwield_Attack_Chop: 'combat_melee',
  Melee_Dualwield_Attack_Slice: 'combat_melee',
  Melee_Dualwield_Attack_Stab: 'combat_melee',
  Melee_Unarmed_Attack_Kick: 'combat_melee',
  Melee_Unarmed_Attack_Punch_A: 'combat_melee',
  Melee_Unarmed_Idle: 'combat_melee',

  // Combat Ranged (20 clips)
  Ranged_1H_Aiming: 'combat_ranged',
  Ranged_1H_Reload: 'combat_ranged',
  Ranged_1H_Shoot: 'combat_ranged',
  Ranged_1H_Shooting: 'combat_ranged',
  Ranged_2H_Aiming: 'combat_ranged',
  Ranged_2H_Reload: 'combat_ranged',
  Ranged_2H_Shoot: 'combat_ranged',
  Ranged_2H_Shooting: 'combat_ranged',
  Ranged_Bow_Aiming_Idle: 'combat_ranged',
  Ranged_Bow_Draw: 'combat_ranged',
  Ranged_Bow_Draw_Up: 'combat_ranged',
  Ranged_Bow_Idle: 'combat_ranged',
  Ranged_Bow_Release: 'combat_ranged',
  Ranged_Bow_Release_Up: 'combat_ranged',
  Ranged_Magic_Raise: 'combat_ranged',
  Ranged_Magic_Shoot: 'combat_ranged',
  Ranged_Magic_Spellcasting: 'combat_ranged',
  Ranged_Magic_Spellcasting_Long: 'combat_ranged',
  Ranged_Magic_Summon: 'combat_ranged',

  // Simulation (14 clips) — everyday actions, perfect for comedy
  Cheering: 'simulation',
  Lie_Down: 'simulation',
  Lie_Idle: 'simulation',
  Lie_StandUp: 'simulation',
  Push_Ups: 'simulation',
  Sit_Chair_Down: 'simulation',
  Sit_Chair_Idle: 'simulation',
  Sit_Chair_StandUp: 'simulation',
  Sit_Floor_Down: 'simulation',
  Sit_Floor_Idle: 'simulation',
  Sit_Floor_StandUp: 'simulation',
  Sit_Ups: 'simulation',
  Waving: 'simulation',

  // Special (15 clips) — includes Skeleton-specific animations
  Skeletons_Awaken_Floor: 'special',
  Skeletons_Awaken_Floor_Long: 'special',
  Skeletons_Awaken_Standing: 'special',
  Skeletons_Death: 'special',
  Skeletons_Death_Pose: 'special',
  Skeletons_Death_Resurrect: 'special',
  Skeletons_Idle: 'special',
  Skeletons_Inactive_Floor_Pose: 'special',
  Skeletons_Inactive_Standing_Pose: 'special',
  Skeletons_Spawn_Ground: 'special',
  Skeletons_Taunt: 'special',
  Skeletons_Taunt_Longer: 'special',
  Skeletons_Walking: 'special',

  // Tools (29 clips) — interaction animations
  Chop: 'tools',
  Chopping: 'tools',
  Dig: 'tools',
  Digging: 'tools',
  Fishing_Bite: 'tools',
  Fishing_Cast: 'tools',
  Fishing_Catch: 'tools',
  Fishing_Idle: 'tools',
  Fishing_Reeling: 'tools',
  Fishing_Struggling: 'tools',
  Fishing_Tug: 'tools',
  Hammer: 'tools',
  Hammering: 'tools',
  Holding_A: 'tools',
  Holding_B: 'tools',
  Holding_C: 'tools',
  Lockpick: 'tools',
  Lockpicking: 'tools',
  Pickaxe: 'tools',
  Pickaxing: 'tools',
  Saw: 'tools',
  Sawing: 'tools',
  Work_A: 'tools',
  Work_B: 'tools',
  Work_C: 'tools',
  Working_A: 'tools',
  Working_B: 'tools',
  Working_C: 'tools',
} as const;

export type AnimationClipName = keyof typeof ANIMATION_CLIPS;
export type AnimationPackKey = keyof typeof ANIMATION_PACKS;

// ─── PER-TASK ASSET LISTS ───────────────────────────────────────────────────
// Each task needs: characters + animation packs + environment props

export interface TaskAssets {
  characters: CharacterKey[];
  animationPacks: AnimationPackKey[];
  props: { key: string; path: string }[];
  description: string;
}

export const TASK_ASSETS: Record<string, TaskAssets> = {
  'adventurers-picnic': {
    description: "T7: Adventurers' Disastrous Picnic",
    characters: ['knight', 'barbarian', 'mage', 'ranger', 'rogue'],
    animationPacks: ['general', 'movement_basic', 'simulation', 'combat_melee', 'tools'],
    props: [
      // Pleasant Picnic (Tiny Treats)
      { key: 'picnic_blanket', path: 'tiny-treats/pleasant-picnic/picnic_blanket_red.gltf' },
      { key: 'picnic_basket', path: 'tiny-treats/pleasant-picnic/picnic_basket_square.gltf' },
      { key: 'picnic_basket_round', path: 'tiny-treats/pleasant-picnic/picnic_basket_round.gltf' },
      { key: 'sandwich', path: 'tiny-treats/pleasant-picnic/sandwich.gltf' },
      { key: 'teapot', path: 'tiny-treats/pleasant-picnic/teapot.gltf' },
      { key: 'plate', path: 'tiny-treats/pleasant-picnic/plate_A.gltf' },
      { key: 'mug', path: 'tiny-treats/pleasant-picnic/mug.gltf' },
      { key: 'apple', path: 'tiny-treats/pleasant-picnic/apple.gltf' },
      // Pretty Park (Tiny Treats)
      { key: 'tree', path: 'tiny-treats/pretty-park/tree.gltf' },
      { key: 'tree_large', path: 'tiny-treats/pretty-park/tree_large.gltf' },
      { key: 'bench', path: 'tiny-treats/pretty-park/bench.gltf' },
      { key: 'fountain', path: 'tiny-treats/pretty-park/fountain.gltf' },
      { key: 'bush', path: 'tiny-treats/pretty-park/bush.gltf' },
      // Baked Goods (Tiny Treats)
      { key: 'cake_birthday', path: 'tiny-treats/baked-goods/cake_birthday.gltf' },
      { key: 'pie_cherry', path: 'tiny-treats/baked-goods/pie_cherry.gltf' },
      // Forest Nature (KayKit) — varied rocks, trees, bushes
      { key: 'rock', path: 'kaykit/packs/forest_nature/Rock_1_A_Color1.gltf' },
      { key: 'rock_large', path: 'kaykit/packs/forest_nature/Rock_2_A_Color1.gltf' },
      { key: 'rock_mossy', path: 'kaykit/packs/forest_nature/Rock_3_A_Color1.gltf' },
      { key: 'tree_forest', path: 'kaykit/packs/forest_nature/Tree_1_A_Color1.gltf' },
      { key: 'tree_tall', path: 'kaykit/packs/forest_nature/Tree_2_A_Color1.gltf' },
      { key: 'tree_pine_forest', path: 'kaykit/packs/forest_nature/Tree_5_A_Color1.gltf' },
      { key: 'bush_forest', path: 'kaykit/packs/forest_nature/Bush_1_A_Color1.gltf' },
      { key: 'bush_round', path: 'kaykit/packs/forest_nature/Bush_2_A_Color1.gltf' },
      { key: 'grass_patch', path: 'kaykit/packs/forest_nature/Grass_1_A_Color1.gltf' },
      // Extra picnic food (Quaternius)
      { key: 'banana', path: 'quaternius/food/banana_001.glb' },
      { key: 'burger', path: 'quaternius/food/burger_001.glb' },
      { key: 'sushi', path: 'quaternius/food/sushi_dish_001.glb' },
      { key: 'ice_cream', path: 'quaternius/food/ice_cream_dish_001.glb' },
    ],
  },

  'skeleton-birthday': {
    description: 'T1: Skeleton\'s Surprise Birthday Party',
    characters: ['skeleton_warrior', 'skeleton_mage', 'skeleton_minion', 'knight', 'mage', 'rogue'],
    animationPacks: ['general', 'movement_basic', 'simulation', 'special'],
    props: [
      // Dungeon (KayKit)
      { key: 'table_long', path: 'kaykit/packs/dungeon/table_long.gltf' },
      { key: 'chair', path: 'kaykit/packs/dungeon/chair.gltf' },
      { key: 'torch', path: 'kaykit/packs/dungeon/torch.gltf' },
      { key: 'barrel', path: 'kaykit/packs/dungeon/barrel.gltf' },
      { key: 'banner_blue', path: 'kaykit/packs/dungeon/banner_blue.gltf' },
      { key: 'banner_red', path: 'kaykit/packs/dungeon/banner_red.gltf' },
      // Holiday (KayKit)
      { key: 'present_A_red', path: 'kaykit/packs/holiday/present_A_red.gltf' },
      { key: 'present_B_blue', path: 'kaykit/packs/holiday/present_B_blue.gltf' },
      { key: 'present_C_green', path: 'kaykit/packs/holiday/present_C_green.gltf' },
      // Baked Goods (Tiny Treats)
      { key: 'cake_birthday', path: 'tiny-treats/baked-goods/cake_birthday.gltf' },
      { key: 'cupcake', path: 'tiny-treats/baked-goods/cupcake.gltf' },
      // Party Candy & Treats (KayKit Halloween)
      { key: 'candy_bucket', path: 'kaykit/packs/halloween/candy_bucket_B_decorated.gltf' },
      { key: 'lollipop', path: 'kaykit/packs/halloween/lollipop_blue.gltf' },
      { key: 'lollipop_pink', path: 'kaykit/packs/halloween/lollipop_pink.gltf' },
      { key: 'lollipop_orange', path: 'kaykit/packs/halloween/lollipop_orange.gltf' },
      { key: 'candy_blue', path: 'kaykit/packs/halloween/candy_blue_A.gltf' },
      { key: 'candy_orange', path: 'kaykit/packs/halloween/candy_orange_A.gltf' },
      { key: 'candy_pink', path: 'kaykit/packs/halloween/candy_pink_A.gltf' },
      { key: 'candycorn', path: 'kaykit/packs/halloween/candycorn.gltf' },
      // Bakery desserts (Tiny Treats)
      { key: 'macaron', path: 'tiny-treats/bakery-interior/macaron_pink.gltf' },
      { key: 'macaron_blue', path: 'tiny-treats/bakery-interior/macaron_blue.gltf' },
      { key: 'cream_puff', path: 'tiny-treats/bakery-interior/cream_puff.gltf' },
      { key: 'pretzel', path: 'tiny-treats/bakery-interior/pretzel.gltf' },
      { key: 'pastry_stand', path: 'tiny-treats/bakery-interior/pastry_stand_A_decorated.gltf' },
      { key: 'cookie_jar', path: 'tiny-treats/bakery-interior/cookie_jar.gltf' },
      // Spooky party decorations (KayKit Halloween)
      { key: 'pumpkin_jackolantern', path: 'kaykit/packs/halloween/pumpkin_orange_jackolantern.gltf' },
      { key: 'skull_candle', path: 'kaykit/packs/halloween/skull_candle.gltf' },
      { key: 'lantern_standing', path: 'kaykit/packs/halloween/lantern_standing.gltf' },
    ],
  },

  'knight-space': {
    description: 'T2: Knight\'s Accidental Space Mission',
    characters: ['knight', 'space_ranger'],
    animationPacks: ['general', 'movement_basic', 'movement_advanced', 'combat_melee'],
    props: [
      // Space Base (KayKit)
      { key: 'basemodule_A', path: 'kaykit/packs/space_base/basemodule_A.gltf' },
      { key: 'basemodule_B', path: 'kaykit/packs/space_base/basemodule_B.gltf' },
      { key: 'basemodule_garage', path: 'kaykit/packs/space_base/basemodule_garage.gltf' },
      { key: 'dome', path: 'kaykit/packs/space_base/dome.gltf' },
      { key: 'solarpanel', path: 'kaykit/packs/space_base/solarpanel.gltf' },
      { key: 'cargo_A', path: 'kaykit/packs/space_base/cargo_A.gltf' },
    ],
  },

  'mage-kitchen': {
    description: 'T3: Mage vs. The Cute Kitchen',
    characters: ['mage', 'witch', 'skeleton_minion'],
    animationPacks: ['general', 'movement_basic', 'simulation', 'combat_ranged', 'tools'],
    props: [
      // Charming Kitchen (Tiny Treats)
      { key: 'stove', path: 'tiny-treats/charming-kitchen/stove.gltf' },
      { key: 'sink', path: 'tiny-treats/charming-kitchen/sink.gltf' },
      { key: 'fridge', path: 'tiny-treats/charming-kitchen/fridge.gltf' },
      { key: 'cabinet_A', path: 'tiny-treats/charming-kitchen/cabinet_A.gltf' },
      { key: 'pot', path: 'tiny-treats/charming-kitchen/pot.gltf' },
      { key: 'pan', path: 'tiny-treats/charming-kitchen/pan.gltf' },
      // Baked Goods (Tiny Treats)
      { key: 'cake_chocolate', path: 'tiny-treats/baked-goods/cake_chocolate.gltf' },
      { key: 'pie_apple', path: 'tiny-treats/baked-goods/pie_apple.gltf' },
      { key: 'bread', path: 'tiny-treats/baked-goods/bread.gltf' },
      // Bakery Interior (Tiny Treats) — professional kitchen equipment
      { key: 'bread_oven', path: 'tiny-treats/bakery-interior/bread_oven.gltf' },
      { key: 'coffee_machine', path: 'tiny-treats/bakery-interior/coffee_machine.gltf' },
      { key: 'stand_mixer', path: 'tiny-treats/bakery-interior/stand_mixer.gltf' },
      { key: 'mixing_bowl', path: 'tiny-treats/bakery-interior/mixing_bowl.gltf' },
      { key: 'dough_roller', path: 'tiny-treats/bakery-interior/dough_roller.gltf' },
      { key: 'flour_sack', path: 'tiny-treats/bakery-interior/flour_sack_open.gltf' },
      { key: 'whisk', path: 'tiny-treats/bakery-interior/whisk.gltf' },
      { key: 'scale', path: 'tiny-treats/bakery-interior/scale.gltf' },
      { key: 'egg', path: 'tiny-treats/bakery-interior/egg_A.gltf' },
      { key: 'milk', path: 'tiny-treats/bakery-interior/milk.gltf' },
      { key: 'serving_tray', path: 'tiny-treats/bakery-interior/serving_tray.gltf' },
      // Magic props (Quaternius Medieval)
      { key: 'potion_bottle', path: 'quaternius/medieval-props/Potion_2.gltf' },
      { key: 'potion_flask', path: 'quaternius/medieval-props/Potion_4.gltf' },
      { key: 'cauldron_medieval', path: 'quaternius/medieval-props/Cauldron.gltf' },
      { key: 'scroll_ancient', path: 'quaternius/medieval-props/Scroll_1.gltf' },
      { key: 'candle_medieval', path: 'quaternius/medieval-props/Candle_1.gltf' },
      { key: 'candlestick_triple', path: 'quaternius/medieval-props/CandleStick_Triple.gltf' },
    ],
  },

  'barbarian-school': {
    description: 'T4: Barbarian\'s First Day of School',
    characters: ['barbarian', 'knight', 'mage', 'ranger', 'rogue'],
    animationPacks: ['general', 'movement_basic', 'simulation', 'combat_melee'],
    props: [
      // Fun Playground (Tiny Treats)
      { key: 'slide', path: 'tiny-treats/fun-playground/slide_A.gltf' },
      { key: 'seesaw', path: 'tiny-treats/fun-playground/seesaw_large.gltf' },
      { key: 'sandbox', path: 'tiny-treats/fun-playground/sandbox_square_decorated.gltf' },
      { key: 'merry_go_round', path: 'tiny-treats/fun-playground/merry_go_round.gltf' },
      // Furniture (KayKit)
      { key: 'desk', path: 'kaykit/packs/furniture/desk.gltf' },
      { key: 'chair_A', path: 'kaykit/packs/furniture/chair_A.gltf' },
      // Living Room
      { key: 'book_stack', path: 'living-room/book_stack.gltf' },
      // School/Learning Props (KayKit RPG Tools)
      { key: 'journal', path: 'kaykit/packs/rpg_tools/journal_open.gltf' },
      { key: 'journal_closed', path: 'kaykit/packs/rpg_tools/journal_closed.gltf' },
      { key: 'map', path: 'kaykit/packs/rpg_tools/map.gltf' },
      { key: 'map_rolled', path: 'kaykit/packs/rpg_tools/map_rolled.gltf' },
      { key: 'blueprint', path: 'kaykit/packs/rpg_tools/blueprint.gltf' },
      { key: 'compass', path: 'kaykit/packs/rpg_tools/drafting_compass.gltf' },
      { key: 'pencil', path: 'kaykit/packs/rpg_tools/pencil_A_long.gltf' },
      { key: 'magnifying_glass', path: 'kaykit/packs/rpg_tools/magnifying_glass.gltf' },
      { key: 'hammer', path: 'kaykit/packs/rpg_tools/hammer.gltf' },
      { key: 'anvil', path: 'kaykit/packs/rpg_tools/anvil.gltf' },
      // Medieval library props (Quaternius)
      { key: 'bookcase', path: 'quaternius/medieval-props/Bookcase_2.gltf' },
      { key: 'book_stack_medieval', path: 'quaternius/medieval-props/Book_Stack_2.gltf' },
      { key: 'scroll_ancient', path: 'quaternius/medieval-props/Scroll_1.gltf' },
      { key: 'bookstand', path: 'quaternius/medieval-props/BookStand.gltf' },
      { key: 'workbench', path: 'quaternius/medieval-props/Workbench.gltf' },
      { key: 'table_large', path: 'quaternius/medieval-props/Table_Large.gltf' },
    ],
  },

  'dungeon-concert': {
    description: 'T5: Dungeon Rock Concert',
    characters: ['knight', 'barbarian', 'mage', 'ranger', 'rogue', 'skeleton_warrior', 'clown'],
    animationPacks: ['general', 'movement_basic', 'simulation', 'combat_melee', 'special'],
    props: [
      // Dungeon (KayKit)
      { key: 'torch', path: 'kaykit/packs/dungeon/torch.gltf' },
      { key: 'barrel', path: 'kaykit/packs/dungeon/barrel.gltf' },
      { key: 'banner_blue', path: 'kaykit/packs/dungeon/banner_blue.gltf' },
      { key: 'banner_red', path: 'kaykit/packs/dungeon/banner_red.gltf' },
      { key: 'table_long', path: 'kaykit/packs/dungeon/table_long.gltf' },
      { key: 'chair', path: 'kaykit/packs/dungeon/chair.gltf' },
      // Real Musical Instruments (Poly-Pizza Coffeehouse)
      { key: 'guitar', path: 'poly-pizza/interior/coffeehouse-lounge/Electric guitar.glb' },
      { key: 'guitar_amp', path: 'poly-pizza/interior/coffeehouse-lounge/Guitar Amp.glb' },
      { key: 'drums', path: 'poly-pizza/interior/coffeehouse-lounge/Drum Set.glb' },
      { key: 'drumstick', path: 'poly-pizza/interior/coffeehouse-lounge/Drum stick.glb' },
      { key: 'microphone', path: 'poly-pizza/interior/coffeehouse-lounge/Microphone.glb' },
      { key: 'bass_speakers', path: 'poly-pizza/interior/coffeehouse-lounge/Bass Speakers.glb' },
      { key: 'speaker', path: 'poly-pizza/interior/coffeehouse-lounge/Speaker.glb' },
      { key: 'floor_monitor', path: 'poly-pizza/interior/coffeehouse-lounge/Floor Monitor.glb' },
      { key: 'effects_pedal', path: 'poly-pizza/interior/coffeehouse-lounge/Electric Guitar Effects Pedal.glb' },
      { key: 'headphones', path: 'poly-pizza/interior/coffeehouse-lounge/Headphones.glb' },
      // Spooky atmosphere (KayKit Halloween)
      { key: 'skull_candle', path: 'kaykit/packs/halloween/skull_candle.gltf' },
      { key: 'lantern_standing', path: 'kaykit/packs/halloween/lantern_standing.gltf' },
      { key: 'lantern_hanging', path: 'kaykit/packs/halloween/lantern_hanging.gltf' },
      { key: 'coffin', path: 'kaykit/packs/halloween/coffin_decorated.gltf' },
    ],
  },

  'skeleton-pizza': {
    description: 'T6: Skeleton Pizza Delivery',
    characters: ['skeleton_warrior', 'skeleton_rogue', 'knight', 'ranger'],
    animationPacks: ['general', 'movement_basic', 'movement_advanced', 'special', 'tools'],
    props: [
      // Restaurant (KayKit) — has actual pizza models!
      { key: 'pizza_pepperoni', path: 'kaykit/packs/restaurant/food_pizza_pepperoni_plated.gltf' },
      { key: 'pizza_cheese', path: 'kaykit/packs/restaurant/food_pizza_cheese_plated.gltf' },
      { key: 'table_round', path: 'kaykit/packs/restaurant/table_round_A.gltf' },
      { key: 'chair_restaurant', path: 'kaykit/packs/restaurant/chair_A.gltf' },
      { key: 'plate', path: 'kaykit/packs/restaurant/plate.gltf' },
      // Pretty Park (Tiny Treats)
      { key: 'bench', path: 'tiny-treats/pretty-park/bench.gltf' },
      // Bakery/Kitchen equipment (Tiny Treats)
      { key: 'bread_oven', path: 'tiny-treats/bakery-interior/bread_oven.gltf' },
      { key: 'counter_table', path: 'tiny-treats/bakery-interior/counter_table.gltf' },
      { key: 'display_case', path: 'tiny-treats/bakery-interior/display_case_long.gltf' },
      { key: 'cash_register', path: 'tiny-treats/bakery-interior/cash_register.gltf' },
      { key: 'serving_tray', path: 'tiny-treats/bakery-interior/serving_tray.gltf' },
      { key: 'dough_ball', path: 'tiny-treats/bakery-interior/dough_ball.gltf' },
      { key: 'flour_sack', path: 'tiny-treats/bakery-interior/flour_sack_open.gltf' },
      // Extra food (Quaternius)
      { key: 'burger', path: 'quaternius/food/burger_001.glb' },
      { key: 'sausages', path: 'quaternius/food/sausages_001.glb' },
      { key: 'tomato', path: 'quaternius/food/tomato_001.glb' },
    ],
  },
};

// ─── ESSENTIAL ANIMATIONS PER CONTEXT ───────────────────────────────────────
// Grouped for system prompt reference

export const ANIMATION_GROUPS = {
  idle: ['Idle_A', 'Idle_B', 'Skeletons_Idle'],
  walk: ['Walking_A', 'Walking_B', 'Walking_C', 'Skeletons_Walking'],
  run: ['Running_A', 'Running_B'],
  combat: ['Melee_1H_Attack_Chop', 'Melee_2H_Attack_Spin', 'Melee_Block', 'Ranged_Magic_Spellcasting'],
  social: ['Cheering', 'Waving', 'Sit_Chair_Down', 'Sit_Chair_Idle', 'Sit_Floor_Down'],
  reactions: ['Hit_A', 'Hit_B', 'Death_A', 'Spawn_Ground', 'Spawn_Air'],
  tools: ['Chop', 'Dig', 'Hammer', 'Fishing_Cast', 'Holding_A', 'Work_A'],
  skeleton_special: ['Skeletons_Awaken_Floor', 'Skeletons_Taunt', 'Skeletons_Death_Resurrect'],
  magic: ['Ranged_Magic_Raise', 'Ranged_Magic_Shoot', 'Ranged_Magic_Spellcasting_Long', 'Ranged_Magic_Summon'],
} as const;

// ─── ANIMAL MODELS (Quaternius) ──────────────────────────────────────────────
// GLB files with embedded rigs and animations. Paths relative to ASSET_BASE.

export const ANIMAL_MODELS: Record<string, string> = {
  cat:     'quaternius/animals/kitty_001.glb',
  dog:     'quaternius/animals/dog_001.glb',
  horse:   'quaternius/animals/horse_001.glb',
  chicken: 'quaternius/animals/chicken_001.glb',
  deer:    'quaternius/animals/deer_001.glb',
  penguin: 'quaternius/animals/pinguin_001.glb',
  tiger:   'quaternius/animals/tiger_001.glb',
};

// ─── FOOD MODELS (Quaternius) ────────────────────────────────────────────────
// GLB files — static props. Paths relative to ASSET_BASE.

export const FOOD_MODELS: Record<string, string> = {
  apple:         'quaternius/food/apple_001.glb',
  banana:        'quaternius/food/banana_001.glb',
  burger:        'quaternius/food/burger_001.glb',
  carrot:        'quaternius/food/carrot_001.glb',
  chips:         'quaternius/food/chips_001.glb',
  coffee:        'quaternius/food/coffee_001.glb',
  donut:         'quaternius/food/donut_001.glb',
  drink:         'quaternius/food/drink_001.glb',
  eggplant:      'quaternius/food/eggplant_001.glb',
  fish:          'quaternius/food/fish_001.glb',
  fork:          'quaternius/food/fork_001.glb',
  ice_cream:     'quaternius/food/ice_cream_dish_001.glb',
  peach:         'quaternius/food/peach_001.glb',
  plate_food:    'quaternius/food/Plate_001.glb',
  sandwich_food: 'quaternius/food/sandwich_001.glb',
  sausages:      'quaternius/food/sausages_001.glb',
  sushi:         'quaternius/food/sushi_dish_001.glb',
  tomato:        'quaternius/food/tomato_001.glb',
  wineglass:     'quaternius/food/wineglass_001.glb',
  yogurt:        'quaternius/food/yogurt_001.glb',
};

// ─── CHRISTMAS MODELS (Quaternius) ───────────────────────────────────────────
// GLB files — static props. Paths relative to ASSET_BASE.

export const CHRISTMAS_MODELS: Record<string, string> = {
  christmas_tree:   'quaternius/christmas/Christmass_tree_indoor_001.glb',
  snowman:          'quaternius/christmas/Snowman_001.glb',
  present_xmas_1:   'quaternius/christmas/Present_001.glb',
  present_xmas_2:   'quaternius/christmas/Present_002.glb',
  present_xmas_3:   'quaternius/christmas/Present_003.glb',
  candy_cane:       'quaternius/christmas/Shugar_cane_001.glb',
  wreath:           'quaternius/christmas/Advent_Wreath_001.glb',
  garland:          'quaternius/christmas/Garland_001.glb',
  stocking:         'quaternius/christmas/Christmass_sock_001.glb',
  fireplace:        'quaternius/christmas/Fireplace_001.glb',
  cookie:           'quaternius/christmas/Cookie_001.glb',
  teapot:           'quaternius/christmas/Teapot_001.glb',
  bowl:             'quaternius/christmas/Bowl_001.glb',
  cup:              'quaternius/christmas/Cup_001.glb',
  armchair:         'quaternius/christmas/Armchair_001.glb',
  couch:            'quaternius/christmas/Couch_001.glb',
};

// ─── ASSET BASE PATH ────────────────────────────────────────────────────────

export const ASSET_BASE = '/assets/3d/';

/** Resolve a manifest path to a full URL */
export function resolveAssetPath(manifestPath: string): string {
  return `${ASSET_BASE}${manifestPath}`;
}
