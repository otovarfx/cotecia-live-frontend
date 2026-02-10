// levelBadges.ts
// Sistema institucional de badges de nivel (1–100) — COTECIA Híbrida

export function getBadgeForLevel(level: number) {
  if (level < 1) level = 1;
  if (level > 100) level = 100;

  return `/badges/level_${level}.png`;
}
