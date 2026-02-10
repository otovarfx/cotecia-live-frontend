// /components/live/SeasonsPanel.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getSeason,
  claimSeasonReward,
  SeasonData,
} from "@/lib/seasons";
import XP from "@/lib/xpSystem";
import { triggerSeasonReward } from "@/lib/vipAnimations";

export default function SeasonsPanel() {
  const [season, setSeason] = useState<SeasonData | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const s = getSeason();
    setSeason({ ...s });
    updateTimeLeft(s.startedAt);

    const interval = setInterval(() => {
      updateTimeLeft(s.startedAt);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  function updateTimeLeft(startedAt: string) {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = now.getTime() - start.getTime();

    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    const daysLeft = 30 - daysPassed;

    setTimeLeft(daysLeft > 0 ? `${daysLeft} días restantes` : "Finaliza hoy");
  }

  function handleClaim() {
    if (!season) return;

    const success = claimSeasonReward("user");

    if (success) {
      triggerSeasonReward("user");
      setSeason({ ...getSeason() });
    }
  }

  if (!season) return null;

  const xpNeeded = 500;
  const progressPercent = Math.min(
    ((season.xp % xpNeeded) / xpNeeded) * 100,
    100
  );

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[var(--text)]">
        🎖️ Temporada Actual
      </h2>

      {/* Nivel de temporada */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[var(--text)] font-semibold">
          Nivel de Temporada: {season.level}
        </span>
        <span className="text-[var(--text-secondary)] text-sm">
          {timeLeft}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-3 bg-[var(--bg)] rounded-full overflow-hidden mb-3 border border-[var(--border)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-4">
        <span>{season.xp % xpNeeded} / {xpNeeded} XP</span>
        <span>Total XP: {season.xp}</span>
      </div>

      {/* Botón de reclamar recompensa */}
      {!season.rewardClaimed ? (
        <button
          onClick={handleClaim}
          className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition"
        >
          Reclamar recompensa de temporada
        </button>
      ) : (
        <div className="w-full py-2 rounded-lg bg-green-600/80 text-white font-semibold text-center">
          Recompensa reclamada ✔
        </div>
      )}
    </div>
  );
}
