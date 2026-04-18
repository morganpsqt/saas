import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrCreateSubscription, hasActiveAccess, daysLeftInTrial } from "@/lib/subscriptions";
import SubscribeClient from "@/components/SubscribeClient";

export default async function SubscribePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/subscribe");

  const subscription = await getOrCreateSubscription(user.id);
  const hasAccess = hasActiveAccess(subscription);
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
