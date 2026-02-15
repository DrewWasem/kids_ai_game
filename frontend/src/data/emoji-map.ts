/**
 * Emoji Map — Maps semantic emotion names to JoyQuest 2.0 pixel-art emoji numbers.
 *
 * Two sets:
 * - outline/ (16×16 px) — for particle burst effects
 * - bubble/ (32×32 px) — for character emote bubbles
 *
 * Numbers verified by visual inspection of extracted PNGs.
 */

export const EMOJI_MAP: Record<string, number> = {
  // Positive emotions
  happy: 10,          // big grin, teeth showing
  laughing: 7,        // open-mouth laugh with tongue
  love_eyes: 2,       // heart eyes
  cool: 90,           // sunglasses
  star_eyes: 15,      // star/sparkle eyes, amazed
  wink: 12,           // one eye closed, smile
  party: 19,          // party hat, confetti
  proud: 65,          // smug grin
  excited: 75,        // big happy grin

  // Negative emotions
  angry: 1,           // furrowed brows, frown
  mad: 6,             // furrowed brows, open mouth
  sad: 4,             // single tear, blue
  crying: 3,          // tears streaming
  scared: 16,         // wide mouth, pale
  confused: 17,       // questioning look
  worried: 5,         // teeth showing, sweat drop
  grumpy: 80,         // pouty face
  sick: 26,           // green/nauseous

  // Surprise / shock
  surprised: 55,      // sparkle/star surprise eyes
  shocked: 60,        // wide eyes, crying variant
  mind_blown: 28,     // head explosion

  // Silly / comedy
  silly: 21,          // tongue out
  tongue_out: 35,     // goofy derpy face
  drooling: 40,       // hungry/drooling
  dizzy: 45,          // woozy/spinning
  sleeping: 20,       // closed eyes, ZZZ
  mischievous: 11,    // devil/horns grin
  smirk: 27,          // half-smile
  thinking: 23,       // pondering face
  blushing: 95,       // embarrassed/rosy
  ghost: 24,          // pale/frightened
  unamused: 9,        // flat mouth, half-lidded
  determined: 18,     // serious, flat face
  frozen: 8,          // cold/blue tint

  // Food reactions (for kitchen/restaurant/picnic tasks)
  yummy: 40,          // drooling (reuse)
  disgusted: 26,      // sick (reuse)
}

/** Get path to a 16×16 outline emoji PNG (for particle effects) */
export function getEmojiOutlinePath(nameOrNum: string | number): string {
  const num = typeof nameOrNum === 'number'
    ? nameOrNum
    : EMOJI_MAP[nameOrNum] ?? parseInt(nameOrNum, 10)
  if (isNaN(num) || num < 1 || num > 127) return ''
  return `/assets/2d/emojis/outline/em_outline_${num}.png`
}

/** Get path to a 32×32 bubble emoji PNG (for character emote bubbles) */
export function getEmojiBubblePath(nameOrNum: string | number): string {
  const num = typeof nameOrNum === 'number'
    ? nameOrNum
    : EMOJI_MAP[nameOrNum] ?? parseInt(nameOrNum, 10)
  // Bubble files are 0-indexed (bubble_0.png = emoji 1, bubble_126.png = emoji 127)
  if (isNaN(num) || num < 1 || num > 127) return ''
  return `/assets/2d/emojis/bubble/bubble_${num - 1}.png`
}
