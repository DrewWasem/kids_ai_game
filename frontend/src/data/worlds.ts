/**
 * World Definitions — sandbox world configs for all 7 quest zones.
 *
 * Each world defines its characters, props, animations, effects, sounds,
 * and the system prompt template used to call Claude for sandbox play.
 * Replaces the old per-task prompt files and story/stage system.
 */

export interface WorldConfig {
  id: string;
  label: string;
  emoji: string;
  color: string;
  hook: string;
  placeholder: string;
  characters: string[];
  props: string[];
  animations: string[];
  effects: string[];
  sounds: string[];
}

export const WORLDS: Record<string, WorldConfig> = {
  'skeleton-birthday': {
    id: 'skeleton-birthday',
    label: "Skeleton's Birthday Bash",
    emoji: '\u{1F480}',
    color: '#7C3AED',
    hook: "It's the Skeleton's birthday and nobody knows what to do! You're in charge!",
    placeholder: "What should happen at the skeleton's birthday party?",
    characters: ['skeleton_warrior', 'skeleton_mage', 'knight', 'mage', 'clown', 'robot'],
    props: ['cake', 'present_A_red', 'present_B_blue', 'table_long', 'chair', 'balloon', 'torch', 'barrel', 'banner_blue', 'banner_red'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Cheering', 'Waving',
      'Sit_Chair_Down', 'Sit_Chair_Idle', 'Hit_A', 'Interact', 'PickUp', 'Throw',
      'Skeletons_Taunt', 'Skeletons_Idle', 'Skeletons_Awaken_Floor', 'Skeletons_Death_Resurrect',
      'Jump_Full_Short', 'Push_Ups', 'Headbutt', 'Death_A',
    ],
    effects: ['confetti-burst', 'explosion-cartoon', 'hearts-float', 'stars-spin', 'question-marks', 'laugh-tears', 'sparkle-magic', 'sad-cloud'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },

  'knight-space': {
    id: 'knight-space',
    label: 'Space Station Emergency',
    emoji: '\u{1F680}',
    color: '#3B82F6',
    hook: "The space station is drifting and the robots are floating around doing nothing! Fix this mess!",
    placeholder: "How do you fix the space station? Who does what?",
    characters: ['space_ranger', 'robot', 'robot_two', 'engineer', 'knight'],
    props: ['rocket', 'basemodule_A', 'cargo_A', 'solarpanel', 'dome', 'flag'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Cheering', 'Waving',
      'Interact', 'PickUp', 'Throw', 'Hammer', 'Hammering',
      'Jump_Full_Short', 'Jump_Idle', 'Jump_Full_Long',
      'Work_A', 'Work_B', 'Working_A',
    ],
    effects: ['confetti-burst', 'explosion-cartoon', 'stars-spin', 'question-marks', 'sparkle-magic', 'fire-sneeze'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },

  'barbarian-school': {
    id: 'barbarian-school',
    label: 'Monster Recess',
    emoji: '\u{1F3C3}',
    color: '#EF4444',
    hook: "The monsters got to the playground and recess is WILD! What happens?",
    placeholder: "What happens at monster recess? Who plays what?",
    characters: ['barbarian', 'clown', 'ninja', 'robot', 'caveman'],
    props: ['slide', 'swing', 'seesaw', 'sandbox', 'merry_go_round', 'fence', 'tree'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Running_B', 'Cheering', 'Waving',
      'Jump_Full_Short', 'Jump_Full_Long', 'Jump_Start', 'Jump_Land',
      'Interact', 'PickUp', 'Throw', 'Push_Ups', 'Headbutt',
      'Sit_Floor_Down', 'Sit_Floor_Idle',
    ],
    effects: ['confetti-burst', 'explosion-cartoon', 'laugh-tears', 'question-marks', 'stars-spin', 'hearts-float'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },

  'skeleton-pizza': {
    id: 'skeleton-pizza',
    label: 'Pizza Pandemonium',
    emoji: '\u{1F355}',
    color: '#FBBF24',
    hook: "Orders are flying in and nobody can cook! Run this restaurant before it burns down!",
    placeholder: "How do you save the restaurant? Who cooks what?",
    characters: ['skeleton_warrior', 'clown', 'superhero', 'survivalist'],
    props: ['pizza', 'pizza_pepperoni', 'oven', 'plate', 'pan', 'pot', 'stove', 'chair_A'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Running_B', 'Cheering', 'Waving',
      'Interact', 'PickUp', 'Throw', 'Work_A', 'Working_A',
      'Skeletons_Taunt', 'Skeletons_Idle',
      'Hit_A', 'Jump_Full_Short',
    ],
    effects: ['confetti-burst', 'explosion-cartoon', 'fire-sneeze', 'laugh-tears', 'question-marks', 'stars-spin'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },

  'adventurers-picnic': {
    id: 'adventurers-picnic',
    label: 'Forest Mystery',
    emoji: '\u{1F332}',
    color: '#22C55E',
    hook: "The adventurers found a strange clearing in the forest! Something magical is happening...",
    placeholder: "What magical thing is happening in the forest? What do the adventurers do?",
    characters: ['ranger', 'druid', 'barbarian', 'ninja', 'rogue'],
    props: ['tree', 'rock', 'bush', 'torch', 'bench', 'picnic_blanket', 'apple', 'basket'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Cheering', 'Waving',
      'Interact', 'PickUp', 'Throw', 'Sneaking', 'Crouching',
      'Ranged_Bow_Draw', 'Ranged_Bow_Release',
      'Sit_Floor_Down', 'Sit_Floor_Idle', 'Lie_Down', 'Lie_Idle',
    ],
    effects: ['confetti-burst', 'sparkle-magic', 'hearts-float', 'stars-spin', 'question-marks', 'splash', 'sad-cloud'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },

  'dungeon-concert': {
    id: 'dungeon-concert',
    label: 'Dungeon Escape',
    emoji: '\u{1F5DD}',
    color: '#F97316',
    hook: "You're trapped in a dungeon! There's a locked chest, a sleeping guard, and a secret door. What do you do?",
    placeholder: "How do you escape the dungeon? What's your plan?",
    characters: ['knight', 'mage', 'rogue', 'skeleton_warrior', 'necromancer'],
    props: ['chest', 'barrel', 'torch', 'banner_blue', 'banner_red', 'table_long', 'bone', 'book', 'potion'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Cheering', 'Waving',
      'Interact', 'PickUp', 'Throw', 'Sneaking', 'Crouching',
      'Melee_1H_Attack_Chop', 'Melee_1H_Attack_Stab', 'Melee_Block',
      'Ranged_Magic_Spellcasting', 'Ranged_Magic_Shoot',
      'Lockpick', 'Lockpicking',
      'Skeletons_Awaken_Floor', 'Skeletons_Taunt',
    ],
    effects: ['confetti-burst', 'explosion-cartoon', 'sparkle-magic', 'stars-spin', 'question-marks', 'fire-sneeze', 'sad-cloud'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },

  'mage-kitchen': {
    id: 'mage-kitchen',
    label: 'Cooking Catastrophe',
    emoji: '\u{1F9D9}',
    color: '#A855F7',
    hook: "The mage tried to cook with magic and now the kitchen is ALIVE! Tame it!",
    placeholder: "How does the mage tame the wild kitchen? What spells help?",
    characters: ['mage', 'witch', 'caveman', 'superhero', 'skeleton_minion'],
    props: ['stove', 'sink', 'fridge', 'pot', 'pan', 'cake', 'pie', 'bread', 'plate'],
    animations: [
      'Idle_A', 'Walking_A', 'Running_A', 'Cheering', 'Waving',
      'Interact', 'PickUp', 'Throw',
      'Ranged_Magic_Spellcasting', 'Ranged_Magic_Spellcasting_Long', 'Ranged_Magic_Shoot', 'Ranged_Magic_Summon',
      'Hit_A', 'Hit_B', 'Jump_Full_Short',
      'Skeletons_Idle',
    ],
    effects: ['confetti-burst', 'explosion-cartoon', 'sparkle-magic', 'fire-sneeze', 'stars-spin', 'question-marks', 'laugh-tears', 'splash'],
    sounds: ['spawn', 'move', 'react', 'success', 'partial', 'fail'],
  },
};

/**
 * Generate the sandbox system prompt for a given zone.
 * Single parameterized template — replaces 7 separate prompt files.
 */
export function getWorldPrompt(zoneId: string): string {
  const world = WORLDS[zoneId];
  if (!world) {
    console.warn(`[worlds] Unknown zone "${zoneId}" — falling back to skeleton-birthday`);
    return getWorldPrompt('skeleton-birthday');
  }

  return `You are the game engine for "Quest AI," a children's sandbox game (ages 7-11) that teaches prompt engineering through creative play.

CURRENT WORLD: ${world.label}
SCENARIO: ${world.hook}

This is a SANDBOX — there are no right or wrong answers. Every input produces something.
- Vague prompts ("do stuff") → funny, silly results
- Specific prompts → impressive, detailed scenes
- The more detail the child gives, the cooler the result

EVALUATE the child's input and return ONLY a JSON object. No markdown, no explanation.

JSON FORMAT:
{
  "success_level": "FULL_SUCCESS" or "PARTIAL_SUCCESS" or "FUNNY_FAIL",
  "narration": "One fun sentence describing what happens (under 20 words)",
  "actions": [
    { "type": "spawn", "target": "character_or_prop", "position": "left" },
    { "type": "move", "target": "character_or_prop", "to": "center", "style": "arc" },
    { "type": "animate", "target": "character", "anim": "Cheering" },
    { "type": "react", "effect": "confetti-burst", "position": "center" }
  ],
  "prompt_feedback": "Encouraging feedback with one concrete tip to try next",
  "guide_hint": "A friendly suggestion for what to try (e.g. 'Try telling me WHO should do something and HOW they do it!')",
  "prompt_analysis": {
    "has_character": true,
    "has_action": true,
    "has_sequence": false,
    "has_detail": false,
    "has_multi_char": false,
    "has_environment": false
  }
}

SKILL DETECTION (for prompt_analysis):
- has_character: Did they name a specific character? (e.g. "the skeleton" or "the knight")
- has_action: Did they describe a specific action? (e.g. "dances" or "picks up the cake")
- has_sequence: Did they describe events in order? (e.g. "first... then... finally...")
- has_detail: Did they add descriptive details? (e.g. "a GIANT cake" or "slowly sneaks")
- has_multi_char: Did they involve 2+ characters interacting?
- has_environment: Did they reference the setting or props in the world?

SUCCESS LEVEL MAPPING:
- FUNNY_FAIL (0-1 skills): Vague input → something silly and unexpected happens. The characters are confused or do something random. Make it FUNNY, never mean.
- PARTIAL_SUCCESS (2-3 skills): Decent input → the scene works but could be more detailed. Characters do what was asked but in a basic way.
- FULL_SUCCESS (4+ skills): Specific input → an impressive, detailed scene. Characters do exactly what was described with flair.

CHARACTERS ON STAGE (use these exact names):
${world.characters.map(c => `- ${c}`).join('\n')}

AVAILABLE PROPS (use these exact names):
${world.props.map(p => `- ${p}`).join('\n')}

AVAILABLE ANIMATIONS (use these exact names):
${world.animations.map(a => `- ${a}`).join('\n')}

AVAILABLE REACTIONS (use these exact names):
${world.effects.map(e => `- ${e}`).join('\n')}

AVAILABLE POSITIONS:
- left, center, right, top, bottom, off-left, off-right, off-top

AVAILABLE MOVE STYLES:
- linear, arc, bounce, float, shake, spin-in, drop-in

RULES:
- Maximum 6 actions in the actions array
- ONLY use character names, prop names, animations, and reactions from the lists above
- NEVER invent new asset names
- narration must be fun, silly, and under 20 words
- For FUNNY_FAIL: make it silly and surprising, NEVER mean or scary
- prompt_feedback should be encouraging and give ONE specific tip
- guide_hint should suggest what kind of detail to add next (character names, actions, sequence, description)
- prompt_analysis must accurately reflect what skills the child demonstrated
- RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT.`;
}
