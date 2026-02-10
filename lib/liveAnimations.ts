// liveAnimations.ts
// Módulo institucional de COTECIA Híbrida
// Animaciones premium para el LIVE: fade, pop, pulse, slide, VIP effects.

// ---------------------------------------------
// BLOQUE 1 — TIPOS Y CONFIGURACIÓN
// ---------------------------------------------

export type LiveAnimationType =
  | "fadeIn"
  | "fadeOut"
  | "pop"
  | "pulse"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "vipGlow"
  | "shake";

export interface LiveAnimationOptions {
  duration?: number; // ms
  delay?: number; // ms
  iterations?: number | "infinite";
  easing?: string;
}

const defaultOptions: Required<LiveAnimationOptions> = {
  duration: 400,
  delay: 0,
  iterations: 1,
  easing: "ease-out",
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — APLICAR ANIMACIÓN A UN ELEMENTO
// ---------------------------------------------

export function applyAnimation(
  element: HTMLElement | null,
  type: LiveAnimationType,
  options?: LiveAnimationOptions
) {
  if (!element) return;

  const opts = { ...defaultOptions, ...(options || {}) };

  const keyframes = getKeyframes(type);
  const animation = element.animate(keyframes, {
    duration: opts.duration,
    delay: opts.delay,
    iterations: opts.iterations,
    easing: opts.easing,
    fill: "both",
  });

  return animation;
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — DEFINICIÓN DE KEYFRAMES
// ---------------------------------------------

function getKeyframes(type: LiveAnimationType): Keyframe[] {
  switch (type) {
    case "fadeIn":
      return [
        { opacity: 0 },
        { opacity: 1 },
      ];

    case "fadeOut":
      return [
        { opacity: 1 },
        { opacity: 0 },
      ];

    case "pop":
      return [
        { transform: "scale(0.8)", opacity: 0 },
        { transform: "scale(1.05)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ];

    case "pulse":
      return [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.08)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ];

    case "slideUp":
      return [
        { transform: "translateY(20px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ];

    case "slideDown":
      return [
        { transform: "translateY(-20px)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ];

    case "slideLeft":
      return [
        { transform: "translateX(20px)", opacity: 0 },
        { transform: "translateX(0)", opacity: 1 },
      ];

    case "slideRight":
      return [
        { transform: "translateX(-20px)", opacity: 0 },
        { transform: "translateX(0)", opacity: 1 },
      ];

    case "vipGlow":
      return [
        { boxShadow: "0 0 0px rgba(255,215,0,0)", transform: "scale(1)" },
        { boxShadow: "0 0 18px rgba(255,215,0,0.9)", transform: "scale(1.03)" },
        { boxShadow: "0 0 0px rgba(255,215,0,0)", transform: "scale(1)" },
      ];

    case "shake":
      return [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" },
      ];

    default:
      return [{ opacity: 1 }, { opacity: 1 }];
  }
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — HELPERS ESPECÍFICOS PARA EL LIVE
// ---------------------------------------------

export function animateGift(element: HTMLElement | null) {
  return applyAnimation(element, "pop", { duration: 500 });
}

export function animateViewerJoin(element: HTMLElement | null) {
  return applyAnimation(element, "slideUp", { duration: 350 });
}

export function animateViewerLeave(element: HTMLElement | null) {
  return applyAnimation(element, "fadeOut", { duration: 300 });
}

export function animateVipUser(element: HTMLElement | null) {
  return applyAnimation(element, "vipGlow", {
    duration: 900,
    iterations: 2,
  });
}

export function animateError(element: HTMLElement | null) {
  return applyAnimation(element, "shake", { duration: 400 });
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  applyAnimation,
  animateGift,
  animateViewerJoin,
  animateViewerLeave,
  animateVipUser,
  animateError,
};

// FINAL DEL BLOQUE 5
// FINAL DEL ARCHIVO
