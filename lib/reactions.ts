// reactions.ts
// Reacciones TikTok PRO — COTECIA Híbrida
// Floating hearts / fire / clap con animaciones premium

// ---------------------------------------------
// BLOQUE 1 — SVGs DE REACCIONES
// ---------------------------------------------

export const ReactionSVG = {
  heart: "❤️",
  fire: "🔥",
  clap: "👏",
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — ANIMACIÓN DE REACCIÓN
// ---------------------------------------------

export function spawnReaction(container: HTMLElement, type: string) {
  const el = document.createElement("div");
  el.className =
    "absolute text-4xl pointer-events-none select-none animate-reaction-float";
  el.style.left = Math.random() * 80 + "%";
  el.style.bottom = "20px";
  el.innerHTML = ReactionSVG[type] || "❤️";

  container.appendChild(el);

  setTimeout(() => el.remove(), 2000);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  spawnReaction,
  ReactionSVG,
};

// FINAL DEL BLOQUE 3
// FINAL DEL ARCHIVO
