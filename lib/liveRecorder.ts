// liveRecorder.ts
// Grabación institucional de COTECIA Híbrida
// Graba video + audio + subtítulos en un solo archivo .webm

// ---------------------------------------------
// BLOQUE 1 — ESTADO INTERNO
// ---------------------------------------------

let recorder: MediaRecorder | null = null;
let chunks: BlobPart[] = [];
let subtitleTrack: string[] = [];

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — INICIAR GRABACIÓN
// ---------------------------------------------

export function startRecording(stream: MediaStream) {
  if (recorder) return;

  chunks = [];
  subtitleTrack = [];

  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9,opus",
  });

  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.start(200);

  console.log("🎥 Grabación iniciada");
}

// FINAL DEL BLOQUE 2


// ---------------------------------------------
// BLOQUE 3 — DETENER GRABACIÓN
// ---------------------------------------------

export function stopRecording(): Promise<Blob> {
  return new Promise((resolve) => {
    if (!recorder) return resolve(new Blob());

    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });

      const subtitleBlob = new Blob([subtitleTrack.join("\n")], {
        type: "text/plain",
      });

      const finalBlob = new Blob([videoBlob, subtitleBlob], {
        type: "application/octet-stream",
      });

      recorder = null;
      chunks = [];

      resolve(finalBlob);
    };

    recorder.stop();
    console.log("🛑 Grabación detenida");
  });
}

// FINAL DEL BLOQUE 3


// ---------------------------------------------
// BLOQUE 4 — AGREGAR SUBTÍTULO
// ---------------------------------------------

export function addSubtitle(text: string) {
  const timestamp = new Date().toISOString();
  subtitleTrack.push(`[${timestamp}] ${text}`);
}

// FINAL DEL BLOQUE 4


// ---------------------------------------------
// BLOQUE 5 — EXPORTACIÓN PRINCIPAL
// ---------------------------------------------

export default {
  startRecording,
  stopRecording,
  addSubtitle,
};

// FINAL DEL BLOQUE 5
// FINAL DEL ARCHIVO
