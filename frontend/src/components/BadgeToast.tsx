import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { BADGES } from '../services/badge-system';

export default function BadgeToast() {
  const badgeUnlocks = useGameStore((s) => s.badgeUnlocks);
  const clearBadgeUnlocks = useGameStore((s) => s.clearBadgeUnlocks);

  useEffect(() => {
    if (badgeUnlocks.length === 0) return;
    const timer = setTimeout(clearBadgeUnlocks, 3500);
    return () => clearTimeout(timer);
  }, [badgeUnlocks, clearBadgeUnlocks]);

  if (badgeUnlocks.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {badgeUnlocks.map((id) => {
        const badge = BADGES.find((b) => b.id === id);
        if (!badge) return null;
        return (
          <div
            key={id}
            className="animate-slide-in-right bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-quest-purple/30 px-4 py-3 flex items-center gap-3 min-w-[220px]"
          >
            <span className="text-2xl">{badge.emoji}</span>
            <div>
              <p className="font-heading font-bold text-sm text-quest-text-dark">
                {badge.label} Unlocked!
              </p>
              <p className="text-xs text-quest-text-muted">{badge.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
