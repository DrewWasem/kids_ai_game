/**
 * Quest Stage Definitions — template sentences, slots, default options, and vignette links.
 *
 * Each quest zone has 1-3 stages. Stage 1 is always defined; stages 2-3 added as content grows.
 * Claude generates fresh options on stage entry; defaultOptions are the static fallback.
 */

import type { QuestStage } from '../types/madlibs';
import { SKELETON_BIRTHDAY_STAGE_1, SKELETON_BIRTHDAY_DEFAULT } from './vignettes/skeleton-birthday';
import { KNIGHT_SPACE_STAGE_1, KNIGHT_SPACE_DEFAULT } from './vignettes/knight-space';
import { BARBARIAN_SCHOOL_STAGE_1, BARBARIAN_SCHOOL_DEFAULT } from './vignettes/barbarian-school';
import { SKELETON_PIZZA_STAGE_1, SKELETON_PIZZA_DEFAULT } from './vignettes/skeleton-pizza';
import { ADVENTURERS_PICNIC_STAGE_1, ADVENTURERS_PICNIC_DEFAULT } from './vignettes/adventurers-picnic';
import { DUNGEON_CONCERT_STAGE_1, DUNGEON_CONCERT_DEFAULT } from './vignettes/dungeon-concert';
import { MAGE_KITCHEN_STAGE_1, MAGE_KITCHEN_DEFAULT } from './vignettes/mage-kitchen';

// ─── SKELETON BIRTHDAY ──────────────────────────────────────────────────────

export const SKELETON_BIRTHDAY_STAGES: QuestStage[] = [
  {
    id: 'skeleton-birthday-1',
    questId: 'skeleton-birthday',
    stageNumber: 1,
    title: "The Skeleton's Birthday Bash",
    intro: "It's the Skeleton's birthday and nobody knows what to do! You're in charge of planning the party!",
    template: {
      sentence: "Plan a party with {FOOD} and {ENTERTAINMENT} for a {VIBE} birthday",
      slots: [
        {
          id: 'FOOD',
          label: 'Party Food',
          icon: '🍽️',
          allowedTags: ['cake', 'pizza', 'feast', 'fruit', 'candy', 'soup'],
          defaultOptions: [
            { label: 'Birthday Cake', tag: 'cake', icon: '🎂' },
            { label: 'Pizza Party', tag: 'pizza', icon: '🍕' },
            { label: 'Royal Feast', tag: 'feast', icon: '🍖' },
            { label: 'Fruit Platter', tag: 'fruit', icon: '🍎' },
            { label: 'Candy Mountain', tag: 'candy', icon: '🍬' },
            { label: 'Bone Soup', tag: 'soup', icon: '🍲' },
          ],
        },
        {
          id: 'ENTERTAINMENT',
          label: 'Entertainment',
          icon: '🎪',
          allowedTags: ['magic_show', 'fireworks', 'music', 'combat', 'dance', 'games'],
          defaultOptions: [
            { label: 'Magic Show', tag: 'magic_show', icon: '🪄' },
            { label: 'Fireworks', tag: 'fireworks', icon: '🎆' },
            { label: 'Live Music', tag: 'music', icon: '🎵' },
            { label: 'Arena Combat', tag: 'combat', icon: '⚔️' },
            { label: 'Dance-Off', tag: 'dance', icon: '💃' },
            { label: 'Party Games', tag: 'games', icon: '🎯' },
          ],
        },
        {
          id: 'VIBE',
          label: 'Party Vibe',
          icon: '✨',
          allowedTags: ['spooky', 'epic', 'wild', 'silly', 'fancy', 'chill'],
          defaultOptions: [
            { label: 'Spooky', tag: 'spooky', icon: '👻' },
            { label: 'Epic', tag: 'epic', icon: '⚡' },
            { label: 'Wild', tag: 'wild', icon: '🔥' },
            { label: 'Silly', tag: 'silly', icon: '🤪' },
            { label: 'Fancy', tag: 'fancy', icon: '🎩' },
            { label: 'Chill', tag: 'chill', icon: '😎' },
          ],
        },
      ],
    },
    vignettes: SKELETON_BIRTHDAY_STAGE_1,
    defaultVignette: SKELETON_BIRTHDAY_DEFAULT,
    successTags: [['cake', 'magic_show', 'spooky'], ['feast', 'fireworks', 'epic']],
  },
];

// ─── KNIGHT SPACE ───────────────────────────────────────────────────────────

export const KNIGHT_SPACE_STAGES: QuestStage[] = [
  {
    id: 'knight-space-1',
    questId: 'knight-space',
    stageNumber: 1,
    title: 'Space Station Emergency',
    intro: "The space station is drifting and the robots are floating around doing nothing! Fix this mess!",
    template: {
      sentence: "Fix the station by having {CREW} do {TASK} using the {TOOL}",
      slots: [
        {
          id: 'CREW',
          label: 'Crew Member',
          icon: '🧑‍🚀',
          allowedTags: ['ranger', 'robot', 'engineer', 'knight', 'everyone'],
          defaultOptions: [
            { label: 'Space Ranger', tag: 'ranger', icon: '🚀' },
            { label: 'Robot Helper', tag: 'robot', icon: '🤖' },
            { label: 'Engineer', tag: 'engineer', icon: '🔧' },
            { label: 'Knight', tag: 'knight', icon: '🛡️' },
            { label: 'Everyone!', tag: 'everyone', icon: '👥' },
          ],
        },
        {
          id: 'TASK',
          label: 'Emergency Task',
          icon: '⚠️',
          allowedTags: ['repair', 'launch', 'build', 'rescue', 'explore', 'defend'],
          defaultOptions: [
            { label: 'Repair Hull', tag: 'repair', icon: '🔩' },
            { label: 'Launch Rocket', tag: 'launch', icon: '🚀' },
            { label: 'Build Module', tag: 'build', icon: '🏗️' },
            { label: 'Rescue Crew', tag: 'rescue', icon: '🆘' },
            { label: 'Explore Outside', tag: 'explore', icon: '🔭' },
            { label: 'Defend Station', tag: 'defend', icon: '🛡️' },
          ],
        },
        {
          id: 'TOOL',
          label: 'Equipment',
          icon: '🛠️',
          allowedTags: ['solar_panel', 'cargo', 'dome', 'rocket', 'flag', 'laser'],
          defaultOptions: [
            { label: 'Solar Panel', tag: 'solar_panel', icon: '☀️' },
            { label: 'Cargo Crate', tag: 'cargo', icon: '📦' },
            { label: 'Space Dome', tag: 'dome', icon: '🔮' },
            { label: 'Rocket Booster', tag: 'rocket', icon: '🚀' },
            { label: 'Space Flag', tag: 'flag', icon: '🚩' },
            { label: 'Laser Beam', tag: 'laser', icon: '⚡' },
          ],
        },
      ],
    },
    vignettes: KNIGHT_SPACE_STAGE_1,
    defaultVignette: KNIGHT_SPACE_DEFAULT,
  },
];

export const BARBARIAN_SCHOOL_STAGES: QuestStage[] = [
  {
    id: 'barbarian-school-1',
    questId: 'barbarian-school',
    stageNumber: 1,
    title: 'Monster Recess',
    intro: "The monsters got to the playground and recess is WILD! What happens?",
    template: {
      sentence: "At recess, {MONSTER} plays {ACTIVITY} on the {EQUIPMENT}",
      slots: [
        {
          id: 'MONSTER',
          label: 'Monster',
          icon: '👹',
          allowedTags: ['barbarian', 'clown', 'ninja', 'robot', 'caveman', 'everyone'],
          defaultOptions: [
            { label: 'Barbarian', tag: 'barbarian', icon: '🪓' },
            { label: 'Clown', tag: 'clown', icon: '🤡' },
            { label: 'Ninja', tag: 'ninja', icon: '🥷' },
            { label: 'Robot', tag: 'robot', icon: '🤖' },
            { label: 'Caveman', tag: 'caveman', icon: '🦴' },
            { label: 'All of Them!', tag: 'everyone', icon: '👥' },
          ],
        },
        {
          id: 'ACTIVITY',
          label: 'Game',
          icon: '🏃',
          allowedTags: ['tag', 'wrestling', 'hide_seek', 'race', 'jumping', 'climbing'],
          defaultOptions: [
            { label: 'Tag', tag: 'tag', icon: '🏷️' },
            { label: 'Wrestling', tag: 'wrestling', icon: '🤼' },
            { label: 'Hide & Seek', tag: 'hide_seek', icon: '🙈' },
            { label: 'Racing', tag: 'race', icon: '🏁' },
            { label: 'Jumping Contest', tag: 'jumping', icon: '🦘' },
            { label: 'Climbing', tag: 'climbing', icon: '🧗' },
          ],
        },
        {
          id: 'EQUIPMENT',
          label: 'Playground',
          icon: '🎢',
          allowedTags: ['slide', 'swing', 'seesaw', 'sandbox', 'merry_go_round', 'field'],
          defaultOptions: [
            { label: 'Giant Slide', tag: 'slide', icon: '🛝' },
            { label: 'Swing Set', tag: 'swing', icon: '🎐' },
            { label: 'Seesaw', tag: 'seesaw', icon: '⚖️' },
            { label: 'Sandbox', tag: 'sandbox', icon: '🏖️' },
            { label: 'Merry-Go-Round', tag: 'merry_go_round', icon: '🎠' },
            { label: 'Open Field', tag: 'field', icon: '🌿' },
          ],
        },
      ],
    },
    vignettes: BARBARIAN_SCHOOL_STAGE_1,
    defaultVignette: BARBARIAN_SCHOOL_DEFAULT,
  },
];

// ─── SKELETON PIZZA ─────────────────────────────────────────────────────────

export const SKELETON_PIZZA_STAGES: QuestStage[] = [
  {
    id: 'skeleton-pizza-1',
    questId: 'skeleton-pizza',
    stageNumber: 1,
    title: 'Pizza Pandemonium',
    intro: "Orders are flying in and nobody can cook! Run this restaurant before it burns down!",
    template: {
      sentence: "Have {CHEF} cook {DISH} in the most {STYLE} way possible",
      slots: [
        {
          id: 'CHEF',
          label: 'Chef',
          icon: '👨‍🍳',
          allowedTags: ['skeleton', 'clown', 'superhero', 'survivalist', 'everyone'],
          defaultOptions: [
            { label: 'Skeleton Chef', tag: 'skeleton', icon: '💀' },
            { label: 'Clown Cook', tag: 'clown', icon: '🤡' },
            { label: 'Super Chef', tag: 'superhero', icon: '🦸' },
            { label: 'Survivalist', tag: 'survivalist', icon: '🏕️' },
            { label: 'All Chefs!', tag: 'everyone', icon: '👥' },
          ],
        },
        {
          id: 'DISH',
          label: 'Dish',
          icon: '🍽️',
          allowedTags: ['pizza', 'pepperoni', 'pasta', 'soup', 'cake', 'mystery'],
          defaultOptions: [
            { label: 'Classic Pizza', tag: 'pizza', icon: '🍕' },
            { label: 'Pepperoni Deluxe', tag: 'pepperoni', icon: '🍕' },
            { label: 'Spaghetti Tower', tag: 'pasta', icon: '🍝' },
            { label: 'Cauldron Soup', tag: 'soup', icon: '🍲' },
            { label: 'Layer Cake', tag: 'cake', icon: '🎂' },
            { label: 'Mystery Dish', tag: 'mystery', icon: '❓' },
          ],
        },
        {
          id: 'STYLE',
          label: 'Style',
          icon: '🎨',
          allowedTags: ['fast', 'fancy', 'chaotic', 'explosive', 'sneaky', 'dramatic'],
          defaultOptions: [
            { label: 'Speed Run', tag: 'fast', icon: '⚡' },
            { label: 'Fancy Plating', tag: 'fancy', icon: '✨' },
            { label: 'Total Chaos', tag: 'chaotic', icon: '🌪️' },
            { label: 'Explosive', tag: 'explosive', icon: '💥' },
            { label: 'Sneaky', tag: 'sneaky', icon: '🤫' },
            { label: 'Dramatic', tag: 'dramatic', icon: '🎭' },
          ],
        },
      ],
    },
    vignettes: SKELETON_PIZZA_STAGE_1,
    defaultVignette: SKELETON_PIZZA_DEFAULT,
  },
];

// ─── ADVENTURERS PICNIC ─────────────────────────────────────────────────────

export const ADVENTURERS_PICNIC_STAGES: QuestStage[] = [
  {
    id: 'adventurers-picnic-1',
    questId: 'adventurers-picnic',
    stageNumber: 1,
    title: 'Forest Mystery',
    intro: "The adventurers found a strange clearing in the forest! Something magical is happening...",
    template: {
      sentence: "The {ADVENTURER} discovers a {DISCOVERY} and reacts by {REACTION}",
      slots: [
        {
          id: 'ADVENTURER',
          label: 'Adventurer',
          icon: '🧝',
          allowedTags: ['ranger', 'druid', 'barbarian', 'ninja', 'rogue', 'whole_party'],
          defaultOptions: [
            { label: 'Ranger', tag: 'ranger', icon: '🏹' },
            { label: 'Druid', tag: 'druid', icon: '🌿' },
            { label: 'Barbarian', tag: 'barbarian', icon: '🪓' },
            { label: 'Ninja', tag: 'ninja', icon: '🥷' },
            { label: 'Rogue', tag: 'rogue', icon: '🗡️' },
            { label: 'Whole Party', tag: 'whole_party', icon: '👥' },
          ],
        },
        {
          id: 'DISCOVERY',
          label: 'Discovery',
          icon: '🔮',
          allowedTags: ['magic_portal', 'treasure', 'creature', 'enchanted_food', 'ancient_ruin', 'glowing_plant'],
          defaultOptions: [
            { label: 'Magic Portal', tag: 'magic_portal', icon: '🌀' },
            { label: 'Hidden Treasure', tag: 'treasure', icon: '💎' },
            { label: 'Forest Creature', tag: 'creature', icon: '🦊' },
            { label: 'Enchanted Feast', tag: 'enchanted_food', icon: '🍎' },
            { label: 'Ancient Ruin', tag: 'ancient_ruin', icon: '🏛️' },
            { label: 'Glowing Plant', tag: 'glowing_plant', icon: '🌱' },
          ],
        },
        {
          id: 'REACTION',
          label: 'Reaction',
          icon: '😲',
          allowedTags: ['investigate', 'celebrate', 'panic', 'cast_spell', 'set_trap', 'have_picnic'],
          defaultOptions: [
            { label: 'Investigating', tag: 'investigate', icon: '🔍' },
            { label: 'Celebrating', tag: 'celebrate', icon: '🎉' },
            { label: 'Panicking', tag: 'panic', icon: '😱' },
            { label: 'Casting Spells', tag: 'cast_spell', icon: '✨' },
            { label: 'Setting Traps', tag: 'set_trap', icon: '🪤' },
            { label: 'Having a Picnic', tag: 'have_picnic', icon: '🧺' },
          ],
        },
      ],
    },
    vignettes: ADVENTURERS_PICNIC_STAGE_1,
    defaultVignette: ADVENTURERS_PICNIC_DEFAULT,
  },
];

// ─── DUNGEON CONCERT ────────────────────────────────────────────────────────

export const DUNGEON_CONCERT_STAGES: QuestStage[] = [
  {
    id: 'dungeon-concert-1',
    questId: 'dungeon-concert',
    stageNumber: 1,
    title: 'Dungeon Escape',
    intro: "You're trapped in a dungeon! There's a locked chest, a sleeping guard, and a secret door. What do you do?",
    template: {
      sentence: "The {HERO} tries to {ESCAPE_METHOD} past the {OBSTACLE}",
      slots: [
        {
          id: 'HERO',
          label: 'Hero',
          icon: '⚔️',
          allowedTags: ['knight', 'mage', 'rogue', 'skeleton', 'necromancer', 'team'],
          defaultOptions: [
            { label: 'Knight', tag: 'knight', icon: '🛡️' },
            { label: 'Mage', tag: 'mage', icon: '🧙' },
            { label: 'Rogue', tag: 'rogue', icon: '🗡️' },
            { label: 'Skeleton', tag: 'skeleton', icon: '💀' },
            { label: 'Necromancer', tag: 'necromancer', icon: '☠️' },
            { label: 'The Team', tag: 'team', icon: '👥' },
          ],
        },
        {
          id: 'ESCAPE_METHOD',
          label: 'Escape Plan',
          icon: '🗝️',
          allowedTags: ['sneak', 'fight', 'magic', 'lockpick', 'distract', 'smash'],
          defaultOptions: [
            { label: 'Sneak Past', tag: 'sneak', icon: '🤫' },
            { label: 'Fight Through', tag: 'fight', icon: '⚔️' },
            { label: 'Use Magic', tag: 'magic', icon: '✨' },
            { label: 'Pick the Lock', tag: 'lockpick', icon: '🔑' },
            { label: 'Create Distraction', tag: 'distract', icon: '💨' },
            { label: 'Smash Everything', tag: 'smash', icon: '💥' },
          ],
        },
        {
          id: 'OBSTACLE',
          label: 'Obstacle',
          icon: '🚧',
          allowedTags: ['guard', 'locked_door', 'trap', 'darkness', 'puzzle', 'skeleton_army'],
          defaultOptions: [
            { label: 'Sleeping Guard', tag: 'guard', icon: '💤' },
            { label: 'Locked Door', tag: 'locked_door', icon: '🚪' },
            { label: 'Booby Trap', tag: 'trap', icon: '⚠️' },
            { label: 'Total Darkness', tag: 'darkness', icon: '🌑' },
            { label: 'Ancient Puzzle', tag: 'puzzle', icon: '🧩' },
            { label: 'Skeleton Army', tag: 'skeleton_army', icon: '💀' },
          ],
        },
      ],
    },
    vignettes: DUNGEON_CONCERT_STAGE_1,
    defaultVignette: DUNGEON_CONCERT_DEFAULT,
  },
];

// ─── MAGE KITCHEN ───────────────────────────────────────────────────────────

export const MAGE_KITCHEN_STAGES: QuestStage[] = [
  {
    id: 'mage-kitchen-1',
    questId: 'mage-kitchen',
    stageNumber: 1,
    title: 'Cooking Catastrophe',
    intro: "The mage tried to cook with magic and now the kitchen is ALIVE! Tame it!",
    template: {
      sentence: "Cast {SPELL} on the {APPLIANCE} to make it {RESULT}",
      slots: [
        {
          id: 'SPELL',
          label: 'Spell',
          icon: '🪄',
          allowedTags: ['fire_spell', 'ice_spell', 'grow_spell', 'shrink_spell', 'levitate', 'transform'],
          defaultOptions: [
            { label: 'Fireball', tag: 'fire_spell', icon: '🔥' },
            { label: 'Ice Blast', tag: 'ice_spell', icon: '❄️' },
            { label: 'Grow Big', tag: 'grow_spell', icon: '📈' },
            { label: 'Shrink Down', tag: 'shrink_spell', icon: '📉' },
            { label: 'Levitate', tag: 'levitate', icon: '🪶' },
            { label: 'Transform', tag: 'transform', icon: '🔄' },
          ],
        },
        {
          id: 'APPLIANCE',
          label: 'Target',
          icon: '🍳',
          allowedTags: ['stove', 'fridge', 'pot', 'pan', 'sink', 'oven'],
          defaultOptions: [
            { label: 'Wild Stove', tag: 'stove', icon: '🔥' },
            { label: 'Angry Fridge', tag: 'fridge', icon: '🧊' },
            { label: 'Bubbling Pot', tag: 'pot', icon: '🍲' },
            { label: 'Flying Pan', tag: 'pan', icon: '🍳' },
            { label: 'Leaky Sink', tag: 'sink', icon: '🚰' },
            { label: 'Haunted Oven', tag: 'oven', icon: '♨️' },
          ],
        },
        {
          id: 'RESULT',
          label: 'Result',
          icon: '✨',
          allowedTags: ['cook_perfectly', 'explode', 'dance', 'multiply', 'calm_down', 'go_wild'],
          defaultOptions: [
            { label: 'Cook Perfectly', tag: 'cook_perfectly', icon: '👨‍🍳' },
            { label: 'Explode!', tag: 'explode', icon: '💥' },
            { label: 'Dance Around', tag: 'dance', icon: '💃' },
            { label: 'Multiply', tag: 'multiply', icon: '✖️' },
            { label: 'Calm Down', tag: 'calm_down', icon: '😌' },
            { label: 'Go Even Wilder', tag: 'go_wild', icon: '🌪️' },
          ],
        },
      ],
    },
    vignettes: MAGE_KITCHEN_STAGE_1,
    defaultVignette: MAGE_KITCHEN_DEFAULT,
  },
];

// ─── MASTER REGISTRY ────────────────────────────────────────────────────────

/** All quest stages indexed by zone ID. */
export const QUEST_STAGES: Record<string, QuestStage[]> = {
  'skeleton-birthday': SKELETON_BIRTHDAY_STAGES,
  'knight-space': KNIGHT_SPACE_STAGES,
  'barbarian-school': BARBARIAN_SCHOOL_STAGES,
  'skeleton-pizza': SKELETON_PIZZA_STAGES,
  'adventurers-picnic': ADVENTURERS_PICNIC_STAGES,
  'dungeon-concert': DUNGEON_CONCERT_STAGES,
  'mage-kitchen': MAGE_KITCHEN_STAGES,
};

/** Get a specific stage, or the first stage for a quest zone. */
export function getQuestStage(questId: string, stageNumber = 1): QuestStage | null {
  const stages = QUEST_STAGES[questId];
  if (!stages) return null;
  return stages.find(s => s.stageNumber === stageNumber) ?? stages[0] ?? null;
}

/** Get all stages for a quest zone. */
export function getQuestStages(questId: string): QuestStage[] {
  return QUEST_STAGES[questId] ?? [];
}
