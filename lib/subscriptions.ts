import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Subscription } from "@/lib/types";

export { hasActiveAccess, daysLeftInTrial } from "@/lib/subscriptions-shared";

const TRIAL_DAYS = 14;

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export async function getOrCreateSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[subscriptions] fetch error:", error.message);
    return null;
  }

  if (data) return data as Subscription;

  try {
    const admin = createAdminClient();
    const { data: created, error: insertError } = await admin
      .from("subscriptions")
      .insert({
        user_id: userId,
        status: "trialing",
        trial_end: daysFromNow(TRIAL_DAYS),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[subscriptions] create error:", insertError.message);
      return null;
    }

    return created as Subscription;
  } catch {
    console.warn("[subscriptions] fallback virtuel (service_role manquant)");
    return {
      user_id: userId,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      status: "trialing",
      current_period_end: null,
      trial_end: daysFromNow(TRIAL_DAYS),
      cancel_at_period_end: false,
      setup_paid: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}
