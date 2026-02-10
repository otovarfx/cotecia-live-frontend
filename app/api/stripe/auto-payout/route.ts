 appapistripeauto-payoutroute.ts
 ---------------------------------------------
 BLOQUE 1 — IMPORTS
 ---------------------------------------------

import { NextResponse } from nextserver;
import { stripe } from @libstripe;
import { db } from @libdb;
import { getCurrentUser } from @libauth;

 FINAL DEL BLOQUE 1



 ---------------------------------------------
 BLOQUE 2 — HANDLER PRINCIPAL AUTO-PAYOUT
 ---------------------------------------------

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error No autenticado }, { status 401 });
    }

    const dbUser = await db.user.findUnique({
      where { id user.id },
      select { stripeAccountId true, autoPayoutEnabled true },
    });

    if (!dbUser.stripeAccountId) {
      return NextResponse.json(
        { error No tienes cuenta Stripe Connect },
        { status 400 }
      );
    }

    if (!dbUser.autoPayoutEnabled) {
      return NextResponse.json(
        { error Auto-payout no está habilitado },
        { status 400 }
      );
    }

    const balance = await stripe.balance.retrieve({
      stripeAccount dbUser.stripeAccountId,
    });

    const available = balance.available.[0].amount  0;
    const minAmount = Number(process.env.STRIPE_PAYOUT_MIN_AMOUNT  1000);  por defecto 10 USD

    if (available  minAmount) {
      return NextResponse.json(
        { error Balance insuficiente para auto-payout },
        { status 400 }
      );
    }

    const payout = await stripe.payouts.create(
      {
        amount available,
        currency balance.available[0].currency,
      },
      {
        stripeAccount dbUser.stripeAccountId,
      }
    );

     opcional guardar registro en tu DB
    await db.payout.create({
      data {
        userId user.id,
        stripePayoutId payout.id,
        amount available,
        currency balance.available[0].currency,
        status payout.status,
      },
    });

    return NextResponse.json({ ok true, payout });
  } catch (error) {
    console.error(Auto-payout error, error);
    return NextResponse.json(
      { error Error ejecutando auto-payout },
      { status 500 }
    );
  }
}

 FINAL DEL BLOQUE 2
 FINAL DEL ARCHIVO
