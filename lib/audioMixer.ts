// audioMixer.ts
// Módulo institucional de COTECIA Híbrida
// Mezcla inteligente de audio para evitar eco, loops y saturación.
// Este módulo se usa tanto para el host como para el viewer.

// ---------------------------------------------
// BLOQUE 1 — TIPOS Y CONFIGURACIÓN
// ---------------------------------------------

export interface AudioMixerConfig {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  highpassFilter?: boolean;
  limiter?: boolean;
}

let config: AudioMixerConfig = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  highpassFilter: true,
  limiter: true,
};

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initAudioMixer(cfg?: AudioMixerConfig) {
  config = { ...config, ...(cfg || {}) };
  console.log("🎚️ AudioMixer inicializado:", config);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — CREAR CONTEXTO DE AUDIO
// ---------------------------------------------

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — PROCESAR STREAM DE AUDIO
// ---------------------------------------------

export function processIncomingAudio(stream: MediaStream): MediaStream {
  const ctx = getAudioContext();

  const source = ctx.createMediaStreamSource(stream);

  // Filtros
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = config.highpassFilter ? 120 : 0;

  const compressor = ctx.createDynamicsCompressor();
  if (config.limiter) {
    compressor.threshold.value = -10;
    compressor.knee.value = 0;
    compressor.ratio.value = 20;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.05;
  }

  // Conectar cadena
  source.connect(highpass);
  highpass.connect(compressor);

  const destination = ctx.createMediaStreamDestination();
  compressor.connect(destination);

  return destination.stream;
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — PROCESAR MICRÓFONO LOCAL
// ---------------------------------------------

export async function processMicrophone(): Promise<MediaStream> {
  const rawStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: config.echoCancellation,
      noiseSuppression: config.noiseSuppression,
      autoGainControl: config.autoGainControl,
    },
  });

  return processIncomingAudio(rawStream);
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — MEZCLAR DOS STREAMS (HOST + VIEWER)
// ---------------------------------------------

export function mixStreams(streamA: MediaStream, streamB: MediaStream): MediaStream {
  const ctx = getAudioContext();

  const sourceA = ctx.createMediaStreamSource(streamA);
  const sourceB = ctx.createMediaStreamSource(streamB);

  const merger = ctx.createChannelMerger(2);

  sourceA.connect(merger, 0, 0);
  sourceB.connect(merger, 0, 1);

  const destination = ctx.createMediaStreamDestination();
  merger.connect(destination);

  return destination.stream;
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — EVITAR ECO Y LOOPS
// ---------------------------------------------

export function preventEcho(stream: MediaStream, localStream: MediaStream): MediaStream {
  const ctx = getAudioContext();

  const incoming = ctx.createMediaStreamSource(stream);
  const local = ctx.createMediaStreamSource(localStream);

  const inverter = ctx.createGain();
  inverter.gain.value = -1;

  local.connect(inverter);

  const merger = ctx.createChannelMerger(2);
  incoming.connect(merger, 0, 0);
  inverter.connect(merger, 0, 1);

  const destination = ctx.createMediaStreamDestination();
  merger.connect(destination);

  return destination.stream;
}

// FINAL DEL BLOQUE 7


// ---------------------------------------------
// BLOQUE 8 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initAudioMixer,
  processIncomingAudio,
  processMicrophone,
  mixStreams,
  preventEcho,
};

// FINAL DEL BLOQUE 8
// FINAL DEL ARCHIVO
