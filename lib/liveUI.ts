// liveUI.ts
// Módulo institucional de COTECIA Híbrida
// UI del LIVE: botones, overlays, estados visuales, animaciones.

// ---------------------------------------------
// BLOQUE 1 — TIPOS DE ELEMENTOS UI
// ---------------------------------------------

export interface LiveUIButton {
  id: string;
  label: string;
  icon?: string;
  visible: boolean;
  enabled: boolean;
}

export interface LiveUIOverlay {
  id: string;
  visible: boolean;
  content?: string;
}

export interface LiveUIState {
  buttons: Record<string, LiveUIButton>;
  overlays: Record<string, LiveUIOverlay>;
}

// Estado inicial institucional
let state: LiveUIState = {
  buttons: {
    mic: { id: "mic", label: "Mic", icon: "🎤", visible: true, enabled: true },
    cam: { id: "cam", label: "Cam", icon: "📷", visible: true, enabled: true },
    end: { id: "end", label: "End", icon: "⛔", visible: true, enabled: true },
    invite: { id: "invite", label: "Invite", icon: "👥", visible: true, enabled: true },
    flip: { id: "flip", label: "Flip", icon: "🔄", visible: true, enabled: true },
    fullscreen: { id: "fullscreen", label: "Full", icon: "🖥️", visible: true, enabled: true },
  },
  overlays: {
    loading: { id: "loading", visible: false, content: "Cargando..." },
    subtitles: { id: "subtitles", visible: true, content: "" },
    viewerCount: { id: "viewerCount", visible: true, content: "0" },
    gifts: { id: "gifts", visible: true, content: "" },
  },
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initLiveUI(initial?: Partial<LiveUIState>) {
  state = { ...state, ...(initial || {}) };
  console.log("🎨 LiveUI inicializado:", state);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — CONTROL DE BOTONES
// ---------------------------------------------

export function showButton(id: string) {
  if (state.buttons[id]) {
    state.buttons[id].visible = true;
  }
}

export function hideButton(id: string) {
  if (state.buttons[id]) {
    state.buttons[id].visible = false;
  }
}

export function enableButton(id: string) {
  if (state.buttons[id]) {
    state.buttons[id].enabled = true;
  }
}

export function disableButton(id: string) {
  if (state.buttons[id]) {
    state.buttons[id].enabled = false;
  }
}

export function getButton(id: string) {
  return state.buttons[id];
}

export function getAllButtons() {
  return Object.values(state.buttons);
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — CONTROL DE OVERLAYS
// ---------------------------------------------

export function showOverlay(id: string, content?: string) {
  if (state.overlays[id]) {
    state.overlays[id].visible = true;
    if (content) state.overlays[id].content = content;
  }
}

export function hideOverlay(id: string) {
  if (state.overlays[id]) {
    state.overlays[id].visible = false;
  }
}

export function updateOverlay(id: string, content: string) {
  if (state.overlays[id]) {
    state.overlays[id].content = content;
  }
}

export function getOverlay(id: string) {
  return state.overlays[id];
}

export function getAllOverlays() {
  return Object.values(state.overlays);
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — SUBTÍTULOS EN TIEMPO REAL
// ---------------------------------------------

export function updateSubtitles(text: string) {
  if (state.overlays["subtitles"]) {
    state.overlays["subtitles"].content = text;
  }
}

export function clearSubtitles() {
  if (state.overlays["subtitles"]) {
    state.overlays["subtitles"].content = "";
  }
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — CONTADOR DE VIEWERS
// ---------------------------------------------

export function updateViewerCount(count: number) {
  if (state.overlays["viewerCount"]) {
    state.overlays["viewerCount"].content = String(count);
  }
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — ANIMACIONES DE GIFTS
// ---------------------------------------------

export function triggerGiftAnimation(giftName: string) {
  if (state.overlays["gifts"]) {
    state.overlays["gifts"].content = giftName;

    // Reset automático después de 2 segundos
    setTimeout(() => {
      state.overlays["gifts"].content = "";
    }, 2000);
  }
}

// FINAL DEL BLOQUE 7


// ---------------------------------------------
// BLOQUE 8 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initLiveUI,
  showButton,
  hideButton,
  enableButton,
  disableButton,
  getButton,
  getAllButtons,
  showOverlay,
  hideOverlay,
  updateOverlay,
  getOverlay,
  getAllOverlays,
  updateSubtitles,
  clearSubtitles,
  updateViewerCount,
  triggerGiftAnimation,
};

// FINAL DEL BLOQUE 8
// FINAL DEL ARCHIVO
