import { createClient } from "@/lib/supabase/server";

export interface Profile {
  user_id: string;
  display_name: string | null;
  company_name: string | null;
  phone: string | null;
  contact_email: string | null;
  avatar_url: string | null;
  has_seen_onboarding: boolean;
  welcome_email_sent: boolean;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

export function deriveFirstNameFromEmail(email: string): string {
  if (!email) return "";
  const local = email.split("@")[0] ?? "";
  const first = local.split(/[._+-]/)[0] ?? "";
  if (!first) return "";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function getDisplayLabel(profile: Profile | null, email: string): string {
  if (profile?.display_name) return profile.display_name;
  return deriveFirstNameFromEmail(email);
}
