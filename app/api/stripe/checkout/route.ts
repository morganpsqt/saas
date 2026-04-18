import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  stripe,
  STRIPE_PRICE_SETUP,
  STRIPE_PRICE_MONTHLY,
  assertStripeConfigured,
} from "@/lib/stripe/server";

/**
 * POST /api/stripe/checkout
 * Crée une Stripe Checkout Session :
 *  - ligne 1 : frais d'inscription (29€, one-shot)
 *  - ligne 2 : abonnement mensuel (19€/mois, avec trial si pas encore écoulé)
 * Retourne l'URL vers laquelle rediriger le navigateur.
 */
export async function POST() {
  try {
    assertStripeConfigured();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe non configuré" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Récupère ou crée le customer Stripe
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("stripe_customer_id, setup_paid, trial_end")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = sub?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await admin
      .from("subscriptions")
      .upsert(
        { user_id: user.id, stripe_customer_id: customerId, status: "trialing" },
        { onConflict: "user_id" }
      );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Calcule la durée de trial restante (en jours) pour l'appliquer côté Stripe
  let trialDays: number | undefined;
  if (sub?.trial_end) {
    const remainingMs = new Date(sub.trial_end).getTime() - Date.now();
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    if (remainingDays > 0) trialDays = Math.min(remainingDays, 14);
  }

  const lineItems: Array<{ price: string; quantity: number }> = [
    { price: STRIPE_PRICE_MONTHLY, quantity: 1 },
  ];

  // Les frais d'inscription ne sont facturés qu'une fois
  if (!sub?.setup_paid) {
    lineItems.unshift({ price: STRIPE_PRICE_SETUP, quantity: 1 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: lineItems,
    subscription_data: trialDays ? { trial_period_days: trialDays } : undefined,
    success_url: `${appUrl}/app?checkout=success`,
    cancel_url: `${appUrl}/subscribe?checkout=cancelled`,
    allow_promotion_codes: true,
    metadata: { supabase_user_id: user.id },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Impossible de créer la session" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
