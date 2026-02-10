// /lib/vipAnimations.ts
// Disparadores institucionales de Animaciones VIP

import { pushVipEvent } from "@/components/live/VIPAnimations";

// ⭐ LEVEL UP
export function triggerLevelUp(user: string) {
  pushVipEvent({ type: "level-up", user });
}

// ⭐ MISIÓN COMPLETADA
export function triggerMissionCompleted(user: string) {
  pushVipEvent({ type: "mission-completed", user });
}

// ⭐ LOGRO DESBLOQUEADO
export function triggerAchievementUnlocked(user: string) {
  pushVipEvent({ type: "achievement-unlocked", user });
}

// ⭐ RECOMPENSA DE TEMPORADA
export function triggerSeasonReward(user: string) {
  pushVipEvent({ type: "season-reward", user });
}

// ⭐ TOP RANKING
export function triggerTopRanking(user: string) {
  pushVipEvent({ type: "top-ranking", user });
}

// ⭐ GIFT EXPLOSION
export function triggerGiftExplosion(user: string, giftName: string) {
  pushVipEvent({ type: "gift-explosion", user, payload: { giftName } });
}
