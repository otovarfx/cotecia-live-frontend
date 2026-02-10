// gifts.ts
// Sistema institucional de COTECIA Híbrida
// Gifts premium animados (SVG + animaciones PRO)

// ---------------------------------------------
// BLOQUE 1 — SVGs PREMIUM
// ---------------------------------------------

export const GiftSVG = {
  rose: `
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff4d6d" />
          <stop offset="100%" stop-color="#b3003c" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill="url(#roseGlow)" />
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="32px" font-weight="bold">🌹</text>
    </svg>
  `,
  star: `
    <svg width="140" height="140" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffe066" />
          <stop offset="100%" stop-color="#ffba08" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="45" fill="url(#starGlow)" />
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="38px" font-weight="bold">⭐</text>
    </svg>
  `,
  rocket: `
    <svg width="150" height="150" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="rocketGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4dabf7" />
          <stop offset="100%" stop-color="#1864ab" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#rocketGlow)" />
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="40px" font-weight="bold">🚀</text>
    </svg>
  `,
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — ANIMACIÓN PREMIUM
// ---------------------------------------------

export function playGiftAnimation(container: HTMLElement, type: string) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = GiftSVG[type] || "";
  wrapper.className =
    "absolute animate-gift-pop pointer-events-none select-none";

  container.appendChild(wrapper);

  setTimeout(() => wrapper.remove(), 2000);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  GiftSVG,
  playGiftAnimation,
};

// FINAL DEL BLOQUE 3
// FINAL DEL ARCHIVO
