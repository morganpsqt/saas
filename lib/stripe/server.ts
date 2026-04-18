import Stripe from "stripe";

// Instance Stripe côté serveur (ne jamais importer côté client).
// Un placeholder permet au build de passer même sans clé ; les appels runtime lèveront via assertStripeConfigured().
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder",
  {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    appInfo: {
      name: "Relya",
      version: "0.1.0",
    },
  }
);

export const STRIPE_PRICE_SETUP = process.env.STRIPE_PRICE_SETUP ?? "";
export const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export function assertStripeConfigured() {
  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!STRIPE_PRICE_SETUP) missing.push("STRIPE_PRICE_SETUP");
  if (!STRIPE_PRICE_MONTHLY) missing.push("STRIPE_PRICE_MONTHLY");
  if (missing.length > 0) {
    throw new Error(
      `Stripe non configuré. Variables manquantes : ${missing.join(", ")}.`
    );
  }
}
