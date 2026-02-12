/**
 * Story 3: Mage vs. The Cursed Kitchen
 * Skill: Context — "Set the Scene"
 * Teaching Goal: HOW you describe a situation matters. Context (who, where, what situation) changes the outcome.
 */

import type { Story } from './types';

export const MAGE_KITCHEN = {
  id: 'mage-kitchen',
  title: "Mage vs. The Cursed Kitchen",
  order: 3,
  skill: 'context',
  teachingGoal: "HOW you describe a situation matters. Context (who, where, what situation) changes the outcome.",
  characters: ['mage', 'witch', 'skeleton_minion'],
  props: [],

  stages: [
    // ─── STAGE 1: "The Kitchen Is Alive!" ────────────────────────────────
    {
      title: "The Kitchen Is Alive!",
      narration: "The mage tried a cooking spell and now the stove is angry, the pots are flying, and the fridge won't stop opening and slamming shut!",
      question: "Describe what's happening in the kitchen right now. Who is where? What's going wrong? Give us the full picture!",
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput: "The mage is standing on the left side looking scared because the stove on the right is shooting fire. Pots and pans are flying around the center. The fridge door keeps opening and slamming shut on its own.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'enter-left', anim: 'Hit_A' }
          ],
          reactions: ['fire-sneeze', 'explosion-cartoon'],
          feedback: "Excellent context! You told us WHO, WHERE, and WHAT'S WRONG. The full picture!"
        },
        {
          sampleInput: "The mage is in the middle surrounded by disaster. The stove is burning out of control because the spell made it too powerful. Skeleton minions are running away from the fridge that keeps chasing them.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Raise' },
            { block: 'skeleton_minion', count: 3, action: 'enter-right' }
          ],
          reactions: ['fire-sneeze', 'explosion-cartoon', 'laugh-tears'],
          feedback: "You set the scene perfectly: the mage's position, the stove's problem, AND why the skeletons are panicking!"
        },
        {
          sampleInput: "The witch came to help but she's hiding behind the cabinet because the oven exploded. The mage is trying to cast a calming spell but a pot keeps bonking him on the head.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'witch', action: 'appear-left', anim: 'Idle_A' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Two characters, each in a specific spot, each with a specific problem. That's rich context!"
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "The kitchen is a mess",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "What KIND of mess? Where is the mage? What appliances are going crazy?"
        },
        {
          sampleInput: "The stove is on fire and things are flying",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [],
          reactions: ['fire-sneeze', 'explosion-cartoon'],
          feedback: "Where's the mage? What's HE doing about it?"
        },
        {
          sampleInput: "The mage messed up his spell and everything is breaking",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "WHICH appliances are affected? Where is each one?"
        },
        {
          sampleInput: "Everything is on fire and the mage is scared",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['fire-sneeze'],
          feedback: "Where exactly? And what's the mage doing about it?"
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "cook dinner",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "The kitchen is CURSED -- first describe what's going wrong!"
        },
        {
          sampleInput: "hi",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Waving' }
          ],
          reactions: ['question-marks'],
          feedback: "The kitchen is in chaos! Describe the situation: who is where, and what's going wrong?"
        },
        {
          sampleInput: "run away",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Running_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Running doesn't help! Tell us what the scene looks like: where is the mage, what's broken?"
        }
      ],
      hints: [
        "Look around the kitchen -- what's going wrong? Where is the mage standing?",
        "Describe each problem: what's the stove doing? What's the fridge doing? Where is the mage?",
        "The best descriptions tell us WHO is where, WHAT is happening, and WHY it's going wrong."
      ]
    },

    // ─── STAGE 2: "Tame the Stove!" ──────────────────────────────────────
    {
      title: "Tame the Stove!",
      narration: "First things first -- the fire-breathing stove needs to be stopped!",
      question: "How does the mage stop the angry stove? Remember: this is a MAGIC kitchen with a CURSED stove. The solution needs to fit the situation!",
      responses: [
        // FULL_SUCCESS (4)
        {
          sampleInput: "The mage raises his staff and casts a frost spell from the left toward the stove on the right. The ice magic cools down the stove and puts out the fire. Sparkles appear when the spell works!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-left', anim: 'Ranged_Magic_Spellcasting_Long' }
          ],
          reactions: ['sparkle-magic', 'stars-spin'],
          feedback: "A magical solution for a magical problem! Frost spell for fire -- context-perfect!"
        },
        {
          sampleInput: "The witch teaches the mage a calming enchantment. He stands in front of the stove and chants it. The fire gets smaller until it's just a gentle flame.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'witch', action: 'appear-left', anim: 'Interact' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'witch', action: 'appear-left', anim: 'Cheering' }
          ],
          reactions: ['sparkle-magic', 'hearts-float'],
          feedback: "You used BOTH characters in context! The witch as teacher, the mage as student!"
        },
        {
          sampleInput: "The mage uses a summoning spell to call a skeleton minion to throw water from the sink onto the stove. The magic fire goes out!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-left', anim: 'Ranged_Magic_Summon' },
            { block: 'skeleton_minion', action: 'enter-right', anim: 'Interact' }
          ],
          reactions: ['sparkle-magic', 'confetti-burst'],
          feedback: "Summoning, skeleton's help, AND the kitchen's own sink. Everything fits the context!"
        },
        {
          sampleInput: "The mage remembers the stove is cursed, not broken. So he uses a peaceful spell to remove the curse. Purple magic surrounds the stove. The fire changes from angry red to gentle blue.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting_Long' }
          ],
          reactions: ['sparkle-magic', 'stars-spin', 'hearts-float'],
          feedback: "You recognized the CONTEXT (cursed, not broken) and chose the right approach. That's exactly what context-awareness means!"
        },

        // PARTIAL_SUCCESS (3)
        {
          sampleInput: "Turn it off",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks'],
          feedback: "This is a CURSED magical stove -- normal solutions won't work! What SPELL could stop it?"
        },
        {
          sampleInput: "Use magic on it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "What KIND of magic? A frost spell? A calming charm? Match the spell to the problem!"
        },
        {
          sampleInput: "The mage casts a spell",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: [],
          feedback: "WHICH spell? WHY that spell? Think about what the stove's problem is."
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "punch it",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "The mage is a WIZARD, not a boxer! What magical solution fits this magical problem?"
        },
        {
          sampleInput: "sit down",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Sit_Floor_Down' }
          ],
          reactions: ['fire-sneeze'],
          feedback: "The stove is still on fire! Think about what the mage has (magic!) and what the problem is (fire curse!)."
        },
        {
          sampleInput: "ask it nicely",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "Politeness is great but this stove is CURSED! What kind of magic spell could fix a fire curse?"
        }
      ],
      hints: [
        "The stove is cursed with fire magic. What kind of spell could fight fire?",
        "The mage could use frost, calming, or water magic. Which one fits this problem best?",
        "Remember the CONTEXT: it's a curse, not a regular fire. The solution needs to be magical too!"
      ]
    },

    // ─── STAGE 3: "Save the Dinner!" ─────────────────────────────────────
    {
      title: "Save the Dinner!",
      narration: "The stove is tamed! But the kitchen is a mess and there's no dinner. Time to cook -- with magic!",
      question: "How does the mage cook dinner in this magical kitchen? Who helps? What do they make? Remember the context -- this is a MAGICAL kitchen!",
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput: "The mage uses a levitation spell to float the pots back onto the stove. The witch stirs with a magic wand while the mage heats it up with a gentle fire spell. Skeleton minions carry plates to the table. They make enchanted soup that glows purple!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-left', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'witch', action: 'appear-center', anim: 'Interact' },
            { block: 'skeleton_minion', count: 2, action: 'enter-right', anim: 'Walking_A' }
          ],
          reactions: ['sparkle-magic', 'hearts-float', 'stars-spin'],
          feedback: "Magical cooking with magical tools! Levitation for pots, wand for stirring, fire spell for heat -- every solution fits the context!"
        },
        {
          sampleInput: "The witch tells the mage to use a summoning spell to call fresh ingredients from the garden. The mage waves his staff and vegetables float in through the window. The skeleton minions chop them with tiny swords. The witch enchants the stove to cook at the perfect temperature.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'witch', action: 'appear-left', anim: 'Interact' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Summon' },
            { block: 'skeleton_minion', count: 3, action: 'enter-right', anim: 'Interact' },
            { block: 'witch', action: 'appear-left', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic', 'confetti-burst'],
          feedback: "You used the context perfectly: summoning spells for ingredients, enchantment for temperature, skeleton helpers with swords as knives!"
        },
        {
          sampleInput: "The mage casts a time-reverse spell on the mess so the broken dishes fix themselves. Then the witch brews a potion in the cauldron that turns into a feast. The skeleton minions set the table while the mage lights candles with tiny fire spells.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting_Long' },
            { block: 'witch', action: 'appear-left', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'skeleton_minion', count: 2, action: 'enter-right', anim: 'Interact' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Shoot' }
          ],
          reactions: ['sparkle-magic', 'stars-spin', 'hearts-float'],
          feedback: "Time magic to fix the mess, potion-brewing for cooking, fire spells for candles -- every detail is magical. Context master!"
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "They cook food",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Cook HOW? This is a magical kitchen! What spells do they use? Who does what?"
        },
        {
          sampleInput: "The mage makes dinner with the stove",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: [],
          feedback: "The stove was just cursed! How does the mage cook with MAGIC instead of normally?"
        },
        {
          sampleInput: "The witch helps cook something",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'witch', action: 'appear-left', anim: 'Interact' },
            { block: 'mage', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: [],
          feedback: "What does she cook? HOW does she cook it? Remember, she's a WITCH with magic!"
        },
        {
          sampleInput: "They make soup",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Soup sounds good! But how do they make it in a MAGICAL kitchen? What spells are involved?"
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "order takeout",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "No delivery to a cursed kitchen! How would a MAGE cook using MAGIC?"
        },
        {
          sampleInput: "microwave it",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "No microwaves in a magical kitchen! Think about what spells could help cook dinner."
        },
        {
          sampleInput: "give up",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Never! The mage has MAGIC! Think about what spells could help: fire for heat, levitation for pots, summoning for ingredients!"
        }
      ],
      hints: [
        "What magical tools does the mage have? How could spells help with cooking?",
        "The witch knows potions and the mage knows spells. How could they BOTH contribute?",
        "Think about the context: magical ingredients, enchanted tools, spell-powered cooking. What does that dinner look like?"
      ]
    }
  ]
} satisfies Story;
