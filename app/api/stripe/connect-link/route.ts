// /app/api/stripe/connect-link/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { stripe } = await import("@/lib/stripe");
    const { db } = await import("@/lib/db");

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

    const accountLink = await stripe.accountLinks.create({
      account: dbUser.stripeAccountId,
      refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL!,
      return_url: process.env.STRIPE_CONNECT_RETURN_URL!,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect Link error:", error);
    return NextResponse.json(
      { error: "Error creando link de Stripe Connect" },
      { status: 500 }
    );
  }
}
