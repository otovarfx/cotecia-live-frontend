// /components/live/CreatorFloatingButton.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import React from "react";

interface CreatorFloatingButtonProps {
  onOpen: () => void;
}

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL
// ---------------------------------------------

export default function CreatorFloatingButton({ onOpen }: CreatorFloatingButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="
        fixed bottom-6 right-6 z-[95]
        w-14 h-14 rounded-full
        bg-[var(--accent)] text-white
        shadow-xl border border-white/20
        flex items-center justify-center
        hover:scale-105 active:scale-95
        transition-all duration-200
      "
    >
      ⚡
    </button>
  );
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
