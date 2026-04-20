import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FIELDS = ["display_name", "company_name", "phone", "contact_email", "avatar_url", "has_seen_onboarding"] as const;
type Field = typeof FIELDS[number];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return NextResponse.json({ profile: data ?? null });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as Record<string, unknown>;
  const update: Record<string, unknown> = {
    user_id: user.id,
    updated_at: new Date().toISOString(),
  };
  for (const k of FIELDS) {
    if (k in body) update[k as Field] = body[k];
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(update, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
