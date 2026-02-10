// /app/api/stripe/webhook/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrentUser } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    // IMPORTS DINÁMICOS — necesarios para Vercel
    const { stripe } = await import("@/src/lib/stripe");
    const { db } = await import("@/src/lib/db");

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // MANEJO DE EVENTOS STRIPE
    // ---------------------------------------------

    switch (event.type) {
      case "account.updated": {
        const account = event.data.object;

        await db.user.updateMany({
          where: { stripeAccountId: account.id },
          data: {
            stripeDetailsSubmitted: account.details_submitted ?? false,
          },
        });

        break;
      }

      case "payout.paid":
      case "payout.failed": {
        const payout = event.data.object;

        await db.payout.updateMany({
          where: { stripePayoutId: payout.id },
          data: {
            status: payout.status,
          },
        });

        break;
      }

      case "payment_intent.succeeded": {
        const intent = event.data.object;

        await db.payment.create({
          data: {
            stripePaymentIntentId: intent.id,
            amount: intent.amount_received,
            currency: intent.currency,
            status: "succeeded",
          },
        });

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
