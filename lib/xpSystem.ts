// xpSystem.ts
// Sistema de XP + niveles + ranking en tiempo real — COTECIA Híbrida

// ---------------------------------------------
// BLOQUE 1 — ESTADO GLOBAL
// ---------------------------------------------

// XP total por usuario
const xpMap = new Map<string, number>();

// Nivel actual por usuario
const levelMap = new Map<string, number>();

// Ranking en tiempo real (ordenado por XP)
const ranking: Array<{ user: string; xp: number; level: number }> = [];

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — CONFIGURACIÓN DE XP
// ---------------------------------------------

export const XP_VALUES = {
  watchPerMinute: 2,   // XP por ver el live cada minuto
  chatMessage: 5,      // XP por enviar mensaje
  reaction: 3,         // XP por reacción
  sticker: 4,          // XP por sticker
  gift: {              // XP por gift según rareza
    rose: 10,
    star: 25,
    rocket: 60,
  },
};

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — FUNCIÓN PRINCIPAL: AÑADIR XP
// ---------------------------------------------

export function addXP(user: string, amount: number) {
  if (!user) return;

  const current = xpMap.get(user) ?? 0;
  const newXP = current + amount;

  xpMap.set(user, newXP);

  updateLevel(user, newXP);
  updateRanking();

  return newXP;
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — CÁLCULO DE NIVEL
// ---------------------------------------------

function updateLevel(user: string, xp: number) {
  const level = calculateLevel(xp);
  levelMap.set(user, level);
}

// Fórmula escalable: nivel crece más lento a medida que sube
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

// FINAL DEL BLOQUE 4



// ---------------------------------------------
// BLOQUE 5 — RANKING EN TIEMPO REAL
// ---------------------------------------------

function updateRanking() {
  const arr = [...xpMap.entries()].map(([user, xp]) => ({
    user,
    xp,
    level: levelMap.get(user) ?? 1,
  }));

  arr.sort((a, b) => b.xp - a.xp);

  ranking.length = 0;
  ranking.push(...arr);
}

export function getRanking() {
  return ranking;
}

// FINAL DEL BLOQUE 5



// ---------------------------------------------
// BLOQUE 6 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  addXP,
  getRanking,
  calculateLevel,
  XP_VALUES,
};

// FINAL DEL BLOQUE 6
// FINAL DEL ARCHIVO
