// liveControls.ts
// Módulo institucional de COTECIA Híbrida
// Panel PRO del Host: mute, ban, slow mode, followers-only, etc.

// ---------------------------------------------
// BLOQUE 1 — TIPOS Y ESTADO INTERNO
// ---------------------------------------------

export interface LiveControlsState {
  chatMuted: boolean;
  slowMode: boolean;
  followersOnly: boolean;
  bannedUsers: Set<string>;
  slowModeDelay: number; // segundos entre mensajes
}

let state: LiveControlsState = {
  chatMuted: false,
  slowMode: false,
  followersOnly: false,
  bannedUsers: new Set(),
  slowModeDelay: 5,
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initLiveControls(initial?: Partial<LiveControlsState>) {
  state = { ...state, ...(initial || {}) };
  console.log("🛠️ LiveControls inicializado:", state);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — MUTEO GLOBAL DEL CHAT
// ---------------------------------------------

export function toggleChatMute() {
  state.chatMuted = !state.chatMuted;
  console.log("🔇 Chat mute:", state.chatMuted);
  return state.chatMuted;
}

export function isChatMuted() {
  return state.chatMuted;
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — MODO LENTO (SLOW MODE)
// ---------------------------------------------

export function toggleSlowMode() {
  state.slowMode = !state.slowMode;
  console.log("🐌 Slow mode:", state.slowMode);
  return state.slowMode;
}

export function setSlowModeDelay(seconds: number) {
  state.slowModeDelay = seconds;
  console.log("⏱️ Slow mode delay:", seconds);
}

export function getSlowModeDelay() {
  return state.slowModeDelay;
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — FOLLOWERS ONLY MODE
// ---------------------------------------------

export function toggleFollowersOnly() {
  state.followersOnly = !state.followersOnly;
  console.log("⭐ Followers-only:", state.followersOnly);
  return state.followersOnly;
}

export function isFollowersOnly() {
  return state.followersOnly;
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — BANEO DE USUARIOS
// ---------------------------------------------

export function banUser(username: string) {
  state.bannedUsers.add(username);
  console.log("⛔ Usuario baneado:", username);
}

export function unbanUser(username: string) {
  state.bannedUsers.delete(username);
  console.log("✔ Usuario desbaneado:", username);
}

export function isUserBanned(username: string) {
  return state.bannedUsers.has(username);
}

export function getBannedUsers() {
  return Array.from(state.bannedUsers);
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — VALIDACIÓN DE MENSAJES
// ---------------------------------------------

export function canUserSendMessage(
  username: string,
  isFollower: boolean,
  lastMessageTimestamp: number
): { allowed: boolean; reason?: string } {
  const now = Date.now();

  if (state.chatMuted) {
    return { allowed: false, reason: "chat_muted" };
  }

  if (state.bannedUsers.has(username)) {
    return { allowed: false, reason: "banned" };
  }

  if (state.followersOnly && !isFollower) {
    return { allowed: false, reason: "followers_only" };
  }

  if (state.slowMode && now - lastMessageTimestamp < state.slowModeDelay * 1000) {
    return { allowed: false, reason: "slow_mode" };
  }

  return { allowed: true };
}

// FINAL DEL BLOQUE 7


// ---------------------------------------------
// BLOQUE 8 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initLiveControls,
  toggleChatMute,
  isChatMuted,
  toggleSlowMode,
  setSlowModeDelay,
  getSlowModeDelay,
  toggleFollowersOnly,
  isFollowersOnly,
  banUser,
  unbanUser,
  isUserBanned,
  getBannedUsers,
  canUserSendMessage,
};

// FINAL DEL BLOQUE 8
// FINAL DEL ARCHIVO
