// liveEvents.ts
// Event Bus institucional de COTECIA Híbrida
// Orquesta sockets, WebRTC, UI, gifts, reacciones, subtítulos, interpretación,
// mixer, panel PRO, grabación, XP y ranking en tiempo real.

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import {
  onChatMessage,
  onReaction,
  onGift,
  onSticker,
  onViewersUpdate,
  onWebRTCOffer,
  onWebRTCAnswer,
  onWebRTCIce,
  onViewerJoin,
  sendWebRTCOfferToViewer,
  sendWebRTCAnswerToHost,
  sendWebRTCIce,
  onRankingUpdate,
  sendRankingUpdate,
} from "./liveSockets";

import {
  updateViewerCount,
  updateSubtitles,
} from "./liveUI";

import { canUserSendMessage } from "./liveControls";
import { processIncomingAudio } from "./audioMixer";

import { interpretBidirectional } from "./interpretation";
import { startSpeechToText } from "./speechToText";

// PANEL PRO AVANZADO
import {
  toggleChatMute,
  toggleSlowMode,
  toggleFollowersOnly,
  banUser,
  isUserBanned,
  isChatMuted,
  isUserShadowBanned,
} from "./livePanel";

// IA MODERATION
import { moderateMessage } from "./aiModeration";

// GRABACIÓN INSTITUCIONAL
import {
  startRecording,
  stopRecording,
  addSubtitle,
} from "./liveRecorder";

// GIFTS PREMIUM AVANZADOS
import { spawnAdvancedGift } from "./giftsAdvanced";

// SISTEMA DE XP + NIVELES + RANKING
import XP from "./xpSystem";

// ⭐ ANIMACIONES VIP
import {
  triggerLevelUp,
  triggerGiftExplosion,
} from "./vipAnimations";

// ⭐ MISIONES DIARIAS
import { incrementMissionProgress } from "./dailyMissions";

// ⭐ LOGROS
import { incrementAchievementProgress } from "./achievements";

// ⭐ TEMPORADAS
import { incrementSeasonXP } from "./seasons";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — TIPOS DEL EVENT BUS
// ---------------------------------------------

export interface LiveEventsConfig {
  role: "host" | "viewer";
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peers: { [id: string]: RTCPeerConnection };
  hostAudioRef?: HTMLAudioElement | null;
  user: string;
  isFollower: boolean;
  onMessage?: (msg: any) => void;
  onReaction?: (payload: any) => void;
  onGift?: (payload: any) => void;
  onSticker?: (payload: any) => void;
  onSubtitles?: (text: string) => void;
  onRanking?: (ranking: any[]) => void;
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — FUNCIÓN PRINCIPAL
// ---------------------------------------------

export function registerLiveEvents(cfg: LiveEventsConfig) {
  const {
    role,
    localStream,
    remoteStream,
    peers,
    hostAudioRef,
    user,
    isFollower,
    onMessage,
    onReaction: onReactionCb,
    onGift: onGiftCb,
    onSticker: onStickerCb,
    onSubtitles: onSubtitlesCb,
    onRanking: onRankingCb,
  } = cfg;

  console.log("🧠 liveEvents: Event Bus inicializado (modo:", role, ")");



  // ---------------------------------------------
  // RANKING EN TIEMPO REAL (RECEPCIÓN)
  // ---------------------------------------------
  onRankingUpdate((ranking) => {
    onRankingCb?.(ranking);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // CHAT + XP + LEVEL UP + MISIONES + LOGROS + TEMPORADAS
  // ---------------------------------------------
  onChatMessage(async (msg) => {
    if (isChatMuted()) return;
    if (isUserBanned(msg.user)) return;
    if (isUserShadowBanned(msg.user)) return;

    const moderation = canUserSendMessage(
      msg.user,
      msg.isFollower ?? false,
      msg.ts
    );
    if (!moderation.allowed) return;

    const ai = await moderateMessage(msg.text);
    if (!ai.allowed) return;

    const prevLevel = XP.getLevel(msg.user);

    XP.addXP(msg.user, XP.XP_VALUES.chatMessage);

    // ⭐ TEMPORADAS
    incrementSeasonXP(msg.user, XP.XP_VALUES.chatMessage);

    // ⭐ LOGROS: CHAT
    incrementAchievementProgress("chat", msg.user);

    const newLevel = XP.getLevel(msg.user);

    if (newLevel > prevLevel) {
      triggerLevelUp(msg.user);
      // ⭐ LOGROS: LEVEL UP
      incrementAchievementProgress("level", msg.user);
    }

    // ⭐ MISIÓN: CHAT
    incrementMissionProgress("chat");

    if (role === "host") sendRankingUpdate(XP.getRanking());

    onMessage?.(msg);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // REACCIONES + XP + LEVEL UP + MISIONES + LOGROS + TEMPORADAS
  // ---------------------------------------------
  onReaction((payload) => {
    if (payload?.user) {
      const prevLevel = XP.getLevel(payload.user);

      XP.addXP(payload.user, XP.XP_VALUES.reaction);

      // ⭐ TEMPORADAS
      incrementSeasonXP(payload.user, XP.XP_VALUES.reaction);

      // ⭐ LOGROS: REACCIONES
      incrementAchievementProgress("reaction", payload.user);

      const newLevel = XP.getLevel(payload.user);

      if (newLevel > prevLevel) {
        triggerLevelUp(payload.user);
        // ⭐ LOGROS: LEVEL UP
        incrementAchievementProgress("level", payload.user);
      }

      // ⭐ MISIÓN: REACCIONES
      incrementMissionProgress("reaction");

      if (role === "host") sendRankingUpdate(XP.getRanking());
    }

    onReactionCb?.(payload);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // GIFTS + XP + LEVEL UP + EXPLOSION + MISIONES + LOGROS + TEMPORADAS
  // ---------------------------------------------
  onGift((payload) => {
    const container = document.getElementById("gift-overlay");

    if (payload?.user) {
      const prevLevel = XP.getLevel(payload.user);
      const giftXP = XP.XP_VALUES.gift[payload.name] ?? 10;

      XP.addXP(payload.user, giftXP);

      // ⭐ TEMPORADAS
      incrementSeasonXP(payload.user, giftXP);

      // ⭐ LOGROS: GIFT
      incrementAchievementProgress("gift", payload.user);

      const newLevel = XP.getLevel(payload.user);

      if (newLevel > prevLevel) {
        triggerLevelUp(payload.user);
        // ⭐ LOGROS: LEVEL UP
        incrementAchievementProgress("level", payload.user);
      }

      // ⭐ ANIMACIÓN VIP ESPECIAL
      triggerGiftExplosion(payload.user, payload.name);

      // ⭐ MISIÓN: GIFT
      incrementMissionProgress("gift");

      if (role === "host") sendRankingUpdate(XP.getRanking());
    }

    if (container) spawnAdvancedGift(container, payload.name);

    onGiftCb?.(payload);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // STICKERS + XP + LEVEL UP + MISIONES + LOGROS + TEMPORADAS
  // ---------------------------------------------
  onSticker((payload) => {
    if (payload?.user) {
      const prevLevel = XP.getLevel(payload.user);

      XP.addXP(payload.user, XP.XP_VALUES.sticker);

      // ⭐ TEMPORADAS
      incrementSeasonXP(payload.user, XP.XP_VALUES.sticker);

      // ⭐ LOGROS: STICKER
      incrementAchievementProgress("sticker", payload.user);

      const newLevel = XP.getLevel(payload.user);

      if (newLevel > prevLevel) {
        triggerLevelUp(payload.user);
        // ⭐ LOGROS: LEVEL UP
        incrementAchievementProgress("level", payload.user);
      }

      // ⭐ MISIÓN: STICKER
      incrementMissionProgress("sticker");

      if (role === "host") sendRankingUpdate(XP.getRanking());
    }

    onStickerCb?.(payload);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // VIEWERS
  // ---------------------------------------------
  onViewersUpdate(({ count }) => {
    updateViewerCount(count);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // VIEWER JOIN → HOST CREA PEER
  // ---------------------------------------------
  if (role === "host") {
    onViewerJoin(({ viewerId }) => {
      console.log("👤 Nuevo viewer:", viewerId);
      createPeerForViewer(viewerId);
    });
  }
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // WEBRTC — VIEWER RECIBE OFFER
  // ---------------------------------------------
  if (role === "viewer") {
    onWebRTCOffer(async ({ offer, hostId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peers[hostId] = pc;

      const stream = new MediaStream();
      if (cfg.remoteStream) cfg.remoteStream = stream;

      pc.ontrack = (event) => stream.addTrack(event.track);

      pc.onicecandidate = (event) => {
        if (event.candidate) sendWebRTCIce(hostId, event.candidate);
      };

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      sendWebRTCAnswerToHost(hostId, answer);
    });
  }
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // WEBRTC — HOST RECIBE ANSWER
  // ---------------------------------------------
  if (role === "host") {
    onWebRTCAnswer(async ({ viewerId, answer }) => {
      const pc = peers[viewerId];
      if (!pc) return;
      await pc.setRemoteDescription(answer);
    });
  }
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // WEBRTC — ICE
  // ---------------------------------------------
  onWebRTCIce(async ({ from, candidate }) => {
    const pc = peers[from];
    if (!pc) return;
    await pc.addIceCandidate(candidate);
  });
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // STT + INTERPRETACIÓN + GRABACIÓN (HOST)
  // ---------------------------------------------
  if (role === "host" && localStream) {
    startSpeechToText(localStream, async (originalText) => {
      updateSubtitles(originalText);
      onSubtitlesCb?.(originalText);
      addSubtitle(originalText);

      try {
        const result = await interpretBidirectional(
          await streamToBlob(localStream),
          "host"
        );

        updateSubtitles(result.translatedText);
        onSubtitlesCb?.(result.translatedText);
        addSubtitle(result.translatedText);
      } catch (err) {
        console.warn("Interpretación host→viewer falló:", err);
      }
    });
  }
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // INTERPRETACIÓN BIDIRECCIONAL (VIEWER → HOST)
  // ---------------------------------------------
  if (role === "host" && hostAudioRef) {
    hostAudioRef.onplay = async () => {
      try {
        const audioStream = hostAudioRef.srcObject as MediaStream;
        if (!audioStream) return;

        const result = await interpretBidirectional(
          await streamToBlob(audioStream),
          "viewer"
        );

        console.log("🗣️ Viewer → Host interpretado:", result.translatedText);
        addSubtitle(result.translatedText);
      } catch (err) {
        console.warn("Interpretación viewer→host falló:", err);
      }
    };
  }
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // FUNCIÓN INTERNA: CREAR PEER PARA VIEWER
  // ---------------------------------------------
  async function createPeerForViewer(viewerId: string) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peers[viewerId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) sendWebRTCIce(viewerId, event.candidate);
    };

    pc.ontrack = (event) => {
      const [track] = event.streams[0].getAudioTracks();
      if (track && hostAudioRef) {
        const audioStream = new MediaStream([track]);
        hostAudioRef.srcObject = audioStream;
        hostAudioRef.play().catch(() => {});
        processIncomingAudio(audioStream);
      }
    };

    localStream?.getTracks().forEach((track) =>
      pc.addTrack(track, localStream)
    );

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendWebRTCOfferToViewer(viewerId, offer);
  }
  // FINAL DEL BLOQUE



  // ---------------------------------------------
  // XP POR VER EL LIVE + MISIÓN WATCH + LOGROS + TEMPORADAS
  // ---------------------------------------------
  if (role === "viewer") {
    setInterval(() => {
      const amount = XP.XP_VALUES.watchPerMinute;

      XP.addXP(user, amount);

      // ⭐ TEMPORADAS
      incrementSeasonXP(user, amount);

      // ⭐ LOGROS: WATCH
      incrementAchievementProgress("watch", user);

      // ⭐ MISIÓN: WATCH
      incrementMissionProgress("watch");
    }, 60_000);
  }

} // FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — UTILIDAD: STREAM → BLOB
// ---------------------------------------------

async function streamToBlob(stream: MediaStream): Promise<Blob> {
  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  return new Promise((resolve) => {
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () =>
      resolve(new Blob(chunks, { type: "audio/webm" }));
    recorder.start();
    setTimeout(() => recorder.stop(), 500);
  });
}

// FINAL DEL BLOQUE 4



// ---------------------------------------------
// BLOQUE 5 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  registerLiveEvents,
};

// FINAL DEL BLOQUE 5
// FINAL DEL ARCHIVO
