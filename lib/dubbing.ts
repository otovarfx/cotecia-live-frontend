// dubbing.ts
// Módulo institucional de COTECIA Híbrida
// Doblaje automático (Texto → Voz)
// Convierte texto traducido en audio listo para reproducir en el LIVE.

// ---------------------------------------------
// BLOQUE 1 — CONFIGURACIÓN DEL MOTOR DE TTS
// ---------------------------------------------

export type TTSProvider = "azure" | "google" | "openai";

interface DubbingConfig {
  provider: TTSProvider;
  apiKey: string;
  endpoint?: string;
  voice?: string; // nombre de la voz a usar
  language?: string; // idioma destino
}

let config: DubbingConfig | null = null;

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initDubbing(cfg: DubbingConfig) {
  config = cfg;
  console.log("🎧 Doblaje inicializado con proveedor:", cfg.provider);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — FUNCIÓN PRINCIPAL DE DOBLAJE
// ---------------------------------------------

export async function generateDubbingAudio(
  text: string,
  language?: string,
  voice?: string
): Promise<Blob> {
  if (!config) {
    throw new Error("Dubbing no inicializado. Llama a initDubbing() primero.");
  }

  const lang = language || config.language || "en-US";
  const selectedVoice = voice || config.voice || "default";

  switch (config.provider) {
    case "azure":
      return await dubbingAzure(text, lang, selectedVoice);

    case "google":
      return await dubbingGoogle(text, lang, selectedVoice);

    case "openai":
      return await dubbingOpenAI(text, lang, selectedVoice);

    default:
      throw new Error("Proveedor TTS no soportado.");
  }
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — IMPLEMENTACIÓN AZURE TTS
// ---------------------------------------------

async function dubbingAzure(
  text: string,
  language: string,
  voice: string
): Promise<Blob> {
  if (!config?.apiKey || !config?.endpoint) {
    throw new Error("Falta configuración de Azure TTS");
  }

  const ssml = `
    <speak version="1.0" xml:lang="${language}">
      <voice name="${voice}">${text}</voice>
    </speak>
  `;

  const res = await fetch(`${config.endpoint}/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": config.apiKey,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
    },
    body: ssml,
  });

  const buffer = await res.arrayBuffer();
  return new Blob([buffer], { type: "audio/mp3" });
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — IMPLEMENTACIÓN GOOGLE TTS
// ---------------------------------------------

async function dubbingGoogle(
  text: string,
  language: string,
  voice: string
): Promise<Blob> {
  if (!config?.apiKey) throw new Error("Falta API Key de Google TTS");

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: language, name: voice },
        audioConfig: { audioEncoding: "MP3" },
      }),
    }
  );

  const json = await res.json();
  const audioBase64 = json.audioContent;

  const binary = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
  return new Blob([binary], { type: "audio/mp3" });
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — IMPLEMENTACIÓN OPENAI TTS
// ---------------------------------------------

async function dubbingOpenAI(
  text: string,
  language: string,
  voice: string
): Promise<Blob> {
  if (!config?.apiKey) throw new Error("Falta API Key de OpenAI");

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      input: text,
      voice,
      language,
      format: "mp3",
    }),
  });

  const buffer = await res.arrayBuffer();
  return new Blob([buffer], { type: "audio/mp3" });
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initDubbing,
  generateDubbingAudio,
};

// FINAL DEL BLOQUE 7
// FINAL DEL ARCHIVO
