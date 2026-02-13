/**
 * Comedy Combos — Reusable micro-sequences for building vignettes.
 *
 * Each combo is a 2-6 step sequence with template variables ({VARIABLE}).
 * Vignettes are ASSEMBLED from these combos, not written from scratch.
 */

import type { VignetteAction, VignetteStep, ComboVariables } from '../types/madlibs';

type ComboTemplate = VignetteAction[];

export const COMEDY_COMBOS: Record<string, ComboTemplate> = {

  // ─── SLAPSTICK ──────────────────────────────────────────────────────────────

  bonk_and_fall: [
    { action: 'animate', character: '{TARGET}', anim: 'get_hit' },
    { action: 'sfx', sound: 'bonk' },
    { action: 'react', effect: 'stars-spin', position: '{TARGET_POS}' },
    { action: 'animate', character: '{TARGET}', anim: 'die_dramatic' },
    { action: 'sfx', sound: 'slide_whistle_down' },
  ],

  throw_and_hit: [
    { action: 'animate', character: '{THROWER}', anim: 'throw' },
    { action: 'sfx', sound: 'whoosh' },
    { action: 'animate', character: '{TARGET}', anim: 'get_bonked' },
    { action: 'sfx', sound: 'splat' },
    { action: 'react', effect: 'stars-spin', position: '{TARGET_POS}' },
  ],

  throw_and_miss: [
    { action: 'animate', character: '{THROWER}', anim: 'throw' },
    { action: 'sfx', sound: 'whoosh' },
    { action: 'sfx', sound: 'crash' },
    { action: 'emote', character: '{THROWER}', emoji: '😬' },
  ],

  pratfall: [
    { action: 'animate', character: '{TARGET}', anim: 'walk' },
    { action: 'animate', character: '{TARGET}', anim: 'die_flop' },
    { action: 'sfx', sound: 'bonk' },
    { action: 'react', effect: 'explosion-cartoon', position: '{TARGET_POS}' },
    { action: 'emote', character: '{TARGET}', emoji: '😵' },
  ],

  dramatic_entrance: [
    { action: 'sfx', sound: 'spawn' },
    { action: 'screen_flash', color: 'white', duration: 0.15 },
    { action: 'spawn_character', character: '{CHARACTER}', position: '{POSITION}', anim: 'spawn_air' },
    { action: 'react', effect: 'sparkle-magic', position: '{POSITION}' },
    { action: 'animate', character: '{CHARACTER}', anim: 'taunt' },
  ],

  // ─── MAGIC MISHAPS ──────────────────────────────────────────────────────────

  spell_backfire: [
    { action: 'animate', character: '{CASTER}', anim: 'cast_long' },
    { action: 'react', effect: 'sparkle-magic', position: '{CASTER_POS}' },
    { action: 'sfx', sound: 'react' },
    { action: 'react', effect: 'explosion-cartoon', position: '{CASTER_POS}' },
    { action: 'animate', character: '{CASTER}', anim: 'get_hit' },
    { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
    { action: 'sfx', sound: 'fail' },
    { action: 'emote', character: '{CASTER}', emoji: '💫' },
  ],

  spell_success: [
    { action: 'animate', character: '{CASTER}', anim: 'cast_long' },
    { action: 'react', effect: 'sparkle-magic', position: 'center' },
    { action: 'sfx', sound: 'react' },
    { action: 'animate', character: '{CASTER}', anim: 'summon' },
    { action: 'react', effect: 'sparkle-magic', position: 'center' },
    { action: 'sfx', sound: 'success' },
  ],

  potion_drink: [
    { action: 'animate', character: '{CHARACTER}', anim: 'use' },
    { action: 'sfx', sound: 'spawn' },
    { action: 'animate', character: '{CHARACTER}', anim: '{RESULT_ANIM}' },
    { action: 'react', effect: '{RESULT_EFFECT}', position: '{CHARACTER_POS}' },
  ],

  // ─── CROWD REACTIONS ────────────────────────────────────────────────────────

  crowd_cheer: [
    { action: 'crowd_react', characters: 'all_background', anim: 'celebrate' },
    { action: 'sfx', sound: 'success' },
    { action: 'react', effect: 'confetti-burst', position: 'center' },
  ],

  crowd_gasp: [
    { action: 'crowd_react', characters: 'all_background', anim: 'dodge_back' },
    { action: 'sfx', sound: 'react' },
  ],

  crowd_scatter: [
    { action: 'crowd_react', characters: 'all_background', anim: 'run_panic' },
    { action: 'sfx', sound: 'move' },
  ],

  crowd_faint: [
    { action: 'crowd_react', characters: 'all_background', anim: 'die_dramatic' },
    { action: 'sfx', sound: 'fail' },
  ],

  // ─── OBJECT COMEDY ──────────────────────────────────────────────────────────

  object_rain: [
    { action: 'spawn_rain', asset: '{OBJECT}', quantity: 8, position: 'wide' },
    { action: 'sfx', sound: 'react' },
    { action: 'camera_shake', intensity: 0.4, duration: 2.0 },
    { action: 'text_popup', text: '{RAIN_TEXT}', position: 'top', size: 'huge' },
  ],

  surprise_in_chest: [
    { action: 'spawn', asset: 'chest', position: '{POSITION}' },
    { action: 'sfx', sound: 'spawn' },
    { action: 'animate', character: '{CHARACTER}', anim: 'interact' },
    { action: 'react', effect: 'sparkle-magic', position: '{POSITION}' },
    { action: 'sfx', sound: 'success' },
    { action: 'screen_flash', color: 'gold', duration: 0.2 },
  ],

  // ─── FINALES ────────────────────────────────────────────────────────────────

  victory_celebration: [
    { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
    { action: 'react', effect: 'confetti-burst', position: 'center' },
    { action: 'react', effect: 'stars-spin', position: 'center' },
    { action: 'sfx', sound: 'success' },
    { action: 'text_popup', text: '{VICTORY_TEXT}', position: 'center', size: 'huge' },
  ],

  chaos_aftermath: [
    { action: 'animate', character: '{SURVIVOR}', anim: 'taunt' },
    { action: 'crowd_react', characters: 'all_others', anim: 'lie_idle' },
    { action: 'sfx', sound: 'react' },
    { action: 'emote', character: '{SURVIVOR}', emoji: '😎' },
    { action: 'text_popup', text: '{CHAOS_TEXT}', position: 'center', size: 'huge' },
  ],

  awkward_silence: [
    { action: 'crowd_react', characters: 'all', anim: 'idle' },
    { action: 'sfx', sound: 'fail' },
    { action: 'emote', character: '{MAIN}', emoji: '😐' },
    { action: 'react', effect: 'sad-cloud', position: 'center' },
  ],
};

/**
 * Expand a comedy combo template by substituting variables.
 * Wraps all actions into a single VignetteStep for easy composition.
 */
export function expandCombo(comboId: string, variables: ComboVariables): VignetteStep[] {
  const template = COMEDY_COMBOS[comboId];
  if (!template) {
    console.warn(`[comedy-combos] Unknown combo: "${comboId}"`);
    return [];
  }

  const actions = template.map(action => {
    const expanded = { ...action };
    for (const [key, value] of Object.entries(expanded)) {
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const varName = value.slice(1, -1);
        if (varName in variables) {
          (expanded as Record<string, unknown>)[key] = variables[varName];
        }
      }
    }
    return expanded;
  });

  // Split into steps: every 2-3 actions become a parallel step for pacing
  const steps: VignetteStep[] = [];
  let batch: VignetteAction[] = [];

  for (const action of actions) {
    batch.push(action);
    // Group sfx/react with the action they accompany (same step)
    // Split on animate/spawn/move/text_popup/screen_flash (visual beats)
    const isVisualBeat = ['animate', 'spawn_character', 'spawn', 'text_popup', 'screen_flash', 'crowd_react', 'spawn_rain'].includes(action.action);
    if (isVisualBeat && batch.length >= 2) {
      steps.push({ parallel: batch, delayAfter: 0.4 });
      batch = [];
    }
  }

  if (batch.length > 0) {
    steps.push({ parallel: batch, delayAfter: 0.5 });
  }

  return steps;
}

/**
 * Compose multiple comedy combos into a full vignette step array.
 */
export function composeVignette(...combos: Array<{ id: string; vars: ComboVariables }>): VignetteStep[] {
  return combos.flatMap(({ id, vars }) => expandCombo(id, vars));
}
