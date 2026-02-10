// /app/api/stripe/balance/route.ts

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

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // IMPORTS DINÁMICOS — necesarios para Vercel
    const { stripe } = await import("@/src/lib/stripe");
    const { db } = await import("@/src/lib/db");

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { stripeAccountId: true },
    });

    if (!dbUser?.stripeAccountId) {
      return NextResponse.json(
        { error: "No tienes cuenta Stripe Connect" },
        { status: 400 }
      );
    }

    const balance = await stripe.balance.retrieve({
      stripeAccount: dbUser.stripeAccountId,
    });

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Stripe Balance error:", error);
    return NextResponse.json(
      { error: "Error obteniendo balance" },
      { status: 500 }
    );
  }
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
