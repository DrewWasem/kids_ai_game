import { forwardRef, useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MonsterPartyScene } from './scenes/MonsterPartyScene';
import { RobotPizzaScene } from './scenes/RobotPizzaScene';
import EventBus from './EventBus';

export interface PhaserGameRef {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

const PhaserGame = forwardRef<PhaserGameRef>(function PhaserGame(_props, ref) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (gameRef.current || !gameContainerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 1024,
      height: 576,
      backgroundColor: '#1a0533',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [MonsterPartyScene, RobotPizzaScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    if (typeof ref === 'function') {
      ref({ game, scene: null });
    } else if (ref) {
      ref.current = { game, scene: null };
    }

    // Update ref when scene is ready
    EventBus.on('scene-ready', (scene: Phaser.Scene) => {
      if (typeof ref === 'function') {
        ref({ game, scene });
      } else if (ref) {
        ref.current = { game, scene };
      }
    });

    return () => {
      EventBus.removeAllListeners('scene-ready');
      game.destroy(true);
      gameRef.current = null;
    };
  }, [ref]);

  return <div ref={gameContainerRef} className="w-full h-full" />;
});

export default PhaserGame;
