// /components/live/HostHeader.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import React from "react";

interface HostHeaderProps {
  onOpenPanel: () => void;
}

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL
// ---------------------------------------------

export default function HostHeader({ onOpenPanel }: HostHeaderProps) {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-[var(--bg-secondary)] border-b border-[var(--border)]">
      <h1 className="text-lg font-bold text-[var(--text)]">
        🎥 COTECIA LIVE — Host
      </h1>

      <button
        onClick={onOpenPanel}
        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition"
      >
        💼 Panel PRO
      </button>
    </header>
  );
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
