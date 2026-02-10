// /lib/achievements.ts
// Sistema institucional de Logros — COTECIA LIVE

import XP from "./xpSystem";
import { triggerAchievementUnlocked } from "./vipAnimations";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  rewardXP: number;
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "chat_50",
    title: "Comunicador Activo",
    description: "Envía 50 mensajes en el live",
    goal: 50,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 150,
  },
  {
    id: "reaction_100",
    title: "Reaccionador Profesional",
    description: "Envía 100 reacciones",
    goal: 100,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 120,
  },
  {
    id: "gift_10",
    title: "Donador Generoso",
    description: "Envía 10 gifts",
    goal: 10,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 200,
  },
  {
    id: "sticker_20",
    title: "Sticker Master",
    description: "Envía 20 stickers",
    goal: 20,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 100,
  },
  {
    id: "watch_60",
    title: "Fan Leal",
    description: "Mira el live por 60 minutos",
    goal: 60,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 180,
  },
  {
    id: "level_10",
    title: "Nivel 10",
    description: "Alcanza el nivel 10",
    goal: 10,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 250,
  },
];

let achievements: Achievement[] = loadAchievements();

function loadAchievements(): Achievement[] {
  const saved = localStorage.getItem("achievements");
  if (saved) return JSON.parse(saved);

  localStorage.setItem("achievements", JSON.stringify(DEFAULT_ACHIEVEMENTS));
  return DEFAULT_ACHIEVEMENTS;
}

function saveAchievements() {
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

export function getAchievements() {
  return achievements;
}

export function incrementAchievementProgress(type: string, user: string) {
  achievements.forEach((a) => {
    if (a.completed) return;

    if (
      (type === "chat" && a.id === "chat_50") ||
      (type === "reaction" && a.id === "reaction_100") ||
      (type === "gift" && a.id === "gift_10") ||
      (type === "sticker" && a.id === "sticker_20") ||
      (type === "watch" && a.id === "watch_60") ||
      (type === "level" && a.id === "level_10")
    ) {
      a.progress++;

      if (a.progress >= a.goal) {
        a.completed = true;
        triggerAchievementUnlocked(user);
      }
    }
  });

  saveAchievements();
}

export function claimAchievement(id: string) {
  const a = achievements.find((x) => x.id === id);
  if (!a || !a.completed || a.claimed) return false;

  a.claimed = true;

  // XP extra
  XP.addXP("user", a.rewardXP);

  saveAchievements();
  return true;
}

export function resetAchievements() {
  achievements = DEFAULT_ACHIEVEMENTS.map((a) => ({
    ...a,
    progress: 0,
    completed: false,
    claimed: false,
  }));

  saveAchievements();
}
