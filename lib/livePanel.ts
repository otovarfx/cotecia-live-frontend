// livePanel.ts
// Panel PRO avanzado — mute global, slow-mode dinámico, shadowban

// ---------------------------------------------
// BLOQUE 1 — ESTADO INTERNO
// ---------------------------------------------

let chatMuted = false;
let followersOnly = false;
let slowModeSeconds = 0;

const bannedUsers = new Set<string>();
const shadowBannedUsers = new Set<string>();

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — CONTROLES BÁSICOS (YA EXISTENTES)
// ---------------------------------------------

export function toggleChatMute() {
  chatMuted = !chatMuted;
  console.log("🔇 Chat mute global:", chatMuted);
}

export function toggleFollowersOnly() {
  followersOnly = !followersOnly;
  console.log("⭐ Followers only:", followersOnly);
}

export function toggleSlowMode(seconds: number) {
  slowModeSeconds = seconds;
  console.log("🐢 Slow mode:", slowModeSeconds, "segundos");
}

export function banUser(user: string) {
  bannedUsers.add(user);
  console.log("⛔ Usuario baneado:", user);
}

export function isUserBanned(user: string): boolean {
  return bannedUsers.has(user);
}

export function isChatMuted(): boolean {
  return chatMuted;
}

export function getSlowModeSeconds(): number {
  return slowModeSeconds;
}

export function isFollowersOnly(): boolean {
  return followersOnly;
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — SHADOWBAN AVANZADO
// ---------------------------------------------

export function shadowBanUser(user: string) {
  shadowBannedUsers.add(user);
  console.log("👻 Shadowban aplicado a:", user);
}

export function unshadowBanUser(user: string) {
  shadowBannedUsers.delete(user);
  console.log("👻 Shadowban removido de:", user);
}

export function isUserShadowBanned(user: string): boolean {
  return shadowBannedUsers.has(user);
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  toggleChatMute,
  toggleFollowersOnly,
  toggleSlowMode,
  banUser,
  isUserBanned,
  isChatMuted,
  getSlowModeSeconds,
  isFollowersOnly,
  shadowBanUser,
  unshadowBanUser,
  isUserShadowBanned,
};

// FINAL DEL BLOQUE 4
// FINAL DEL ARCHIVO
