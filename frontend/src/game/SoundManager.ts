import Phaser from 'phaser';
import { useGameStore } from '../stores/gameStore';

/**
 * Simple SFX manager wrapping Phaser.Sound.
 * Reads mute state from Zustand store.
 */
export class SoundManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  play(key: string, volume = 0.5): void {
    if (useGameStore.getState().isMuted) return;
    if (!this.scene.sound || !this.scene.cache.audio.exists(key)) return;

    this.scene.sound.play(key, { volume });
  }
}
