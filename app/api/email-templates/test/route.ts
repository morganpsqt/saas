import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateSubscription } from "@/lib/subscriptions";
import { getSubscriptionState, isPro } from "@/lib/subscriptions-shared";
import { sendTestRelanceEmail } from "@/lib/emails/send";
import { DEFAULT_TEMPLATES, type EmailTemplatesSet } from "@/lib/emails/templates";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const subscription = await getOrCreateSubscription(user.id);
  const state = getSubscriptionState(subscription);
  if (!isPro(state)) {
    return NextResponse.json({ error: "Fonctionnalité réservée aux abonnés" }, { status: 402 });
  }

  const body = (await req.json()) as {
    templates?: Partial<EmailTemplatesSet>;
    numeroRelance?: 1 | 2 | 3;
  };
  const numero = body.numeroRelance ?? 1;

  const templates: EmailTemplatesSet = {
    j3: {
      subject: body.templates?.j3?.subject || DEFAULT_TEMPLATES.j3.subject,
      body: body.templates?.j3?.body || DEFAULT_TEMPLATES.j3.body,
    },
    j7: {
      subject: body.templates?.j7?.subject || DEFAULT_TEMPLATES.j7.subject,
      body: body.templates?.j7?.body || DEFAULT_TEMPLATES.j7.body,
    },
    j10: {
      subject: body.templates?.j10?.subject || DEFAULT_TEMPLATES.j10.subject,
      body: body.templates?.j10?.body || DEFAULT_TEMPLATES.j10.body,
    },
    artisan_name: body.templates?.artisan_name ?? "",
    artisan_signature: body.templates?.artisan_signature ?? "",
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, company_name, phone")
    .eq("user_id", user.id)
    .maybeSingle();

  try {
    await sendTestRelanceEmail({
      to: user.email!,
      numeroRelance: numero,
      templates,
      artisanName: profile?.display_name || undefined,
      companyName: profile?.company_name || undefined,
      phone: profile?.phone || undefined,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
