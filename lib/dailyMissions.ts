// /lib/dailyMissions.ts
// Sistema institucional de Misiones Diarias — COTECIA LIVE

import { triggerMissionCompleted } from "./vipAnimations";
import XP from "./xpSystem";

export type DailyMission = {
  id: string;
  title: string;
  goal: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  rewardXP: number;
};

const DEFAULT_MISSIONS: DailyMission[] = [
  {
    id: "chat_5",
    title: "Enviar 5 mensajes",
    goal: 5,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 50,
  },
  {
    id: "reactions_10",
    title: "Enviar 10 reacciones",
    goal: 10,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 40,
  },
  {
    id: "watch_10",
    title: "Ver el live por 10 minutos",
    goal: 10,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 60,
  },
  {
    id: "gift_1",
    title: "Enviar 1 gift",
    goal: 1,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 80,
  },
  {
    id: "sticker_1",
    title: "Enviar 1 sticker",
    goal: 1,
    progress: 0,
    completed: false,
    claimed: false,
    rewardXP: 30,
  },
];

let missions: DailyMission[] = loadMissions();

function loadMissions(): DailyMission[] {
  const saved = localStorage.getItem("daily_missions");
  if (saved) return JSON.parse(saved);

  localStorage.setItem("daily_missions", JSON.stringify(DEFAULT_MISSIONS));
  return DEFAULT_MISSIONS;
}

function saveMissions() {
  localStorage.setItem("daily_missions", JSON.stringify(missions));
}

export function getDailyMissions() {
  return missions;
}

export function incrementMissionProgress(type: "chat" | "reaction" | "gift" | "sticker" | "watch") {
  missions.forEach((m) => {
    if (m.completed) return;

    if (
      (type === "chat" && m.id === "chat_5") ||
      (type === "reaction" && m.id === "reactions_10") ||
      (type === "gift" && m.id === "gift_1") ||
      (type === "sticker" && m.id === "sticker_1") ||
      (type === "watch" && m.id === "watch_10")
    ) {
      m.progress++;

      if (m.progress >= m.goal) {
        m.completed = true;
        triggerMissionCompleted("user");
      }
    }
  });

  saveMissions();
}

export function claimMission(id: string, user: string) {
  const m = missions.find((x) => x.id === id);
  if (!m || !m.completed || m.claimed) return false;

  m.claimed = true;
  XP.addXP(user, m.rewardXP);

  saveMissions();
  return true;
}

export function resetDailyMissions() {
  missions = DEFAULT_MISSIONS.map((m) => ({
    ...m,
    progress: 0,
    completed: false,
    claimed: false,
  }));

  saveMissions();
}
