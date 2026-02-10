import Phaser from 'phaser';
import EventBus from '../EventBus';
import { SceneScriptPlayer } from '../SceneScriptPlayer';
import type { SceneScript } from '../../types/scene-script';

export class MonsterPartyScene extends Phaser.Scene {
  private scriptPlayer!: SceneScriptPlayer;
  private instructionText!: Phaser.GameObjects.Text;
  private narrationText!: Phaser.GameObjects.Text | null;
  private isPlaying = false;

  constructor() {
    super('MonsterPartyScene');
  }

  preload() {
    // Asset loading will happen here once images are sourced.
    // The SceneScriptPlayer handles missing textures gracefully
    // by creating colored placeholder rectangles.
  }

  create() {
    // Party room background
    this.cameras.main.setBackgroundColor('#1a0533');

    // Title text
    this.add.text(
      this.cameras.main.centerX,
      50,
      'Monster Birthday Party',
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      },
    ).setOrigin(0.5);

    // Spawn the monster as a persistent actor (always visible)
    this.spawnMonster();

    // Instruction text
    this.instructionText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height - 40,
      'Type a prompt below to plan the party!',
      {
        fontSize: '16px',
        color: '#8888bb',
        fontFamily: 'Arial, sans-serif',
      },
    ).setOrigin(0.5);

    this.narrationText = null;

    // Initialize the scene script player
    this.scriptPlayer = new SceneScriptPlayer(this);

    // Listen for scene scripts from React
    EventBus.on('play-script', this.handleScript, this);

    // Let React know the scene is ready
    EventBus.emit('scene-ready', this);
  }

  private spawnMonster() {
    // Create the monster as a persistent scene element
    // The SceneScriptPlayer will also reference "monster" by key
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY + 40;

    if (this.textures.exists('monster')) {
      this.add.image(cx, cy, 'monster').setScale(1.2);
    } else {
      // Placeholder monster
      const gfx = this.add.graphics();
      gfx.fillStyle(0x7c5cfc, 1);
      gfx.fillRoundedRect(cx - 45, cy - 50, 90, 100, 16);
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(cx - 15, cy - 20, 10);
      gfx.fillCircle(cx + 15, cy - 20, 10);
      gfx.fillStyle(0x000000, 1);
      gfx.fillCircle(cx - 15, cy - 20, 5);
      gfx.fillCircle(cx + 15, cy - 20, 5);
      // Smile
      gfx.lineStyle(3, 0xffffff, 1);
      gfx.beginPath();
      gfx.arc(cx, cy, 20, 0.2, Math.PI - 0.2, false);
      gfx.strokePath();

      // Label
      this.add.text(cx, cy + 65, 'Monster', {
        fontSize: '14px',
        color: '#aaaacc',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);
    }
  }

  async handleScript(script: SceneScript) {
    if (this.isPlaying) {
      console.warn('[MonsterPartyScene] Already playing a script, ignoring');
      return;
    }

    this.isPlaying = true;

    // Hide instruction text
    this.instructionText.setAlpha(0);

    // Show narration
    this.showNarration(script.narration, script.success_level);

    try {
      await this.scriptPlayer.play(script);
      await this.postScriptEffect(script.success_level);
    } catch (err) {
      console.error('[MonsterPartyScene] Script playback error:', err);
    }

    this.isPlaying = false;

    // Bring back instruction after a delay
    this.time.delayedCall(2000, () => {
      this.instructionText.setAlpha(1);
    });
  }

  private showNarration(text: string, level: string) {
    // Remove old narration
    if (this.narrationText) {
      this.narrationText.destroy();
    }

    const color = level === 'FULL_SUCCESS' ? '#34d399'
      : level === 'PARTIAL_SUCCESS' ? '#fbbf24'
      : '#c084fc';

    this.narrationText = this.add.text(
      this.cameras.main.centerX,
      100,
      text,
      {
        fontSize: '18px',
        color,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'italic',
        wordWrap: { width: 600 },
        align: 'center',
      },
    ).setOrigin(0.5).setAlpha(0);

    // Fade in
    this.tweens.add({
      targets: this.narrationText,
      alpha: 1,
      duration: 400,
      ease: 'Sine.easeOut',
    });
  }

  private async postScriptEffect(level: string): Promise<void> {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    if (level === 'FULL_SUCCESS') {
      // Screen-wide celebration: emoji confetti raining down
      const emojis = ['🎉', '🎊', '⭐', '🎈', '🎂', '✨', '💫', '🥳'];
      const particles: Phaser.GameObjects.Text[] = [];

      for (let i = 0; i < 30; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const x = Math.random() * w;
        const particle = this.add.text(x, -30, emoji, {
          fontSize: `${18 + Math.random() * 14}px`,
        }).setOrigin(0.5).setAlpha(0);
        particles.push(particle);
      }

      const promises = particles.map((p, i) =>
        new Promise<void>((resolve) => {
          this.tweens.add({
            targets: p,
            y: h + 30,
            alpha: { from: 1, to: 0.3 },
            angle: Math.random() * 360,
            duration: 1500 + Math.random() * 1000,
            delay: i * 60,
            ease: 'Sine.easeIn',
            onComplete: () => { p.destroy(); resolve(); },
          });
        }),
      );

      await Promise.all(promises);
    } else if (level === 'FUNNY_FAIL') {
      // Quick screen shake + floating emoji
      this.cameras.main.shake(400, 0.01);

      const q = this.add.text(w / 2, h / 2, '🤔', { fontSize: '64px' })
        .setOrigin(0.5).setAlpha(0);

      await new Promise<void>((resolve) => {
        this.tweens.add({
          targets: q,
          alpha: { from: 1, to: 0 },
          y: h / 2 - 60,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 1000,
          ease: 'Sine.easeOut',
          onComplete: () => { q.destroy(); resolve(); },
        });
      });
    }
  }

  shutdown() {
    EventBus.off('play-script', this.handleScript, this);
    this.scriptPlayer?.clear();
  }
}
