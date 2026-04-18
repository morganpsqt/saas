import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrCreateSubscription } from "@/lib/subscriptions";
import { daysLeftInTrial, isPro, getSubscriptionState } from "@/lib/subscriptions-shared";
import SubscribeClient from "@/components/SubscribeClient";

export default async function SubscribePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/subscribe");

  const subscription = await getOrCreateSubscription(user.id);
  const state = getSubscriptionState(subscription);

  // Déjà abonné (trial payé ou actif) → retour au dashboard
  if (isPro(state)) {
    redirect("/app");
  }

  const hasAccess = state === "trial_unpaid";
  const daysLeft = daysLeftInTrial(subscription);

  return (
    <SubscribeClient
      hasAccess={hasAccess}
      daysLeft={daysLeft}
      status={subscription?.status ?? "trialing"}
      email={user.email ?? ""}
    />
  );
}
