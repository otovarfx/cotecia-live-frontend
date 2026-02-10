// aiModeration.ts
// Moderación automática con IA — COTECIA Híbrida
// Analiza mensajes y decide si deben bloquearse.

// ---------------------------------------------
// BLOQUE 1 — TIPOS
// ---------------------------------------------

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — MODELO DE IA (SIMULADO / API REAL)
// ---------------------------------------------

export async function moderateMessage(text: string): Promise<ModerationResult> {
  // Aquí puedes conectar OpenAI, Azure AI, o tu propio modelo.
  // Por ahora, lógica simulada institucional:

  const lower = text.toLowerCase();

  const bannedWords = [
    "puta",
    "mierda",
    "estúpido",
    "idiota",
    "fuck",
    "bitch",
    "kill",
    "suicide",
    "sexo",
    "porn",
  ];

  if (bannedWords.some((w) => lower.includes(w))) {
    return {
      allowed: false,
      reason: "Lenguaje inapropiado detectado por IA",
    };
  }

  // Anti-spam básico
  if (text.length > 300) {
    return {
      allowed: false,
      reason: "Mensaje demasiado largo (posible spam)",
    };
  }

  return { allowed: true };
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  moderateMessage,
};

// FINAL DEL BLOQUE 3
// FINAL DEL ARCHIVO
