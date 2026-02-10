"use client";

import { useEffect, useState } from "react";

export default function RankingViewer({ socketRanking, currentUser }) {
  const [ranking, setRanking] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (!socketRanking) return;

    socketRanking((data) => {
      setRanking(data);
      const mine = data.find((r) => r.user === currentUser);
      setMe(mine ?? null);
    });
  }, [socketRanking, currentUser]);

  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-xl shadow-lg animate-fadeIn w-full max-w-sm">
      <h2 className="text-lg font-bold mb-3 text-[var(--accent)]">
        ⭐ Tu progreso
      </h2>

      {me && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Nivel {me.level}</span>
            <span className="text-sm text-[var(--text-secondary)]">
              XP: {me.xp}
            </span>
          </div>

          <div className="w-full h-3 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-[var(--accent)] transition-all"
              style={{
                width: `${Math.min((me.xp % 100) / 100 * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      <h3 className="text-md font-bold mb-2 text-[var(--accent)]">
        🏆 Top 5 del stream
      </h3>

      <div className="space-y-2">
        {ranking.slice(0, 5).map((item, i) => (
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
