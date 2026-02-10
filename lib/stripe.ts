// /lib/stripe.ts
// ---------------------------------------------
// BLOQUE 1 — CLIENTE STRIPE
// ---------------------------------------------

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY no está definido");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// FINAL DEL BLOQUE 1
// FINAL DEL ARCHIVO
