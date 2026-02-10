import Phaser from 'phaser';

/**
 * Shared asset preloader — loads all game actors, props, backdrops, and SFX.
 * Call from any scene's preload() method. Phaser deduplicates loads automatically,
 * so calling this from multiple scenes is safe and efficient.
 */
export function preloadGameAssets(scene: Phaser.Scene): void {
  const load = scene.load;

  // ─── Actors (all PNG) ─────────────────────────────────
  const actors = ['monster', 'dog', 'trex', 'octopus', 'robot', 'wizard', 'kid', 'fish', 'squirrel'];
  for (const actor of actors) {
    load.image(actor, `assets/actors/${actor}.png`);
  }

  // ─── Props ────────────────────────────────────────────
  // PNG props
  const pngProps = [
    'cake', 'cake-giant', 'cake-tiny', 'pizza', 'pizza-soggy',
    'rocket', 'moon', 'desk', 'chair', 'fridge', 'toaster',
    'soup-bowl', 'plates', 'pencil', 'stars', 'keyboard',
    'spacesuit', 'flag',
  ];
  for (const prop of pngProps) {
    load.image(prop, `assets/props/${prop}.png`);
  }

  // SVG-only props
  const svgProps = [
    'balloon', 'present', 'guitar', 'drums', 'microphone',
    'bone', 'lunchbox', 'fire-extinguisher', 'river', 'pillow-fort',
  ];
  for (const prop of svgProps) {
    load.svg(prop, `assets/props/${prop}.svg`, { width: 128, height: 128 });
  }

  // ─── Backdrops ────────────────────────────────────────
  load.svg('party-room', 'assets/backdrops/party-room.svg', { width: 1024, height: 576 });
  load.svg('city-street', 'assets/backdrops/city-street.svg', { width: 1024, height: 576 });
  load.image('space', 'assets/backdrops/space.png');
  load.svg('wizard-kitchen', 'assets/backdrops/wizard-kitchen.svg', { width: 1024, height: 576 });
  load.svg('classroom', 'assets/backdrops/classroom.svg', { width: 1024, height: 576 });
  load.svg('underwater-stage', 'assets/backdrops/underwater-stage.svg', { width: 1024, height: 576 });

  // ─── SFX ──────────────────────────────────────────────
  const sfx = [
    'boing', 'bong', 'celebration', 'click', 'drop', 'error',
    'funny-fail', 'impact', 'jingle-celebrate', 'jingle-fail',
    'jingle-start', 'jingle-success', 'laser', 'partial',
    'pop', 'submit', 'success', 'whoosh', 'zap',
  ];
  for (const sound of sfx) {
    load.audio(sound, `assets/sfx/${sound}.ogg`);
  }
}
