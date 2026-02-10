// /app/live/page.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { useEffect, useState } from "react";
import HostHeader from "@/components/live/HostHeader";
import PanelPRO from "@/components/live/PanelPRO";
import CreatorFloatingButton from "@/components/live/CreatorFloatingButton";
import RadialMenu from "@/components/live/RadialMenu";
import LiveUI from "@/components/live/LiveUI";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL DEL LIVE
// ---------------------------------------------

export default function LivePage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRadialOpen, setIsRadialOpen] = useState(false);

  // Hotkeys avanzadas
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "p") setIsPanelOpen((prev) => !prev);
      if (e.shiftKey && key === "p") setIsRadialOpen((prev) => !prev);
      if (e.ctrlKey && key === "p") {
        setIsPanelOpen(true);
        window.dispatchEvent(new CustomEvent("open-monetization"));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Evento global para abrir monetización
  useEffect(() => {
    const handler = () => {
      const el = document.getElementById("panelpro-monetization");
      el?.click();
    };
    window.addEventListener("open-monetization", handler);
    return () => window.removeEventListener("open-monetization", handler);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <HostHeader onOpenPanel={() => setIsPanelOpen(true)} />

      {/* Contenido del live */}
      <div className="flex-1">
        <LiveUI />
      </div>

      {/* Botón flotante PRO */}
      <CreatorFloatingButton onOpen={() => setIsPanelOpen(true)} />

      {/* Menú radial */}
      <RadialMenu
        open={isRadialOpen}
        onClose={() => setIsRadialOpen(false)}
        onSelect={(section) => {
          setIsRadialOpen(false);
          setIsPanelOpen(true);
          window.dispatchEvent(
            new CustomEvent("panelpro-open-section", { detail: section })
          );
        }}
      />

      {/* Panel PRO con animación PRO */}
      <div
        className={`
          transition-all duration-300 
          ${isPanelOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <PanelPRO open={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
