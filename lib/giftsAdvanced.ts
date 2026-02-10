// giftsAdvanced.ts
// Gifts Premium Avanzados — COTECIA Híbrida
// Glow dinámico + partículas + trail + pop PRO

// ---------------------------------------------
// BLOQUE 1 — SVGs PREMIUM AVANZADOS
// ---------------------------------------------

export const GiftAdvancedSVG = {
  rose: "🌹",
  star: "⭐",
  rocket: "🚀",
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — ANIMACIÓN PRINCIPAL DEL GIFT
// ---------------------------------------------

export function spawnAdvancedGift(container: HTMLElement, type: string) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "absolute pointer-events-none select-none animate-gift-advanced-pop";
  wrapper.style.left = Math.random() * 60 + 20 + "%";
  wrapper.style.top = "50%";
  wrapper.style.fontSize = "64px";
  wrapper.style.filter = "drop-shadow(0 0 12px rgba(255,255,255,0.9))";

  wrapper.innerHTML = GiftAdvancedSVG[type] || "⭐";

  container.appendChild(wrapper);

  spawnParticles(container, wrapper);

  setTimeout(() => wrapper.remove(), 2000);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — PARTÍCULAS PREMIUM
// ---------------------------------------------

function spawnParticles(container: HTMLElement, parent: HTMLElement) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "absolute text-xl animate-gift-particle";
    p.innerHTML = "✨";

    const rect = parent.getBoundingClientRect();
    p.style.left = rect.left + rect.width / 2 + "px";
    p.style.top = rect.top + rect.height / 2 + "px";

    p.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${
      (Math.random() - 0.5) * 120
    }px) scale(${Math.random() * 1.2 + 0.5})`;

    container.appendChild(p);

    setTimeout(() => p.remove(), 1200);
  }
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  spawnAdvancedGift,
  GiftAdvancedSVG,
};

// FINAL DEL BLOQUE 4
// FINAL DEL ARCHIVO
