/**
 * Story 2: Skeleton's Pizza Disaster
 *
 * Skill: Completeness — "Don't Forget the List"
 * Teaching Goal: Leaving out key steps causes failures. A complete plan covers ALL pieces.
 */

import type { Story } from './types';

export const SKELETON_PIZZA = {
  id: 'skeleton-pizza',
  title: "Skeleton's Pizza Disaster",
  order: 2,
  skill: 'completeness',
  teachingGoal: "Leaving out key steps causes failures. A complete plan covers ALL pieces.",
  characters: ['skeleton_warrior', 'skeleton_rogue', 'knight', 'ranger'],
  props: ['pizza', 'table_round', 'chair', 'plate', 'bench'],
  stages: [
    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 1: Pick Up the Pizza
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "Pick Up the Pizza",
      narration: "The skeleton got a job delivering pizza! First step: pick up the order from the kitchen without dropping any bones!",
      question: "How does the skeleton pick up the pizza? What kind of pizza is it? How does he hold it without his arms falling off?",
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput: "The skeleton warrior walks carefully to the counter and picks up a pepperoni pizza. The skeleton rogue ties the skeleton's arms on tight with rope so they don't fall off. He holds the pizza on a plate.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
            { block: 'pizza', action: 'appear-center' },
            { block: 'skeleton_rogue', action: 'enter-right', anim: 'Interact' },
            { block: 'plate', action: 'drop-center' },
          ],
          reactions: ['sparkle-magic'],
          feedback: "You covered all three things: the pizza type, how he carries it, AND how to keep his arms attached. Complete plan!",
        },
        {
          sampleInput: "It's a cheese pizza sitting on the round table. The skeleton rogue helps balance it on the warrior's head since his hands are wobbly. They tape his finger bones together first.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'skeleton_rogue', action: 'enter-left', anim: 'Interact' },
            { block: 'pizza', action: 'appear-center' },
            { block: 'table_round', action: 'appear' },
          ],
          reactions: ['hearts-float'],
          feedback: "Every detail matters: pizza type, carrying method, bone solution. Nothing forgotten!",
        },
        {
          sampleInput: "The skeleton warrior picks up a pepperoni pizza from the table. He holds it with both hands super carefully. The skeleton rogue walks behind him to catch any bones that fall.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'PickUp' },
            { block: 'pizza', action: 'appear-center' },
            { block: 'table_round', action: 'appear' },
            { block: 'skeleton_rogue', action: 'enter-right', anim: 'Sneaking' },
          ],
          reactions: ['stars-spin'],
          feedback: "Smart! You thought of the pizza, how to hold it, AND a backup plan for falling bones!",
        },
        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "He picks up a pizza",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: [],
          feedback: "He got the pizza! But WHAT kind? And how does he keep his bones from falling apart?",
        },
        {
          sampleInput: "The skeleton gets pepperoni pizza from the kitchen",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'PickUp' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: [],
          feedback: "You named the pizza type -- nice! Now, how does he carry it without losing body parts?",
        },
        {
          sampleInput: "Tie his arms on with rope",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
          ],
          reactions: ['sparkle-magic'],
          feedback: "Good bone solution! But you forgot the actual pizza. What kind is it? How does he grab it?",
        },
        {
          sampleInput: "Pepperoni pizza and cheese pizza",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'pizza', count: 2, action: 'appear-center' },
          ],
          reactions: [],
          feedback: "Great pizza choices! Now describe how the skeleton picks them up AND keeps his bones together.",
        },
        // FUNNY_FAIL (3)
        {
          sampleInput: "go",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Running_A' },
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "Slow down! The skeleton needs to: 1) Get the pizza, 2) Hold it safely, 3) Keep his bones on.",
        },
        {
          sampleInput: "eat the pizza himself",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: ['laugh-tears'],
          feedback: "Ha! He's supposed to DELIVER it, not eat it! How does he pick it up to carry?",
        },
        {
          sampleInput: "pizza pizza pizza",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
          ],
          reactions: ['question-marks'],
          feedback: "We need more than the word! What KIND, how does the skeleton PICK IT UP, and how does he keep his BONES on?",
        },
      ],
      hints: [
        "There are three things to figure out: which pizza, how to carry it, and keeping bones from falling. Did you cover all three?",
        "What if his arms fall off? How would you solve that problem?",
        "A complete plan leaves nothing out. Check: pizza type? Carrying method? Bone fix?",
      ],
    },
    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 2: The Delivery Route
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "The Delivery Route",
      narration: "Pizza secured! Now the skeleton has to deliver it across town. But there are obstacles everywhere!",
      question: "Describe the skeleton's delivery route. Where does he go? What obstacles does he face? How does he get past them?",
      responses: [
        // FULL_SUCCESS (3)
        {
          sampleInput: "The skeleton warrior walks carefully from the restaurant on the left toward the knight waiting on the right. He has to dodge a bench in the middle -- the skeleton rogue pushes it out of the way. The skeleton runs the last bit to deliver it hot!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'appear-right', anim: 'Waving' },
            { block: 'bench', action: 'appear-center' },
            { block: 'skeleton_rogue', action: 'enter-left', anim: 'Interact' },
          ],
          reactions: ['sparkle-magic', 'confetti-burst'],
          feedback: "Complete route: start, destination, obstacle, AND solution! Nothing missing!",
        },
        {
          sampleInput: "The skeleton walks from the kitchen to the round table where the ranger is sitting. On the way, he trips over a plate on the ground but the skeleton rogue catches the pizza just in time.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Skeletons_Walking' },
            { block: 'ranger', action: 'appear-right', anim: 'Sit_Chair_Idle' },
            { block: 'plate', action: 'appear-center' },
            { block: 'skeleton_rogue', action: 'enter-left', anim: 'PickUp' },
            { block: 'table_round', action: 'appear-right' },
          ],
          reactions: ['hearts-float'],
          feedback: "You described the path, the problem, the rescue, AND the delivery. Complete journey!",
        },
        {
          sampleInput: "From the kitchen counter, the skeleton sneaks past the benches going left to right. His knee falls off halfway but the rogue puts it back on. He reaches the knight at the table on the right side.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Sneaking' },
            { block: 'bench', action: 'appear-center' },
            { block: 'skeleton_rogue', action: 'enter-left', anim: 'Interact' },
            { block: 'knight', action: 'appear-right', anim: 'Waving' },
            { block: 'table_round', action: 'appear-right' },
          ],
          reactions: ['stars-spin'],
          feedback: "Route, obstacles, bone problem, solution, destination. Every piece of the plan is there!",
        },
        // PARTIAL_SUCCESS (4)
        {
          sampleInput: "Walk to the customer",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
          ],
          reactions: ['question-marks'],
          feedback: "Walk where exactly? Who is the customer? Are there any obstacles on the way?",
        },
        {
          sampleInput: "Go to the knight but there's something blocking the way",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
            { block: 'knight', action: 'appear-right', anim: 'Idle_A' },
            { block: 'bench', action: 'appear-center' },
          ],
          reactions: [],
          feedback: "Good! You named the customer and an obstacle. Now HOW does the skeleton get past it?",
        },
        {
          sampleInput: "The skeleton runs really fast to deliver it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Running_A' },
          ],
          reactions: ['explosion-cartoon'],
          feedback: "Fast is risky for a skeleton! Where is he running TO? What might go wrong?",
        },
        {
          sampleInput: "Deliver the pizza to the table and avoid dropping it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'enter-left', anim: 'Walking_A' },
            { block: 'table_round', action: 'appear-right' },
          ],
          reactions: [],
          feedback: "Good destination! But what specific obstacles could be in the way?",
        },
        // FUNNY_FAIL (3)
        {
          sampleInput: "throw it",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Throw' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: ['explosion-cartoon', 'laugh-tears'],
          feedback: "The pizza is NOT a frisbee! Describe a route: where does the skeleton walk, and what problems does he face?",
        },
        {
          sampleInput: "fly",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Jump_Full_Long' },
          ],
          reactions: ['question-marks', 'laugh-tears'],
          feedback: "Skeletons can't fly! Describe a walking route: from where, to where, past what?",
        },
        {
          sampleInput: "i like pizza",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' },
          ],
          reactions: ['question-marks'],
          feedback: "We all do! But the skeleton needs a route. Where does he start? Where does he deliver? What's in the way?",
        },
      ],
      hints: [
        "A delivery needs a start, a destination, and what happens in between. Did you cover all three?",
        "What could go wrong on the way? Think about obstacles AND bone problems!",
        "Who is waiting for the pizza? Where are they sitting?",
      ],
    },
    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 3: The Handoff
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: "The Handoff",
      narration: "Almost there! The skeleton reaches the customer with the pizza ALMOST intact. But the final delivery is the trickiest part!",
      question: "Describe exactly how the skeleton delivers the pizza to the customer. What happens when they get it? Does anything go wrong at the last second?",
      responses: [
        // FULL_SUCCESS (4)
        {
          sampleInput: "The skeleton warrior carefully places the pepperoni pizza on the round table in front of the knight. The knight cheers and waves. The skeleton does a victory taunt! Then confetti explodes to celebrate the successful delivery.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'pizza', action: 'drop-center' },
            { block: 'table_round', action: 'appear' },
            { block: 'knight', action: 'appear-center', anim: 'Cheering' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
          ],
          reactions: ['confetti-burst', 'stars-spin'],
          feedback: "Complete delivery: how he places it, customer's reaction, celebration, and finale. Nothing forgotten!",
        },
        {
          sampleInput: "The skeleton sets the pizza on the plate on the table. The ranger tastes it and gives a thumbs up with hearts floating. The skeleton rogue high-fives the warrior but both their hands fall off!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'plate', action: 'appear' },
            { block: 'pizza', action: 'drop-center' },
            { block: 'ranger', action: 'appear-center', anim: 'Cheering' },
            { block: 'skeleton_rogue', action: 'enter-left', anim: 'Interact' },
          ],
          reactions: ['hearts-float', 'laugh-tears'],
          feedback: "The delivery, the reaction, AND a funny ending! Your completeness made this scene hilarious!",
        },
        {
          sampleInput: "He slides the pizza onto the table. The knight picks up a slice. The skeleton warrior takes a bow but his head falls off and rolls under the table. The rogue catches the head and puts it back!",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'pizza', action: 'appear-center' },
            { block: 'knight', action: 'appear-center', anim: 'PickUp' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Hit_A' },
            { block: 'skeleton_rogue', action: 'enter-left', anim: 'PickUp' },
          ],
          reactions: ['laugh-tears', 'confetti-burst'],
          feedback: "Every detail connects: delivery, eating, funny accident, AND rescue. Master of completeness!",
        },
        {
          sampleInput: "The skeleton places the pizza carefully with both hands on the table. The knight sits in the chair and says thank you by waving. Stars spin around because the delivery was perfect. The skeleton warrior does a happy dance.",
          successLevel: 'FULL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'pizza', action: 'drop-center' },
            { block: 'table_round', action: 'appear' },
            { block: 'knight', action: 'appear-center', anim: 'Sit_Chair_Down' },
            { block: 'knight', action: 'appear-center', anim: 'Waving' },
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Taunt' },
          ],
          reactions: ['stars-spin', 'confetti-burst'],
          feedback: "Placing, thanking, celebrating -- every part of the handoff is there. Complete!",
        },
        // PARTIAL_SUCCESS (3)
        {
          sampleInput: "give the pizza to the knight",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Interact' },
            { block: 'knight', action: 'appear-center', anim: 'Idle_A' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: [],
          feedback: "He delivered it! But how? Does the knight react? Does anything funny happen?",
        },
        {
          sampleInput: "The knight gets the pizza and eats it",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'knight', action: 'appear-center', anim: 'PickUp' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: [],
          feedback: "What does the skeleton DO after delivering? Does he celebrate? Does anything go wrong?",
        },
        {
          sampleInput: "Pizza on table, confetti",
          successLevel: 'PARTIAL_SUCCESS',
          elements: [
            { block: 'pizza', action: 'drop-center' },
            { block: 'table_round', action: 'appear' },
          ],
          reactions: ['confetti-burst'],
          feedback: "Where's the skeleton? Where's the customer? A complete scene needs characters reacting!",
        },
        // FUNNY_FAIL (3)
        {
          sampleInput: "drop it",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Throw' },
            { block: 'pizza', action: 'appear-center' },
          ],
          reactions: ['explosion-cartoon'],
          feedback: "SPLAT! How does the skeleton CAREFULLY deliver the pizza? What happens when the customer gets it?",
        },
        {
          sampleInput: "bye",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Waving' },
          ],
          reactions: ['question-marks'],
          feedback: "Wait, don't leave! The pizza still needs to reach the customer. Describe the whole handoff!",
        },
        {
          sampleInput: "idk",
          successLevel: 'FUNNY_FAIL',
          elements: [
            { block: 'skeleton_warrior', action: 'appear-center', anim: 'Skeletons_Idle' },
          ],
          reactions: ['sad-cloud'],
          feedback: "Think about it step by step: how does the skeleton hand over the pizza, and what does the customer do?",
        },
      ],
      hints: [
        "Three things make a complete delivery: how the pizza gets to the table, how the customer reacts, and what happens after.",
        "Don't forget the skeleton! What does HE do when the delivery is done?",
        "The funniest moments come from including every detail -- even the things that go wrong!",
      ],
    },
  ],
} satisfies Story;
