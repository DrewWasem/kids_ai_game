/**
 * Asset Substitution Engine — maps semantic tags to real 3D model paths.
 *
 * All paths relative to frontend/public/assets/3d/
 * Provides 3-tier fallback: direct match → fuzzy keyword → mystery_box
 */

import type { AssetEntry } from '../types/madlibs';

// ─── COMPLETE ASSET MAP (Real Paths) ─────────────────────────────────────────

export const ASSET_SUBS: Record<string, AssetEntry> = {
  // === FOOD — Prepared Meals ===
  pizza:              { path: 'kaykit/packs/restaurant/food_pizza_pepperoni_plated.gltf', fallback: 'kaykit/packs/restaurant/food_pizza_cheese_plated.gltf' },
  pizza_slice:        { path: 'kaykit/packs/restaurant/food_pizza_pepperoni_slice.gltf' },
  pizza_box:          { path: 'kaykit/packs/restaurant/pizzabox_open.gltf', fallback: 'kaykit/packs/restaurant/pizzabox_closed.gltf' },
  pizza_box_stack:    { path: 'kaykit/packs/restaurant/pizzabox_stacked.gltf' },
  burger:             { path: 'kaykit/packs/restaurant/food_burger.gltf', fallback: 'quaternius/food/burger_001.glb' },
  dinner_plate:       { path: 'kaykit/packs/restaurant/food_dinner.gltf' },
  stew:               { path: 'kaykit/packs/restaurant/food_stew.gltf' },
  stew_pot:           { path: 'kaykit/packs/restaurant/stew_pot.gltf' },
  sandwich:           { path: 'tiny-treats/pleasant-picnic/sandwich.gltf', fallback: 'quaternius/food/sandwich_001.glb' },
  sushi:              { path: 'quaternius/food/sushi_dish_001.glb' },

  // === Ice Cream ===
  icecream_chocolate:  { path: 'kaykit/packs/restaurant/food_icecream_cone_chocolate.gltf' },
  icecream_strawberry: { path: 'kaykit/packs/restaurant/food_icecream_cone_strawberry.gltf' },
  icecream_vanilla:    { path: 'kaykit/packs/restaurant/food_icecream_cone_vanilla.gltf' },
  icecream_bowl:       { path: 'kaykit/packs/restaurant/icecream_bowl_decorated_A.gltf' },
  icecream_stack:      { path: 'kaykit/packs/restaurant/icecream_cone_stacked.gltf' },

  // === Ingredients ===
  tomato:             { path: 'kaykit/packs/restaurant/food_ingredient_tomato.gltf', fallback: 'quaternius/food/tomato_001.glb' },
  cheese:             { path: 'kaykit/packs/restaurant/food_ingredient_cheese.gltf' },
  cheese_slice:       { path: 'kaykit/packs/restaurant/food_ingredient_cheese_slice.gltf' },
  lettuce:            { path: 'kaykit/packs/restaurant/food_ingredient_lettuce.gltf' },
  onion:              { path: 'kaykit/packs/restaurant/food_ingredient_onion.gltf' },
  mushroom_food:      { path: 'kaykit/packs/restaurant/food_ingredient_mushroom.gltf' },
  carrot:             { path: 'kaykit/packs/restaurant/food_ingredient_carrot.gltf', fallback: 'quaternius/food/carrot_001.glb' },
  potato:             { path: 'kaykit/packs/restaurant/food_ingredient_potato.gltf' },
  steak:              { path: 'kaykit/packs/restaurant/food_ingredient_steak.gltf' },
  dough:              { path: 'kaykit/packs/restaurant/food_ingredient_dough.gltf' },
  ham:                { path: 'kaykit/packs/restaurant/food_ingredient_ham.gltf' },
  onion_rings:        { path: 'kaykit/packs/restaurant/food_ingredient_onion_rings.gltf' },

  // === Fruits ===
  apple:              { path: 'tiny-treats/pleasant-picnic/apple.gltf', fallback: 'quaternius/food/apple_001.glb' },
  apple_cut:          { path: 'tiny-treats/pleasant-picnic/apple_cut.gltf' },
  banana:             { path: 'quaternius/food/banana_001.glb' },
  grapes:             { path: 'tiny-treats/pleasant-picnic/grapes.gltf' },
  peach:              { path: 'quaternius/food/peach_001.glb' },
  melon:              { path: 'kaykit/packs/block/melon.gltf' },

  // === Drinks ===
  drink_can:          { path: 'tiny-treats/pleasant-picnic/drink_can.gltf' },
  coffee:             { path: 'quaternius/food/coffee_001.glb' },
  mug:                { path: 'kaykit/packs/furniture/mug_A.gltf', fallback: 'tiny-treats/pleasant-picnic/mug.gltf' },
  teapot:             { path: 'tiny-treats/pleasant-picnic/teapot.gltf' },
  thermos:            { path: 'tiny-treats/pleasant-picnic/thermos.gltf' },
  hot_chocolate:      { path: 'kaykit/packs/holiday/hot_chocolate_decorated.gltf' },
  milk:               { path: 'kaykit/packs/holiday/milk.gltf' },

  // === Condiments ===
  ketchup:            { path: 'kaykit/packs/restaurant/ketchup.gltf' },
  mustard:            { path: 'kaykit/packs/restaurant/mustard.gltf' },
  jam:                { path: 'tiny-treats/pleasant-picnic/jam.gltf' },

  // === Kitchen Equipment ===
  pot:                { path: 'kaykit/packs/restaurant/pot_A.gltf' },
  pot_stew:           { path: 'kaykit/packs/restaurant/pot_A_stew.gltf' },
  pot_large:          { path: 'kaykit/packs/restaurant/pot_large.gltf' },
  pan:                { path: 'kaykit/packs/restaurant/pan_A.gltf' },
  cutting_board:      { path: 'kaykit/packs/restaurant/cuttingboard.gltf' },
  knife_kitchen:      { path: 'kaykit/packs/restaurant/knife.gltf' },
  spoon:              { path: 'kaykit/packs/restaurant/spoon.gltf' },
  rolling_pin:        { path: 'kaykit/packs/restaurant/rollingpin.gltf' },
  oven:               { path: 'kaykit/packs/restaurant/oven.gltf' },
  pizza_oven:         { path: 'kaykit/packs/restaurant/pizza_oven.gltf' },
  stove:              { path: 'kaykit/packs/restaurant/stove_multi_decorated.gltf' },
  plate:              { path: 'kaykit/packs/restaurant/plate.gltf', fallback: 'kaykit/packs/dungeon/plate.gltf' },
  plate_food:         { path: 'kaykit/packs/dungeon/plate_food_A.gltf' },
  bowl:               { path: 'kaykit/packs/restaurant/bowl.gltf' },
  lid:                { path: 'kaykit/packs/restaurant/lid_A.gltf' },
  fridge:             { path: 'kaykit/packs/restaurant/fridge_A_decorated.gltf' },

  // === FURNITURE & SCENE DRESSING ===
  table_long:          { path: 'kaykit/packs/dungeon/table_long_tablecloth.gltf', fallback: 'kaykit/packs/dungeon/table_long.gltf' },
  table_long_decorated:{ path: 'kaykit/packs/dungeon/table_long_decorated_A.gltf' },
  table_medium:        { path: 'kaykit/packs/dungeon/table_medium.gltf' },
  table_round:         { path: 'kaykit/packs/dungeon/table_round_large.gltf' },
  table_restaurant:    { path: 'kaykit/packs/restaurant/table_round_B_tablecloth_red_decorated.gltf' },
  table_kitchen:       { path: 'kaykit/packs/restaurant/kitchentable_A_large_decorated_A.gltf' },
  chair:               { path: 'kaykit/packs/dungeon/chair.gltf', fallback: 'kaykit/packs/furniture/chair_A.gltf' },
  chair_fancy:         { path: 'kaykit/packs/holiday/chair_large_red.gltf' },
  stool:               { path: 'kaykit/packs/dungeon/stool.gltf' },
  bench:               { path: 'kaykit/packs/dungeon/bench.gltf', fallback: 'tiny-treats/pretty-park/bench.gltf' },
  armchair:            { path: 'kaykit/packs/furniture/armchair_pillows.gltf' },
  couch:               { path: 'kaykit/packs/furniture/couch_pillows.gltf' },
  bed_single:          { path: 'kaykit/packs/dungeon/bed_A_single.gltf' },
  bed_double:          { path: 'kaykit/packs/dungeon/bed_A_double.gltf' },
  shelf:               { path: 'kaykit/packs/dungeon/shelf_large.gltf' },
  bookcase:            { path: 'kaykit/packs/dungeon/bookcase_double_decoratedA.gltf' },
  desk:                { path: 'kaykit/packs/furniture/desk_decorated.gltf' },
  pillow:              { path: 'kaykit/packs/furniture/pillow_A.gltf' },
  rug:                 { path: 'kaykit/packs/furniture/rug_rectangle_A.gltf' },

  // === CONTAINERS ===
  barrel:              { path: 'kaykit/packs/dungeon/barrel_large.gltf' },
  barrel_small:        { path: 'kaykit/packs/dungeon/barrel_small.gltf' },
  barrel_stack:        { path: 'kaykit/packs/dungeon/barrel_small_stack.gltf' },
  barrel_decorated:    { path: 'kaykit/packs/dungeon/barrel_large_decorated.gltf' },
  crate_large:         { path: 'kaykit/packs/dungeon/crate_large.gltf' },
  crate_small:         { path: 'kaykit/packs/dungeon/crate_small.gltf' },
  crate_stack:         { path: 'kaykit/packs/dungeon/crates_stacked.gltf' },
  box:                 { path: 'kaykit/packs/dungeon/box_large.gltf' },
  bucket:              { path: 'kaykit/packs/dungeon/bucket.gltf' },
  keg:                 { path: 'kaykit/packs/dungeon/keg_decorated.gltf' },
  crate_food:          { path: 'kaykit/packs/restaurant/crate_tomatoes.gltf' },

  // === BANNERS ===
  banner_red:          { path: 'kaykit/packs/dungeon/banner_red.gltf' },
  banner_blue:         { path: 'kaykit/packs/dungeon/banner_blue.gltf' },
  banner_green:        { path: 'kaykit/packs/dungeon/banner_green.gltf' },
  banner_yellow:       { path: 'kaykit/packs/dungeon/banner_yellow.gltf' },
  banner_shield:       { path: 'kaykit/packs/dungeon/banner_shield_red.gltf' },
  banner_triple:       { path: 'kaykit/packs/dungeon/banner_triple_red.gltf' },

  // === PRESENTS ===
  present_red:         { path: 'kaykit/packs/holiday/present_A_red.gltf' },
  present_blue:        { path: 'kaykit/packs/holiday/present_A_blue.gltf' },
  present_green:       { path: 'kaykit/packs/holiday/present_B_green.gltf' },
  present_yellow:      { path: 'kaykit/packs/holiday/present_C_yellow.gltf' },
  present_white:       { path: 'kaykit/packs/holiday/present_D_white.gltf' },
  present_sphere:      { path: 'kaykit/packs/holiday/present_sphere_A_red.gltf' },

  // === HOLIDAY / PARTY ===
  christmas_tree:      { path: 'kaykit/packs/holiday/christmas_tree_decorated.gltf' },
  gingerbread_house:   { path: 'kaykit/packs/holiday/gingerbread_house_decorated.gltf' },
  gingerbread_man:     { path: 'kaykit/packs/holiday/gingerbread_man.gltf' },
  cookie:              { path: 'kaykit/packs/holiday/cookie.gltf' },
  candy:               { path: 'kaykit/packs/holiday/candy_A_pink.gltf' },
  candycane:           { path: 'kaykit/packs/holiday/candycane_large.gltf' },
  candy_peppermint:    { path: 'kaykit/packs/holiday/candy_peppermint.gltf' },
  snowman:             { path: 'kaykit/packs/holiday/snowman_A.gltf' },
  snowball:            { path: 'kaykit/packs/holiday/snowball.gltf' },
  snowball_pile:       { path: 'kaykit/packs/holiday/snowball_pile.gltf' },
  snowball_cannon:     { path: 'kaykit/packs/holiday/snowball_cannon.gltf' },
  bell:                { path: 'kaykit/packs/holiday/bell_decorated.gltf' },
  wreath:              { path: 'kaykit/packs/holiday/wreath.gltf' },
  lantern_holiday:     { path: 'kaykit/packs/holiday/lantern_decorated.gltf' },
  train:               { path: 'kaykit/packs/holiday/train_locomotive.gltf' },
  train_presents:      { path: 'kaykit/packs/holiday/train_tender_presents_A.gltf' },

  // === HALLOWEEN ===
  pumpkin:             { path: 'kaykit/packs/halloween/pumpkin_orange.gltf' },
  pumpkin_jackolantern:{ path: 'kaykit/packs/halloween/pumpkin_orange_jackolantern.gltf' },
  pumpkin_small:       { path: 'kaykit/packs/halloween/pumpkin_orange_small.gltf' },
  coffin:              { path: 'kaykit/packs/halloween/coffin_decorated.gltf' },
  gravestone:          { path: 'kaykit/packs/halloween/gravestone.gltf' },
  skull:               { path: 'kaykit/packs/halloween/skull.gltf' },
  skull_candle:        { path: 'kaykit/packs/halloween/skull_candle.gltf' },
  ribcage:             { path: 'kaykit/packs/halloween/ribcage.gltf' },
  bone_A:              { path: 'kaykit/packs/halloween/bone_A.gltf' },
  bone_B:              { path: 'kaykit/packs/halloween/bone_B.gltf' },
  bone_C:              { path: 'kaykit/packs/halloween/bone_C.gltf' },
  scarecrow:           { path: 'kaykit/packs/halloween/scarecrow.gltf' },
  pitchfork:           { path: 'kaykit/packs/halloween/pitchfork.gltf' },
  candy_bucket:        { path: 'kaykit/packs/halloween/candy_bucket_A_decorated.gltf' },
  lollipop:            { path: 'kaykit/packs/halloween/lollipop_orange.gltf' },
  candycorn:           { path: 'kaykit/packs/halloween/candycorn.gltf' },
  haybale:             { path: 'kaykit/packs/halloween/haybale.gltf' },
  wagon:               { path: 'kaykit/packs/halloween/wagon.gltf' },
  wagon_hay:           { path: 'kaykit/packs/halloween/wagon_hay.gltf' },
  tractor:             { path: 'kaykit/packs/halloween/tractor.gltf' },
  candle:              { path: 'kaykit/packs/halloween/candle.gltf', fallback: 'kaykit/packs/dungeon/candle_lit.gltf' },
  candle_triple:       { path: 'kaykit/packs/halloween/candle_triple.gltf' },
  lantern_hanging:     { path: 'kaykit/packs/halloween/lantern_hanging.gltf' },
  lantern_standing:    { path: 'kaykit/packs/halloween/lantern_standing.gltf' },
  shrine:              { path: 'kaykit/packs/halloween/shrine_candles.gltf' },

  // === Candy (for raining, throwing) ===
  candy_blue:          { path: 'kaykit/packs/halloween/candy_blue_A.gltf' },
  candy_green:         { path: 'kaykit/packs/halloween/candy_green_A.gltf' },
  candy_orange:        { path: 'kaykit/packs/halloween/candy_orange_A.gltf' },
  candy_pink:          { path: 'kaykit/packs/halloween/candy_pink_A.gltf' },
  candy_purple:        { path: 'kaykit/packs/halloween/candy_purple_A.gltf' },

  // === DUNGEON PROPS ===
  torch:               { path: 'kaykit/packs/dungeon/torch_lit.gltf' },
  torch_mounted:       { path: 'kaykit/packs/dungeon/torch_mounted.gltf' },
  chest:               { path: 'kaykit/packs/dungeon/chest.gltf' },
  chest_gold:          { path: 'kaykit/packs/dungeon/chest_gold.gltf' },
  chest_large:         { path: 'kaykit/packs/dungeon/chest_large_gold.gltf' },
  chest_mimic:         { path: 'kaykit/packs/dungeon/chest_mimic.gltf' },
  coin:                { path: 'kaykit/packs/dungeon/coin.gltf' },
  coin_stack:          { path: 'kaykit/packs/dungeon/coin_stack_large.gltf' },
  rocks:               { path: 'kaykit/packs/dungeon/rocks.gltf' },
  rocks_gold:          { path: 'kaykit/packs/dungeon/rocks_gold.gltf' },
  rubble:              { path: 'kaykit/packs/dungeon/rubble_large.gltf' },
  pillar:              { path: 'kaykit/packs/dungeon/pillar_decorated.gltf' },
  sword_shield:        { path: 'kaykit/packs/dungeon/sword_shield.gltf' },
  sword_shield_gold:   { path: 'kaykit/packs/dungeon/sword_shield_gold.gltf' },
  key:                 { path: 'kaykit/packs/dungeon/key_gold.gltf' },
  keyring:             { path: 'kaykit/packs/dungeon/keyring.gltf' },
  pickaxe:             { path: 'kaykit/packs/dungeon/pickaxe_gold.gltf' },
  book_brown:          { path: 'kaykit/packs/dungeon/book_brown.gltf' },

  // === WEAPONS / TOOLS / RPG ===
  sword:               { path: 'poly-pizza/fantasy/fantasy-bundle/Iron Sword.glb' },
  shield:              { path: 'poly-pizza/fantasy/fantasy-bundle/Shield.glb' },
  bow:                 { path: 'poly-pizza/fantasy/fantasy-bundle/Bow.glb' },
  spear:               { path: 'poly-pizza/fantasy/fantasy-bundle/Spear.glb' },
  helmet:              { path: 'poly-pizza/fantasy/fantasy-bundle/Helmet.glb' },
  armor:               { path: 'poly-pizza/fantasy/fantasy-bundle/Armor.glb' },
  potion_red:          { path: 'poly-pizza/fantasy/fantasy-bundle/Potion Red.glb' },
  potion_blue:         { path: 'poly-pizza/fantasy/fantasy-bundle/Potion Blue.glb' },
  potion_green:        { path: 'poly-pizza/fantasy/fantasy-bundle/Potion Green.glb' },
  potion_yellow:       { path: 'poly-pizza/fantasy/fantasy-bundle/Potion Yellow.glb' },
  potion_violet:       { path: 'poly-pizza/fantasy/fantasy-bundle/Potion Violet.glb' },
  crystal_bowl:        { path: 'poly-pizza/fantasy/fantasy-bundle/Crystal Bowl.glb' },
  axe:                 { path: 'kaykit/packs/rpg_tools/axe.gltf' },
  hammer_tool:         { path: 'kaykit/packs/rpg_tools/hammer.gltf' },
  shovel:              { path: 'kaykit/packs/rpg_tools/shovel.gltf' },
  fishing_rod:         { path: 'kaykit/packs/rpg_tools/fishing_rod.gltf' },
  magnifying_glass:    { path: 'kaykit/packs/rpg_tools/magnifying_glass.gltf' },
  map:                 { path: 'kaykit/packs/rpg_tools/map.gltf' },
  lantern_rpg:         { path: 'kaykit/packs/rpg_tools/lantern.gltf' },
  anvil:               { path: 'kaykit/packs/rpg_tools/anvil.gltf' },

  // === ANIMALS ===
  chicken:             { path: 'poly-pizza/animals/animal-kit/Chicken.glb' },
  chick:               { path: 'poly-pizza/animals/animal-kit/Chick.glb' },
  cat:                 { path: 'poly-pizza/animals/animal-kit/Cat.glb' },
  dog:                 { path: 'poly-pizza/animals/animal-kit/Dog.glb' },
  corgi:               { path: 'poly-pizza/animals/animal-kit/Corgi.glb' },
  frog:                { path: 'poly-pizza/animals/animal-kit/Frog.glb' },
  duck:                { path: 'poly-pizza/animals/animal-kit/Duck.glb' },
  rabbit:              { path: 'poly-pizza/animals/animal-kit/Rabbit.glb' },
  sheep:               { path: 'poly-pizza/animals/animal-kit/Sheep.glb' },
  cow:                 { path: 'poly-pizza/animals/animal-kit/Cow.glb' },
  horse:               { path: 'poly-pizza/animals/animal-kit/Horse.glb' },
  bear:                { path: 'poly-pizza/animals/animal-kit/Bear.glb' },
  fox:                 { path: 'poly-pizza/animals/animal-kit/Fox.glb' },
  penguin:             { path: 'poly-pizza/animals/animal-kit/Penguin.glb' },
  shark:               { path: 'poly-pizza/animals/animal-kit/Shark.glb' },
  deer:                { path: 'poly-pizza/animals/animal-kit/Deer.glb' },
  pig:                 { path: 'poly-pizza/animals/farm-animal-pack/Pig.glb' },
  llama:               { path: 'poly-pizza/animals/farm-animal-pack/Llama.glb' },
  bird:                { path: 'tiny-treats/pretty-park/bird.gltf' },
  rubber_duck:         { path: 'poly-pizza/misc/cutes-part-one/Rubber Duck.glb' },

  // === NATURE / ENVIRONMENT ===
  tree:                { path: 'tiny-treats/pretty-park/tree.gltf', fallback: 'kaykit/packs/forest_nature/Tree_1_A_Color1.gltf' },
  tree_large:          { path: 'tiny-treats/pretty-park/tree_large.gltf' },
  tree_dead:           { path: 'kaykit/packs/halloween/tree_dead_large.gltf' },
  bush:                { path: 'tiny-treats/pretty-park/bush.gltf' },
  bush_large:          { path: 'tiny-treats/pretty-park/bush_large.gltf' },
  flower_A:            { path: 'tiny-treats/pretty-park/flower_A.gltf' },
  flower_B:            { path: 'tiny-treats/pretty-park/flower_B.gltf' },
  fountain:            { path: 'tiny-treats/pretty-park/fountain.gltf' },
  mushroom:            { path: 'kaykit/packs/forest_nature/Mushroom_1_A_Color1.gltf' },
  rock:                { path: 'kaykit/packs/dungeon/rocks.gltf' },
  crystal_big:         { path: 'quaternius/game-mechanics/Crystal_Big.gltf' },
  crystal_small:       { path: 'quaternius/game-mechanics/Crystal_Small.gltf' },

  // === CONCERT / MUSIC ===
  stage:               { path: 'poly-pizza/misc/concert-pack/Stage.glb' },
  concert_stage:       { path: 'poly-pizza/misc/concert-pack/Concert Stage.glb' },
  microphone:          { path: 'poly-pizza/misc/concert-pack/Mic.glb' },
  speaker:             { path: 'poly-pizza/misc/concert-pack/Speaker.glb' },
  spotlight:           { path: 'poly-pizza/misc/concert-pack/Spotlight.glb' },
  barricade:           { path: 'poly-pizza/misc/concert-pack/Barricade.glb' },

  // === SPACE ===
  dropship:            { path: 'kaykit/packs/space_base/dropship.gltf' },
  dome:                { path: 'kaykit/packs/space_base/dome.gltf' },
  solar_panel:         { path: 'kaykit/packs/space_base/solarpanel.gltf' },
  spacetruck:          { path: 'kaykit/packs/space_base/spacetruck.gltf' },
  lander:              { path: 'kaykit/packs/space_base/lander_A.gltf' },
  cannon:              { path: 'quaternius/game-mechanics/Cannon.gltf' },
  cannonball:          { path: 'quaternius/game-mechanics/Cannonball.gltf' },

  // === TREASURE / MAGIC / ITEMS ===
  gem_blue:            { path: 'quaternius/items/Gem_Blue.gltf' },
  gem_green:           { path: 'quaternius/items/Gem_Green.gltf' },
  gem_pink:            { path: 'quaternius/items/Gem_Pink.gltf' },
  heart:               { path: 'quaternius/items/Heart.gltf' },
  star:                { path: 'quaternius/items/Star.gltf' },
  coins:               { path: 'quaternius/items/Prop_Coins.gltf' },
  gold_bag:            { path: 'quaternius/items/Prop_GoldBag.gltf' },
  chest_open:          { path: 'quaternius/game-mechanics/Chest_Open.gltf' },
  chest_closed:        { path: 'quaternius/game-mechanics/Chest_Closed.gltf' },
  goal_flag:           { path: 'quaternius/game-mechanics/Goal_Flag.gltf' },
  book_blue:           { path: 'poly-pizza/fantasy/fantasy-bundle/Book Blue.glb' },
  book_red:            { path: 'poly-pizza/fantasy/fantasy-bundle/Book Red.glb' },

  // === PICNIC ===
  picnic_blanket:      { path: 'tiny-treats/pleasant-picnic/picnic_blanket_red.gltf' },
  picnic_basket:       { path: 'tiny-treats/pleasant-picnic/picnic_basket_round.gltf' },
  serving_tray:        { path: 'tiny-treats/pleasant-picnic/serving_tray_round.gltf' },
  cooler:              { path: 'tiny-treats/pleasant-picnic/cooler.gltf' },
  frisbee:             { path: 'tiny-treats/pleasant-picnic/frisbee.gltf' },
  radio:               { path: 'tiny-treats/pleasant-picnic/radio.gltf' },

  // === PLAYGROUND / TOYS ===
  teddy_bear:          { path: 'tiny-treats/playful-bedroom/teddy_bear.gltf' },
  soccer_ball:         { path: 'tiny-treats/playful-bedroom/soccer_ball.gltf' },
  rubiks_cube:         { path: 'tiny-treats/playful-bedroom/rubicks_cube_A.gltf' },
  piggybank:           { path: 'tiny-treats/playful-bedroom/piggybank.gltf' },
  play_block:          { path: 'tiny-treats/playful-bedroom/play_block_A.gltf' },
  basketball:          { path: 'kaykit/packs/holiday/basketball.gltf' },
  football:            { path: 'kaykit/packs/holiday/football.gltf' },

  // === ULTIMATE FALLBACKS ===
  gift:                { path: 'kaykit/packs/block/gift.gltf' },
  dynamite:            { path: 'kaykit/packs/block/dynamite.gltf' },
  mystery_crate:       { path: 'kaykit/packs/dungeon/box_small_decorated.gltf' },
};

// ─── TAG-TO-ASSET CATEGORY MAP ──────────────────────────────────────────────

export const TAG_TO_ASSETS: Record<string, string[]> = {
  // Food tags
  food_pizza:     ['pizza', 'pizza_slice', 'pizza_box'],
  food_cake:      ['cookie', 'gingerbread_house'],
  food_burger:    ['burger'],
  food_soup:      ['stew', 'stew_pot'],
  food_feast:     ['dinner_plate', 'plate_food', 'sandwich'],
  food_icecream:  ['icecream_chocolate', 'icecream_strawberry', 'icecream_vanilla', 'icecream_stack'],
  food_fruit:     ['apple', 'banana', 'grapes', 'peach', 'melon'],
  food_sushi:     ['sushi'],
  food_candy:     ['candy_blue', 'candy_green', 'candy_orange', 'candy_pink', 'candy_purple', 'lollipop', 'candycorn'],
  food_ingredient:['tomato', 'cheese', 'lettuce', 'carrot', 'potato', 'mushroom_food', 'onion_rings'],

  // Entertainment tags
  ent_magic:      ['potion_red', 'potion_blue', 'crystal_bowl', 'book_blue'],
  ent_music:      ['microphone', 'speaker', 'stage', 'spotlight', 'radio'],
  ent_combat:     ['sword', 'shield', 'bow', 'spear', 'sword_shield'],
  ent_cooking:    ['pot', 'pan', 'cutting_board', 'oven', 'rolling_pin', 'pizza_oven'],
  ent_sports:     ['soccer_ball', 'basketball', 'football', 'frisbee'],
  ent_treasure:   ['chest_gold', 'chest_large', 'coins', 'gold_bag', 'gem_blue', 'gem_pink'],
  ent_fishing:    ['fishing_rod'],
  ent_fireworks:  ['dynamite', 'cannonball', 'cannon'],

  // Vibe tags
  vibe_spooky:    ['pumpkin_jackolantern', 'skull', 'coffin', 'gravestone', 'bone_A', 'ribcage', 'candle_triple', 'scarecrow'],
  vibe_fancy:     ['banner_shield', 'chest_gold', 'pillar', 'banner_triple', 'wreath', 'chair_fancy', 'rug'],
  vibe_wild:      ['dynamite', 'barrel', 'crate_stack', 'wagon', 'tractor', 'cannon'],
  vibe_chill:     ['picnic_blanket', 'pillow', 'armchair', 'flower_A', 'fountain', 'bird', 'teddy_bear'],
  vibe_epic:      ['sword_shield_gold', 'banner_red', 'chest_large', 'pillar', 'torch', 'goal_flag'],
  vibe_silly:     ['rubber_duck', 'chicken', 'play_block', 'piggybank', 'gingerbread_man'],

  // Throw/projectile
  throw_food:     ['pizza_slice', 'tomato', 'apple', 'cheese', 'onion_rings', 'banana'],
  throw_object:   ['snowball', 'barrel_small', 'bucket', 'book_brown', 'pillow'],
  throw_magic:    ['potion_red', 'potion_blue', 'potion_green', 'crystal_small'],

  // Rain from sky
  rain_food:      ['pizza_slice', 'tomato', 'apple', 'banana', 'cheese_slice', 'onion_rings', 'mushroom_food'],
  rain_candy:     ['candy_blue', 'candy_green', 'candy_orange', 'candy_pink', 'lollipop', 'candycorn'],
  rain_presents:  ['present_red', 'present_blue', 'present_green', 'present_yellow'],
  rain_treasure:  ['coin', 'gem_blue', 'gem_green', 'gem_pink', 'star'],
  rain_chaos:     ['barrel_small', 'crate_small', 'bucket', 'snowball', 'dynamite'],

  // Crowd characters
  crowd_skeleton: ['skeleton_warrior', 'skeleton_mage', 'skeleton_minion', 'skeleton_rogue'],
  crowd_heroes:   ['knight', 'mage', 'barbarian', 'ranger', 'rogue'],
  crowd_weird:    ['clown', 'robot', 'superhero', 'ninja', 'caveman', 'space_ranger'],
  crowd_spooky:   ['necromancer', 'witch', 'vampire', 'skeleton_golem'],

  // Animals
  animal_farm:    ['chicken', 'cow', 'pig', 'sheep', 'horse', 'duck'],
  animal_pet:     ['cat', 'dog', 'corgi', 'rabbit'],
  animal_wild:    ['bear', 'fox', 'deer'],
  animal_chaos:   ['frog', 'llama', 'shark'],
  animal_cute:    ['chick', 'penguin', 'rubber_duck', 'bird'],
};

// ─── FUZZY KEYWORD MAP ──────────────────────────────────────────────────────

const FUZZY_MAP: Record<string, string> = {
  food: 'dinner_plate',
  eat: 'sandwich',
  drink: 'mug',
  weapon: 'sword',
  magic: 'potion_red',
  nature: 'tree',
  plant: 'flower_A',
  fire: 'torch',
  water: 'mug',
  treasure: 'chest',
  scary: 'skull',
  party: 'present_red',
  gift: 'present_red',
  light: 'candle',
  dark: 'skull',
  build: 'crate_large',
  destroy: 'dynamite',
};

// ─── RESOLUTION FUNCTION ────────────────────────────────────────────────────

export interface ResolvedAsset {
  path: string;
  scale?: number;
}

/**
 * Resolve a semantic asset tag to an actual 3D model path.
 * 3-tier fallback: direct match → fuzzy keyword → mystery_crate
 */
export function resolveAssetTag(tag: string): ResolvedAsset {
  // 1. Direct match
  const entry = ASSET_SUBS[tag];
  if (entry) {
    return { path: entry.path };
  }

  // 2. Check TAG_TO_ASSETS category — pick first available
  const categoryAssets = TAG_TO_ASSETS[tag];
  if (categoryAssets && categoryAssets.length > 0) {
    const randomKey = categoryAssets[Math.floor(Math.random() * categoryAssets.length)];
    const catEntry = ASSET_SUBS[randomKey];
    if (catEntry) return { path: catEntry.path };
  }

  // 3. Fuzzy keyword match
  const lowerTag = tag.toLowerCase();
  for (const [keyword, mappedTag] of Object.entries(FUZZY_MAP)) {
    if (lowerTag.includes(keyword)) {
      const fuzzyEntry = ASSET_SUBS[mappedTag];
      if (fuzzyEntry) return { path: fuzzyEntry.path };
    }
  }

  // 4. Ultimate fallback — mystery crate
  console.warn(`[asset-subs] No match for "${tag}", using mystery_crate`);
  return { path: ASSET_SUBS.mystery_crate.path };
}
