"use client";

import { useEffect, useState } from "react";

export default function RankingPanelHost({ socketRanking }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if (!socketRanking) return;
    socketRanking((data) => setRanking(data));
  }, [socketRanking]);

  return (
    <div className="p-4 bg-[var(--bg-secondary)] rounded-xl shadow-lg animate-pop w-full max-w-sm">
      <h2 className="text-lg font-bold mb-3 text-[var(--accent)]">
        🏆 Ranking en tiempo real
      </h2>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {ranking.map((item, i) => (
          <div
            key={item.user}
            className="flex items-center justify-between p-2 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--accent)]">
                #{i + 1}
              </span>
              <span className="font-semibold">{item.user}</span>
            </div>

            <div className="text-right">
              <div className="text-sm text-[var(--text-secondary)]">
                XP: {item.xp}
              </div>
              <div className="text-xs text-[var(--vip)] font-bold">
                Nivel {item.level}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
