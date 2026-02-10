// /app/live/page.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { useEffect, useState } from "react";
import HostHeader from "@/components/live/HostHeader";
import PanelPRO from "@/components/live/PanelPRO";

// Aquí importas tu UI del live (video, chat, etc.)
import LiveUI from "@/components/live/LiveUI";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL DEL LIVE
// ---------------------------------------------

export default function LivePage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Hotkey: P para abrir/cerrar Panel PRO
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") {
        setIsPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header con botón */}
      <HostHeader onOpenPanel={() => setIsPanelOpen(true)} />

      {/* Contenido del live */}
      <div className="flex-1">
        <LiveUI />
      </div>

      {/* Panel PRO Lateral */}
      <PanelPRO open={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
