import { useRef, useCallback } from 'react';
import PhaserGame from './game/PhaserGame';
import type { PhaserGameRef } from './game/PhaserGame';
import PromptInput from './components/PromptInput';
import ErrorBoundary from './components/ErrorBoundary';
import { useGameStore } from './stores/gameStore';

const TASKS: Record<string, { label: string; emoji: string; scene: string }> = {
  'monster-party': { label: 'Monster Birthday Party', emoji: '🎂', scene: 'MonsterPartyScene' },
  'robot-pizza': { label: 'Robot Pizza Delivery', emoji: '🤖', scene: 'RobotPizzaScene' },
};

export default function App() {
  const phaserRef = useRef<PhaserGameRef>(null);
  const currentTask = useGameStore((s) => s.currentTask);
  const switchTask = useCallback((taskId: string) => {
    const store = useGameStore.getState();
    if (taskId === store.currentTask) return;

    // Update store
    useGameStore.setState({ currentTask: taskId, lastScript: null, lastSource: null, error: null });

    // Switch Phaser scene
    const game = phaserRef.current?.game;
    const info = TASKS[taskId];
    if (game && info) {
      game.scene.start(info.scene);
      // Stop the old scene
      const oldInfo = TASKS[store.currentTask];
      if (oldInfo && oldInfo.scene !== info.scene) {
        game.scene.stop(oldInfo.scene);
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-quest-bg stars-bg">
        {/* Header */}
        <header className="relative px-5 py-3 flex items-center justify-between z-10">
          {/* Subtle bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-quest-accent/40 to-transparent" />

          <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-quest-gold via-quest-accent to-quest-cyan bg-clip-text text-transparent drop-shadow-lg">
            Prompt Quest
          </h1>

          <nav className="flex items-center gap-3">
            {Object.entries(TASKS).map(([id, info]) => (
              <button
                key={id}
                onClick={() => switchTask(id)}
                className={`btn-game text-sm px-4 py-2 rounded-xl border-2 ${
                  id === currentTask
                    ? 'bg-gradient-to-b from-quest-accent to-purple-700 text-white border-quest-glow shadow-glow-purple'
                    : 'bg-quest-card/60 text-purple-200/70 border-quest-border hover:border-quest-accent/50 hover:text-white'
                }`}
              >
                <span className="mr-1.5 text-base">{info.emoji}</span>
                {info.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Phaser Game Canvas */}
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <PhaserGame ref={phaserRef} />
        </div>

        {/* Prompt Input */}
        <PromptInput />
      </div>
    </ErrorBoundary>
  );
}
