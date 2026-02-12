/**
 * Story 5: Knight's Accidental Space Mission
 *
 * Skill: Perspective — "Think Like Them"
 * Teaching Goal: Think about WHO is doing the action and WHY.
 * A knight interprets space through medieval eyes.
 */

import type { Story } from './types';

export const KNIGHT_SPACE = {
  id: 'knight-space',
  title: "Knight's Accidental Space Mission",
  order: 5,
  skill: 'perspective',
  teachingGoal:
    "Thinking from someone else's viewpoint changes how you describe things. A knight sees space differently than an astronaut.",
  characters: ['knight', 'space_ranger'],
  props: [],

  stages: [
    // ─── STAGE 1: Lost in Space! ─────────────────────────────────────────────
    {
      title: "Lost in Space!",
      narration:
        "A knight pushed the wrong button on a catapult and launched himself to a space station! He has NO idea what anything is!",
      question:
        "The knight is floating around the space station. How does he react to everything he sees? Remember -- he thinks in swords and castles!",
      hints: [
        "The knight has never seen a space station. What medieval thing might each object look like to him?",
        "Think about the dome, the solar panels, and the cargo crates. What would a knight call them?",
        "A knight knows shields, castles, dragons, and treasure. How would he interpret everything he sees?",
      ],
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput:
            "The knight floats in looking confused. He sees the dome and thinks it's a giant shield! He tries to pick it up. The solar panels look like dragon wings and he tries to fight them with his sword.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'appear-center', anim: 'Jump_Full_Long' },
            { block: 'knight', action: 'appear-center', anim: 'Interact' },
            { block: 'knight', action: 'appear-center', anim: 'Melee_1H_Attack_Chop' },
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback:
            "You thought LIKE a knight! He sees shields and dragons because that's his world. Perfect perspective!",
        },
        {
          sampleInput:
            "The knight looks at the base modules and thinks they're castle towers floating in the sky. He salutes them. When he sees the cargo crates, he thinks they're treasure chests and tries to open them.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Waving' },
            { block: 'knight', action: 'appear-center', anim: 'Interact' },
            { block: 'knight', action: 'appear-center', anim: 'PickUp' },
          ],
          reactions: ['question-marks', 'stars-spin'],
          feedback: "Castle towers, treasure chests -- you saw everything through medieval eyes!",
        },
        {
          sampleInput:
            "The knight grabs onto the wall because he's floating. He's never been without gravity. He sees the space ranger and thinks it's a very weird-looking wizard in a shiny helmet.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'appear-center', anim: 'Jump_Idle' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Waving' },
            { block: 'knight', action: 'appear-left', anim: 'Melee_Block' },
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback:
            "Zero gravity through a knight's eyes, calling the space ranger a wizard -- that's thinking in character!",
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "The knight looks around the space station",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Idle_A' }],
          reactions: ['question-marks'],
          feedback: "But what does he THINK about what he sees? He's never seen any of this!",
        },
        {
          sampleInput: "The knight is confused and scared",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Melee_Block' }],
          reactions: ['question-marks'],
          feedback: "What EXACTLY confuses him? What does the dome look like to him?",
        },
        {
          sampleInput: "He floats around and bumps into things",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Jump_Idle' }],
          reactions: ['explosion-cartoon'],
          feedback: "But what does the knight think he's bumping INTO?",
        },
        {
          sampleInput: "The knight sees the space ranger",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Idle_A' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Idle_A' },
          ],
          reactions: [],
          feedback: "What would a knight THINK the space ranger is? An enemy? A wizard?",
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "go home",
          successLevel: 'FUNNY_FAIL',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Walking_A' }],
          reactions: ['sad-cloud'],
          feedback: "He can't go home yet! How does the knight react to being in this crazy new place?",
        },
        {
          sampleInput: "fight aliens",
          successLevel: 'FUNNY_FAIL',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Melee_1H_Attack_Chop' }],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "A knight doesn't know about aliens! What would HE call the things he sees?",
        },
        {
          sampleInput: "cool",
          successLevel: 'FUNNY_FAIL',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Idle_A' }],
          reactions: ['question-marks'],
          feedback: "How would someone from medieval times ACTUALLY react to space?",
        },
      ],
    },

    // ─── STAGE 2: Meeting the Space Ranger ───────────────────────────────────
    {
      title: "Meeting the Space Ranger",
      narration: "The knight spots the space ranger! From the knight's perspective, this could be anything!",
      question:
        "How do the knight and space ranger meet? The knight thinks in medieval terms. The space ranger thinks in science. How does each see the other?",
      hints: [
        "When the knight sees the space ranger, what medieval thing does she look like to him?",
        "Both characters see the same things differently. What does the knight's armor look like to the space ranger?",
        "The funniest meetings happen when BOTH sides misunderstand each other. What does each one think?",
      ],
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput:
            "The knight sees the space ranger's helmet and thinks it's a magical crystal ball head. He bows and says 'Greetings, crystal wizard!' The space ranger sees the knight's armor and thinks it's an old-fashioned spacesuit. She says 'Nice retro gear!' They're both confused but friendly.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Waving' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Waving' },
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
          ],
          reactions: ['question-marks', 'laugh-tears', 'hearts-float'],
          feedback:
            "Both perspectives! The knight sees a wizard, the ranger sees retro gear. Each character interprets through their own world!",
        },
        {
          sampleInput:
            "The knight draws his sword because the space ranger's blinking lights look like enemy signals. The space ranger holds up her hands to show she's friendly. The knight thinks she's casting a surrender spell. He puts his sword away and bows. She waves.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Melee_1H_Attack_Chop' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Waving' },
            { block: 'knight', action: 'appear-left', anim: 'Melee_Block' },
            { block: 'knight', action: 'appear-left', anim: 'Waving' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Waving' },
          ],
          reactions: ['question-marks', 'stars-spin'],
          feedback:
            "The knight sees threats through medieval eyes, the ranger uses modern body language. Dual perspective perfectly shown!",
        },
        {
          sampleInput:
            "The space ranger tries to explain she's from a space station by pointing at the stars. The knight thinks she's an astrologer reading fortunes. He gets excited and asks her to predict his next battle. She's confused but shows him the control panel, which he thinks is a magical map.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Cheering' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
          ],
          reactions: ['question-marks', 'laugh-tears', 'sparkle-magic'],
          feedback:
            "Every piece of technology becomes magic in the knight's mind! And the ranger can't understand why. Perfect dual perspective!",
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "They say hello to each other",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Waving' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Waving' },
          ],
          reactions: [],
          feedback:
            "How does EACH ONE see the other? The knight thinks in castles, the ranger thinks in science!",
        },
        {
          sampleInput: "The knight is scared of the space ranger",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Melee_Block' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Idle_A' },
          ],
          reactions: [],
          feedback:
            "What does the knight THINK the space ranger is? A wizard? A monster? And what does the ranger think of the knight?",
        },
        {
          sampleInput: "The space ranger explains space to the knight",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Idle_A' },
          ],
          reactions: [],
          feedback: "But how does the knight INTERPRET what she says? He doesn't know what space IS!",
        },
        {
          sampleInput: "They meet and become friends",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Waving' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Waving' },
          ],
          reactions: ['hearts-float'],
          feedback:
            "Friendship is great! But HOW? What does each think the other is? That's the fun part!",
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "they fight",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Melee_1H_Attack_Chop' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Hit_A' },
          ],
          reactions: ['explosion-cartoon'],
          feedback:
            "Wait! How would a knight SEE the space ranger? And how would the ranger SEE the knight? Think about both views!",
        },
        {
          sampleInput: "hi",
          successLevel: 'FUNNY_FAIL',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Idle_A' }],
          reactions: ['question-marks'],
          feedback:
            "The knight meets someone he's NEVER seen before. How does he react from a MEDIEVAL perspective?",
        },
        {
          sampleInput: "the space ranger explains everything",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Idle_A' },
          ],
          reactions: ['question-marks'],
          feedback: "But how does the knight UNDERSTAND it? He thinks in swords and castles, not science!",
        },
      ],
    },

    // ─── STAGE 3: Working Together ───────────────────────────────────────────
    {
      title: "Working Together",
      narration: "They've figured out they're not enemies! Now they need to fix the solar panel together.",
      question:
        "How do the knight and space ranger fix the solar panel? Show how each approaches the problem from their own perspective.",
      hints: [
        "The knight sees medieval things, the ranger sees technology. How can BOTH viewpoints help fix the panel?",
        "What skill does the knight bring? (Strength!) What skill does the ranger bring? (Tech knowledge!) How do they combine?",
        "The best teamwork happens when each person contributes their own talent. What does each one DO and THINK they're doing?",
      ],
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput:
            "The knight thinks the solar panel is a fallen dragon wing and tries to lift it back into place with his strength. The space ranger realizes the knight's brute force is actually useful! She points to where it needs to go. The knight holds it while the ranger reconnects the wires. The knight thinks she's weaving enchantment threads.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'PickUp' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
          ],
          reactions: ['sparkle-magic', 'stars-spin', 'confetti-burst'],
          feedback:
            "The knight uses strength (his skill), the ranger uses tech (her skill), and each sees it through their own eyes. Collaboration through dual perspective!",
        },
        {
          sampleInput:
            "The space ranger shows the knight a wrench. He thinks it's a tiny war hammer. She shows him to turn the bolts. He thinks he's tightening armor rivets on a giant shield. Meanwhile the ranger recalibrates the angle. Together they fix it -- both thinking they did something completely different!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Hammer' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
          ],
          reactions: ['question-marks', 'sparkle-magic', 'laugh-tears', 'confetti-burst'],
          feedback:
            "They fixed the SAME thing but each thought they were doing something different! That's perspective genius!",
        },
        {
          sampleInput:
            "The space ranger explains the solar panel collects sunlight for energy. The knight understands 'sunlight for energy' as a sun blessing ritual. He kneels and holds the panel toward the sun like an offering. The ranger realizes this actually helps aim it correctly! She locks it in place. The knight thinks his prayer worked.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Cheering' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Cheering' },
          ],
          reactions: ['sparkle-magic', 'stars-spin', 'hearts-float'],
          feedback:
            "A sun prayer that's actually engineering! Both perspectives led to the same correct solution. Brilliant!",
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "They fix the solar panel together",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
          ],
          reactions: [],
          feedback:
            "HOW? The knight thinks in medieval terms, the ranger in science. What does each one DO?",
        },
        {
          sampleInput: "The knight lifts the panel and the ranger fixes it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'PickUp' },
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
          ],
          reactions: [],
          feedback:
            "Good teamwork! But what does the knight THINK he's lifting? A shield? A dragon scale? Show his perspective!",
        },
        {
          sampleInput: "The space ranger tells the knight what to do",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'space_ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'knight', action: 'appear-left', anim: 'Idle_A' },
          ],
          reactions: [],
          feedback: "But how does the knight UNDERSTAND the instructions? He doesn't know what a solar panel IS!",
        },
        {
          sampleInput: "The knight hits it with his sword and it works",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [{ block: 'knight', action: 'appear-left', anim: 'Melee_1H_Attack_Chop' }],
          reactions: ['explosion-cartoon'],
          feedback: "He broke it more! How would the knight AND the ranger EACH contribute their own skills?",
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "smash it",
          successLevel: 'FUNNY_FAIL',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Hammer' }],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback:
            "The knight's strength could HELP if the ranger guides him! How do they work together using their different views?",
        },
        {
          sampleInput: "give up and go home",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Walking_A' },
            { block: 'space_ranger', action: 'appear-center', anim: 'Hit_A' },
          ],
          reactions: ['sad-cloud'],
          feedback:
            "Don't quit! The knight has strength, the ranger has knowledge. How does each help from their perspective?",
        },
        {
          sampleInput: "use magic",
          successLevel: 'FUNNY_FAIL',
          elements: [{ block: 'knight', action: 'appear-center', anim: 'Interact' }],
          reactions: ['question-marks'],
          feedback:
            "No magic here! But the knight THINKS in medieval terms. How does he see the repair? And what does the ranger ACTUALLY do?",
        },
      ],
    },
  ],
} satisfies Story;
