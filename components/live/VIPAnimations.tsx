// /components/live/VIPAnimations.tsx
"use client";

import { useEffect, useState } from "react";

type VipEventType =
  | "level-up"
  | "mission-completed"
  | "achievement-unlocked"
  | "season-reward"
  | "top-ranking"
  | "gift-explosion";

export type VipEvent = {
  id: number;
  type: VipEventType;
  user: string;
  payload?: any;
};

let externalPush: ((ev: VipEvent) => void) | null = null;

export function pushVipEvent(ev: Omit<VipEvent, "id">) {
  if (!externalPush) return;
  externalPush({
    ...ev,
    id: Date.now() + Math.random(),
  });
}

export default function VIPAnimations() {
  const [events, setEvents] = useState<VipEvent[]>([]);

  useEffect(() => {
    externalPush = (ev: VipEvent) => {
      setEvents((prev) => [...prev, ev]);
      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== ev.id));
      }, 2000);
    };

    return () => {
      externalPush = null;
    };
  }, []);

  if (!events.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center">
      {events.map((ev) => (
        <div key={ev.id} className="absolute">
          {/* LEVEL UP */}
          {ev.type === "level-up" && (
            <div className="animate-vip-burst px-6 py-3 rounded-2xl bg-[var(--accent)]/90 text-white text-xl font-extrabold shadow-2xl border border-white/40">
              LEVEL UP! <span className="ml-2 text-sm opacity-80">@{ev.user}</span>
            </div>
          )}

          {/* MISIÓN COMPLETADA */}
          {ev.type === "mission-completed" && (
            <div className="animate-vip-pulse px-5 py-2 rounded-2xl bg-emerald-500/90 text-white text-lg font-bold shadow-2xl border border-white/30">
              MISIÓN COMPLETADA 🎯
            </div>
          )}

          {/* LOGRO DESBLOQUEADO */}
          {ev.type === "achievement-unlocked" && (
            <div className="animate-vip-burst px-6 py-3 rounded-2xl bg-purple-600/90 text-white text-lg font-bold shadow-2xl border border-yellow-300/60">
              LOGRO DESBLOQUEADO 🏅
            </div>
          )}

          {/* RECOMPENSA DE TEMPORADA */}
          {ev.type === "season-reward" && (
            <div className="animate-vip-burst px-6 py-3 rounded-2xl bg-[var(--vip)]/90 text-black text-lg font-extrabold shadow-2xl border border-white/40">
              RECOMPENSA DE TEMPORADA 🎖️
            </div>
          )}

          {/* TOP RANKING */}
          {ev.type === "top-ranking" && (
            <div className="animate-vip-pulse px-6 py-3 rounded-2xl bg-amber-500/90 text-white text-lg font-bold shadow-2xl border border-white/40">
              TOP 3 DEL RANKING 🏆
            </div>
          )}

          {/* GIFT EXPLOSION */}
          {ev.type === "gift-explosion" && (
            <div className="animate-vip-burst px-6 py-3 rounded-2xl bg-pink-500/90 text-white text-lg font-bold shadow-2xl border border-white/40">
              GIFT ÉPICO 💎 {ev.payload?.giftName}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
