/**
 * Block Library — maps ~60 keywords to pre-built ActionBlock definitions.
 *
 * Categories:
 *   - character: KayKit characters (Rig_Medium)
 *   - animal: Quaternius GLB animals with embedded animations
 *   - prop: Static 3D models (GLTF/GLB)
 *   - procedural: Runtime-generated geometry (balloons)
 *   - reaction_combo: Multi-effect reaction sequences
 *
 * Each block has aliases for fuzzy matching (Claude may say "kitty" or "cat").
 * The BlockResolver uses this library to convert BlockResponse → SceneScript.
 */

import type { ActionBlock, BlockLibrary } from '../types/block-types';

// ─── CHARACTERS (28) ────────────────────────────────────────────────────────

const CHARACTER_BLOCKS: ActionBlock[] = [
  {
    id: 'knight', aliases: ['sir', 'warrior', 'soldier', 'paladin'],
    category: 'character', characterId: 'knight',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'skeleton_warrior', aliases: ['skeleton', 'bones', 'skelly'],
    category: 'character', characterId: 'skeleton_warrior',
    enterStyle: 'walk', defaultAnimation: 'Skeletons_Walking', idleAnimation: 'Skeletons_Idle',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'skeleton_mage', aliases: ['bone_mage', 'undead_mage'],
    category: 'character', characterId: 'skeleton_mage',
    enterStyle: 'walk', defaultAnimation: 'Skeletons_Walking', idleAnimation: 'Skeletons_Idle',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'skeleton_rogue', aliases: ['bone_rogue', 'undead_rogue'],
    category: 'character', characterId: 'skeleton_rogue',
    enterStyle: 'walk', defaultAnimation: 'Skeletons_Walking', idleAnimation: 'Skeletons_Idle',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'skeleton_minion', aliases: ['minion', 'skeleton_small'],
    category: 'character', characterId: 'skeleton_minion',
    enterStyle: 'walk', defaultAnimation: 'Skeletons_Walking', idleAnimation: 'Skeletons_Idle',
    supportsGroup: true, maxCount: 4, spreadDistance: 2.0,
  },
  {
    id: 'skeleton_golem', aliases: ['bone_golem', 'undead_golem'],
    category: 'character', characterId: 'skeleton_golem',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'necromancer', aliases: ['dark_mage', 'death_mage'],
    category: 'character', characterId: 'necromancer',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'mage', aliases: ['wizard', 'sorcerer', 'magic_user'],
    category: 'character', characterId: 'mage',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'barbarian', aliases: ['monster', 'brute', 'berserker'],
    category: 'character', characterId: 'barbarian',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'ranger', aliases: ['archer', 'hunter', 'bowman'],
    category: 'character', characterId: 'ranger',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'rogue', aliases: ['thief', 'assassin', 'sneaky'],
    category: 'character', characterId: 'rogue',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'druid', aliases: ['nature_mage', 'shaman'],
    category: 'character', characterId: 'druid',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'engineer', aliases: ['builder', 'mechanic', 'inventor'],
    category: 'character', characterId: 'engineer',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'space_ranger', aliases: ['astronaut', 'spaceman'],
    category: 'character', characterId: 'space_ranger',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'ninja', aliases: ['shinobi', 'shadow'],
    category: 'character', characterId: 'ninja',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'clown', aliases: ['jester', 'joker', 'funny'],
    category: 'character', characterId: 'clown',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'robot', aliases: ['robot_one', 'droid', 'bot'],
    category: 'character', characterId: 'robot',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'survivalist', aliases: ['survivor', 'explorer'],
    category: 'character', characterId: 'survivalist',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'witch', aliases: ['sorceress', 'hex'],
    category: 'character', characterId: 'witch',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'vampire', aliases: ['vamp', 'dracula', 'bloodsucker'],
    category: 'character', characterId: 'vampire',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'black_knight', aliases: ['dark_knight', 'evil_knight'],
    category: 'character', characterId: 'black_knight',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'superhero', aliases: ['hero', 'super'],
    category: 'character', characterId: 'superhero',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'caveman', aliases: ['primitive', 'stone_age'],
    category: 'character', characterId: 'caveman',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'frost_golem', aliases: ['ice_golem', 'frozen'],
    category: 'character', characterId: 'frost_golem',
    enterStyle: 'walk', defaultAnimation: 'Walking_A', idleAnimation: 'Idle_A',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
];

// ─── ANIMALS (7) ────────────────────────────────────────────────────────────

const ANIMAL_BLOCKS: ActionBlock[] = [
  {
    id: 'cat', aliases: ['kitten', 'kitty', 'feline', 'cats'],
    category: 'animal', modelPath: 'quaternius/animals/kitty_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 6, spreadDistance: 1.5, scale: 0.8,
  },
  {
    id: 'dog', aliases: ['puppy', 'pup', 'doggy', 'dogs'],
    category: 'animal', modelPath: 'quaternius/animals/dog_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 4, spreadDistance: 1.8, scale: 0.8,
  },
  {
    id: 'horse', aliases: ['pony', 'stallion', 'horses'],
    category: 'animal', modelPath: 'quaternius/animals/horse_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 3, spreadDistance: 2.5, scale: 0.7,
  },
  {
    id: 'chicken', aliases: ['hen', 'rooster', 'chickens'],
    category: 'animal', modelPath: 'quaternius/animals/chicken_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 6, spreadDistance: 1.2, scale: 0.6,
  },
  {
    id: 'deer', aliases: ['stag', 'doe', 'reindeer'],
    category: 'animal', modelPath: 'quaternius/animals/deer_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 3, spreadDistance: 2.0, scale: 0.7,
  },
  {
    id: 'penguin', aliases: ['penguin', 'penguins'],
    category: 'animal', modelPath: 'quaternius/animals/pinguin_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 5, spreadDistance: 1.3, scale: 0.6,
  },
  {
    id: 'tiger', aliases: ['tigers', 'big_cat'],
    category: 'animal', modelPath: 'quaternius/animals/tiger_001.glb',
    enterStyle: 'walk', defaultAnimation: 'Walk', idleAnimation: 'Idle',
    supportsGroup: true, maxCount: 2, spreadDistance: 2.5, scale: 0.8,
  },
];

// ─── PROPS (~20) ────────────────────────────────────────────────────────────

const PROP_BLOCKS: ActionBlock[] = [
  {
    id: 'cake_birthday', aliases: ['cake', 'birthday_cake', 'birthday cake'],
    category: 'prop', propId: 'cake_birthday',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 3.0, associatedReactions: ['confetti-burst'],
  },
  {
    id: 'present', aliases: ['gift', 'present_A_red', 'gifts', 'presents'],
    category: 'prop', propId: 'present_A_red',
    enterStyle: 'bounce', supportsGroup: true, maxCount: 5, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'present_B_blue', aliases: ['blue_gift', 'blue_present'],
    category: 'prop', propId: 'present_B_blue',
    enterStyle: 'bounce', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'present_C_green', aliases: ['green_gift', 'green_present'],
    category: 'prop', propId: 'present_C_green',
    enterStyle: 'bounce', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'table_long', aliases: ['table', 'long_table', 'party_table'],
    category: 'prop', propId: 'table_long',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'torch', aliases: ['torches', 'flame', 'light'],
    category: 'prop', propId: 'torch',
    enterStyle: 'appear', supportsGroup: true, maxCount: 4, spreadDistance: 2.5,
    scale: 2.0,
  },
  {
    id: 'barrel', aliases: ['barrels', 'keg'],
    category: 'prop', propId: 'barrel',
    enterStyle: 'appear', supportsGroup: true, maxCount: 3, spreadDistance: 2.0,
    scale: 0.8,
  },
  {
    id: 'banner_blue', aliases: ['blue_banner', 'blue_flag'],
    category: 'prop', propId: 'banner_blue',
    enterStyle: 'appear', supportsGroup: true, maxCount: 3, spreadDistance: 3.0,
    scale: 0.6,
  },
  {
    id: 'banner_red', aliases: ['red_banner', 'red_flag', 'banner'],
    category: 'prop', propId: 'banner_red',
    enterStyle: 'appear', supportsGroup: true, maxCount: 3, spreadDistance: 3.0,
    scale: 0.6,
  },
  {
    id: 'pizza', aliases: ['pizza_pepperoni', 'pepperoni_pizza'],
    category: 'prop', propId: 'pizza',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.5,
    scale: 2.5,
  },
  {
    id: 'sandwich', aliases: ['burger', 'food_burger'],
    category: 'prop', propId: 'sandwich',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.2,
    scale: 3.0,
  },
  {
    id: 'cupcake', aliases: ['cupcakes', 'muffin'],
    category: 'prop', propId: 'cupcake',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 1.0,
    scale: 3.0,
  },
  {
    id: 'pie', aliases: ['pie_cherry', 'pie_apple', 'cherry_pie'],
    category: 'prop', propId: 'pie',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 3.0,
  },
  {
    id: 'bread', aliases: ['loaf', 'baguette'],
    category: 'prop', propId: 'bread',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 3.0,
  },
  {
    id: 'sword', aliases: ['swords', 'blade', 'weapon'],
    category: 'prop', propId: 'sword',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'shield', aliases: ['shields', 'buckler'],
    category: 'prop', propId: 'shield',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'guitar', aliases: ['guitars', 'axe_instrument'],
    category: 'prop', propId: 'guitar',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'drums', aliases: ['drum', 'drum_set'],
    category: 'prop', propId: 'drums',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
  {
    id: 'chair', aliases: ['chairs', 'seat', 'chair_A'],
    category: 'prop', propId: 'chair',
    enterStyle: 'appear', supportsGroup: true, maxCount: 4, spreadDistance: 1.5,
  },
  {
    id: 'bench', aliases: ['park_bench', 'seat'],
    category: 'prop', propId: 'bench',
    enterStyle: 'appear', supportsGroup: true, maxCount: 4, spreadDistance: 2.5,
    scale: 1.0,
  },
  {
    id: 'desk', aliases: ['school_desk', 'table_desk'],
    category: 'prop', propId: 'desk',
    enterStyle: 'appear', supportsGroup: true, maxCount: 6, spreadDistance: 2.0,
    scale: 1.0,
  },
  {
    id: 'table_round', aliases: ['round_table', 'table_round_A'],
    category: 'prop', propId: 'table_round',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 1.0,
  },
  {
    id: 'plate', aliases: ['dish'],
    category: 'prop', propId: 'plate',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 6, spreadDistance: 1.0,
    scale: 0.6,
  },
  {
    id: 'chest', aliases: ['treasure', 'treasure_chest'],
    category: 'prop', propId: 'chest',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
  },
];

// ─── FOOD PROPS (Quaternius GLB) ────────────────────────────────────────────

const FOOD_BLOCKS: ActionBlock[] = [
  {
    id: 'apple', aliases: ['apples', 'fruit'],
    category: 'prop', modelPath: 'quaternius/food/apple_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'banana', aliases: ['bananas'],
    category: 'prop', modelPath: 'quaternius/food/banana_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'burger', aliases: ['hamburger', 'cheeseburger'],
    category: 'prop', modelPath: 'quaternius/food/burger_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 1.2,
    scale: 2.5,
  },
  {
    id: 'carrot', aliases: ['carrots'],
    category: 'prop', modelPath: 'quaternius/food/carrot_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 0.8,
    scale: 2.5,
  },
  {
    id: 'chips', aliases: ['fries', 'french_fries'],
    category: 'prop', modelPath: 'quaternius/food/chips_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'coffee', aliases: ['coffee_cup', 'hot_coffee'],
    category: 'prop', modelPath: 'quaternius/food/coffee_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'donut_food', aliases: ['doughnut', 'donut_snack'],
    category: 'prop', modelPath: 'quaternius/food/donut_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 0.8,
    scale: 2.5,
  },
  {
    id: 'drink', aliases: ['soda', 'juice', 'beverage', 'drinks'],
    category: 'prop', modelPath: 'quaternius/food/drink_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'fish_food', aliases: ['cooked_fish', 'fish_dish'],
    category: 'prop', modelPath: 'quaternius/food/fish_001.glb',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 2.5,
  },
  {
    id: 'ice_cream', aliases: ['icecream', 'ice_cream_dish', 'sundae'],
    category: 'prop', modelPath: 'quaternius/food/ice_cream_dish_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5, associatedReactions: ['hearts-float'],
  },
  {
    id: 'sandwich_food', aliases: ['sub', 'hoagie', 'panini'],
    category: 'prop', modelPath: 'quaternius/food/sandwich_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'sausages', aliases: ['hot_dog', 'hotdog', 'sausage', 'wiener'],
    category: 'prop', modelPath: 'quaternius/food/sausages_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 3, spreadDistance: 1.0,
    scale: 2.5,
  },
  {
    id: 'sushi', aliases: ['sushi_dish', 'sashimi', 'sushi_roll'],
    category: 'prop', modelPath: 'quaternius/food/sushi_dish_001.glb',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 2.5,
  },
  {
    id: 'tomato', aliases: ['tomatoes'],
    category: 'prop', modelPath: 'quaternius/food/tomato_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 0.8,
    scale: 2.5,
  },
  {
    id: 'yogurt', aliases: ['yoghurt', 'pudding'],
    category: 'prop', modelPath: 'quaternius/food/yogurt_001.glb',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 2.5,
  },
];

// ─── CHRISTMAS / DECORATION PROPS (Quaternius GLB) ──────────────────────────

const CHRISTMAS_BLOCKS: ActionBlock[] = [
  {
    id: 'christmas_tree', aliases: ['xmas_tree', 'holiday_tree', 'tree_christmas'],
    category: 'prop', modelPath: 'quaternius/christmas/Christmass_tree_indoor_001.glb',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 1.5, associatedReactions: ['sparkle-magic'],
  },
  {
    id: 'snowman', aliases: ['snow_man', 'frosty'],
    category: 'prop', modelPath: 'quaternius/christmas/Snowman_001.glb',
    enterStyle: 'appear', supportsGroup: true, maxCount: 3, spreadDistance: 2.0,
    scale: 1.5,
  },
  {
    id: 'present_xmas', aliases: ['christmas_present', 'xmas_gift', 'wrapped_gift'],
    category: 'prop', modelPath: 'quaternius/christmas/Present_001.glb',
    enterStyle: 'bounce', supportsGroup: true, maxCount: 6, spreadDistance: 1.0,
    scale: 2.0,
  },
  {
    id: 'candy_cane', aliases: ['candy_canes', 'sugar_cane', 'peppermint_stick'],
    category: 'prop', modelPath: 'quaternius/christmas/Shugar_cane_001.glb',
    enterStyle: 'appear', supportsGroup: true, maxCount: 4, spreadDistance: 1.0,
    scale: 2.0,
  },
  {
    id: 'wreath', aliases: ['wreaths', 'door_wreath', 'advent_wreath'],
    category: 'prop', modelPath: 'quaternius/christmas/Advent_Wreath_001.glb',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 2.0,
  },
  {
    id: 'garland', aliases: ['garlands', 'decoration_garland'],
    category: 'prop', modelPath: 'quaternius/christmas/Garland_001.glb',
    enterStyle: 'appear', supportsGroup: true, maxCount: 3, spreadDistance: 2.5,
    scale: 1.5,
  },
  {
    id: 'stocking', aliases: ['stockings', 'christmas_sock', 'christmas_stocking'],
    category: 'prop', modelPath: 'quaternius/christmas/Christmass_sock_001.glb',
    enterStyle: 'appear', supportsGroup: true, maxCount: 4, spreadDistance: 1.2,
    scale: 2.0,
  },
  {
    id: 'fireplace_xmas', aliases: ['chimney', 'fire_place'],
    category: 'prop', modelPath: 'quaternius/christmas/Fireplace_001.glb',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 1.2,
  },
  {
    id: 'cookie_xmas', aliases: ['cookies', 'biscuit', 'biscuits'],
    category: 'prop', modelPath: 'quaternius/christmas/Cookie_001.glb',
    enterStyle: 'drop-in', supportsGroup: true, maxCount: 4, spreadDistance: 0.8,
    scale: 2.5,
  },
  {
    id: 'teapot', aliases: ['tea_pot', 'tea'],
    category: 'prop', modelPath: 'quaternius/christmas/Teapot_001.glb',
    enterStyle: 'drop-in', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 2.5,
  },
  {
    id: 'armchair', aliases: ['armchairs', 'comfy_chair', 'easy_chair'],
    category: 'prop', modelPath: 'quaternius/christmas/Armchair_001.glb',
    enterStyle: 'appear', supportsGroup: true, maxCount: 3, spreadDistance: 2.0,
    scale: 1.2,
  },
  {
    id: 'couch', aliases: ['sofa', 'loveseat'],
    category: 'prop', modelPath: 'quaternius/christmas/Couch_001.glb',
    enterStyle: 'appear', supportsGroup: false, maxCount: 1, spreadDistance: 0,
    scale: 1.2,
  },
];

// ─── PROCEDURAL (1) ─────────────────────────────────────────────────────────

const PROCEDURAL_BLOCKS: ActionBlock[] = [
  {
    id: 'balloon', aliases: ['balloons', 'party_balloon', 'party_balloons'],
    category: 'procedural', procedural: 'balloon',
    enterStyle: 'float', supportsGroup: true, maxCount: 10, spreadDistance: 1.2,
    scale: 1.0,
  },
];

// ─── REACTION COMBOS (4) ────────────────────────────────────────────────────

const REACTION_COMBO_BLOCKS: ActionBlock[] = [
  {
    id: 'celebration', aliases: ['celebrate', 'party_time', 'hooray'],
    category: 'reaction_combo',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
    associatedReactions: ['confetti-burst', 'stars-spin'],
  },
  {
    id: 'surprise', aliases: ['surprised', 'shock', 'shocked', 'wow'],
    category: 'reaction_combo',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
    associatedReactions: ['explosion-cartoon', 'question-marks'],
  },
  {
    id: 'love', aliases: ['hearts', 'lovely', 'adore', 'romance'],
    category: 'reaction_combo',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
    associatedReactions: ['hearts-float', 'sparkle-magic'],
  },
  {
    id: 'chaos', aliases: ['chaotic', 'mayhem', 'disaster', 'mess'],
    category: 'reaction_combo',
    supportsGroup: false, maxCount: 1, spreadDistance: 0,
    associatedReactions: ['explosion-cartoon', 'laugh-tears'],
  },
];

// ─── BUILD LIBRARY ──────────────────────────────────────────────────────────

const ALL_BLOCKS: ActionBlock[] = [
  ...CHARACTER_BLOCKS,
  ...ANIMAL_BLOCKS,
  ...PROP_BLOCKS,
  ...FOOD_BLOCKS,
  ...CHRISTMAS_BLOCKS,
  ...PROCEDURAL_BLOCKS,
  ...REACTION_COMBO_BLOCKS,
];

/**
 * Builds the block library indexed by id + all aliases (case-insensitive).
 * Returns a Map for O(1) lookups.
 */
export function buildBlockLibrary(): BlockLibrary {
  const library: BlockLibrary = new Map();

  for (const block of ALL_BLOCKS) {
    // Index by primary id
    library.set(block.id.toLowerCase(), block);
    // Index by all aliases
    for (const alias of block.aliases) {
      library.set(alias.toLowerCase(), block);
    }
  }

  return library;
}

/** Singleton library instance */
export const BLOCK_LIBRARY = buildBlockLibrary();

/** Get all block IDs grouped by category (useful for system prompts) */
export function getBlockIdsByCategory(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const block of ALL_BLOCKS) {
    if (!result[block.category]) result[block.category] = [];
    result[block.category].push(block.id);
  }
  return result;
}
