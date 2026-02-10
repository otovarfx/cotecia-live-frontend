"use client";

// PanelPro.tsx
// UI institucional del Panel PRO de COTECIA Híbrida
// Controla moderación, modos del chat, viewers y acciones del host.

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { useState } from "react";

import {
  toggleChatMute,
  toggleSlowMode,
  toggleFollowersOnly,
  banUser,
} from "@/lib/livePanel";

// FINAL DEL BLOQUE 1


// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL
// ---------------------------------------------

export default function PanelPro() {
  const [open, setOpen] = useState(false);
  const [banInput, setBanInput] = useState("");

  return (
    <>
      {/* BOTÓN FLOTANTE PARA ABRIR PANEL */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-[var(--accent)] text-white rounded-lg shadow-lg hover:scale-105 transition-all"
      >
        Panel PRO
      </button>

      {/* OVERLAY OSCURO */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* PANEL LATERAL */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[var(--bg-secondary)] shadow-2xl z-50 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold text-white mb-2">Panel PRO</h2>

        {/* MUTE CHAT */}
        <button
          onClick={() => toggleChatMute()}
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          🔇 Mute Chat
        </button>

        {/* SLOW MODE */}
        <button
          onClick={() => toggleSlowMode()}
          className="w-full py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all"
        >
          🐢 Slow Mode
        </button>

        {/* FOLLOWERS ONLY */}
        <button
          onClick={() => toggleFollowersOnly()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          ⭐ Followers Only
        </button>

        {/* BAN USER */}
        <div className="flex flex-col gap-2">
          <input
            value={banInput}
            onChange={(e) => setBanInput(e.target.value)}
            placeholder="Usuario a banear"
            className="w-full px-3 py-2 rounded-lg bg-black/30 text-white border border-white/20"
          />

          <button
            onClick={() => {
              if (banInput.trim().length > 0) {
                banUser(banInput.trim());
                setBanInput("");
              }
            }}
            className="w-full py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all"
          >
            ⛔ Banear Usuario
          </button>
        </div>

        {/* CERRAR PANEL */}
        <button
          onClick={() => setOpen(false)}
          className="mt-auto w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          Cerrar Panel
        </button>
      </div>
    </>
  );
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
