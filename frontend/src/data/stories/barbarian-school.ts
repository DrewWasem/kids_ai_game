/**
 * Story 4: Barbarian's First Day of School
 *
 * Skill: Step-by-Step — "First This, Then That"
 * Teaching Goal: ORDER matters. Doing things in the right sequence produces better outcomes.
 */

import type { Story } from './types';

export const BARBARIAN_SCHOOL = {
  id: 'barbarian-school',
  title: "Barbarian's First Day of School",
  order: 4,
  skill: 'step-by-step',
  teachingGoal: 'ORDER matters. Doing things in the right sequence produces better outcomes.',
  characters: ['barbarian', 'knight', 'mage', 'ranger', 'rogue'],
  props: ['desk', 'chair'],

  stages: [
    // ─── STAGE 1: Getting Through the Door ─────────────────────────────────
    {
      title: "Getting Through the Door",
      narration: "The barbarian arrives at school but he's WAY too big for the tiny door!",
      question: "How does the barbarian get into the school building? Describe the steps in order!",

      responses: [
        // FULL_SUCCESS (1/4)
        {
          sampleInput: "First, the barbarian walks up to the door from the left. Then he tries to squeeze through but gets stuck. Next, the knight pushes him from behind. Finally, he pops through and stumbles to the center!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'enter-left', anim: 'Interact' },
            { block: 'barbarian', action: 'move-center', anim: 'Cheering' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Perfect sequence! First-then-next-finally. Each step follows logically!"
        },

        // FULL_SUCCESS (2/4)
        {
          sampleInput: "Step 1: The barbarian sees the tiny door and scratches his head. Step 2: He crouches down to fit. Step 3: He gets stuck halfway. Step 4: The mage casts a shrinking spell on the door to make it bigger. Step 5: The barbarian walks through and waves.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-left', anim: 'Idle_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Crawling' },
            { block: 'mage', action: 'enter-right', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'barbarian', action: 'move-center', anim: 'Walking_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Waving' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Five clear steps in perfect order! You even numbered them. The AI knows exactly what to do!"
        },

        // FULL_SUCCESS (3/4)
        {
          sampleInput: "The barbarian walks to the door first. He looks confused. Then the rogue picks the lock so the door opens wider. After that, the barbarian crouches and crawls through slowly. He stands up on the other side and cheers.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'rogue', action: 'enter-left', anim: 'Lockpick' },
            { block: 'barbarian', action: 'appear-center', anim: 'Crawling' },
            { block: 'barbarian', action: 'appear-center', anim: 'Cheering' }
          ],
          reactions: ['question-marks', 'confetti-burst'],
          feedback: "Each step leads to the next naturally. Walk, discover problem, get help, solve it, celebrate!"
        },

        // FULL_SUCCESS (4/4)
        {
          sampleInput: "First the barbarian runs at the door -- BONK! He bounces off. Then he sits down looking sad. The ranger shows him he can go around through the big gym door instead. They walk together to the classroom.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Running_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Floor_Down' },
            { block: 'ranger', action: 'enter-right', anim: 'Walking_A' },
            { block: 'barbarian', action: 'move-center', anim: 'Walking_A' }
          ],
          reactions: ['explosion-cartoon', 'sad-cloud', 'hearts-float'],
          feedback: "Try, stumble, get help, find a new path. The order makes it funny AND logical!"
        },

        // PARTIAL_SUCCESS (5/10)
        {
          sampleInput: "The barbarian goes to school",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' }
          ],
          reactions: [],
          feedback: "What happens step by step? First he arrives, then what? The door is too small!"
        },

        // PARTIAL_SUCCESS (6/10)
        {
          sampleInput: "He breaks through the wall and sits down",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "That's a start and an end, but what about the MIDDLE steps?"
        },

        // PARTIAL_SUCCESS (7/10)
        {
          sampleInput: "The barbarian crawls through the door",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Crawling' }
          ],
          reactions: [],
          feedback: "Good! But what came BEFORE? What comes AFTER? Steps go: first, then, next, finally."
        },

        // FUNNY_FAIL (8/10)
        {
          sampleInput: "smash",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "The barbarian WANTS to go to school! Describe the steps to get through the door."
        },

        // FUNNY_FAIL (9/10)
        {
          sampleInput: "homework",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Homework comes later! First step: getting through the door."
        },

        // FUNNY_FAIL (10/10)
        {
          sampleInput: "no",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "The barbarian can do it! Step 1, he walks up. Step 2... what next?"
        }
      ],

      hints: [
        "What's the FIRST thing the barbarian does when he reaches the door? Then what happens?",
        "The door is too small! What steps could he try? Crouch? Get help? Go around?",
        "Use order words: first, then, next, finally. Each step should lead to the next one."
      ]
    },

    // ─── STAGE 2: Finding a Seat ───────────────────────────────────────────
    {
      title: "Finding a Seat",
      narration: "The barbarian made it inside! But now he has to sit at a tiny desk.",
      question: "Describe step by step how the barbarian finds a seat and sits down without breaking everything.",

      responses: [
        // FULL_SUCCESS (1/3)
        {
          sampleInput: "First, the barbarian walks to the nearest desk. Then he looks at it and realizes it's tiny. Next, he tries to sit but the chair breaks! Finally, the knight brings two chairs and the barbarian sits on both of them at once.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Chair_Down' },
            { block: 'knight', action: 'enter-right', anim: 'Interact' },
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Chair_Idle' }
          ],
          reactions: ['question-marks', 'explosion-cartoon', 'laugh-tears', 'confetti-burst'],
          feedback: "Walk, look, try, stumble, get help, succeed. Perfect step-by-step sequence!"
        },

        // FULL_SUCCESS (2/3)
        {
          sampleInput: "Step 1: The barbarian sees an empty desk next to the ranger. Step 2: He squeezes into the aisle between desks. Step 3: He accidentally knocks over the mage's books. Step 4: He picks them up and says sorry. Step 5: He carefully lowers himself onto the chair, holding the desk so it doesn't flip.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'ranger', action: 'appear-right', anim: 'Waving' },
            { block: 'barbarian', action: 'move-center', anim: 'Walking_A' },
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'PickUp' },
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Chair_Down' }
          ],
          reactions: ['hearts-float'],
          feedback: "Five numbered steps in perfect order! You even included the accident AND the apology. That's thoughtful sequencing!"
        },

        // FULL_SUCCESS (3/3)
        {
          sampleInput: "The barbarian walks to the back row first because the bigger desks are there. Then he pulls out the chair slowly so it doesn't screech. After that, he turns around and sits down super carefully. The desk wobbles but the rogue jams a book under the leg to steady it.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' },
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Chair_Down' },
            { block: 'rogue', action: 'enter-right', anim: 'Interact' }
          ],
          reactions: ['stars-spin'],
          feedback: "You planned AHEAD by choosing the back row. Each step prevented a problem. Smart sequencing!"
        },

        // PARTIAL_SUCCESS (4/7)
        {
          sampleInput: "He sits down",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Chair_Down' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "He just sat and broke the chair! What should happen BEFORE sitting? Walk to it, check it, then sit carefully."
        },

        // PARTIAL_SUCCESS (5/7)
        {
          sampleInput: "The barbarian finds a desk and sits in it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Walking_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Sit_Chair_Down' }
          ],
          reactions: [],
          feedback: "That's the first and last step! What happens in BETWEEN? Does anything go wrong?"
        },

        // PARTIAL_SUCCESS (6/7)
        {
          sampleInput: "He's too big for the chair so he breaks it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "That's the problem, not the solution! Step by step, how does he sit WITHOUT breaking everything?"
        },

        // PARTIAL_SUCCESS (7/7)
        {
          sampleInput: "The barbarian walks carefully to a desk",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' }
          ],
          reactions: [],
          feedback: "Good first step! Then what? Does he check the chair? How does he sit down?"
        },

        // FUNNY_FAIL (8/10)
        {
          sampleInput: "smash the desk",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "No smashing in class! Step 1: walk to a desk. Step 2... what would be gentle?"
        },

        // FUNNY_FAIL (9/10)
        {
          sampleInput: "stand",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Standing all day? Describe the STEPS to find a seat and sit down!"
        },

        // FUNNY_FAIL (10/10)
        {
          sampleInput: "eat lunch",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks'],
          feedback: "It's class time, not lunch! Step by step: how does the barbarian find a seat?"
        }
      ],

      hints: [
        "What's the first thing you do when finding a seat? Walk to it? Look at it? Then what?",
        "The barbarian is really big. What could go wrong at each step? How does he prevent it?",
        "Good steps go: first (find the desk), then (check if it fits), next (sit carefully), finally (success or get help)."
      ]
    },

    // ─── STAGE 3: Making Friends at Recess ─────────────────────────────────
    {
      title: "Making Friends at Recess",
      narration: "Recess! The barbarian is on the playground and wants to make a friend.",
      question: "Step by step, how does the barbarian make a friend at recess? What does he do first, then what?",

      responses: [
        // FULL_SUCCESS (1/3)
        {
          sampleInput: "First, the barbarian sees the knight playing near the sandbox. Then he walks over slowly so he doesn't scare anyone. Next, he waves and says hi. The knight waves back. Then the barbarian asks if he can play too. Finally, the knight shows him how to build a sandcastle together!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'appear-right', anim: 'Interact' },
            { block: 'barbarian', action: 'appear-center', anim: 'Waving' },
            { block: 'knight', action: 'appear-right', anim: 'Waving' },
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' },
            { block: 'knight', action: 'appear-right', anim: 'Cheering' }
          ],
          reactions: ['hearts-float', 'confetti-burst'],
          feedback: "See someone, approach slowly, say hi, ask to join, play together. Every social step in the right order!"
        },

        // FULL_SUCCESS (2/3)
        {
          sampleInput: "Step 1: The barbarian runs to the slide but he's too big and gets stuck. Step 2: The rogue and ranger try to push him out. Step 3: They all laugh about it. Step 4: The barbarian pushes the rogue and ranger on the swings instead because he's strong enough. Step 5: They become friends because they helped each other!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Running_A' },
            { block: 'rogue', action: 'enter-right', anim: 'Interact' },
            { block: 'ranger', action: 'enter-right', anim: 'Interact' },
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' },
            { block: 'rogue', action: 'appear-right', anim: 'Cheering' },
            { block: 'ranger', action: 'appear-right', anim: 'Cheering' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears', 'hearts-float'],
          feedback: "A problem led to teamwork, which led to friendship! Each step builds on the last one naturally!"
        },

        // FULL_SUCCESS (3/3)
        {
          sampleInput: "The barbarian stands at the edge of the playground looking nervous. Then the mage walks up and shows him a sparkle spell. The barbarian is amazed and claps. Next, the barbarian picks up a huge rock to impress the mage. The mage claps back. Now they're friends because they shared their cool talents!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-left', anim: 'Idle_A' },
            { block: 'mage', action: 'enter-right', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'barbarian', action: 'appear-center', anim: 'Cheering' },
            { block: 'barbarian', action: 'appear-center', anim: 'PickUp' },
            { block: 'mage', action: 'appear-right', anim: 'Cheering' }
          ],
          reactions: ['sad-cloud', 'sparkle-magic', 'hearts-float', 'stars-spin'],
          feedback: "Nervous, see someone, watch them, share your talent back. The friendship builds step by step!"
        },

        // PARTIAL_SUCCESS (4/7)
        {
          sampleInput: "He makes a friend",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "HOW? Step by step: who does he talk to? What does he say? What do they do together?"
        },

        // PARTIAL_SUCCESS (5/7)
        {
          sampleInput: "The barbarian plays with the knight",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-left', anim: 'Idle_A' },
            { block: 'knight', action: 'appear-right', anim: 'Idle_A' }
          ],
          reactions: [],
          feedback: "How did they start playing? What happened FIRST? What did the barbarian do to introduce himself?"
        },

        // PARTIAL_SUCCESS (6/7)
        {
          sampleInput: "He goes to the playground and everyone likes him",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' }
          ],
          reactions: ['confetti-burst'],
          feedback: "That's nice! But what STEPS did he take? Walking up, saying hi, doing something together?"
        },

        // PARTIAL_SUCCESS (7/7)
        {
          sampleInput: "The barbarian waves at someone",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Waving' }
          ],
          reactions: [],
          feedback: "Good first step! Who does he wave at? Do they wave back? What happens next?"
        },

        // FUNNY_FAIL (8/10)
        {
          sampleInput: "fight everyone",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Fighting is NOT how you make friends! Step 1: find someone. Step 2: say hi. Step 3...?"
        },

        // FUNNY_FAIL (9/10)
        {
          sampleInput: "go home",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Walking_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Don't give up! Making friends takes steps. First, find someone who looks fun to play with!"
        },

        // FUNNY_FAIL (10/10)
        {
          sampleInput: "recess",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Yes, it's recess! Now describe the STEPS: who does the barbarian approach, what does he say, what do they do?"
        }
      ],

      hints: [
        "Making friends has steps: find someone, say hi, do something together. What's step one?",
        "Who looks fun to play with? The knight? The mage? How would the barbarian approach them?",
        "Think about order: first approach, then greet, then share something cool, then play together!"
      ]
    }
  ]
} satisfies Story;
