// /components/live/PanelPRO.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { useState } from "react";
import DailyMissionsPanel from "./DailyMissionsPanel";
import AchievementsPanel from "./AchievementsPanel";
import SeasonsPanel from "./SeasonsPanel";
import RankingPanel from "./RankingPanel";
import LiveControlsPanel from "./LiveControlsPanel";
import LiveStatsPanel from "./LiveStatsPanel";
import MonetizationPanel from "./pro/MonetizationPanel";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — TIPOS Y PROPS
// ---------------------------------------------

type PanelSection =
  | "missions"
  | "achievements"
  | "seasons"
  | "ranking"
  | "controls"
  | "stats"
  | "monetization";

interface PanelPROProps {
  open: boolean;
  onClose: () => void;
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — COMPONENTE PRINCIPAL PanelPRO
// ---------------------------------------------

export default function PanelPRO({ open, onClose }: PanelPROProps) {
  const [section, setSection] = useState<PanelSection>("missions");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/40">
      {/* Overlay click */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer lateral */}
      <div className="w-full max-w-md h-full bg-[var(--bg)] border-l border-[var(--border)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">
              Panel PRO
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Gestión avanzada del live, progreso y monetización
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>

        {/* Layout interno: sidebar + contenido */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar interna */}
          <div className="w-40 border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col text-sm">
            <SidebarItem
              label="Misiones"
              icon="📌"
              active={section === "missions"}
              onClick={() => setSection("missions")}
            />
            <SidebarItem
              label="Logros"
              icon="🏅"
              active={section === "achievements"}
              onClick={() => setSection("achievements")}
            />
            <SidebarItem
              label="Temporadas"
              icon="🎖️"
              active={section === "seasons"}
              onClick={() => setSection("seasons")}
            />
            <SidebarItem
              label="Ranking"
              icon="🏆"
              active={section === "ranking"}
              onClick={() => setSection("ranking")}
            />
            <SidebarItem
              label="Controles PRO"
              icon="⚙️"
              active={section === "controls"}
              onClick={() => setSection("controls")}
            />
            <SidebarItem
              label="Estadísticas"
              icon="📊"
              active={section === "stats"}
              onClick={() => setSection("stats")}
            />
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              <SidebarItem
                label="Monetización"
                icon="💰"
                active={section === "monetization"}
                onClick={() => setSection("monetization")}
              />
            </div>
          </div>

          {/* Contenido dinámico */}
          <div className="flex-1 overflow-y-auto p-4">
            {section === "missions" && <DailyMissionsPanel />}
            {section === "achievements" && <AchievementsPanel />}
            {section === "seasons" && <SeasonsPanel />}
            {section === "ranking" && <RankingPanel />}
            {section === "controls" && <LiveControlsPanel />}
            {section === "stats" && <LiveStatsPanel />}
            {section === "monetization" && <MonetizationPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — COMPONENTE SidebarItem
// ---------------------------------------------

function SidebarItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-left w-full transition ${
        active
          ? "bg-[var(--accent)]/15 text-[var(--accent)] border-l-2 border-[var(--accent)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg)]"
      }`}
    >
      <span>{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

// FINAL DEL BLOQUE 4
// FINAL DEL ARCHIVO
