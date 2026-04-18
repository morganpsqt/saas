import type { Subscription, SubscriptionState, SubscriptionStatus } from "@/lib/types";

export function hasActiveAccess(sub: Subscription | null): boolean {
  if (!sub) return false;

  const activeStatuses: SubscriptionStatus[] = ["trialing", "active"];
  if (!activeStatuses.includes(sub.status)) return false;

  if (sub.status === "trialing") {
    if (!sub.trial_end) return true;
    return new Date(sub.trial_end).getTime() > Date.now();
  }

  if (sub.status === "active") {
    if (!sub.current_period_end) return true;
    return new Date(sub.current_period_end).getTime() > Date.now();
  }

  return true;
}

export function daysLeftInTrial(sub: Subscription | null): number | null {
  if (!sub || sub.status !== "trialing" || !sub.trial_end) return null;
  const diffMs = new Date(sub.trial_end).getTime() - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getSubscriptionState(sub: Subscription | null): SubscriptionState {
  if (!sub) return "expired";
  if (sub.status === "active") return "active";
  if (sub.status === "past_due") return "past_due";
  if (sub.status === "canceled") return "canceled";
  if (sub.status === "trialing") {
    if (sub.trial_end && new Date(sub.trial_end).getTime() <= Date.now()) return "expired";
    return sub.setup_paid ? "trial_paid" : "trial_unpaid";
  }
  return "expired";
}

export function isPro(state: SubscriptionState): boolean {
  return state === "active" || state === "trial_paid";
}

export function formatNextBillingDate(sub: Subscription | null): string | null {
  const ref = sub?.trial_end ?? sub?.current_period_end;
  if (!ref) return null;
  return new Date(ref).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
