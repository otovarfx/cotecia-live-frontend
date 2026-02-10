// translation.ts
// Módulo institucional de COTECIA Híbrida
// Traducción simultánea (Texto → Texto)

// ---------------------------------------------
// BLOQUE 1 — CONFIGURACIÓN DEL MOTOR DE TRADUCCIÓN
// ---------------------------------------------

export type TranslationProvider = "azure" | "google" | "openai";

interface TranslationConfig {
  provider: TranslationProvider;
  apiKey: string;
  endpoint?: string;
}

let config: TranslationConfig | null = null;

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIALIZACIÓN DEL MÓDULO
// ---------------------------------------------

export function initTranslation(cfg: TranslationConfig) {
  config = cfg;
  console.log("🌐 Traducción inicializada con proveedor:", cfg.provider);
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — FUNCIÓN PRINCIPAL DE TRADUCCIÓN
// ---------------------------------------------

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "auto"
): Promise<string> {
  if (!config) {
    throw new Error("Translation no inicializado. Llama a initTranslation() primero.");
  }

  switch (config.provider) {
    case "azure":
      return await translateWithAzure(text, targetLang, sourceLang);

    case "google":
      return await translateWithGoogle(text, targetLang, sourceLang);

    case "openai":
      return await translateWithOpenAI(text, targetLang, sourceLang);

    default:
      throw new Error("Proveedor de traducción no soportado.");
  }
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — IMPLEMENTACIÓN AZURE TRANSLATOR
// ---------------------------------------------

async function translateWithAzure(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  if (!config?.apiKey || !config?.endpoint) {
    throw new Error("Falta configuración de Azure Translator");
  }

  const res = await fetch(`${config.endpoint}/translate?api-version=3.0&to=${targetLang}`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": config.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ text }]),
  });

  const json = await res.json();
  return json[0]?.translations?.[0]?.text || "";
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — IMPLEMENTACIÓN GOOGLE TRANSLATE API
// ---------------------------------------------

async function translateWithGoogle(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  if (!config?.apiKey) throw new Error("Falta API Key de Google Translate");

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: sourceLang === "auto" ? undefined : sourceLang,
        format: "text",
      }),
    }
  );

  const json = await res.json();
  return json.data?.translations?.[0]?.translatedText || "";
}

// FINAL DEL BLOQUE 5


// ---------------------------------------------
// BLOQUE 6 — IMPLEMENTACIÓN OPENAI GPT-4o / GPT-5
// ---------------------------------------------

async function translateWithOpenAI(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  if (!config?.apiKey) throw new Error("Falta API Key de OpenAI");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Traduce el texto al idioma objetivo: ${targetLang}.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || "";
}

// FINAL DEL BLOQUE 6


// ---------------------------------------------
// BLOQUE 7 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  initTranslation,
  translateText,
};

// FINAL DEL BLOQUE 7
// FINAL DEL ARCHIVO
