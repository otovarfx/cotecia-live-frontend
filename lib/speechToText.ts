// speechToText.ts
// Módulo institucional de COTECIA Híbrida
// Subtítulos automáticos en tiempo real (Speech‑to‑Text)

// ---------------------------------------------
// BLOQUE 1 — CONFIGURACIÓN DEL MOTOR DE VOZ
// ---------------------------------------------

// Este módulo está diseñado para ser compatible con:
// - Whisper API
// - Azure Speech Services
// - Google STT
// - Deepgram
// - AssemblyAI
// - Cualquier motor STT moderno

// Aquí definimos una interfaz genérica para que COTECIA
// pueda cambiar de proveedor sin romper nada.

export type STTProvider = "azure" | "whisper" | "deepgram" | "google";

interface SpeechToTextConfig {
  provider: STTProvider;
  apiKey: string;
  endpoint?: string;
}

let config: SpeechToTextConfig | null = null;

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initSpeechToText(cfg: SpeechToTextConfig) {
  config = cfg;
  console.log("🎙️ STT inicializado con proveedor:", cfg.provider);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — PROCESAR AUDIO Y CONVERTIR A TEXTO
// ---------------------------------------------

// Esta función recibe audio (Blob, ArrayBuffer o Stream)
// y devuelve texto transcrito en tiempo real.

export async function transcribeAudio(audioData: Blob | ArrayBuffer): Promise<string> {
  if (!config) {
    throw new Error("SpeechToText no inicializado. Llama a initSpeechToText() primero.");
  }

  switch (config.provider) {
    case "whisper":
      return await transcribeWithWhisper(audioData);

    case "azure":
      return await transcribeWithAzure(audioData);

    case "deepgram":
      return await transcribeWithDeepgram(audioData);

    case "google":
      return await transcribeWithGoogle(audioData);

    default:
      throw new Error("Proveedor STT no soportado.");
  }
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — IMPLEMENTACIÓN WHISPER
// ---------------------------------------------

async function transcribeWithWhisper(audioData: Blob | ArrayBuffer): Promise<string> {
  if (!config?.apiKey) throw new Error("Falta API Key de Whisper");

  const form = new FormData();
  form.append("file", new Blob([audioData]), "audio.webm");
  form.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: form,
  });

  const json = await res.json();
  return json.text || "";
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — IMPLEMENTACIÓN AZURE
// ---------------------------------------------

async function transcribeWithAzure(audioData: Blob | ArrayBuffer): Promise<string> {
  if (!config?.apiKey || !config?.endpoint) {
    throw new Error("Falta configuración de Azure Speech Services");
  }

  const res = await fetch(`${config.endpoint}/speechtotext`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": config.apiKey,
      "Content-Type": "audio/webm",
    },
    body: audioData,
  });

  const json = await res.json();
  return json.text || "";
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — IMPLEMENTACIÓN DEEPGRAM
// ---------------------------------------------

async function transcribeWithDeepgram(audioData: Blob | ArrayBuffer): Promise<string> {
  if (!config?.apiKey) throw new Error("Falta API Key de Deepgram");

  const res = await fetch("https://api.deepgram.com/v1/listen", {
    method: "POST",
    headers: {
      Authorization: `Token ${config.apiKey}`,
      "Content-Type": "audio/webm",
    },
    body: audioData,
  });

  const json = await res.json();
  return json.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — IMPLEMENTACIÓN GOOGLE
// ---------------------------------------------

async function transcribeWithGoogle(audioData: Blob | ArrayBuffer): Promise<string> {
  if (!config?.apiKey) throw new Error("Falta API Key de Google STT");

  const base64Audio = Buffer.from(audioData as ArrayBuffer).toString("base64");

  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audio: { content: base64Audio },
        config: { languageCode: "es-ES" },
      }),
    }
  );

  const json = await res.json();
  return json.results?.[0]?.alternatives?.[0]?.transcript || "";
}

// FINAL DEL BLOQUE 7


// ---------------------------------------------
// BLOQUE 8 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initSpeechToText,
  transcribeAudio,
};

// FINAL DEL BLOQUE 8
// FINAL DEL ARCHIVO
