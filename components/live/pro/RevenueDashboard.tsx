// /components/live/pro/RevenueDashboard.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { useEffect, useState } from "react";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — TIPOS
// ---------------------------------------------

interface RevenueEvent {
  id: string;
  type: "gift" | "tip" | "subscription" | "course" | "pack" | "affiliate";
  amount: number;
  user: string;
  timestamp: number;
}

interface RevenueTotals {
  today: number;
  week: number;
  month: number;
  allTime: number;
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — COMPONENTE PRINCIPAL
// ---------------------------------------------

export default function RevenueDashboard() {
  const [events, setEvents] = useState<RevenueEvent[]>([]);
  const [totals, setTotals] = useState<RevenueTotals>({
    today: 0,
    week: 0,
    month: 0,
    allTime: 0,
  });

  // Simulación de ingresos en tiempo real (reemplazar con WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      const fakeEvent: RevenueEvent = {
        id: crypto.randomUUID(),
        type: ["gift", "tip", "subscription"][Math.floor(Math.random() * 3)] as any,
        amount: Math.floor(Math.random() * 20) + 1,
        user: ["Ana", "Luis", "Carlos", "María"][Math.floor(Math.random() * 4)],
        timestamp: Date.now(),
      };

      setEvents((prev) => [fakeEvent, ...prev].slice(0, 50));
      setTotals((prev) => ({
        today: prev.today + fakeEvent.amount,
        week: prev.week + fakeEvent.amount,
        month: prev.month + fakeEvent.amount,
        allTime: prev.allTime + fakeEvent.amount,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[var(--text)]">
        💸 Ingresos en Tiempo Real
      </h2>

      <RevenueTotalsPanel totals={totals} />
      <RevenueLiveFeed events={events} />
    </div>
  );
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — PANEL DE TOTALES
// ---------------------------------------------

function RevenueTotalsPanel({ totals }: { totals: RevenueTotals }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <RevenueCard label="Hoy" value={`$${totals.today.toFixed(2)}`} />
      <RevenueCard label="Esta semana" value={`$${totals.week.toFixed(2)}`} />
      <RevenueCard label="Este mes" value={`$${totals.month.toFixed(2)}`} />
      <RevenueCard label="Total histórico" value={`$${totals.allTime.toFixed(2)}`} />
    </div>
  );
}

// FINAL DEL BLOQUE 4



// ---------------------------------------------
// BLOQUE 5 — CARD DE MÉTRICAS
// ---------------------------------------------

function RevenueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow">
      <div className="text-xs text-[var(--text-secondary)]">{label}</div>
      <div className="text-lg font-bold text-[var(--text)]">{value}</div>
    </div>
  );
}

// FINAL DEL BLOQUE 5



// ---------------------------------------------
// BLOQUE 6 — FEED EN TIEMPO REAL
// ---------------------------------------------

function RevenueLiveFeed({ events }: { events: RevenueEvent[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--text)]">
        Actividad en tiempo real
      </h3>

      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {events.map((e) => (
          <div
            key={e.id}
            className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs flex justify-between"
          >
            <span className="font-medium text-[var(--text)]">
              {iconForType(e.type)} {e.user}
            </span>
            <span className="text-[var(--accent)] font-bold">
              +${e.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 6



// ---------------------------------------------
// BLOQUE 7 — ICONOS POR TIPO DE INGRESO
// ---------------------------------------------

function iconForType(type: RevenueEvent["type"]) {
  switch (type) {
    case "gift":
      return "🎁";
    case "tip":
      return "💵";
    case "subscription":
      return "⭐";
    case "course":
      return "🎓";
    case "pack":
      return "📦";
    case "affiliate":
      return "🔗";
    default:
      return "💰";
  }
}

// FINAL DEL BLOQUE 7
// FINAL DEL ARCHIVO
