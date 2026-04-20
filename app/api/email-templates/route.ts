import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateSubscription } from "@/lib/subscriptions";
import { getSubscriptionState, isPro } from "@/lib/subscriptions-shared";
import { DEFAULT_TEMPLATES, type EmailTemplatesSet } from "@/lib/emails/templates";

type Row = {
  user_id: string;
  subject_j3: string | null;
  body_j3: string | null;
  subject_j7: string | null;
  body_j7: string | null;
  subject_j10: string | null;
  body_j10: string | null;
  artisan_name: string | null;
  artisan_signature: string | null;
};

function rowToSet(row: Row | null | undefined): EmailTemplatesSet {
  return {
    j3: {
      subject: row?.subject_j3 ?? DEFAULT_TEMPLATES.j3.subject,
      body: row?.body_j3 ?? DEFAULT_TEMPLATES.j3.body,
    },
    j7: {
      subject: row?.subject_j7 ?? DEFAULT_TEMPLATES.j7.subject,
      body: row?.body_j7 ?? DEFAULT_TEMPLATES.j7.body,
    },
    j10: {
      subject: row?.subject_j10 ?? DEFAULT_TEMPLATES.j10.subject,
      body: row?.body_j10 ?? DEFAULT_TEMPLATES.j10.body,
    },
    artisan_name: row?.artisan_name ?? "",
    artisan_signature: row?.artisan_signature ?? "",
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data } = await supabase
    .from("email_templates")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    templates: rowToSet(data as Row | null),
    hasCustom: !!data,
    defaults: DEFAULT_TEMPLATES,
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const subscription = await getOrCreateSubscription(user.id);
  const state = getSubscriptionState(subscription);
  if (!isPro(state)) {
    return NextResponse.json({ error: "Fonctionnalité réservée aux abonnés" }, { status: 402 });
  }

  const body = (await req.json()) as Partial<EmailTemplatesSet>;

  const upsert = {
    user_id: user.id,
    subject_j3: body.j3?.subject ?? null,
    body_j3: body.j3?.body ?? null,
    subject_j7: body.j7?.subject ?? null,
    body_j7: body.j7?.body ?? null,
    subject_j10: body.j10?.subject ?? null,
    body_j10: body.j10?.body ?? null,
    artisan_name: body.artisan_name ?? null,
    artisan_signature: body.artisan_signature ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("email_templates")
    .upsert(upsert, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { error } = await supabase
    .from("email_templates")
    .delete()
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
