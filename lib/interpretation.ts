// interpretation.ts
// Módulo institucional de COTECIA Híbrida
// Interpretación bidireccional (voz ↔ voz)
// Combina STT + Traducción + TTS para crear interpretación en tiempo real.

// ---------------------------------------------
// BLOQUE 1 — IMPORTS DE MÓDULOS INTERNOS
// ---------------------------------------------

import { transcribeAudio } from "./speechToText";
import { translateText } from "./translation";
import { generateDubbingAudio } from "./dubbing";

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — CONFIGURACIÓN DEL MÓDULO
// ---------------------------------------------

export interface InterpretationConfig {
  sourceLang: string; // idioma original del host
  targetLang: string; // idioma destino del viewer
  voice?: string;     // voz del doblaje
}

let config: InterpretationConfig | null = null;

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initInterpretation(cfg: InterpretationConfig) {
  config = cfg;
  console.log("🗣️ Interpretación inicializada:", cfg);
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — INTERPRETACIÓN UNIDIRECCIONAL
// ---------------------------------------------

export async function interpretAudio(
  audioData: Blob | ArrayBuffer
): Promise<{ text: string; translated: string; audio: Blob }> {
  if (!config) {
    throw new Error("Interpretation no inicializado. Llama a initInterpretation() primero.");
  }

  // 1️⃣ Voz → Texto
  const text = await transcribeAudio(audioData);

  // 2️⃣ Texto → Traducción
  const translated = await translateText(text, config.targetLang, config.sourceLang);

  // 3️⃣ Texto traducido → Voz
  const audio = await generateDubbingAudio(translated, config.targetLang, config.voice);

  return { text, translated, audio };
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — INTERPRETACIÓN BIDIRECCIONAL
// ---------------------------------------------

export async function interpretBidirectional(
  audioData: Blob | ArrayBuffer,
  from: "host" | "viewer"
): Promise<{
  originalText: string;
  translatedText: string;
  audio: Blob;
  direction: string;
}> {
  if (!config) {
    throw new Error("Interpretation no inicializado.");
  }

  // Determinar dirección
  const direction =
    from === "host"
      ? `${config.sourceLang} → ${config.targetLang}`
      : `${config.targetLang} → ${config.sourceLang}`;

  // 1️⃣ Voz → Texto
  const originalText = await transcribeAudio(audioData);

  // 2️⃣ Texto → Traducción
  const translatedText =
    from === "host"
      ? await translateText(originalText, config.targetLang, config.sourceLang)
      : await translateText(originalText, config.sourceLang, config.targetLang);

  // 3️⃣ Texto traducido → Voz
  const audio = await generateDubbingAudio(
    translatedText,
    from === "host" ? config.targetLang : config.sourceLang,
    config.voice
  );

  return { originalText, translatedText, audio, direction };
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initInterpretation,
  interpretAudio,
  interpretBidirectional,
};

// FINAL DEL BLOQUE 6
// FINAL DEL ARCHIVO
