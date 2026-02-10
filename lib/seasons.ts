// /lib/seasons.ts
// Sistema institucional de Temporadas — COTECIA LIVE

import { triggerSeasonReward } from "./vipAnimations";
import XP from "./xpSystem";

export type SeasonData = {
  seasonId: number;
  xp: number;
  level: number;
  rewardClaimed: boolean;
  startedAt: string;
};

const SEASON_DURATION_DAYS = 30; // Duración de cada temporada
const XP_PER_LEVEL = 500; // XP necesario para subir nivel de temporada

let season: SeasonData = loadSeason();

function loadSeason(): SeasonData {
  const saved = localStorage.getItem("season_data");

  if (saved) {
    const parsed = JSON.parse(saved);

    // Verificar si la temporada expiró
    const start = new Date(parsed.startedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays >= SEASON_DURATION_DAYS) {
      return resetSeason();
    }

    return parsed;
  }

  return resetSeason();
}

function saveSeason() {
  localStorage.setItem("season_data", JSON.stringify(season));
}

export function getSeason() {
  return season;
}

export function incrementSeasonXP(user: string, amount: number) {
  season.xp += amount;

  const newLevel = Math.floor(season.xp / XP_PER_LEVEL);

  if (newLevel > season.level) {
    season.level = newLevel;
  }

  saveSeason();
}

export function claimSeasonReward(user: string) {
  if (season.rewardClaimed) return false;

  // Recompensa basada en nivel de temporada
  const rewardXP = season.level * 200;

  XP.addXP(user, rewardXP);

  season.rewardClaimed = true;

  // Animación VIP
  triggerSeasonReward(user);

  saveSeason();
  return true;
}

export function resetSeason(): SeasonData {
  season = {
    seasonId: Date.now(),
    xp: 0,
    level: 0,
    rewardClaimed: false,
    startedAt: new Date().toISOString(),
  };

  saveSeason();
  return season;
}
