// /app/api/stripe/webhook/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — RAW BODY READER (Stripe lo exige)
// ---------------------------------------------

async function readRawBody(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — HANDLER PRINCIPAL DEL WEBHOOK
// ---------------------------------------------

export async function POST(req: Request) {
  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers.get("stripe-signature");

    // IMPORTS DINÁMICOS — necesarios para Vercel
    const { stripe } = await import("@/lib/stripe");
    const { db } = await import("@/lib/db");

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("❌ Error verificando webhook:", err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // ---------------------------------------------
    // BLOQUE 4 — MANEJO DE EVENTOS
    // ---------------------------------------------

    switch (event.type) {
      // ---------------------------------------------
      // 🔥 PAYMENT INTENT SUCCEEDED — SPLIT REVENUE PRO + SPLIT POR TIPO
      // ---------------------------------------------
      case "payment_intent.succeeded": {
        const pi = event.data.object;

        const hostId = pi.metadata?.hostId;
        const type = pi.metadata?.type || "unknown";

        if (!hostId) break;

        const amount = pi.amount;
        const currency = pi.currency;

        // 1. Obtener cuenta Stripe del host
        const host = await db.user.findUnique({
          where: { id: hostId },
          select: { stripeAccountId: true },
        });

        if (!host?.stripeAccountId) {
          console.error("Host sin cuenta Stripe:", hostId);
          break;
        }

        // 2. Obtener split por tipo
        const typeSplits = await db.revenueSplitByType.findMany({
          where: { hostId, type },
        });

        // 3. Si no hay split por tipo → usar split general
        const generalSplits = await db.revenueSplit.findMany({
          where: { hostId },
        });

        const splits = typeSplits.length > 0 ? typeSplits : generalSplits;

        // 4. Calcular porcentaje del host
        const totalSplitPercent = splits.reduce((acc, s) => acc + s.percent, 0);
        const hostPercent = 100 - totalSplitPercent;

        // 5. Transferencia al host
        await stripe.transfers.create({
          amount: Math.round((amount * hostPercent) / 100),
          currency,
          destination: host.stripeAccountId,
        });

        // 6. Transferencias a co-hosts y managers
        for (const s of splits) {
          const user = await db.user.findUnique({
            where: { id: s.userId },
            select: { stripeAccountId: true },
          });

          if (!user?.stripeAccountId) continue;

          await stripe.transfers.create({
            amount: Math.round((amount * s.percent) / 100),
            currency,
            destination: user.stripeAccountId,
          });
        }

        // 7. Registrar auditoría PRO
        await db.payment.create({
          data: {
            stripePaymentIntentId: pi.id,
            amount,
            currency,
            status: "succeeded",
            userId: hostId,
            type,
            splitApplied: true,
            splitType: typeSplits.length > 0 ? "type" : "general",
          },
        });

        break;
      }

      // ---------------------------------------------
      // 🔥 PAYOUTS
      // ---------------------------------------------
      case "payout.paid": {
        const payout = event.data.object;

        await db.payout.updateMany({
          where: { stripePayoutId: payout.id },
          data: { status: "paid" },
        });

        break;
      }

      case "payout.failed": {
        const payout = event.data.object;

        await db.payout.updateMany({
          where: { stripePayoutId: payout.id },
          data: { status: "failed" },
        });

        break;
      }

      // ---------------------------------------------
      // 🔥 CUENTA STRIPE CONNECT (KYC)
      // ---------------------------------------------
      case "account.updated": {
        const account = event.data.object;

        await db.user.updateMany({
          where: { stripeAccountId: account.id },
          data: {
            stripeDetailsSubmitted: account.details_submitted,
            stripeChargesEnabled: account.charges_enabled,
            stripePayoutsEnabled: account.payouts_enabled,
          },
        });

        break;
      }

      default:
        console.log("Evento no manejado:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Error procesando webhook:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

// FINAL DEL BLOQUE 3
// FINAL DEL ARCHIVO
