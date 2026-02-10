import Phaser from 'phaser';
import EventBus from '../EventBus';
import { SceneScriptPlayer } from '../SceneScriptPlayer';
import type { SceneScript } from '../../types/scene-script';

export class RobotPizzaScene extends Phaser.Scene {
  private scriptPlayer!: SceneScriptPlayer;
  private instructionText!: Phaser.GameObjects.Text;
  private narrationText!: Phaser.GameObjects.Text | null;
  private isPlaying = false;

  constructor() {
    super('RobotPizzaScene');
  }

  preload() {
    // Asset loading will happen here once images are sourced.
    // The SceneScriptPlayer handles missing textures gracefully
    // by creating colored placeholder rectangles.
  }

  create() {
    // City skyline background — dark blue/gray gradient
    this.cameras.main.setBackgroundColor('#0d1b2a');

    // Draw simple city skyline silhouette
    this.drawCitySkyline();

    // Title text
    this.add.text(
      this.cameras.main.centerX,
      50,
      'Robot Pizza Delivery',
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      },
    ).setOrigin(0.5);

    // Spawn the robot as a persistent actor (always visible)
    this.spawnRobot();

    // Instruction text
    this.instructionText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height - 40,
      'Type instructions to help the robot deliver the pizza!',
      {
        fontSize: '16px',
        color: '#7799bb',
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

  private drawCitySkyline() {
    const w = this.cameras.main.width;
    const gfx = this.add.graphics();

    // Ground / street
    gfx.fillStyle(0x1b2838, 1);
    gfx.fillRect(0, 440, w, 136);

    // Road markings
    gfx.fillStyle(0x3a4a5a, 1);
    gfx.fillRect(0, 470, w, 4);
    // Dashed center line
    gfx.fillStyle(0xf0c040, 1);
    for (let x = 20; x < w; x += 60) {
      gfx.fillRect(x, 490, 30, 3);
    }

    // Building silhouettes (background)
    const buildings = [
      { x: 30, w: 80, h: 180 },
      { x: 130, w: 60, h: 240 },
      { x: 210, w: 100, h: 160 },
      { x: 340, w: 70, h: 220 },
      { x: 430, w: 90, h: 200 },
      { x: 550, w: 60, h: 260 },
      { x: 630, w: 110, h: 180 },
      { x: 770, w: 70, h: 230 },
      { x: 860, w: 90, h: 190 },
      { x: 960, w: 60, h: 210 },
    ];

    buildings.forEach((b) => {
      const baseY = 440;
      // Building body
      gfx.fillStyle(0x162330, 1);
      gfx.fillRect(b.x, baseY - b.h, b.w, b.h);
      // Building outline
      gfx.lineStyle(1, 0x2a3a4a, 0.6);
      gfx.strokeRect(b.x, baseY - b.h, b.w, b.h);
      // Windows (small yellow/white dots)
      gfx.fillStyle(0xffdd44, 0.6);
      for (let wy = baseY - b.h + 20; wy < baseY - 10; wy += 30) {
        for (let wx = b.x + 12; wx < b.x + b.w - 10; wx += 18) {
          if (Math.random() > 0.3) {
            gfx.fillRect(wx, wy, 8, 10);
          }
        }
      }
    });
  }

  private spawnRobot() {
    // Create the robot as a persistent scene element
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY + 40;

    if (this.textures.exists('robot')) {
      this.add.image(cx, cy, 'robot').setScale(1.2);
    } else {
      // Placeholder robot
      const gfx = this.add.graphics();
      // Body (metallic blue-gray)
      gfx.fillStyle(0x4a7a9b, 1);
      gfx.fillRoundedRect(cx - 40, cy - 45, 80, 90, 12);
      // Head visor
      gfx.fillStyle(0x22ddff, 0.8);
      gfx.fillRoundedRect(cx - 30, cy - 35, 60, 25, 8);
      // Eyes (LED dots)
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(cx - 12, cy - 22, 6);
      gfx.fillCircle(cx + 12, cy - 22, 6);
      gfx.fillStyle(0x00ff88, 1);
      gfx.fillCircle(cx - 12, cy - 22, 3);
      gfx.fillCircle(cx + 12, cy - 22, 3);
      // Antenna
      gfx.lineStyle(3, 0x4a7a9b, 1);
      gfx.lineBetween(cx, cy - 45, cx, cy - 60);
      gfx.fillStyle(0xff4444, 1);
      gfx.fillCircle(cx, cy - 63, 5);
      // Mouth (small line)
      gfx.lineStyle(2, 0x22ddff, 0.8);
      gfx.lineBetween(cx - 10, cy - 5, cx + 10, cy - 5);

      // Label
      this.add.text(cx, cy + 60, 'Robot', {
        fontSize: '14px',
        color: '#7799bb',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);
    }
  }

  async handleScript(script: SceneScript) {
    if (this.isPlaying) {
      console.warn('[RobotPizzaScene] Already playing a script, ignoring');
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
      console.error('[RobotPizzaScene] Script playback error:', err);
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
      // Delivery celebration: pizza + rocket + star emojis raining down
      const emojis = ['🍕', '🤖', '⭐', '🚀', '✨', '🎉', '💫', '🏆'];
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
      // Quick screen shake + confused robot emoji
      this.cameras.main.shake(400, 0.01);

      const q = this.add.text(w / 2, h / 2, '🤖', { fontSize: '64px' })
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
