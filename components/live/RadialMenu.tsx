// /components/live/RadialMenu.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import React from "react";

interface RadialMenuProps {
  open: boolean;
  onSelect: (section: string) => void;
  onClose: () => void;
}

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL
// ---------------------------------------------

export default function RadialMenu({ open, onSelect, onClose }: RadialMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/40">
      <div className="relative w-64 h-64">
        {/* Botón central */}
        <button
          onClick={onClose}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-16 h-16 rounded-full bg-[var(--accent)] text-white shadow-xl"
        >
          ✕
        </button>

        {/* Opciones radiales */}
        {[
          { label: "Misiones", icon: "📌", section: "missions", angle: 270 },
          { label: "Logros", icon: "🏅", section: "achievements", angle: 330 },
          { label: "Temporadas", icon: "🎖️", section: "seasons", angle: 30 },
          { label: "Monetización", icon: "💰", section: "monetization", angle: 90 },
          { label: "Controles", icon: "⚙️", section: "controls", angle: 150 },
          { label: "Stats", icon: "📊", section: "stats", angle: 210 },
        ].map((item, i) => {
          const radius = 90;
          const x = radius * Math.cos((item.angle * Math.PI) / 180);
          const y = radius * Math.sin((item.angle * Math.PI) / 180);

          return (
            <button
              key={i}
              onClick={() => onSelect(item.section)}
              className="absolute w-14 h-14 rounded-full bg-[var(--bg)] border border-[var(--border)]
                         text-[var(--text)] shadow-lg hover:bg-[var(--accent)] hover:text-white transition"
              style={{
                left: `calc(50% + ${x}px - 28px)`,
                top: `calc(50% + ${y}px - 28px)`,
              }}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
