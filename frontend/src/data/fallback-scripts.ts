import type { SceneScript } from '../types/scene-script';

/**
 * Hardcoded fallback scripts — used as Tier 3 when cache misses AND API fails.
 * These guarantee the demo NEVER shows an error screen.
 */
export const FALLBACK_SCRIPTS: Record<string, SceneScript> = {
  'monster-party': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The monster tries to party, but something feels incomplete!',
    actions: [
      { type: 'spawn', target: 'cake', position: 'left' },
      { type: 'move', target: 'cake', to: 'center', style: 'arc' },
      { type: 'animate', target: 'monster', anim: 'confused', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['decorations', 'entertainment'],
    prompt_feedback: 'Good start! Try describing what KIND of party the monster should have — what decorations, food, and fun activities?',
  },

  'robot-pizza': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The robot picks up the pizza but looks lost!',
    actions: [
      { type: 'spawn', target: 'robot', position: 'left' },
      { type: 'spawn', target: 'pizza', position: 'center' },
      { type: 'move', target: 'robot', to: 'center', style: 'linear' },
      { type: 'animate', target: 'robot', anim: 'confused', duration_ms: 600 },
    ],
    missing_elements: ['delivery destination', 'obstacles to avoid'],
    prompt_feedback: 'Nice try! Tell the robot WHERE to deliver the pizza and what to watch out for on the way.',
  },

  'wizard-kitchen': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The wizard zaps the toaster, but the plates keep flying!',
    actions: [
      { type: 'spawn', target: 'toaster', position: 'right' },
      { type: 'spawn', target: 'plates', position: 'top' },
      { type: 'animate', target: 'wizard', anim: 'wave', duration_ms: 600 },
      { type: 'react', effect: 'sparkle-magic', position: 'right' },
    ],
    missing_elements: ['soup solution', 'fridge solution', 'plates solution'],
    prompt_feedback: 'Good start! Try describing HOW to fix each appliance — the plates, the soup, the toaster, and the fridge.',
  },

  'dinosaur-school': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The T-Rex squeezes through the door but breaks the desk!',
    actions: [
      { type: 'spawn', target: 'desk', position: 'center' },
      { type: 'move', target: 'trex', to: 'center', style: 'bounce' },
      { type: 'react', effect: 'explosion-cartoon', position: 'center' },
      { type: 'animate', target: 'trex', anim: 'sad', duration_ms: 600 },
    ],
    missing_elements: ['writing solution', 'sitting solution', 'eating solution'],
    prompt_feedback: 'Nice try! Think about each problem the T-Rex faces: the door, the desk, the pencil, and lunch.',
  },

  'dog-space': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The dog hops in the rocket but forgot the snacks!',
    actions: [
      { type: 'spawn', target: 'rocket', position: 'center' },
      { type: 'move', target: 'dog', to: 'center', style: 'bounce' },
      { type: 'animate', target: 'dog', anim: 'happy', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'right' },
    ],
    missing_elements: ['safety gear', 'supplies', 'mission goal'],
    prompt_feedback: 'Great start! Think about what the dog needs: a rocket, a spacesuit, food, and a goal for the trip.',
  },

  'octopus-band': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The octopus grabs a guitar but has no stage!',
    actions: [
      { type: 'spawn', target: 'guitar', position: 'left' },
      { type: 'move', target: 'octopus', to: 'left', style: 'float' },
      { type: 'animate', target: 'octopus', anim: 'dance', duration_ms: 600 },
      { type: 'react', effect: 'stars-spin', position: 'center' },
    ],
    missing_elements: ['more instruments', 'venue/stage', 'audience'],
    prompt_feedback: 'Good start! Try describing which instruments, where the concert happens, what song they play, and who watches.',
  },

  'skeleton-birthday': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The skeleton sets up a table but forgot to invite anyone!',
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'table', position: 'left' },
      { type: 'animate', target: 'skeleton_warrior', anim: 'Idle_A', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['party guests', 'decorations'],
    prompt_feedback: 'Nice start! Try describing WHO comes to the party and what decorations you\'d put in the dungeon.',
  },

  'knight-space': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The knight floats around the space station, bumping into everything!',
    actions: [
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'spawn', target: 'crate', position: 'center' },
      { type: 'move', target: 'knight', to: 'center', style: 'bounce' },
      { type: 'react', effect: 'stars-spin', position: 'center' },
    ],
    missing_elements: ['survival plan', 'space ranger friend'],
    prompt_feedback: 'Good try! Think about how the knight survives in space and who might help him.',
  },

  'mage-kitchen': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The mage zaps the stove but the pot starts flying!',
    actions: [
      { type: 'spawn', target: 'mage', position: 'left' },
      { type: 'spawn', target: 'potion', position: 'right' },
      { type: 'animate', target: 'mage', anim: 'Interact', duration_ms: 600 },
      { type: 'react', effect: 'sparkle-magic', position: 'right' },
    ],
    missing_elements: ['food solution', 'kitchen cleanup'],
    prompt_feedback: 'Great magic! Now describe what to cook and how to stop the kitchen from fighting back.',
  },

  'barbarian-school': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The barbarian sits down and the chair explodes!',
    actions: [
      { type: 'spawn', target: 'barbarian', position: 'center' },
      { type: 'spawn', target: 'desk', position: 'right' },
      { type: 'animate', target: 'barbarian', anim: 'Sit_Chair_Down', duration_ms: 600 },
      { type: 'react', effect: 'explosion-cartoon', position: 'right' },
    ],
    missing_elements: ['making friends', 'learning something'],
    prompt_feedback: 'Fun start! Try describing how the barbarian makes friends and what subject to study.',
  },

  'dungeon-concert': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'Everyone grabs a torch but nobody knows any songs!',
    actions: [
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'spawn', target: 'skeleton_warrior', position: 'right' },
      { type: 'spawn', target: 'torch', position: 'center' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['instruments assigned', 'actual performance'],
    prompt_feedback: 'Rock on! Describe which adventurer plays what instrument and what song they should play.',
  },

  'skeleton-pizza': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The skeleton picks up a pizza but its arm falls off!',
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'left' },
      { type: 'spawn', target: 'pizza', position: 'center' },
      { type: 'move', target: 'skeleton_warrior', to: 'center', style: 'linear' },
      { type: 'animate', target: 'skeleton_warrior', anim: 'PickUp', duration_ms: 600 },
    ],
    missing_elements: ['delivery route', 'bone solution'],
    prompt_feedback: 'Hilarious! Describe WHERE to deliver the pizza and how to keep the skeleton\'s bones together.',
  },

  'adventurers-picnic': {
    success_level: 'PARTIAL_SUCCESS',
    narration: 'The adventurers lay out a blanket but the barbarian ate all the sandwiches!',
    actions: [
      { type: 'spawn', target: 'blanket', position: 'center' },
      { type: 'spawn', target: 'barbarian', position: 'left' },
      { type: 'move', target: 'barbarian', to: 'center', style: 'bounce' },
      { type: 'react', effect: 'laugh-tears', position: 'center' },
    ],
    missing_elements: ['more food', 'activities for everyone'],
    prompt_feedback: 'Great setup! Try describing what each adventurer brings and what activities they do.',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE-KEYED FALLBACKS (22 total: stories 1-6 have 3 stages each, story 7 has 4)
  // ─────────────────────────────────────────────────────────────────────────

  // Story 1: Skeleton Birthday (3 stages)
  'skeleton-birthday-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The skeleton needs a little more help with the party!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['specific guests'],
    prompt_feedback: "Hmm, who do you want at this party? Can you name specific characters?",
  },

  'skeleton-birthday-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The dungeon needs decorations!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'torch', position: 'left' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['specific decorations'],
    prompt_feedback: "What would make a dark dungeon look party-ready? Think about what you'd see at a real birthday!",
  },

  'skeleton-birthday-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The cake is here but something's missing!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'cake-3d', position: 'center' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['cake arrival', 'reactions'],
    prompt_feedback: "What does the cake look like? How does it get to the party? Does it drop from the ceiling? Does someone carry it?",
  },

  // Story 2: Skeleton Pizza (3 stages)
  'skeleton-pizza-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The skeleton has the pizza but something's not quite right!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'left' },
      { type: 'spawn', target: 'pizza', position: 'center' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['pizza type', 'carrying method', 'bone solution'],
    prompt_feedback: "There are three things to figure out: which pizza, how to carry it, and keeping bones from falling. Did you cover all three?",
  },

  'skeleton-pizza-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The skeleton starts walking but where exactly?",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'left' },
      { type: 'move', target: 'skeleton_warrior', to: 'center', style: 'linear' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['route', 'obstacles', 'destination'],
    prompt_feedback: "A delivery needs a start, a destination, and what happens in between. Did you cover all three?",
  },

  'skeleton-pizza-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The skeleton reaches the table but the handoff isn't quite complete!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'table', position: 'right' },
      { type: 'spawn', target: 'pizza', position: 'center' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['delivery method', 'customer reaction'],
    prompt_feedback: "Three things make a complete delivery: how the pizza gets to the table, how the customer reacts, and what happens after.",
  },

  // Story 3: Mage Kitchen (3 stages)
  'mage-kitchen-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The kitchen is chaotic but we need more details!",
    actions: [
      { type: 'spawn', target: 'mage', position: 'center' },
      { type: 'react', effect: 'explosion-cartoon', position: 'center' },
    ],
    missing_elements: ['scene description', 'what\'s broken'],
    prompt_feedback: "Look around the kitchen -- what's going wrong? Where is the mage standing?",
  },

  'mage-kitchen-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The mage waves his staff but the stove keeps acting up!",
    actions: [
      { type: 'spawn', target: 'mage', position: 'center' },
      { type: 'animate', target: 'mage', anim: 'Ranged_Magic_Spellcasting', duration_ms: 600 },
      { type: 'react', effect: 'fire-sneeze', position: 'right' },
    ],
    missing_elements: ['spell type', 'solution'],
    prompt_feedback: "The stove is cursed with fire magic. What kind of spell could fight fire?",
  },

  'mage-kitchen-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The mage tries to cook but needs a better plan!",
    actions: [
      { type: 'spawn', target: 'mage', position: 'left' },
      { type: 'spawn', target: 'witch', position: 'right' },
      { type: 'react', effect: 'sparkle-magic', position: 'center' },
    ],
    missing_elements: ['cooking method', 'who helps', 'what they make'],
    prompt_feedback: "What magical tools does the mage have? How could spells help with cooking?",
  },

  // Story 4: Barbarian School (3 stages)
  'barbarian-school-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The barbarian looks at the tiny door and scratches his head!",
    actions: [
      { type: 'spawn', target: 'barbarian', position: 'left' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['steps', 'solution'],
    prompt_feedback: "What's the FIRST thing the barbarian does when he reaches the door? Then what happens?",
  },

  'barbarian-school-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The barbarian finds a desk but it looks really small!",
    actions: [
      { type: 'spawn', target: 'barbarian', position: 'center' },
      { type: 'spawn', target: 'desk', position: 'right' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['seating steps', 'how to avoid breaking things'],
    prompt_feedback: "What's the first thing you do when finding a seat? Walk to it? Look at it? Then what?",
  },

  'barbarian-school-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The barbarian stands at the playground looking nervous!",
    actions: [
      { type: 'spawn', target: 'barbarian', position: 'left' },
      { type: 'animate', target: 'barbarian', anim: 'Idle_A', duration_ms: 600 },
      { type: 'react', effect: 'sad-cloud', position: 'center' },
    ],
    missing_elements: ['approach', 'greeting', 'activity together'],
    prompt_feedback: "Making friends has steps: find someone, say hi, do something together. What's step one?",
  },

  // Story 5: Knight Space (3 stages)
  'knight-space-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The knight floats around looking very confused!",
    actions: [
      { type: 'spawn', target: 'knight', position: 'center' },
      { type: 'animate', target: 'knight', anim: 'Jump_Idle', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['medieval interpretation', 'what he thinks things are'],
    prompt_feedback: "The knight has never seen a space station. What medieval thing might each object look like to him?",
  },

  'knight-space-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The knight waves at someone but the meeting is awkward!",
    actions: [
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'spawn', target: 'space_ranger', position: 'right' },
      { type: 'animate', target: 'knight', anim: 'Waving', duration_ms: 600 },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['both perspectives', 'misunderstanding'],
    prompt_feedback: "When the knight sees the space ranger, what medieval thing does she look like to him?",
  },

  'knight-space-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "They're trying to work together but something's missing!",
    actions: [
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'spawn', target: 'space_ranger', position: 'right' },
      { type: 'animate', target: 'knight', anim: 'Interact', duration_ms: 600 },
    ],
    missing_elements: ['knight perspective', 'ranger perspective', 'teamwork'],
    prompt_feedback: "The knight sees medieval things, the ranger sees technology. How can BOTH viewpoints help fix the panel?",
  },

  // Story 6: Dungeon Concert (3 stages)
  'dungeon-concert-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The band is forming but they need instruments!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['dungeon instruments', 'who plays what'],
    prompt_feedback: "Look around the dungeon: barrels, torches, tables, banners. What could each one become if you use your imagination?",
  },

  'dungeon-concert-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The band members stand around but there's no stage!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'knight', position: 'left' },
      { type: 'spawn', target: 'barbarian', position: 'right' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['stage platform', 'lighting', 'decoration'],
    prompt_feedback: "What big objects could be a stage platform? A table? Stacked barrels?",
  },

  'dungeon-concert-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The stage is set but the performance hasn't started!",
    actions: [
      { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
      { type: 'spawn', target: 'barrel', position: 'left' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['each performer action', 'audience reaction'],
    prompt_feedback: "What does each performer DO? The skeleton drums barrels, the knight sings into a torch... what about the others?",
  },

  // Story 7: Adventurers Picnic (4 stages)
  'adventurers-picnic-0': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The adventurers arrive but the setup needs more planning!",
    actions: [
      { type: 'spawn', target: 'knight', position: 'center' },
      { type: 'spawn', target: 'barbarian', position: 'left' },
      { type: 'react', effect: 'question-marks', position: 'center' },
    ],
    missing_elements: ['each adventurer role', 'personalities'],
    prompt_feedback: "There are five adventurers. What would EACH one do to help set up? Think about their personalities!",
  },

  'adventurers-picnic-1': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "Something starts to go wrong at the picnic!",
    actions: [
      { type: 'spawn', target: 'barbarian', position: 'center' },
      { type: 'spawn', target: 'table', position: 'right' },
      { type: 'react', effect: 'explosion-cartoon', position: 'center' },
    ],
    missing_elements: ['chain reaction', 'each character reaction'],
    prompt_feedback: "What could the barbarian do that starts a chain reaction? Think about his personality!",
  },

  'adventurers-picnic-2': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The adventurers try to fix the mess!",
    actions: [
      { type: 'spawn', target: 'knight', position: 'center' },
      { type: 'spawn', target: 'ranger', position: 'right' },
      { type: 'animate', target: 'knight', anim: 'Interact', duration_ms: 600 },
    ],
    missing_elements: ['each adventurer solution', 'different skills'],
    prompt_feedback: "Five adventurers = five different solutions. What's each one best at?",
  },

  'adventurers-picnic-3': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The picnic is almost perfect but needs a grand finale!",
    actions: [
      { type: 'spawn', target: 'knight', position: 'center' },
      { type: 'spawn', target: 'mage', position: 'right' },
      { type: 'react', effect: 'confetti-burst', position: 'center' },
    ],
    missing_elements: ['each character ending', 'integration of all skills'],
    prompt_feedback: "This is your chance to use EVERY skill: specificity, completeness, context, order, perspective, and creativity. What does EACH adventurer do?",
  },
};
