// /app/api/cron/auto-payout/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { stripe } = await import("@/lib/stripe");
    const { db } = await import("@/lib/db");

    const users = await db.user.findMany({
      where: { autoPayoutEnabled: true },
      select: { id: true, stripeAccountId: true },
    });

    const minAmount = Number(process.env.STRIPE_PAYOUT_MIN_AMOUNT ?? 1000);

    const results: any[] = [];

    for (const user of users) {
      if (!user.stripeAccountId) continue;

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

      const payout = await stripe.payouts.create(
        {
          amount: available,
          currency,
        },
        {
          stripeAccount: user.stripeAccountId,
        }
      );

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
