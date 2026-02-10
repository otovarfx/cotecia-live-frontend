// stickers.ts
// Stickers Animados PRO — COTECIA Híbrida
// like / wow / gg con animaciones premium

// ---------------------------------------------
// BLOQUE 1 — SVGs PREMIUM
// ---------------------------------------------

export const StickerSVG = {
  like: "👍",
  wow: "😮",
  gg: "🏆",
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — ANIMACIÓN DE STICKER
// ---------------------------------------------

export function spawnSticker(container: HTMLElement, type: string) {
  const el = document.createElement("div");
  el.className =
    "absolute text-5xl pointer-events-none select-none animate-sticker-pop";
  el.style.left = Math.random() * 80 + "%";
  el.style.bottom = "40px";
  el.innerHTML = StickerSVG[type] || "👍";

  container.appendChild(el);

  setTimeout(() => el.remove(), 1800);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  spawnSticker,
  StickerSVG,
};

// FINAL DEL BLOQUE 3
// FINAL DEL ARCHIVO
