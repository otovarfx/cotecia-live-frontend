// /components/live/pro/MonetizationPanel.tsx
"use client";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS Y TIPOS
// ---------------------------------------------

import { useState } from "react";
import RevenueDashboard from "./RevenueDashboard"; // ⭐ Revenue Dashboard PRO

type MonetizationTab =
  | "overview"
  | "gifts"
  | "subscriptions"
  | "courses"
  | "community"
  | "tips"
  | "affiliates"
  | "packs"
  | "realtime"
  | "payouts"; // ⭐ NUEVO TAB PAYOUTS PRO

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — COMPONENTE PRINCIPAL MonetizationPanel
// ---------------------------------------------

export default function MonetizationPanel() {
  const [tab, setTab] = useState<MonetizationTab>("overview");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text)]">
        💰 Monetización Premium
      </h2>
      <p className="text-xs text-[var(--text-secondary)]">
        Gestiona todas tus fuentes de ingresos desde un solo lugar.
      </p>

      {/* Tabs internas */}
      <div className="flex flex-wrap gap-2 text-xs">
        <MonoTab label="Resumen" tab="overview" current={tab} setTab={setTab} />
        <MonoTab label="Gifts PRO" tab="gifts" current={tab} setTab={setTab} />
        <MonoTab label="Suscripciones" tab="subscriptions" current={tab} setTab={setTab} />
        <MonoTab label="Cursos / Mentorías" tab="courses" current={tab} setTab={setTab} />
        <MonoTab label="Comunidad Premium" tab="community" current={tab} setTab={setTab} />
        <MonoTab label="Tips directos" tab="tips" current={tab} setTab={setTab} />
        <MonoTab label="Afiliados" tab="affiliates" current={tab} setTab={setTab} />
        <MonoTab label="Packs digitales" tab="packs" current={tab} setTab={setTab} />
        <MonoTab label="Ingresos en tiempo real" tab="realtime" current={tab} setTab={setTab} />

        {/* ⭐ NUEVO TAB PAYOUTS */}
        <MonoTab label="Retiros (Payouts)" tab="payouts" current={tab} setTab={setTab} />
      </div>

      {/* Contenido dinámico por tab */}
      <div className="mt-2">
        {tab === "overview" && <MonetizationOverview />}
        {tab === "gifts" && <GiftsMonetization />}
        {tab === "subscriptions" && <SubscriptionsMonetization />}
        {tab === "courses" && <CoursesMonetization />}
        {tab === "community" && <CommunityMonetization />}
        {tab === "tips" && <TipsMonetization />}
        {tab === "affiliates" && <AffiliatesMonetization />}
        {tab === "packs" && <PacksMonetization />}
        {tab === "realtime" && <RealtimeRevenueMonetization />}

        {/* ⭐ NUEVO CONTENIDO PAYOUTS */}
        {tab === "payouts" && <PayoutsMonetization />}
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — COMPONENTE MonoTab
// ---------------------------------------------

function MonoTab({
  label,
  tab,
  current,
  setTab,
}: {
  label: string;
  tab: MonetizationTab;
  current: MonetizationTab;
  setTab: (t: MonetizationTab) => void;
}) {
  const active = current === tab;
  return (
    <button
      onClick={() => setTab(tab)}
      className={`px-3 py-1 rounded-full border text-xs transition ${
        active
          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
          : "bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-secondary)]"
      }`}
    >
      {label}
    </button>
  );
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — TAB: RESUMEN GENERAL
// ---------------------------------------------

function MonetizationOverview() {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Ingresos hoy" value="$0.00" />
        <StatCard label="Ingresos este mes" value="$0.00" />
        <StatCard label="Suscriptores activos" value="0" />
        <StatCard label="Cursos vendidos" value="0" />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        Aquí verás tus ingresos en tiempo real cuando conectes tu pasarela de pago (Stripe, PayPal, etc.).
      </p>
    </div>
  );
}

// FINAL DEL BLOQUE 4



// ---------------------------------------------
// BLOQUE 5 — TAB: GIFTS PRO
// ---------------------------------------------

function GiftsMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Gifts PRO</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Los gifts que recibes durante el live se convierten en ingresos. Aquí podrás ver:
      </p>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
        <li>Top donadores</li>
        <li>Historial de gifts</li>
        <li>Ingresos estimados por gift</li>
      </ul>
      <div className="mt-2 p-3 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)]">
        Integración con pasarela de pago pendiente.  
        Cuando conectes Stripe/PayPal, aquí verás el valor real de cada gift.
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 5



// ---------------------------------------------
// BLOQUE 6 — TAB: SUSCRIPCIONES
// ---------------------------------------------

function SubscriptionsMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Suscripciones Premium</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Crea niveles de suscripción con beneficios exclusivos:
      </p>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
        <li>Badges especiales en el chat</li>
        <li>XP boost para suscriptores</li>
        <li>Acceso a contenido exclusivo</li>
        <li>Acceso a comunidad privada</li>
      </ul>
      <button className="mt-2 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold">
        Configurar niveles de suscripción
      </button>
    </div>
  );
}

// FINAL DEL BLOQUE 6



// ---------------------------------------------
// BLOQUE 7 — TAB: CURSOS / MENTORÍAS
// ---------------------------------------------

function CoursesMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Cursos y Mentorías</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Vende cursos, clases en vivo y mentorías 1:1 directamente desde COTECIA LIVE.
      </p>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
        <li>Listado de cursos</li>
        <li>Alumnos activos</li>
        <li>Ingresos por curso</li>
      </ul>
      <button className="mt-2 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold">
        Crear nuevo curso
      </button>
    </div>
  );
}

// FINAL DEL BLOQUE 7



// ---------------------------------------------
// BLOQUE 8 — TAB: COMUNIDAD PREMIUM
// ---------------------------------------------

function CommunityMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Comunidad Premium</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Crea una comunidad cerrada con acceso exclusivo para miembros de pago.
      </p>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
        <li>Chat privado</li>
        <li>Eventos exclusivos</li>
        <li>Misiones y logros solo para miembros</li>
      </ul>
      <button className="mt-2 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold">
        Configurar comunidad premium
      </button>
    </div>
  );
}

// FINAL DEL BLOQUE 8



// ---------------------------------------------
// BLOQUE 9 — TAB: TIPS DIRECTOS
// ---------------------------------------------

function TipsMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Tips directos</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Activa un botón de propina directa para que tus viewers te apoyen sin intermediarios.
      </p>
      <div className="mt-2 p-3 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)]">
        Aquí podrás conectar tu cuenta de Stripe/PayPal y generar un enlace de tip directo.
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 9



// ---------------------------------------------
// BLOQUE 10 — TAB: AFILIADOS
// ---------------------------------------------

function AffiliatesMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Afiliados</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Gestiona tus enlaces de afiliado y mide su rendimiento.
      </p>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
        <li>Enlaces activos</li>
        <li>Clicks</li>
        <li>Conversiones estimadas</li>
      </ul>
      <button className="mt-2 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold">
        Agregar enlace de afiliado
      </button>
    </div>
  );
}

// FINAL DEL BLOQUE 10



// ---------------------------------------------
// BLOQUE 11 — TAB: PACKS DIGITALES
// ---------------------------------------------

function PacksMonetization() {
  return (
    <div className="space-y-3 text-sm">
      <h3 className="font-semibold text-[var(--text)]">Packs digitales</h3>
      <p className="text-xs text-[var(--text-secondary)]">
        Vende packs de stickers, animaciones VIP, overlays y recursos digitales.
      </p>
      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
        <li>Packs activos</li>
        <li>Descargas</li>
        <li>Ingresos por pack</li>
      </ul>
      <button className="mt-2 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold">
        Crear nuevo pack digital
      </button>
    </div>
  );
}

// FINAL DEL BLOQUE 11



// ---------------------------------------------
// BLOQUE 12 — COMPONENTE StatCard
// ---------------------------------------------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
      <div className="text-[var(--text-secondary)] text-xs mb-1">
        {label}
      </div>
      <div className="text-[var(--text)] font-semibold text-sm">
        {value}
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 12



// ---------------------------------------------
// BLOQUE 13 — TAB: INGRESOS EN TIEMPO REAL (Revenue Dashboard PRO)
// ---------------------------------------------

function RealtimeRevenueMonetization() {
  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-[var(--text)]">
        💸 Ingresos en Tiempo Real
      </h3>

      <p className="text-xs text-[var(--text-secondary)]">
        Observa tus ingresos minuto a minuto mientras transmites en COTECIA LIVE.
      </p>

      <RevenueDashboard />
    </div>
  );
}

// FINAL DEL BLOQUE 13



// ---------------------------------------------
// BLOQUE 14 — TAB: PAYOUTS PRO (Sistema de Retiros + Auto-Withdraw)
// ---------------------------------------------

function PayoutsMonetization() {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<any>(null);
  const [autoPayout, setAutoPayout] = useState<boolean>(false);

  // Cargar balance real y estado de auto-payout
  useEffect(() => {
    fetch("/api/stripe/balance")
      .then((res) => res.json())
      .then((data) => setBalance(data.balance))
      .catch(() => {});

    fetch("/api/user/payout-settings")
      .then((res) => res.json())
      .then((data) => setAutoPayout(data.autoPayoutEnabled))
      .catch(() => {});
  }, []);

  const handleConnectStripe = async () => {
    try {
      setLoading(true);
      await fetch("/api/stripe/connect", { method: "POST" });
      const res = await fetch("/api/stripe/connect-link", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Error al conectar con Stripe");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoPayout = async () => {
    try {
      const res = await fetch("/api/user/payout-settings", {
        method: "POST",
        body: JSON.stringify({ autoPayoutEnabled: !autoPayout }),
      });
      if (res.ok) setAutoPayout((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualAutoPayoutNow = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/auto-payout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error en auto-payout");
      } else {
        alert("Auto-payout ejecutado");
      }
    } catch (e) {
      console.error(e);
      alert("Error ejecutando auto-payout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-[var(--text)]">
        🏦 Retiros (Payouts PRO)
      </h3>

      {/* Conectar Stripe */}
      <button
        onClick={handleConnectStripe}
        disabled={loading}
        className="w-full px-3 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold disabled:opacity-60"
      >
        {loading ? "Conectando..." : "Conectar con Stripe"}
      </button>

      {/* Auto-payout toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
        <div>
          <div className="text-xs font-semibold text-[var(--text)]">
            Auto-withdraw PRO
          </div>
          <div className="text-[var(--text-secondary)] text-[11px]">
            Envía automáticamente tu balance disponible cuando supere el mínimo configurado.
          </div>
        </div>
        <button
          onClick={handleToggleAutoPayout}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            autoPayout
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
          }`}
        >
          {autoPayout ? "Activado" : "Desactivado"}
        </button>
      </div>

      {/* Ejecutar ahora (manual trigger del auto-payout) */}
      <button
        onClick={handleManualAutoPayoutNow}
        disabled={loading}
        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs hover:bg-[var(--bg-secondary)] disabled:opacity-60"
      >
        Ejecutar auto-withdraw ahora
      </button>

      {/* Balance */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Balance disponible"
          value={
            balance?.available?.[0]?.amount
              ? `$${(balance.available[0].amount / 100).toFixed(2)}`
              : "$0.00"
          }
        />
        <StatCard
          label="Pendiente"
          value={
            balance?.pending?.[0]?.amount
              ? `$${(balance.pending[0].amount / 100).toFixed(2)}`
              : "$0.00"
          }
        />
      </div>
    </div>
  );
}

// FINAL DEL BLOQUE 14
