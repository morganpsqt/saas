import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/emails/send";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("welcome_email_sent, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.welcome_email_sent) {
    return NextResponse.json({ skipped: true });
  }

  let sent = false;
  let sendError: string | null = null;
  try {
    await sendWelcomeEmail({
      to: user.email,
      displayName: profile?.display_name ?? undefined,
    });
    sent = true;
  } catch (e) {
    sendError = e instanceof Error ? e.message : String(e);
    console.error("[welcome email] send failed:", sendError);
  }

  // Flag the profile as welcomed only on successful send so we retry later if Resend was down.
  if (sent) {
    try {
      const admin = createAdminClient();
      await admin.from("profiles").upsert({
        user_id: user.id,
        welcome_email_sent: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    } catch (e) {
      console.warn("[welcome email] flag update failed:", e);
    }
  }

  return NextResponse.json({ success: true, sent, ...(sendError ? { reason: sendError } : {}) });
}
