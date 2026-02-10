// /components/live/AchievementsPanel.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getAchievements,
  Achievement,
  claimAchievement,
} from "@/lib/achievements";
import XP from "@/lib/xpSystem";
import { triggerAchievementUnlocked } from "@/lib/vipAnimations";

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements([...getAchievements()]);
  }, []);

  function handleClaim(a: Achievement) {
    const success = claimAchievement(a.id);

    if (success) {
      // Animación VIP
      triggerAchievementUnlocked("user");

      // Recargar lista
      setAchievements([...getAchievements()]);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[var(--text)]">
        🏅 Logros
      </h2>

      <div className="space-y-4">
        {achievements.map((a) => {
          const progressPercent = Math.min(
            (a.progress / a.goal) * 100,
            100
          );

          return (
            <div
              key={a.id}
              className={`p-4 rounded-lg border ${
                a.completed
                  ? "border-purple-400 bg-purple-600/20"
                  : "border-[var(--border)] bg-[var(--bg)]"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-[var(--text)]">
                  {a.title}
                </h3>

                {a.completed && !a.claimed && (
                  <span className="text-purple-400 font-bold text-sm animate-vip-burst">
                    ✔ Completado
                  </span>
                )}

                {a.claimed && (
                  <span className="text-green-400 font-bold text-sm">
                    Reclamado
                  </span>
                )}
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {a.description}
              </p>

              {/* Barra de progreso */}
              <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-3">
                <span>
                  {a.progress} / {a.goal}
                </span>
                <span>+{a.rewardXP} XP</span>
              </div>

              {/* BOTÓN DE RECLAMAR */}
              {a.completed && !a.claimed && (
                <button
                  onClick={() => handleClaim(a)}
                  className="w-full py-2 mt-1 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                >
                  Reclamar recompensa
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
