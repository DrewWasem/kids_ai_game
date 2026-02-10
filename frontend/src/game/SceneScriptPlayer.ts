import Phaser from 'phaser';
import type {
  SceneScript,
  Action,
  SpawnAction,
  MoveAction,
  AnimateAction,
  ReactAction,
  EmoteAction,
  WaitAction,
  RemoveAction,
  Position,
  MoveStyle,
} from '../types/scene-script';

// Position mapping for 1024x576 canvas
const POSITIONS: Record<Position, { x: number; y: number }> = {
  'left': { x: 200, y: 380 },
  'center': { x: 512, y: 380 },
  'right': { x: 824, y: 380 },
  'top': { x: 512, y: 150 },
  'bottom': { x: 512, y: 480 },
  'off-left': { x: -100, y: 380 },
  'off-right': { x: 1124, y: 380 },
  'off-top': { x: 512, y: -100 },
};

// Default tween duration
const DEFAULT_MOVE_MS = 600;
const DEFAULT_ANIM_MS = 500;
const SPAWN_SCALE_DURATION = 300;

/**
 * SceneScriptPlayer — executes scene scripts by spawning sprites and applying tweens.
 *
 * Usage:
 *   const player = new SceneScriptPlayer(scene);
 *   await player.play(script);
 */
export class SceneScriptPlayer {
  private scene: Phaser.Scene;
  private actors: Map<string, Phaser.GameObjects.Image | Phaser.GameObjects.Sprite> = new Map();
  private emotes: Map<string, Phaser.GameObjects.Text> = new Map();
  private effects: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /** Clear all spawned objects from a previous script. */
  clear() {
    for (const obj of this.actors.values()) {
      obj.destroy();
    }
    this.actors.clear();

    for (const obj of this.emotes.values()) {
      obj.destroy();
    }
    this.emotes.clear();

    for (const emitter of this.effects) {
      emitter.destroy();
    }
    this.effects = [];
  }

  /** Play a full scene script, executing actions sequentially. */
  async play(script: SceneScript): Promise<void> {
    this.clear();

    for (const action of script.actions) {
      // Respect per-action delay
      if (action.delay_ms && action.delay_ms > 0) {
        await this.wait(action.delay_ms);
      }

      try {
        await this.executeAction(action);
      } catch (err) {
        console.warn('[SceneScriptPlayer] Action failed, skipping:', action, err);
        // Never crash — skip the action and continue
      }
    }
  }

  private async executeAction(action: Action): Promise<void> {
    switch (action.type) {
      case 'spawn':
        return this.doSpawn(action);
      case 'move':
        return this.doMove(action);
      case 'animate':
        return this.doAnimate(action);
      case 'react':
        return this.doReact(action);
      case 'emote':
        return this.doEmote(action);
      case 'sfx':
        // Sound effects: skip if audio not loaded (graceful degradation)
        return;
      case 'wait':
        return this.doWait(action);
      case 'remove':
        return this.doRemove(action);
    }
  }

  // ─── SPAWN ─────────────────────────────────────────────
  private async doSpawn(action: SpawnAction): Promise<void> {
    const key = action.target;
    const pos = POSITIONS[action.position] ?? POSITIONS['center'];

    let obj: Phaser.GameObjects.Image;

    // Try to use a loaded texture; fall back to a colored rectangle placeholder
    if (this.scene.textures.exists(key)) {
      obj = this.scene.add.image(pos.x, pos.y, key);
    } else {
      // Placeholder: colored rectangle with label
      obj = this.createPlaceholder(key, pos.x, pos.y);
    }

    obj.setScale(0);
    this.actors.set(key, obj);

    // Pop-in animation
    await this.tween({
      targets: obj,
      scaleX: 1,
      scaleY: 1,
      duration: SPAWN_SCALE_DURATION,
      ease: 'Back.easeOut',
    });
  }

  // ─── MOVE ──────────────────────────────────────────────
  private async doMove(action: MoveAction): Promise<void> {
    const obj = this.actors.get(action.target);
    if (!obj) {
      console.warn(`[SceneScriptPlayer] Move target "${action.target}" not found`);
      return;
    }

    const dest = POSITIONS[action.to] ?? POSITIONS['center'];
    const duration = action.duration_ms ?? DEFAULT_MOVE_MS;
    const style = action.style ?? 'linear';

    await this.tweenWithStyle(obj, dest, duration, style);
  }

  private async tweenWithStyle(
    obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite,
    dest: { x: number; y: number },
    duration: number,
    style: MoveStyle,
  ): Promise<void> {
    switch (style) {
      case 'arc': {
        // Parabolic arc: move up then down to destination
        const midY = Math.min(obj.y, dest.y) - 120;
        await this.tween({
          targets: obj,
          x: (obj.x + dest.x) / 2,
          y: midY,
          duration: duration / 2,
          ease: 'Sine.easeOut',
        });
        await this.tween({
          targets: obj,
          x: dest.x,
          y: dest.y,
          duration: duration / 2,
          ease: 'Sine.easeIn',
        });
        return;
      }
      case 'bounce':
        await this.tween({
          targets: obj,
          x: dest.x,
          y: dest.y,
          duration,
          ease: 'Bounce.easeOut',
        });
        return;
      case 'float':
        await this.tween({
          targets: obj,
          x: dest.x,
          y: dest.y,
          duration,
          ease: 'Sine.easeInOut',
        });
        return;
      case 'shake': {
        // Move to destination with a shake
        await this.tween({
          targets: obj,
          x: dest.x,
          y: dest.y,
          duration: duration * 0.6,
          ease: 'Power2',
        });
        // Shake at destination
        const origX = dest.x;
        for (let i = 0; i < 3; i++) {
          await this.tween({ targets: obj, x: origX - 8, duration: 40, ease: 'Linear' });
          await this.tween({ targets: obj, x: origX + 8, duration: 40, ease: 'Linear' });
        }
        await this.tween({ targets: obj, x: origX, duration: 40, ease: 'Linear' });
        return;
      }
      case 'spin-in':
        await this.tween({
          targets: obj,
          x: dest.x,
          y: dest.y,
          angle: 360,
          duration,
          ease: 'Power2',
        });
        obj.setAngle(0);
        return;
      case 'drop-in':
        // Start above destination, drop down
        obj.setPosition(dest.x, dest.y - 300);
        await this.tween({
          targets: obj,
          y: dest.y,
          duration,
          ease: 'Bounce.easeOut',
        });
        return;
      case 'linear':
      default:
        await this.tween({
          targets: obj,
          x: dest.x,
          y: dest.y,
          duration,
          ease: 'Power2',
        });
        return;
    }
  }

  // ─── ANIMATE ───────────────────────────────────────────
  private async doAnimate(action: AnimateAction): Promise<void> {
    const obj = this.actors.get(action.target);
    if (!obj) {
      console.warn(`[SceneScriptPlayer] Animate target "${action.target}" not found`);
      return;
    }

    const duration = action.duration_ms ?? DEFAULT_ANIM_MS;

    // Since we use static images + tweens (not sprite atlas),
    // simulate animations with tween-based effects
    switch (action.anim) {
      case 'happy':
      case 'dance':
        await this.animateDance(obj, duration);
        break;
      case 'sad':
      case 'cry':
        await this.animateSad(obj, duration);
        break;
      case 'eat':
        await this.animateEat(obj, duration);
        break;
      case 'confused':
        await this.animateConfused(obj, duration);
        break;
      case 'wave':
      case 'cheer':
      case 'clap':
        await this.animateWave(obj, duration);
        break;
      case 'laugh':
        await this.animateLaugh(obj, duration);
        break;
      case 'point':
        await this.animatePoint(obj, duration);
        break;
      case 'idle':
      default:
        // Gentle idle bob
        await this.animateIdle(obj, duration);
        break;
    }
  }

  private async animateDance(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    const steps = 4;
    const stepDur = duration / steps;
    for (let i = 0; i < steps; i++) {
      await this.tween({ targets: obj, y: obj.y - 20, angle: i % 2 === 0 ? 10 : -10, duration: stepDur / 2, ease: 'Sine.easeOut' });
      await this.tween({ targets: obj, y: obj.y, angle: 0, duration: stepDur / 2, ease: 'Sine.easeIn' });
    }
  }

  private async animateSad(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    // Droop down and tilt
    await this.tween({ targets: obj, y: obj.y + 15, angle: -5, scaleX: 0.9, scaleY: 0.9, duration: duration * 0.6, ease: 'Sine.easeOut' });
    await this.tween({ targets: obj, y: obj.y, angle: 0, scaleX: 1, scaleY: 1, duration: duration * 0.4, ease: 'Sine.easeIn' });
  }

  private async animateEat(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    // Chomp motion: scale up then down repeatedly
    for (let i = 0; i < 3; i++) {
      await this.tween({ targets: obj, scaleX: 1.15, scaleY: 0.9, duration: duration / 6, ease: 'Sine.easeOut' });
      await this.tween({ targets: obj, scaleX: 1, scaleY: 1, duration: duration / 6, ease: 'Sine.easeIn' });
    }
  }

  private async animateConfused(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    // Tilt side to side
    await this.tween({ targets: obj, angle: -15, duration: duration * 0.25, ease: 'Sine.easeOut' });
    await this.tween({ targets: obj, angle: 15, duration: duration * 0.25, ease: 'Sine.easeInOut' });
    await this.tween({ targets: obj, angle: -10, duration: duration * 0.25, ease: 'Sine.easeInOut' });
    await this.tween({ targets: obj, angle: 0, duration: duration * 0.25, ease: 'Sine.easeIn' });
  }

  private async animateWave(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    // Bounce up and down with slight rotation
    for (let i = 0; i < 3; i++) {
      await this.tween({ targets: obj, y: obj.y - 15, angle: 5, duration: duration / 6, ease: 'Sine.easeOut' });
      await this.tween({ targets: obj, y: obj.y, angle: -5, duration: duration / 6, ease: 'Sine.easeIn' });
    }
    await this.tween({ targets: obj, angle: 0, duration: 100 });
  }

  private async animateLaugh(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    // Quick vibrate/shake
    const origX = obj.x;
    const shakes = 6;
    const shakeDur = duration / shakes;
    for (let i = 0; i < shakes; i++) {
      const dx = i % 2 === 0 ? 5 : -5;
      await this.tween({ targets: obj, x: origX + dx, scaleY: i % 2 === 0 ? 1.05 : 0.95, duration: shakeDur, ease: 'Linear' });
    }
    await this.tween({ targets: obj, x: origX, scaleY: 1, duration: 50 });
  }

  private async animatePoint(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    // Lean forward
    await this.tween({ targets: obj, scaleX: 1.1, x: obj.x + 20, duration: duration * 0.4, ease: 'Sine.easeOut' });
    await this.wait(duration * 0.3);
    await this.tween({ targets: obj, scaleX: 1, x: obj.x, duration: duration * 0.3, ease: 'Sine.easeIn' });
  }

  private async animateIdle(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, duration: number) {
    await this.tween({ targets: obj, y: obj.y - 5, duration: duration / 2, ease: 'Sine.easeInOut', yoyo: true });
  }

  // ─── REACT (visual effects) ────────────────────────────
  private async doReact(action: ReactAction): Promise<void> {
    const pos = POSITIONS[action.position] ?? POSITIONS['center'];

    switch (action.effect) {
      case 'confetti-burst':
        await this.effectConfetti(pos);
        break;
      case 'explosion-cartoon':
        await this.effectExplosion(pos);
        break;
      case 'hearts-float':
        await this.effectFloatingEmoji(pos, '\u2764\uFE0F', 6);
        break;
      case 'stars-spin':
        await this.effectFloatingEmoji(pos, '\u2B50', 5);
        break;
      case 'question-marks':
        await this.effectFloatingEmoji(pos, '\u2753', 4);
        break;
      case 'laugh-tears':
        await this.effectFloatingEmoji(pos, '\uD83D\uDE02', 4);
        break;
      case 'fire-sneeze':
        await this.effectFireSneeze(pos);
        break;
      case 'splash':
        await this.effectFloatingEmoji(pos, '\uD83D\uDCA6', 5);
        break;
      case 'sparkle-magic':
        await this.effectFloatingEmoji(pos, '\u2728', 6);
        break;
      case 'sad-cloud':
        await this.effectFloatingEmoji(pos, '\uD83D\uDE22', 3);
        break;
      default:
        console.warn(`[SceneScriptPlayer] Unknown effect: ${action.effect}`);
    }
  }

  private async effectConfetti(pos: { x: number; y: number }): Promise<void> {
    const particles: Phaser.GameObjects.Text[] = [];

    for (let i = 0; i < 24; i++) {
      const emoji = ['🎉', '🎊', '⭐', '✨', '🎈'][Math.floor(Math.random() * 5)];
      const particle = this.scene.add.text(pos.x, pos.y, emoji, { fontSize: '20px' })
        .setOrigin(0.5)
        .setAlpha(0);
      particles.push(particle);
    }

    // Burst outward
    const promises = particles.map((p, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const dist = 80 + Math.random() * 120;
      return this.tween({
        targets: p,
        x: pos.x + Math.cos(angle) * dist,
        y: pos.y + Math.sin(angle) * dist - 50,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 0.3 },
        angle: Math.random() * 360,
        duration: 800 + Math.random() * 400,
        ease: 'Cubic.easeOut',
      });
    });

    await Promise.all(promises);
    particles.forEach(p => p.destroy());
  }

  private async effectExplosion(pos: { x: number; y: number }): Promise<void> {
    const boom = this.scene.add.text(pos.x, pos.y, '💥', { fontSize: '64px' }).setOrigin(0.5).setScale(0);
    await this.tween({ targets: boom, scaleX: 2, scaleY: 2, alpha: { from: 1, to: 0 }, duration: 600, ease: 'Power2' });
    boom.destroy();
  }

  private async effectFloatingEmoji(pos: { x: number; y: number }, emoji: string, count: number): Promise<void> {
    const items: Phaser.GameObjects.Text[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.scene.add.text(
        pos.x + (Math.random() - 0.5) * 80,
        pos.y,
        emoji,
        { fontSize: `${20 + Math.random() * 16}px` },
      ).setOrigin(0.5).setAlpha(0);
      items.push(item);
    }

    const promises = items.map((item, i) =>
      this.tween({
        targets: item,
        y: item.y - 80 - Math.random() * 60,
        x: item.x + (Math.random() - 0.5) * 60,
        alpha: { from: 1, to: 0 },
        duration: 800 + Math.random() * 400,
        delay: i * 100,
        ease: 'Sine.easeOut',
      }),
    );

    await Promise.all(promises);
    items.forEach(i => i.destroy());
  }

  private async effectFireSneeze(pos: { x: number; y: number }): Promise<void> {
    const flames: Phaser.GameObjects.Text[] = [];
    for (let i = 0; i < 5; i++) {
      const flame = this.scene.add.text(pos.x, pos.y, '🔥', { fontSize: '28px' })
        .setOrigin(0.5)
        .setAlpha(0);
      flames.push(flame);
    }

    const promises = flames.map((f, i) =>
      this.tween({
        targets: f,
        x: pos.x + 40 + i * 30,
        y: pos.y - 20 + (Math.random() - 0.5) * 40,
        alpha: { from: 1, to: 0 },
        scale: { from: 1.2, to: 0.3 },
        duration: 500 + i * 100,
        delay: i * 60,
        ease: 'Power2',
      }),
    );

    await Promise.all(promises);
    flames.forEach(f => f.destroy());
  }

  // ─── EMOTE ─────────────────────────────────────────────
  private async doEmote(action: EmoteAction): Promise<void> {
    const obj = this.actors.get(action.target);
    if (!obj) return;

    const display = action.emoji ?? action.text ?? '💬';
    const emote = this.scene.add.text(obj.x, obj.y - 60, display, {
      fontSize: '28px',
      backgroundColor: '#ffffff',
      padding: { x: 6, y: 4 },
      color: '#000000',
    }).setOrigin(0.5).setAlpha(0);

    this.emotes.set(`${action.target}-emote`, emote);

    // Float up and fade in
    await this.tween({
      targets: emote,
      y: obj.y - 90,
      alpha: 1,
      duration: 300,
      ease: 'Sine.easeOut',
    });

    // Hold
    await this.wait(1000);

    // Fade out
    await this.tween({
      targets: emote,
      alpha: 0,
      y: obj.y - 110,
      duration: 300,
      ease: 'Sine.easeIn',
    });

    emote.destroy();
    this.emotes.delete(`${action.target}-emote`);
  }

  // ─── WAIT ──────────────────────────────────────────────
  private async doWait(action: WaitAction): Promise<void> {
    await this.wait(action.duration_ms);
  }

  // ─── REMOVE ────────────────────────────────────────────
  private async doRemove(action: RemoveAction): Promise<void> {
    const obj = this.actors.get(action.target);
    if (!obj) return;

    // Shrink out
    await this.tween({
      targets: obj,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      ease: 'Back.easeIn',
    });

    obj.destroy();
    this.actors.delete(action.target);
  }

  // ─── HELPERS ───────────────────────────────────────────

  /** Create a colored placeholder rectangle with text label when no texture is loaded. */
  private createPlaceholder(key: string, x: number, y: number): Phaser.GameObjects.Image {
    // Generate a canvas texture as placeholder
    const texKey = `placeholder-${key}`;
    if (!this.scene.textures.exists(texKey)) {
      const color = this.stringToColor(key);
      const canvas = this.scene.textures.createCanvas(texKey, 80, 80);
      if (canvas) {
        const ctx = canvas.getContext();
        // Draw rounded rectangle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(2, 2, 76, 76, 12);
        ctx.fill();
        // Draw border
        ctx.strokeStyle = '#ffffff44';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(2, 2, 76, 76, 12);
        ctx.stroke();
        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = key.length > 10 ? key.slice(0, 9) + '…' : key;
        ctx.fillText(label, 40, 40);
        canvas.refresh();
      }
    }
    return this.scene.add.image(x, y, texKey);
  }

  /** Convert a string to a deterministic hex color. */
  private stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 45%)`;
  }

  /** Promisified Phaser tween. */
  private tween(config: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
    return new Promise<void>((resolve) => {
      this.scene.tweens.add({
        ...config,
        onComplete: () => resolve(),
      });
    });
  }

  /** Promisified wait. */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.scene.time.delayedCall(ms, resolve);
    });
  }
}
