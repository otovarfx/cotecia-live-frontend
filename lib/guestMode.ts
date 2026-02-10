// guestMode.ts
// Módulo institucional de COTECIA Híbrida
// Modo Invitado (Dual Live)
// Permite que un invitado se una al host con cámara + micrófono.

// ---------------------------------------------
// BLOQUE 1 — TIPOS Y CONFIGURACIÓN
// ---------------------------------------------

export interface GuestModeConfig {
  maxGuests?: number; // número máximo de invitados
  allowAudio?: boolean;
  allowVideo?: boolean;
}

let config: GuestModeConfig = {
  maxGuests: 1,
  allowAudio: true,
  allowVideo: true,
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initGuestMode(cfg?: GuestModeConfig) {
  config = { ...config, ...(cfg || {}) };
  console.log("🎥 GuestMode inicializado:", config);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — CREAR PEER CONNECTION PARA INVITADO
// ---------------------------------------------

export function createGuestPeer(): RTCPeerConnection {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  console.log("🔗 PeerConnection para invitado creado");

  return pc;
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — AGREGAR STREAM DEL INVITADO
// ---------------------------------------------

export function addGuestStream(
  pc: RTCPeerConnection,
  stream: MediaStream
) {
  if (config.allowAudio) {
    stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream));
  }

  if (config.allowVideo) {
    stream.getVideoTracks().forEach((track) => pc.addTrack(track, stream));
  }

  console.log("🎤🎥 Stream del invitado agregado al PeerConnection");
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — CAPTURAR CÁMARA Y MIC DEL INVITADO
// ---------------------------------------------

export async function getGuestMedia(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: config.allowAudio,
    video: config.allowVideo,
  });

  console.log("📸 Invitado: cámara y micrófono activados");

  return stream;
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — CREAR OFERTA PARA EL HOST
// ---------------------------------------------

export async function createGuestOffer(
  pc: RTCPeerConnection
): Promise<RTCSessionDescriptionInit> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  console.log("📡 Invitado: offer creado");

  return offer;
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — PROCESAR ANSWER DEL HOST
// ---------------------------------------------

export async function handleHostAnswer(
  pc: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
) {
  await pc.setRemoteDescription(answer);
  console.log("📡 Invitado: answer del host procesado");
}

// FINAL DEL BLOQUE 7


// ---------------------------------------------
// BLOQUE 8 — HOST: PROCESAR OFFER DEL INVITADO
// ---------------------------------------------

export async function hostProcessGuestOffer(
  pc: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> {
  await pc.setRemoteDescription(offer);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  console.log("🎛️ Host: answer generado para invitado");

  return answer;
}

// FINAL DEL BLOQUE 8


// ---------------------------------------------
// BLOQUE 9 — HOST: RECIBIR STREAM DEL INVITADO
// ---------------------------------------------

export function hostReceiveGuestStream(
  pc: RTCPeerConnection,
  callback: (stream: MediaStream) => void
) {
  pc.ontrack = (event) => {
    const stream = event.streams[0];
    console.log("📺 Host: stream del invitado recibido");
    callback(stream);
  };
}

// FINAL DEL BLOQUE 9


// ---------------------------------------------
// BLOQUE 10 — ICE CANDIDATES
// ---------------------------------------------

export function setupIceHandlers(
  pc: RTCPeerConnection,
  onCandidate: (candidate: RTCIceCandidate) => void
) {
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onCandidate(event.candidate);
    }
  };

  console.log("❄️ ICE handlers configurados");
}

// FINAL DEL BLOQUE 10


// ---------------------------------------------
// BLOQUE 11 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initGuestMode,
  createGuestPeer,
  addGuestStream,
  getGuestMedia,
  createGuestOffer,
  handleHostAnswer,
  hostProcessGuestOffer,
  hostReceiveGuestStream,
  setupIceHandlers,
};

// FINAL DEL BLOQUE 11
// FINAL DEL ARCHIVO
