/**
 * Story 1: Skeleton's Surprise Birthday Party
 * Skill: Specificity — "Paint the Picture"
 * Teaching Goal: More details = better results. Vague instructions produce vague (and funny) outcomes.
 */

import type { Story } from './types';

export const SKELETON_BIRTHDAY = {
  id: 'skeleton-birthday',
  title: "Skeleton's Surprise Birthday Party",
  order: 1,
  skill: 'specificity',
  teachingGoal: 'More details = better results. Vague instructions produce vague (and funny) outcomes.',
  characters: [
    'skeleton_warrior',
    'skeleton_mage',
    'skeleton_minion',
    'knight',
    'mage',
    'rogue'
  ],
  props: [
    'table_long',
    'chair',
    'torch',
    'barrel',
    'banner_blue',
    'banner_red',
    'present',
    'present_B_blue',
    'present_C_green',
    'cake_birthday',
    'cupcake',
    'balloon'
  ],
  stages: [
    // ═══════════════════════════════════════════════════════════════════════
    // STAGE 1: "Who's Invited?"
    // ═══════════════════════════════════════════════════════════════════════
    {
      title: "Who's Invited?",
      narration: "A skeleton just found out birthdays exist! He wants to throw a party but has no idea who to invite!",
      question: "Tell the skeleton WHO should come to the birthday party. Be as specific as you can!",
      responses: [
        // ─────────────────────────────────────────────────────────────────
        // FULL_SUCCESS (1-4)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "Invite the knight, the mage, and the rogue! The knight brings his shield, the mage does sparkly magic, and the rogue sneaks in with presents.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Cheering' },
            { block: 'knight', action: 'enter-left', anim: 'Waving' },
            { block: 'mage', action: 'enter-right', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'rogue', action: 'enter-left', anim: 'Walking_A' },
            { block: 'present', count: 3, action: 'bounce-in' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Brilliant! You named specific guests AND said what each one does. That's amazing detail!"
        },
        {
          sampleInput: "The skeleton mage and four skeleton minions should come. They're all his dungeon friends and they can do a skeleton dance together!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'skeleton_mage', action: 'enter-left', anim: 'Skeletons_Walking' },
            { block: 'skeleton_minion', count: 4, action: 'enter-right' }
          ],
          reactions: ['confetti-burst'],
          feedback: "Love it! You told us exactly who AND what they'd do together. Great specificity!"
        },
        {
          sampleInput: "Invite the knight in shiny armor, the sneaky rogue who hides behind barrels, and the mage who shoots sparkle spells. They should all wave hello when they arrive.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Waving' },
            { block: 'knight', action: 'enter-left', anim: 'Waving' },
            { block: 'rogue', action: 'enter-right', anim: 'Walking_A' },
            { block: 'mage', action: 'enter-left', anim: 'Waving' },
            { block: 'barrel', count: 2, action: 'appear' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Perfect! You described each guest with details that make the scene come alive!"
        },
        {
          sampleInput: "The knight and skeleton mage are best friends so they should come in together from the left side. Then the rogue sneaks in from the right with a surprise gift.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Cheering' },
            { block: 'knight', action: 'enter-left', anim: 'Walking_A' },
            { block: 'skeleton_mage', action: 'enter-left', anim: 'Skeletons_Walking' },
            { block: 'rogue', action: 'enter-right', anim: 'Walking_A' },
            { block: 'present', count: 1, action: 'drop-center' }
          ],
          reactions: ['stars-spin'],
          feedback: "You told us who, where they enter, and why! That's top-tier specificity!"
        },

        // ─────────────────────────────────────────────────────────────────
        // PARTIAL_SUCCESS (5-7)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "Invite some friends",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks'],
          feedback: "Good start! But WHICH friends? Try naming the actual characters, like 'the knight' or 'the mage.'"
        },
        {
          sampleInput: "The knight should come",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Waving' },
            { block: 'knight', action: 'enter-left', anim: 'Walking_A' }
          ],
          reactions: [],
          feedback: "Nice, you named one guest! Can you invite more people and describe what they do?"
        },
        {
          sampleInput: "Bring everyone to the party with decorations",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Cheering' },
            { block: 'knight', action: 'enter-left', anim: 'Walking_A' },
            { block: 'banner_red', count: 1, action: 'appear' }
          ],
          reactions: [],
          feedback: "You mentioned decorations -- cool! But who exactly is 'everyone'? Name the characters!"
        },

        // ─────────────────────────────────────────────────────────────────
        // FUNNY_FAIL (8-10)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "party",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['sad-cloud'],
          feedback: "The skeleton needs more to work with! WHO should come? Describe your guests!"
        },
        {
          sampleInput: "make a sandwich",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' }
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "Ha! Sandwiches are great, but this is a birthday party! Who should the skeleton invite?"
        },
        {
          sampleInput: "yes",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks'],
          feedback: "The skeleton is confused! Try saying something like: 'Invite the knight and the mage to the party!'"
        }
      ],
      hints: [
        "Hmm, who do you want at this party? Can you name specific characters?",
        "What if you said which adventurers should come? Like the knight, the mage, or the rogue?",
        "The more people you name, the bigger the party gets! Who else should show up?"
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // STAGE 2: "Decorate the Dungeon!"
    // ═══════════════════════════════════════════════════════════════════════
    {
      title: "Decorate the Dungeon!",
      narration: "The guests are on their way! But the dungeon looks like... well, a dungeon. It needs decorations!",
      question: "Tell the skeleton how to decorate the dungeon for the party. What should it look like?",
      responses: [
        // ─────────────────────────────────────────────────────────────────
        // FULL_SUCCESS (1-4)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "Hang blue and red banners on the walls. Put torches everywhere so the dungeon is bright. Set up a long table in the middle with chairs around it.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'banner_blue', count: 2, action: 'appear-left' },
            { block: 'banner_red', count: 2, action: 'appear-right' },
            { block: 'torch', count: 4, action: 'appear' },
            { block: 'table_long', action: 'appear-center' },
            { block: 'chair', count: 4, action: 'appear' }
          ],
          reactions: [],
          feedback: "Wow! You told us WHAT decorations, WHERE they go, and HOW MANY. That's incredible detail!"
        },
        {
          sampleInput: "Float 10 balloons above the table. Put red and blue banners along the back wall. Light up torches on both sides so everyone can see.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'balloon', count: 10, action: 'float-above' },
            { block: 'banner_blue', count: 2, action: 'appear' },
            { block: 'banner_red', count: 2, action: 'appear' },
            { block: 'torch', count: 4, action: 'appear' },
            { block: 'table_long', action: 'appear-center' }
          ],
          reactions: [],
          feedback: "You said exactly how many balloons (10!), where the banners go, and how the torches work. Perfect!"
        },
        {
          sampleInput: "Stack barrels in the corners for spooky dungeon vibes. Hang the blue banner behind the table. Put four torches along the walls so it's not too dark and not too bright.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barrel', count: 3, action: 'appear' },
            { block: 'banner_blue', count: 2, action: 'appear' },
            { block: 'torch', count: 4, action: 'appear' },
            { block: 'table_long', action: 'appear-center' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Love the specific mood you described! 'Not too dark, not too bright' -- that's great detail!"
        },
        {
          sampleInput: "Put a long table in the center. Chairs on both sides for the guests. Red banners everywhere and balloons floating from the ceiling.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'table_long', action: 'appear-center' },
            { block: 'chair', count: 4, action: 'appear' },
            { block: 'banner_red', count: 3, action: 'appear' },
            { block: 'balloon', count: 6, action: 'float-above' }
          ],
          reactions: ['confetti-burst'],
          feedback: "You covered the table, seating, wall decorations, AND ceiling decorations. Complete picture!"
        },

        // ─────────────────────────────────────────────────────────────────
        // PARTIAL_SUCCESS (5-7)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "Make it look nice",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'torch', count: 1, action: 'appear' }
          ],
          reactions: ['question-marks'],
          feedback: "What does 'nice' look like to you? Try describing specific decorations -- banners, balloons, torches?"
        },
        {
          sampleInput: "Put some balloons",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'balloon', count: 3, action: 'float-above' }
          ],
          reactions: [],
          feedback: "Balloons are a great start! How many? And what else should the dungeon have? Tables? Banners?"
        },
        {
          sampleInput: "Decorations and lights",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'torch', count: 2, action: 'appear' },
            { block: 'banner_red', count: 1, action: 'appear' }
          ],
          reactions: [],
          feedback: "You mentioned the right categories! Now be specific: WHICH decorations? HOW MANY lights? WHERE do they go?"
        },

        // ─────────────────────────────────────────────────────────────────
        // FUNNY_FAIL (8-10)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "paint it",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Ha! We can't paint, but we CAN add banners, balloons, torches, and tables! What should the dungeon have?"
        },
        {
          sampleInput: "i dont know",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['sad-cloud'],
          feedback: "That's okay! Imagine a party room -- what would you see? Balloons? Banners? A big table?"
        },
        {
          sampleInput: "boo",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['explosion-cartoon'],
          feedback: "You scared him! Now help him decorate -- try listing things like 'red banners, torches, and a long table.'"
        }
      ],
      hints: [
        "What would make a dark dungeon look party-ready? Think about what you'd see at a real birthday!",
        "Can you describe specific things to hang on the walls or put on the tables?",
        "How many of each decoration? Where should they go? The more detail, the better the party looks!"
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // STAGE 3: "The Birthday Cake!"
    // ═══════════════════════════════════════════════════════════════════════
    {
      title: "The Birthday Cake!",
      narration: "Guests? Check. Decorations? Check. But wait -- there's no cake! And you can't have a birthday without cake!",
      question: "Describe the perfect birthday cake for a skeleton. Where does it go? What happens when it arrives?",
      responses: [
        // ─────────────────────────────────────────────────────────────────
        // FULL_SUCCESS (1-3)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "A giant birthday cake drops from the ceiling into the center of the table! The skeleton cheers and all the guests wave. Then confetti explodes everywhere!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'cake_birthday', action: 'drop-center' },
            { block: 'skeleton_warrior', anim: 'Cheering', action: 'appear-center' },
            { block: 'knight', anim: 'Waving', action: 'appear-left' },
            { block: 'mage', anim: 'Waving', action: 'appear-right' }
          ],
          reactions: ['confetti-burst', 'stars-spin'],
          feedback: "You described the cake, how it arrives (drops!), where it goes (center table), and what everyone does after. Masterful!"
        },
        {
          sampleInput: "The rogue sneaks in from the left carrying a big birthday cake. He puts it on the table. Cupcakes for the skeleton minions bounce in from the right. Everyone cheers!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'rogue', action: 'enter-left', anim: 'Walking_A' },
            { block: 'cake_birthday', action: 'drop-center' },
            { block: 'cupcake', count: 4, action: 'bounce-in' },
            { block: 'skeleton_minion', count: 4, anim: 'Cheering', action: 'appear-right' }
          ],
          reactions: ['confetti-burst', 'hearts-float'],
          feedback: "You told a little story: who carries it, where it goes, AND what the others get. Beautiful detail!"
        },
        {
          sampleInput: "A huge cake with candles appears in the center. The skeleton walks up to it from the left, and the mage uses sparkle magic to light the candles. Then hearts float everywhere because everyone is happy.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'cake_birthday', action: 'appear-center' },
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
            { block: 'mage', anim: 'Ranged_Magic_Spellcasting', action: 'appear-right' }
          ],
          reactions: ['sparkle-magic', 'hearts-float'],
          feedback: "You described the cake, the skeleton's reaction, AND the mage's role. Each detail makes the scene richer!"
        },

        // ─────────────────────────────────────────────────────────────────
        // PARTIAL_SUCCESS (4-7)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "Put a cake there",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'cake_birthday', action: 'appear-center' }
          ],
          reactions: [],
          feedback: "The cake is here! But how does it arrive? Who reacts? What happens next? Add more details!"
        },
        {
          sampleInput: "birthday cake and cupcakes",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'cake_birthday', action: 'drop-center' },
            { block: 'cupcake', count: 2, action: 'bounce-in' }
          ],
          reactions: [],
          feedback: "Good food choices! Now describe HOW they arrive and what everyone DOES when they see the cake."
        },
        {
          sampleInput: "A big cake falls in and everyone is happy",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'cake_birthday', action: 'drop-center' }
          ],
          reactions: ['confetti-burst'],
          feedback: "Nice action! But WHO is happy? What do they do? Do they cheer? Wave? Dance?"
        },
        {
          sampleInput: "Cake with presents",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'cake_birthday', action: 'appear-center' },
            { block: 'present', count: 2, action: 'bounce-in' }
          ],
          reactions: [],
          feedback: "Great items! Try adding what the skeleton DOES when he sees the cake. Does he cheer? Jump?"
        },

        // ─────────────────────────────────────────────────────────────────
        // FUNNY_FAIL (8-10)
        // ─────────────────────────────────────────────────────────────────
        {
          sampleInput: "eat",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' }
          ],
          reactions: ['question-marks'],
          feedback: "Skeletons have trouble eating! Describe what KIND of cake and how it gets to the party."
        },
        {
          sampleInput: "no cake",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "Oh no, the skeleton is heartbroken! Every birthday needs cake. Describe one for him!"
        },
        {
          sampleInput: "a million pizzas",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' }
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Ha! This is a BIRTHDAY party, not a pizza party! Describe the birthday cake!"
        }
      ],
      hints: [
        "What does the cake look like? How does it get to the party? Does it drop from the ceiling? Does someone carry it?",
        "When the cake shows up, what does the skeleton do? Does he cheer? Jump? What about the guests?",
        "The best descriptions tell us WHAT happens AND HOW everyone reacts!"
      ]
    }
  ]
} satisfies Story;
