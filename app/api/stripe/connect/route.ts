// /app/api/stripe/connect/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — HANDLER PRINCIPAL
// ---------------------------------------------

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // IMPORTS DINÁMICOS — necesarios para Vercel
    const { stripe } = await import("@/lib/stripe");
    const { db } = await import("@/lib/db");

    // 1. Buscar si ya tiene cuenta Stripe
    const existing = await db.user.findUnique({
      where: { id: user.id },
      select: { stripeAccountId: true },
    });

    let accountId = existing?.stripeAccountId;

    // 2. Si no existe → crear cuenta Stripe Connect
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email ?? undefined,
      });

      accountId = account.id;

      // 3. Guardar en DB
      await db.user.update({
        where: { id: user.id },
        data: { stripeAccountId: accountId },
      });
    }

    return NextResponse.json({ accountId });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      { error: "Error creando cuenta Stripe" },
      { status: 500 }
    );
  }
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
