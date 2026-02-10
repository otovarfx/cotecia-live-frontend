// /app/api/stripe/connect/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // IMPORTS DINÁMICOS — necesarios para Vercel
    const { stripe } = await import("@/src/lib/stripe");
    const { db } = await import("@/src/lib/db");

    // 1. Buscar si ya tiene cuenta Stripe
    const existing = await db.user.findUnique({
      where: { id: user.id },
      select: { stripeAccountId: true },
    });

    let accountId = existing?.stripeAccountId;

    // 2. Crear cuenta si no existe
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email ?? undefined,
      });

      accountId = account.id;

      await db.user.update({
        where: { id: user.id },
        data: { stripeAccountId: accountId },
      });
    }

    // 3. Crear link de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL!,
      return_url: process.env.STRIPE_CONNECT_RETURN_URL!,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      { error: "Error creando cuenta Stripe Connect" },
      { status: 500 }
    );
  }
}
