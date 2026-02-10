// /app/api/stripe/balance/route.ts
// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

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
