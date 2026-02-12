/**
 * Story 6: Dungeon Rock Concert
 * Skill: Creative Constraints — "Color Inside the Lines"
 * Teaching Goal: Be creative WITHIN limits. No real instruments -- only dungeon stuff!
 */

import type { Story } from './types';

export const DUNGEON_CONCERT = {
  id: 'dungeon-concert',
  title: 'Dungeon Rock Concert',
  order: 6,
  skill: 'creative-constraints',
  teachingGoal: "Working within limitations sparks creativity. No instruments? Turn dungeon items into music!",
  characters: ['skeleton_warrior', 'knight', 'mage', 'barbarian', 'rogue', 'ranger', 'clown'],
  props: ['barrel', 'torch', 'chest'],

  stages: [
    // ─── STAGE 1: ASSEMBLE THE BAND ──────────────────────────────────────────
    {
      title: "Assemble the Band!",
      narration: "The dungeon creatures want to rock! But there are no instruments -- only dungeon stuff. Time to get creative!",
      question: "Pick band members and assign each one a dungeon 'instrument.' No guitars or drums exist -- only barrels, torches, chairs, and banners!",

      responses: [
        // FULL_SUCCESS (4)
        {
          sampleInput: "The skeleton warrior is the drummer -- he bangs on three barrels! The knight uses a torch as a microphone and sings. The mage waves the blue banner like a rock star flag. The barbarian pounds on the table like a bass drum!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'barrel', count: 3, action: 'appear' },
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'torch', count: 1, action: 'appear' },
            { block: 'mage', action: 'appear-right', anim: 'Waving' },
            { block: 'banner_blue', count: 1, action: 'appear' },
            { block: 'barbarian', action: 'appear-left', anim: 'Hammer' },
            { block: 'table_long', action: 'appear' }
          ],
          reactions: ['stars-spin', 'confetti-burst'],
          feedback: "Barrels as drums, torch as mic -- that's creative thinking within constraints!"
        },
        {
          sampleInput: "The barbarian flips a barrel upside down and drums on it with his fists. The clown juggles torches while dancing. The rogue taps chairs with sticks. The ranger waves red and blue banners.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' },
            { block: 'barrel', count: 1, action: 'appear' },
            { block: 'clown', action: 'appear-right', anim: 'Jump_Full_Short' },
            { block: 'torch', count: 2, action: 'appear' },
            { block: 'rogue', action: 'appear-left', anim: 'Work_A' },
            { block: 'chair', count: 2, action: 'appear' },
            { block: 'ranger', action: 'appear-right', anim: 'Waving' },
            { block: 'banner_red', count: 1, action: 'appear' },
            { block: 'banner_blue', count: 1, action: 'appear' }
          ],
          reactions: ['confetti-burst'],
          feedback: "Every character has a unique role using only dungeon stuff! Maximum creativity!"
        },
        {
          sampleInput: "The skeleton warrior is lead singer because his jaw rattles when he sings. He holds a torch like a microphone. The knight and barbarian each have barrels as drums. The mage makes sparkle effects with magic as the light show.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'torch', count: 1, action: 'appear' },
            { block: 'knight', action: 'appear-left', anim: 'Hammer' },
            { block: 'barbarian', action: 'appear-right', anim: 'Hammer' },
            { block: 'barrel', count: 2, action: 'appear' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic', 'stars-spin'],
          feedback: "A rattling jaw as singing! And mage's magic as the light show -- genius within constraints!"
        },
        {
          sampleInput: "The clown is the frontman. The skeleton warrior bangs barrels for drums. The knight stands on a chair and uses a banner as a cape while doing air guitar. The mage shoots sparkle magic to the beat.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'clown', action: 'appear-center', anim: 'Jump_Full_Short' },
            { block: 'skeleton_warrior', action: 'appear-right', anim: 'Hammer' },
            { block: 'barrel', count: 2, action: 'appear' },
            { block: 'knight', action: 'appear-left', anim: 'Cheering' },
            { block: 'chair', count: 1, action: 'appear' },
            { block: 'banner_red', count: 1, action: 'appear' },
            { block: 'mage', action: 'appear-right', anim: 'Ranged_Magic_Shoot' }
          ],
          reactions: ['sparkle-magic', 'confetti-burst'],
          feedback: "Banner as a cape, chair as a stage -- every constraint became an opportunity!"
        },

        // PARTIAL_SUCCESS (3)
        {
          sampleInput: "The knight plays guitar and the barbarian plays drums",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Interact' },
            { block: 'barbarian', action: 'appear-right', anim: 'Hammer' }
          ],
          reactions: ['question-marks'],
          feedback: "There's no guitar or drums! What dungeon objects could BECOME instruments?"
        },
        {
          sampleInput: "Everyone plays music",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' },
            { block: 'skeleton_warrior', action: 'appear-left', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "Who plays what? Only barrels, torches, banners, and tables. Get creative!"
        },
        {
          sampleInput: "The barbarian hits barrels",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' },
            { block: 'barrel', count: 1, action: 'appear' }
          ],
          reactions: [],
          feedback: "Barrel drums -- creative! Now give every band member a dungeon 'instrument.'"
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "play music",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks'],
          feedback: "With WHAT? No instruments, only dungeon stuff. What creative substitutes can you invent?"
        },
        {
          sampleInput: "buy instruments from a store",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "No stores in a dungeon! Could a barrel be a drum? A torch a microphone?"
        },
        {
          sampleInput: "quiet",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "No way! Pick characters and turn dungeon stuff into instruments!"
        }
      ],

      hints: [
        "Look around the dungeon: barrels, torches, tables, banners. What could each one become if you use your imagination?",
        "A barrel could be a drum, a torch could be a microphone. What else could work?",
        "Pick your band members first, then assign each one a dungeon object as their instrument. Be creative!"
      ]
    },

    // ─── STAGE 2: SET UP THE STAGE ───────────────────────────────────────────
    {
      title: "Set Up the Stage",
      narration: "Band assembled! Now they need a stage -- built from dungeon junk!",
      question: "Design the stage using only dungeon stuff. Where does each band member stand? What's the audience seating?",

      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput: "Stack three barrels as the drum platform in the center. Put the long table on its side as the main stage in front. The knight and barbarian stand on the table. The skeleton stands behind the barrels. Audience sits on chairs in a row facing the stage. Hang red and blue banners behind the stage as a backdrop!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barrel', count: 3, action: 'appear-center' },
            { block: 'table_long', action: 'appear-center' },
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'barbarian', action: 'appear-center', anim: 'Cheering' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'chair', count: 4, action: 'appear' },
            { block: 'banner_red', count: 2, action: 'appear' },
            { block: 'banner_blue', count: 2, action: 'appear' }
          ],
          reactions: ['confetti-burst'],
          feedback: "Barrels as platforms, table as a stage, banners as backdrop! Every piece of dungeon junk became stage equipment!"
        },
        {
          sampleInput: "Push the long table to the front -- that's the stage. Put four torches at the corners for the spotlight effect. The clown and rogue perform on the table. Stack barrels on the sides for speakers. The mage and ranger sit on chairs in the audience. Hang blue banners from the torches for decoration!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'table_long', action: 'appear-center' },
            { block: 'torch', count: 4, action: 'appear' },
            { block: 'clown', action: 'appear-center', anim: 'Jump_Full_Short' },
            { block: 'rogue', action: 'appear-center', anim: 'Interact' },
            { block: 'barrel', count: 2, action: 'appear' },
            { block: 'mage', action: 'appear-left', anim: 'Sit_Chair_Idle' },
            { block: 'ranger', action: 'appear-right', anim: 'Sit_Chair_Idle' },
            { block: 'banner_blue', count: 2, action: 'appear' }
          ],
          reactions: ['stars-spin'],
          feedback: "Torches as spotlights, barrels as speakers, banners as curtains! Constraints sparked pure creativity!"
        },
        {
          sampleInput: "The barbarian flips the long table upside down so the legs stick up as corner posts. Red banners stretch between the posts as a canopy. Torches go on each side for lighting. The skeleton and knight perform on top. Everyone else sits on the floor around it like a mosh pit!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'table_long', action: 'appear-center' },
            { block: 'banner_red', count: 3, action: 'appear' },
            { block: 'torch', count: 4, action: 'appear' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'barbarian', action: 'appear-left', anim: 'Cheering' },
            { block: 'mage', action: 'appear-right', anim: 'Cheering' }
          ],
          reactions: ['confetti-burst', 'stars-spin'],
          feedback: "An upside-down table with banner canopy! That's the most creative stage design possible with dungeon stuff!"
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "Build a stage",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'table_long', action: 'appear-center' }
          ],
          reactions: ['question-marks'],
          feedback: "Build it from WHAT? Only dungeon stuff! How do barrels, tables, torches, and banners become a stage?"
        },
        {
          sampleInput: "Put the table in the middle and stand on it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'table_long', action: 'appear-center' }
          ],
          reactions: [],
          feedback: "Good start! Now add lighting (torches?), decoration (banners?), and where does the audience sit?"
        },
        {
          sampleInput: "Everyone stands in a line",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-left', anim: 'Idle_A' },
            { block: 'barbarian', action: 'appear-center', anim: 'Idle_A' },
            { block: 'skeleton_warrior', action: 'appear-right', anim: 'Idle_A' }
          ],
          reactions: [],
          feedback: "Where's the STAGE? Use dungeon objects to build one! And where does the audience sit?"
        },
        {
          sampleInput: "Torches for light and chairs for sitting",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'torch', count: 2, action: 'appear' },
            { block: 'chair', count: 2, action: 'appear' }
          ],
          reactions: [],
          feedback: "Good elements! Now WHERE does everything go? What's the stage MADE of? Where do performers stand?"
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "buy a stage from the store",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "No stores in a dungeon! Build the stage from what you have: tables, barrels, torches, banners!"
        },
        {
          sampleInput: "outside",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Idle_A' }
          ],
          reactions: ['question-marks'],
          feedback: "The concert is IN the dungeon! How do you build a stage with dungeon objects?"
        },
        {
          sampleInput: "just play on the floor",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' }
          ],
          reactions: ['sad-cloud'],
          feedback: "The floor? A rock band needs a STAGE! What dungeon objects could be stacked, flipped, or arranged into one?"
        }
      ],

      hints: [
        "What big objects could be a stage platform? A table? Stacked barrels?",
        "A stage needs a platform, lighting, decoration, and audience seating. What dungeon objects fill each role?",
        "Think creatively: torches = spotlights, banners = backdrop curtains, chairs = audience seats. What's the stage itself?"
      ]
    },

    // ─── STAGE 3: THE BIG PERFORMANCE ────────────────────────────────────────
    {
      title: "The Big Performance!",
      narration: "Lights! Camera! ROCK! Time for the big show!",
      question: "Describe the actual performance! What does each band member do? What's the audience reaction? Remember -- only dungeon instruments!",

      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput: "The skeleton warrior rattles his jaw and sings into a torch microphone. The barbarian pounds on three barrels going boom-boom-crash! The knight waves a red banner like a rock star windmill. The mage shoots sparkle magic into the air as fireworks. The clown does backflips off the table. The audience of rogue and ranger stomp their feet and cheer!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'torch', count: 1, action: 'appear' },
            { block: 'barbarian', action: 'appear-left', anim: 'Hammer' },
            { block: 'barrel', count: 3, action: 'appear' },
            { block: 'knight', action: 'appear-right', anim: 'Cheering' },
            { block: 'banner_red', count: 1, action: 'appear' },
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Shoot' },
            { block: 'clown', action: 'appear-center', anim: 'Jump_Full_Short' },
            { block: 'rogue', action: 'appear-left', anim: 'Cheering' },
            { block: 'ranger', action: 'appear-right', anim: 'Cheering' }
          ],
          reactions: ['sparkle-magic', 'confetti-burst', 'stars-spin'],
          feedback: "Every performer doing something creative, the audience reacting, magical fireworks -- all within dungeon constraints! Rock on!"
        },
        {
          sampleInput: "The barbarian starts by hitting the table three times -- BOOM BOOM BOOM. Then the skeleton warrior rattles his bones as the beat kicks in. The knight lifts a torch and screams the lyrics. The mage waves blue banners in time with the music. The rogue climbs on barrels and crowd-surfs onto the chairs. Everyone goes wild!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'barbarian', action: 'appear-left', anim: 'Hammer' },
            { block: 'table_long', action: 'appear' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'torch', count: 1, action: 'appear' },
            { block: 'mage', action: 'appear-right', anim: 'Waving' },
            { block: 'banner_blue', count: 2, action: 'appear' },
            { block: 'rogue', action: 'appear-right', anim: 'Jump_Full_Short' },
            { block: 'barrel', count: 2, action: 'appear' }
          ],
          reactions: ['confetti-burst', 'explosion-cartoon', 'stars-spin'],
          feedback: "You described the music building up beat by beat! Table hits, bone rattles, torch mic, banner dancing -- maximum creativity!"
        },
        {
          sampleInput: "The clown opens the show by juggling torches. The crowd cheers! Then the skeleton warrior starts drumming on barrels with his own arm bones. The knight sings a ballad about a brave warrior while the mage makes hearts float everywhere. For the grand finale, the barbarian smashes a barrel and everyone cheers!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'clown', action: 'appear-center', anim: 'Jump_Full_Short' },
            { block: 'torch', count: 2, action: 'appear' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hammer' },
            { block: 'barrel', count: 3, action: 'appear' },
            { block: 'knight', action: 'appear-left', anim: 'Cheering' },
            { block: 'mage', action: 'appear-right', anim: 'Ranged_Magic_Spellcasting' },
            { block: 'barbarian', action: 'appear-center', anim: 'Hammer' }
          ],
          reactions: ['confetti-burst', 'hearts-float', 'explosion-cartoon', 'stars-spin'],
          feedback: "Opening act, main performance, AND a grand finale! Each act used only dungeon props. Show-stopping creativity!"
        },

        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "They play music and everyone claps",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' }
          ],
          reactions: ['confetti-burst'],
          feedback: "WHO plays WHAT? Describe each performer's dungeon instrument and what they do with it!"
        },
        {
          sampleInput: "The skeleton drums on barrels and the knight sings",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hammer' },
            { block: 'barrel', count: 1, action: 'appear' },
            { block: 'knight', action: 'appear-left', anim: 'Cheering' }
          ],
          reactions: [],
          feedback: "Good start! What about the other band members? And how does the audience react?"
        },
        {
          sampleInput: "Everyone rocks out",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'barbarian', action: 'appear-left', anim: 'Cheering' }
          ],
          reactions: ['confetti-burst'],
          feedback: "HOW do they rock out? Each character needs a specific action with a specific dungeon instrument!"
        },
        {
          sampleInput: "The mage does sparkle effects while they play",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'mage', action: 'appear-center', anim: 'Ranged_Magic_Spellcasting' }
          ],
          reactions: ['sparkle-magic'],
          feedback: "Love the sparkle light show! Now describe what each MUSICIAN does with their dungeon instrument!"
        },

        // FUNNY_FAIL (3)
        {
          sampleInput: "loud",
          successLevel: 'FUNNY_FAIL',
          elements: [],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Sure, it's loud! But WHO is making the noise? Describe each performer and their dungeon instrument!"
        },
        {
          sampleInput: "play a real song",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' }
          ],
          reactions: ['question-marks'],
          feedback: "They can play anything -- but with DUNGEON instruments! Describe how each character performs!"
        },
        {
          sampleInput: "stop the music",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hit_A' }
          ],
          reactions: ['sad-cloud'],
          feedback: "No way, the show must go on! Describe each band member performing with their dungeon instrument!"
        }
      ],

      hints: [
        "What does each performer DO? The skeleton drums barrels, the knight sings into a torch... what about the others?",
        "A great performance has a beginning, middle, and big finish. What happens at each part?",
        "Don't forget the audience! How do they react to each performer? Cheering? Stomping? Going wild?"
      ]
    }
  ]
} satisfies Story;
