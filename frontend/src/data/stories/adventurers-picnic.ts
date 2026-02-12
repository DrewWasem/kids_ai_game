/**
 * Story 7: Adventurers' Disastrous Picnic
 *
 * Skill: Integration — "Master Prompter"
 * Teaching Goal: Combine ALL prompt engineering skills: specificity, completeness,
 *                context, sequence, perspective, and constraints.
 *
 * 4 Stages with 10 pre-rendered responses each (3 FULL_SUCCESS, 4 PARTIAL_SUCCESS, 3 FUNNY_FAIL)
 */

import type { Story } from './types';

export const ADVENTURERS_PICNIC = {
  id: 'adventurers-picnic',
  title: "Adventurers' Disastrous Picnic",
  order: 7,
  skill: 'integration',
  teachingGoal: "Combine ALL prompt engineering skills: specificity, completeness, context, step-by-step, perspective, and creative constraints.",
  characters: ['knight', 'mage', 'rogue', 'barbarian', 'ranger'],
  props: ['bench', 'basket', 'blanket', 'sandwich', 'pie', 'apple'],

  stages: [
    // ─── STAGE 1: Setting Up the Picnic ─────────────────────────────────
    {
      title: "Setting Up the Picnic",
      narration: "Five adventurers walk into a park for a nice picnic. But these are ADVENTURERS. This is going to be... interesting.",
      question: "Describe how each adventurer helps set up the picnic. Who does what? Where does everything go? What's each character's personality like?",

      responses: [
        // FULL_SUCCESS responses (4)
        {
          sampleInput: "First, the knight lays the blanket in the center near the fountain. Then the ranger sets up plates and mugs because she's organized. The rogue sneaks over with sandwiches -- he probably stole extra. The barbarian carries the heavy stuff: cake and pie. The mage uses sparkle magic to hang apples from tree branches as decoration. Everyone sits down when it's ready.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'enter-left', anim: 'Interact' },
            { block: 'ranger', action: 'enter-right', anim: 'Interact' },
            { block: 'rogue', action: 'enter-left', anim: 'Sneaking' },
            { block: 'sandwich', count: 2, action: 'appear' },
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'cake_birthday', action: 'drop-center' },
            { block: 'pie', action: 'drop-center' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'apple', count: 3, action: 'float-above' }
          ],
          reactions: ['sparkle-magic', 'hearts-float'],
          feedback: "THIS is master-level prompting! Specific names, complete setup, character personalities, clear order, each person's perspective, AND creative decoration. All skills combined!"
        },
        {
          sampleInput: "The knight takes charge because that's what knights do. He points at the spot and tells everyone where to sit. The barbarian doesn't understand why they can't just eat standing up. The rogue secretly sets up the food while nobody's watching. The ranger scouts for ants. The mage adds sparkle decorations because he can't help himself.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Waving' },
            { block: 'barbarian', action: 'appear-left', anim: 'Idle_A' },
            { block: 'rogue', action: 'appear-right', anim: 'Sneaking' },
            { block: 'sandwich', action: 'appear' },
            { block: 'ranger', action: 'enter-right', anim: 'Walking_A' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['question-marks', 'sparkle-magic', 'confetti-burst'],
          feedback: "Every character has their own personality and job. You thought about WHO each person is. Integration perfection!"
        },
        {
          sampleInput: "Step 1: Ranger arrives first and chooses a spot between two trees. Step 2: Knight and barbarian carry heavy stuff. The barbarian almost trips. Step 3: Rogue unpacks food fast -- sandwiches, apples, pie, and cake. He hides an extra sandwich for himself. Step 4: Mage enchants the fountain to play music. Step 5: Everyone sits and the mage pours tea with a floating spell.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'ranger', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'enter-left', anim: 'Interact' },
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'rogue', action: 'appear-center', anim: 'PickUp' },
            { block: 'sandwich', count: 3, action: 'appear' },
            { block: 'apple', count: 2, action: 'appear' },
            { block: 'pie', action: 'appear' },
            { block: 'cake_birthday', action: 'appear' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic', 'stars-spin'],
          feedback: "Numbered steps, character perspectives, creative magic, specific food, location details -- EVERY skill in one response. Master Prompter!"
        },

        // PARTIAL_SUCCESS responses (4)
        {
          sampleInput: "They set up a picnic",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Who does what? What food? Where? Use all your skills!"
        },
        {
          sampleInput: "The knight puts the blanket down and everyone eats",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Interact' },
            { block: 'sandwich', count: 1, action: 'appear' }
          ],
          reactions: [],
          feedback: "What about the other four? Each would help differently."
        },
        {
          sampleInput: "They bring sandwiches and cake and sit near the trees. The mage does some magic.",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'sandwich', count: 2, action: 'appear' },
            { block: 'cake_birthday', action: 'appear-center' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Getting there! Now add WHO does what, in WHAT order, how each personality shows."
        },
        {
          sampleInput: "The barbarian carries everything and the others sit down",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'appear-right', anim: 'Sit_Floor_Down' }
          ],
          reactions: [],
          feedback: "What do the others contribute? Each adventurer has a skill."
        },

        // FUNNY_FAIL responses (3)
        {
          sampleInput: "eat",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks'],
          feedback: "Before eating, the picnic needs setup! Who brings what? Where? Use ALL your skills!"
        },
        {
          sampleInput: "fight a dragon",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Melee_1H_Attack_Chop' }
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "No dragons today! This is a picnic. How do the five adventurers set it up?"
        },
        {
          sampleInput: "ok",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "The picnic needs YOUR plan! Describe who, what, where, when, and how."
        }
      ],

      hints: [
        "There are five adventurers. What would EACH one do to help set up? Think about their personalities!",
        "The knight leads, the barbarian carries heavy stuff, the rogue is sneaky, the mage uses magic, the ranger is organized. How does each help?",
        "Use ALL your skills: name each character (specificity), cover every step (completeness), describe the setting (context), put things in order (step-by-step), show personalities (perspective), and get creative!"
      ]
    },

    // ─── STAGE 2: Disaster Strikes! ─────────────────────────────────────
    {
      title: "Disaster Strikes!",
      narration: "Everything was going well... and then the barbarian spotted the cake.",
      question: "Something goes wrong! Describe the disaster step by step: what happens, who is affected, and how does each adventurer react based on their personality?",

      responses: [
        // FULL_SUCCESS responses (4)
        {
          sampleInput: "First, the barbarian spots the birthday cake and charges at it. He trips over the table and flips it! Sandwiches fly everywhere. The knight tries to catch the cake but bumps into the mage, who accidentally casts a spell that makes all the drinks float. The rogue dives to save the pie but slides into the ranger's lap. The ranger screams because there's pie on her map. Apples roll everywhere.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'enter-left', anim: 'Running_A' },
            { block: 'table_long', action: 'appear-center' },
            { block: 'sandwich', count: 3, action: 'bounce-in' },
            { block: 'knight', action: 'appear-center', anim: 'Walking_A' },
            { block: 'mage', action: 'appear-right', anim: 'Hit_A' },
            { block: 'drink', count: 4, action: 'float-above' },
            { block: 'rogue', action: 'appear-left', anim: 'Jump_Full_Short' },
            { block: 'ranger', action: 'appear-right', anim: 'Hit_A' },
            { block: 'pie', action: 'bounce-in' },
            { block: 'apple', count: 3, action: 'bounce-in' }
          ],
          reactions: ['explosion-cartoon', 'sparkle-magic', 'laugh-tears'],
          feedback: "Step-by-step chaos! Each character reacts differently based on personality. Barbarian charges, knight helps, mage panics, rogue dives, ranger screams. All skills in action!"
        },
        {
          sampleInput: "The mage accidentally sneezes and a spell shoots out, turning all the food giant-sized. The burger is now as big as the barbarian! The barbarian thinks it's amazing and tries to eat it. The knight scolds the mage. The rogue tries to steal the giant cake while nobody's looking. The ranger makes a list of everything that went wrong.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' },
            { block: 'burger', count: 2, action: 'bounce-in' },
            { block: 'barbarian', action: 'appear-left', anim: 'Cheering' },
            { block: 'knight', action: 'appear-right', anim: 'Interact' },
            { block: 'rogue', action: 'appear-left', anim: 'Sneaking' },
            { block: 'cake_birthday', action: 'bounce-in' },
            { block: 'ranger', action: 'appear-right', anim: 'Interact' }
          ],
          reactions: ['sparkle-magic', 'explosion-cartoon', 'laugh-tears', 'stars-spin'],
          feedback: "A magical sneeze! Each character's reaction fits their personality: barbarian excited, knight scolding, rogue stealing, ranger organizing. Integration perfection!"
        },
        {
          sampleInput: "Step 1: A gust of wind blows the banners onto the knight's face so he can't see. Step 2: He stumbles into the barbarian who was carrying drinks. Step 3: Drinks splash on the mage's spellbook. Step 4: The book sparks and shoots cupcakes into the sky. Step 5: The rogue catches cupcakes but drops the sandwiches into the dirt. Step 6: The ranger facepalms.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'banner_blue', action: 'appear' },
            { block: 'knight', action: 'appear-center', anim: 'Hit_A' },
            { block: 'barbarian', action: 'appear-left', anim: 'Hit_A' },
            { block: 'drink', count: 3, action: 'bounce-in' },
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' },
            { block: 'cupcake', count: 3, action: 'float-above' },
            { block: 'rogue', action: 'appear-right', anim: 'PickUp' },
            { block: 'sandwich', count: 2, action: 'bounce-in' },
            { block: 'ranger', action: 'appear-right', anim: 'Hit_A' }
          ],
          reactions: ['sparkle-magic', 'explosion-cartoon', 'laugh-tears'],
          feedback: "Six numbered steps where each disaster causes the next! Chain reaction with every character involved. Master-level sequencing AND integration!"
        },

        // PARTIAL_SUCCESS responses (4)
        {
          sampleInput: "The barbarian eats all the food",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks'],
          feedback: "That's one disaster! But step by step, HOW? And how does EACH adventurer react differently?"
        },
        {
          sampleInput: "Something goes wrong and food goes everywhere",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'sandwich', count: 2, action: 'bounce-in' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "WHAT goes wrong exactly? WHO causes it? How does EACH person react based on their personality?"
        },
        {
          sampleInput: "The mage's spell goes wrong and messes up the food",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['sparkle-magic', 'explosion-cartoon'],
          feedback: "Good inciting incident! Now what happens step by step? How do the knight, barbarian, rogue, and ranger each react?"
        },
        {
          sampleInput: "Everything falls over",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'table_long', action: 'appear-center' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "Why does it fall? Who caused it? Who gets hit? What does each adventurer do?"
        },

        // FUNNY_FAIL responses (3)
        {
          sampleInput: "nothing goes wrong",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Something ALWAYS goes wrong with adventurers! What disaster happens? Think big and specific!"
        },
        {
          sampleInput: "boom",
          successLevel: 'FUNNY_FAIL',
          elements: [],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "BOOM is fun but what CAUSED the boom? Who was involved? Step by step, what happened?"
        },
        {
          sampleInput: "the end",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Not yet! The disaster hasn't happened! Describe what goes wrong, step by step, with each character reacting!"
        }
      ],

      hints: [
        "What could the barbarian do that starts a chain reaction? Think about his personality!",
        "Each adventurer reacts differently: the knight tries to fix it, the mage panics with magic, the rogue sees an opportunity. What about the ranger and barbarian?",
        "The best disasters happen step by step: one thing causes the next. What's step 1, and what does it cause?"
      ]
    },

    // ─── STAGE 3: Save the Picnic! ──────────────────────────────────────
    {
      title: "Save the Picnic!",
      narration: "The picnic is in chaos! Can the adventurers work TOGETHER to save the day?",
      question: "Describe how each adventurer helps fix the disaster. Each solves a different problem in a different way. Order matters!",

      responses: [
        // FULL_SUCCESS responses (4)
        {
          sampleInput: "First, the knight takes charge and tells everyone to stop panicking. The ranger picks up the fallen food and sorts what's still good. The barbarian uses his strength to flip the table back up. The mage casts a cleaning spell on the dirty sandwiches -- sparkles make them fresh again. The rogue secretly replaces the ruined cake with a pie he had hidden in a barrel.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Waving' },
            { block: 'ranger', action: 'enter-right', anim: 'PickUp' },
            { block: 'sandwich', count: 2, action: 'appear' },
            { block: 'barbarian', action: 'appear-left', anim: 'PickUp' },
            { block: 'table_long', action: 'appear-center' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'rogue', action: 'appear-left', anim: 'Sneaking' },
            { block: 'barrel', action: 'appear' },
            { block: 'pie', action: 'drop-center' }
          ],
          reactions: ['sparkle-magic', 'confetti-burst', 'hearts-float'],
          feedback: "Each adventurer uses their own skill: knight leads, ranger organizes, barbarian lifts, mage cleans with magic, rogue has a backup plan. Every skill you've learned in one answer!"
        },
        {
          sampleInput: "Step 1: The ranger assesses the damage and makes a plan. Step 2: The barbarian carries the heavy broken stuff away. Step 3: The knight guards the remaining food from ants. Step 4: The mage uses a levitation spell to rescue the floating drinks and bring them back to the table. Step 5: The rogue sneaks off and comes back with fresh apples from a nearby tree.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'ranger', action: 'appear-center', anim: 'Interact' },
            { block: 'barbarian', action: 'enter-left', anim: 'PickUp' },
            { block: 'knight', action: 'appear-right', anim: 'Melee_Block' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'drink', count: 3, action: 'float-above' },
            { block: 'rogue', action: 'appear-left', anim: 'Sneaking' },
            { block: 'apple', count: 4, action: 'bounce-in' }
          ],
          reactions: ['sparkle-magic', 'stars-spin', 'confetti-burst'],
          feedback: "Numbered steps, each character solving a different problem their own way. Completeness, order, perspective, and context all in one. Master Prompter!"
        },
        {
          sampleInput: "The mage reverses his sneeze spell so the giant food shrinks back to normal. The knight apologizes to everyone and sets up new plates. The barbarian runs to the pond and brings water for everyone because the drinks spilled. The rogue picks flowers and puts them in a cup as a centerpiece to make things nice again. The ranger puts the saved food back on the table in neat rows.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'knight', action: 'appear-center', anim: 'Interact' },
            { block: 'barbarian', action: 'enter-left', anim: 'Running_A' },
            { block: 'drink', count: 3, action: 'appear' },
            { block: 'rogue', action: 'appear-right', anim: 'Walking_A' },
            { block: 'balloon', count: 3, action: 'float-above' },
            { block: 'ranger', action: 'appear-right', anim: 'Interact' },
            { block: 'sandwich', count: 2, action: 'appear' },
            { block: 'apple', count: 3, action: 'appear' }
          ],
          reactions: ['sparkle-magic', 'hearts-float', 'confetti-burst'],
          feedback: "Every character contributes their unique talent. The mage uses context (magic), the barbarian uses strength, the rogue adds creativity, the ranger brings order. ALL skills integrated!"
        },

        // PARTIAL_SUCCESS responses (4)
        {
          sampleInput: "They clean up the mess",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks'],
          feedback: "WHO cleans WHAT? Each adventurer should fix a different thing their own way!"
        },
        {
          sampleInput: "The mage fixes everything with magic",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "The mage can't do it alone! What does each OTHER adventurer contribute?"
        },
        {
          sampleInput: "Everyone picks up the food and puts it back",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'PickUp' },
            { block: 'barbarian', action: 'appear-right', anim: 'PickUp' }
          ],
          reactions: [],
          feedback: "That's one action for everyone. But each adventurer has a DIFFERENT skill. How does each help differently?"
        },
        {
          sampleInput: "The knight leads and the barbarian helps carry stuff back",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Waving' },
            { block: 'barbarian', action: 'appear-left', anim: 'PickUp' }
          ],
          reactions: [],
          feedback: "Two characters covered! What about the mage, rogue, and ranger? Each fixes something differently."
        },

        // FUNNY_FAIL responses (3)
        {
          sampleInput: "go home",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Walking_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Don't give up! Five adventurers, five talents. How does EACH one help fix the mess?"
        },
        {
          sampleInput: "eat the mess",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['laugh-tears'],
          feedback: "Ha! The barbarian would try that. But the OTHERS want to save the picnic properly. Step by step, who does what?"
        },
        {
          sampleInput: "magic",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['question-marks'],
          feedback: "Magic helps, but there are FIVE adventurers! What does each one do? Be specific, complete, and in order!"
        }
      ],

      hints: [
        "Five adventurers = five different solutions. What's each one best at?",
        "The knight leads, the barbarian lifts heavy things, the mage uses spells, the rogue is sneaky-clever, the ranger is organized. How does each help?",
        "Put the rescue in order: who goes first? What do they fix? Then who goes next? Use all your skills!"
      ]
    },

    // ─── STAGE 4: The Grand Finale ──────────────────────────────────────
    {
      title: "The Grand Finale",
      narration: "Against all odds, the picnic is back on track!",
      question: "Describe the perfect ending. What does each adventurer do? Make it specific, complete, in order, in character, and creative!",

      responses: [
        // FULL_SUCCESS responses (4)
        {
          sampleInput: "The knight raises his cup and makes a toast: 'To the worst picnic that became the best!' Everyone cheers. The barbarian shares the last burger with the ranger because she helped the most. The mage makes sparkle fireworks above the trees. The rogue reveals he saved the birthday cake the whole time and puts it on the table with candles. Balloons float up from behind the barrel. Everyone sits in a circle and laughs about the disaster.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'drink', count: 1, action: 'appear' },
            { block: 'barbarian', action: 'appear-left', anim: 'Interact' },
            { block: 'ranger', action: 'appear-right', anim: 'Cheering' },
            { block: 'burger', count: 1, action: 'appear' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Shoot' },
            { block: 'rogue', action: 'enter-left', anim: 'Walking_A' },
            { block: 'cake_birthday', action: 'drop-center' },
            { block: 'balloon', count: 10, action: 'float-above' },
            { block: 'barrel', action: 'appear' }
          ],
          reactions: ['sparkle-magic', 'hearts-float', 'confetti-burst', 'stars-spin'],
          feedback: "EVERY skill: specific toast, complete character list, magical context, sequential moments, each character's personality, creative balloon reveal, and all five integrated. MASTER PROMPTER ACHIEVEMENT UNLOCKED!"
        },
        {
          sampleInput: "Step 1: The ranger calls everyone together. Step 2: They sit in a circle on the ground since the chairs are broken. Step 3: The barbarian puts out the remaining sandwiches, apples, and chips. Step 4: The mage enchants the ice cream so it doesn't melt. Step 5: The knight tells the story of the disaster and everyone laughs. Step 6: The rogue does a sneaky magic trick with cups. Step 7: The mage makes stars spin above them as the sun sets. They all agree it was the best adventure yet.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'ranger', action: 'appear-center', anim: 'Waving' },
            { block: 'knight', action: 'appear-left', anim: 'Sit_Floor_Down' },
            { block: 'barbarian', action: 'appear-right', anim: 'Sit_Floor_Down' },
            { block: 'sandwich', count: 2, action: 'appear' },
            { block: 'apple', count: 3, action: 'appear' },
            { block: 'chips', count: 2, action: 'appear' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'ice_cream', count: 3, action: 'appear' },
            { block: 'rogue', action: 'appear-right', anim: 'Interact' }
          ],
          reactions: ['sparkle-magic', 'laugh-tears', 'stars-spin', 'hearts-float', 'confetti-burst'],
          feedback: "Seven numbered steps, five distinct characters, creative food saving, storytelling, and a magical sunset finale. Every single skill combined. You are a Master Prompter!"
        },
        {
          sampleInput: "The mage creates floating lanterns with magic so the picnic glows in the evening light. The knight serves everyone a plate personally because that's his chivalry. The barbarian arm-wrestles the rogue for the last cupcake -- the rogue wins by tickling him! The ranger takes out her journal and draws a picture of everyone together. They pass around coffee and pie. Balloons the mage enchanted earlier drift overhead with little sparkle trails.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'barbarian', action: 'appear-right', anim: 'Interact' },
            { block: 'rogue', action: 'appear-right', anim: 'Cheering' },
            { block: 'cupcake', count: 1, action: 'appear' },
            { block: 'ranger', action: 'appear-left', anim: 'Interact' },
            { block: 'coffee', action: 'appear' },
            { block: 'pie', action: 'drop-center' },
            { block: 'balloon', count: 6, action: 'float-above' }
          ],
          reactions: ['sparkle-magic', 'laugh-tears', 'stars-spin', 'hearts-float', 'confetti-burst'],
          feedback: "Magical lanterns, chivalrous knight, arm-wrestling comedy, artistic ranger, enchanted balloons. Specific, complete, contextual, sequential, perspective-driven, creatively constrained, and beautifully integrated. PERFECTION."
        },

        // PARTIAL_SUCCESS responses (4)
        {
          sampleInput: "They eat and have fun",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Cheering' }
          ],
          reactions: ['confetti-burst'],
          feedback: "This is your capstone moment! WHO eats WHAT? How does EACH adventurer make the ending special? Use ALL your skills!"
        },
        {
          sampleInput: "Everyone sits down and eats the remaining food",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Sit_Floor_Down' },
            { block: 'barbarian', action: 'appear-right', anim: 'Sit_Floor_Down' },
            { block: 'sandwich', count: 1, action: 'appear' }
          ],
          reactions: [],
          feedback: "What does each character DO that shows their personality? The mage, the rogue, the ranger -- each should shine!"
        },
        {
          sampleInput: "The mage makes fireworks and they all cheer",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Shoot' }
          ],
          reactions: ['sparkle-magic', 'confetti-burst'],
          feedback: "Beautiful fireworks! But what about the other four? Make each adventurer's ending moment special!"
        },
        {
          sampleInput: "The knight makes a speech and everyone claps. They eat cake.",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'cake_birthday', action: 'appear-center' }
          ],
          reactions: ['confetti-burst'],
          feedback: "Good toast! Now add what each OTHER adventurer contributes to the perfect ending."
        },

        // FUNNY_FAIL responses (3)
        {
          sampleInput: "done",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Not quite! The grand finale needs EVERY adventurer doing something special. This is your Master Prompter moment!"
        },
        {
          sampleInput: "they leave",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Walking_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Don't end it yet! The best endings have everyone celebrating. What does each adventurer do?"
        },
        {
          sampleInput: "party",
          successLevel: 'FUNNY_FAIL',
          elements: [],
          reactions: ['confetti-burst', 'question-marks'],
          feedback: "WHAT kind of party? Use all your skills: name each character, describe what they do, in what order, using their personality, with creative touches!"
        }
      ],

      hints: [
        "This is your chance to use EVERY skill: specificity, completeness, context, order, perspective, and creativity. What does EACH adventurer do?",
        "The best endings have each character doing something that shows who they are. The knight leads, the mage uses magic, the rogue surprises everyone...",
        "Describe the scene step by step: first someone does something, then someone else, building to a big happy finale with everyone together!"
      ]
    }
  ]
} satisfies Story;
