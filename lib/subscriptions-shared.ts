import type { Subscription, SubscriptionStatus } from "@/lib/types";

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
