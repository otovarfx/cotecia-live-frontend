// liveSockets.ts
// Módulo institucional de COTECIA Híbrida
// Socket.io centralizado: chat, reacciones, gifts, viewers, WebRTC, ranking, etc.

// ---------------------------------------------
// BLOQUE 1 — IMPORTS Y TIPOS BÁSICOS
// ---------------------------------------------

import { io, Socket } from "socket.io-client";

export type ChatMessage = {
  user: string;
  text: string;
  ts: number;
  isFollower?: boolean;
};

export type ReactionType = "heart" | "fire" | "clap";
export type GiftType = "rose" | "star" | "rocket";
export type StickerType = "like" | "wow" | "gg";

export interface ReactionPayload {
  type: ReactionType;
  user: string;
}

export interface GiftPayload {
  name: GiftType;
  user: string;
}

export interface StickerPayload {
  sticker: StickerType;
  user: string;
}

export interface ViewersUpdatePayload {
  count: number;
}

export interface WebRTCOfferPayload {
  offer: RTCSessionDescriptionInit;
  hostId?: string;
  viewerId?: string;
}

export interface WebRTCAnswerPayload {
  answer: RTCSessionDescriptionInit;
  hostId?: string;
  viewerId?: string;
}

export interface WebRTCIcePayload {
  from?: string;
  target?: string;
  candidate: RTCIceCandidateInit;
}

export interface ViewerJoinPayload {
  viewerId: string;
}

// Ranking en tiempo real
export interface RankingEntry {
  user: string;
  xp: number;
  level: number;
}

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — SINGLETON SOCKET
// ---------------------------------------------

let socket: Socket | null = null;

export function initLiveSockets(serverUrl: string): Socket {
  if (!socket) {
    socket = io(serverUrl, {
      transports: ["websocket"],
    });
    console.log("🔌 liveSockets: conectado a", serverUrl);
  }
  return socket;
}

export function getLiveSocket(): Socket | null {
  return socket;
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — EMISIÓN DE EVENTOS
// ---------------------------------------------

export function sendChatMessage(msg: ChatMessage) {
  socket?.emit("chat:message", msg);
}

export function sendReaction(payload: ReactionPayload) {
  socket?.emit("reaction", payload);
}

export function sendGift(payload: GiftPayload) {
  socket?.emit("gift", payload);
}

export function sendSticker(payload: StickerPayload) {
  socket?.emit("sticker", payload);
}

export function notifyViewerJoin() {
  socket?.emit("viewer:join");
}

export function sendWebRTCOfferToViewer(viewerId: string, offer: RTCSessionDescriptionInit) {
  socket?.emit("webrtc:offer", { viewerId, offer });
}

export function sendWebRTCAnswerToHost(hostId: string, answer: RTCSessionDescriptionInit) {
  socket?.emit("webrtc:answer", { hostId, answer });
}

export function sendWebRTCIce(targetId: string, candidate: RTCIceCandidateInit) {
  socket?.emit("webrtc:ice", { target: targetId, candidate });
}

// ⭐ NUEVO: EMITIR RANKING EN TIEMPO REAL
export function sendRankingUpdate(ranking: RankingEntry[]) {
  socket?.emit("ranking:update", ranking);
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — SUSCRIPCIÓN A EVENTOS BÁSICOS
// ---------------------------------------------

export function onChatMessage(handler: (msg: ChatMessage) => void) {
  socket?.on("chat:message", handler);
  return () => socket?.off("chat:message", handler);
}

export function onReaction(handler: (payload: ReactionPayload) => void) {
  socket?.on("reaction", handler);
  return () => socket?.off("reaction", handler);
}

export function onGift(handler: (payload: GiftPayload) => void) {
  socket?.on("gift", handler);
  return () => socket?.off("gift", handler);
}

export function onSticker(handler: (payload: StickerPayload) => void) {
  socket?.on("sticker", handler);
  return () => socket?.off("sticker", handler);
}

export function onViewersUpdate(handler: (payload: ViewersUpdatePayload) => void) {
  socket?.on("viewers:update", handler);
  return () => socket?.off("viewers:update", handler);
}

// ⭐ NUEVO: RECIBIR RANKING EN TIEMPO REAL
export function onRankingUpdate(handler: (ranking: RankingEntry[]) => void) {
  socket?.on("ranking:update", handler);
  return () => socket?.off("ranking:update", handler);
}

// FINAL DEL BLOQUE 4



// ---------------------------------------------
// BLOQUE 5 — SUSCRIPCIÓN A SEÑALIZACIÓN WEBRTC
// ---------------------------------------------

export function onWebRTCOffer(
  handler: (payload: { offer: RTCSessionDescriptionInit; hostId: string }) => void
) {
  socket?.on("webrtc:offer", handler);
  return () => socket?.off("webrtc:offer", handler);
}

export function onWebRTCAnswer(
  handler: (payload: { viewerId: string; answer: RTCSessionDescriptionInit }) => void
) {
  socket?.on("webrtc:answer", handler);
  return () => socket?.off("webrtc:answer", handler);
}

export function onWebRTCIce(
  handler: (payload: { from: string; candidate: RTCIceCandidateInit }) => void
) {
  socket?.on("webrtc:ice", handler);
  return () => socket?.off("webrtc:ice", handler);
}

export function onViewerJoin(handler: (payload: ViewerJoinPayload) => void) {
  socket?.on("viewer:join", handler);
  return () => socket?.off("viewer:join", handler);
}

// FINAL DEL BLOQUE 5



// ---------------------------------------------
// BLOQUE 6 — LIMPIEZA Y CIERRE
// ---------------------------------------------

export function disconnectLiveSockets() {
  if (socket) {
    socket.disconnect();
    console.log("🔌 liveSockets: desconectado");
    socket = null;
  }
}

// FINAL DEL BLOQUE 6



// ---------------------------------------------
// BLOQUE 7 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initLiveSockets,
  getLiveSocket,
  sendChatMessage,
  sendReaction,
  sendGift,
  sendSticker,
  notifyViewerJoin,
  sendWebRTCOfferToViewer,
  sendWebRTCAnswerToHost,
  sendWebRTCIce,
  sendRankingUpdate,     // ⭐ NUEVO
  onChatMessage,
  onReaction,
  onGift,
  onSticker,
  onViewersUpdate,
  onRankingUpdate,       // ⭐ NUEVO
  onWebRTCOffer,
  onWebRTCAnswer,
  onWebRTCIce,
  onViewerJoin,
  disconnectLiveSockets,
};

// FINAL DEL BLOQUE 7
// FINAL DEL ARCHIVO
