import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, assertStripeConfigured } from "@/lib/stripe/server";

/**
 * POST /api/stripe/portal
 * Ouvre le portail client Stripe — permet à l'utilisateur d'annuler, mettre à jour
 * son moyen de paiement, consulter ses factures.
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

  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Aucun abonnement trouvé. Souscrivez d'abord." },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${appUrl}/app`,
  });

  return NextResponse.json({ url: portalSession.url });
}
