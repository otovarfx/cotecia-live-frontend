// /app/api/cron/auto-payout/route.ts
// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — HANDLER PRINCIPAL (CRON)
// ---------------------------------------------

export async function GET() {
  try {
    // 1. Buscar todos los usuarios con auto-payout activado
    const users = await db.user.findMany({
      where: { autoPayoutEnabled: true },
      select: { id: true, stripeAccountId: true },
    });

    const minAmount = Number(process.env.STRIPE_PAYOUT_MIN_AMOUNT ?? 1000); // 10 USD

    const results: any[] = [];

    for (const user of users) {
      if (!user.stripeAccountId) continue;

      // 2. Obtener balance real
      const balance = await stripe.balance.retrieve({
        stripeAccount: user.stripeAccountId,
      });

      const available = balance.available?.[0]?.amount ?? 0;
      const currency = balance.available?.[0]?.currency ?? "usd";

      if (available < minAmount) {
        results.push({
          userId: user.id,
          status: "SKIPPED",
          reason: "Balance insuficiente",
        });
        continue;
      }

      // 3. Ejecutar payout
      const payout = await stripe.payouts.create(
        {
          amount: available,
          currency,
        },
        {
          stripeAccount: user.stripeAccountId,
        }
      );

      // 4. Guardar registro
      await db.payout.create({
        data: {
          userId: user.id,
          stripePayoutId: payout.id,
          amount: available,
          currency,
          status: payout.status,
        },
      });

      results.push({
        userId: user.id,
        status: "PAID",
        amount: available,
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("CRON AUTO-PAYOUT ERROR:", error);
    return NextResponse.json(
      { error: "Error ejecutando cron de auto-payout" },
      { status: 500 }
    );
  }
}

// FINAL DEL BLOQUE 2
// FINAL DEL ARCHIVO
