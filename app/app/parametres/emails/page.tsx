import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrCreateSubscription } from "@/lib/subscriptions";
import { getSubscriptionState, isPro } from "@/lib/subscriptions-shared";
import { DEFAULT_TEMPLATES, type EmailTemplatesSet } from "@/lib/emails/templates";
import EmailTemplatesEditor from "@/components/settings/EmailTemplatesEditor";
import ProFeatureGate from "@/components/ProFeatureGate";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  subject_j3: string | null;
  body_j3: string | null;
  subject_j7: string | null;
  body_j7: string | null;
  subject_j10: string | null;
  body_j10: string | null;
  artisan_name: string | null;
  artisan_signature: string | null;
};

function rowToSet(row: Row | null): EmailTemplatesSet {
  return {
    j3: { subject: row?.subject_j3 || DEFAULT_TEMPLATES.j3.subject, body: row?.body_j3 || DEFAULT_TEMPLATES.j3.body },
    j7: { subject: row?.subject_j7 || DEFAULT_TEMPLATES.j7.subject, body: row?.body_j7 || DEFAULT_TEMPLATES.j7.body },
    j10: { subject: row?.subject_j10 || DEFAULT_TEMPLATES.j10.subject, body: row?.body_j10 || DEFAULT_TEMPLATES.j10.body },
    artisan_name: row?.artisan_name ?? "",
    artisan_signature: row?.artisan_signature ?? "",
  };
}

export default async function EmailTemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const subscription = await getOrCreateSubscription(user.id);
  const state = getSubscriptionState(subscription);
  const pro = isPro(state);

  let initial: EmailTemplatesSet = DEFAULT_TEMPLATES;
  if (pro) {
    const { data } = await supabase
      .from("email_templates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    initial = rowToSet(data as Row | null);
  }

  return (
    <>
      <style>{`
        .settings-head { display:flex; align-items:center; gap:12px; margin-bottom:24px; font-size:13px; color:#9A9A9A; }
        .settings-head a { color:#9A9A9A; text-decoration:none; }
        .settings-head a:hover { color:#1C2B1A; }
        .settings-head .sep { color:#D9D5CC; }
        .settings-title { font-family:'Fraunces', serif; font-size:30px; color:#1C2B1A; margin-bottom:6px; }
        .settings-sub { font-size:14px; color:#6B7280; margin-bottom:32px; }
      `}</style>
      <div className="settings-head">
        <Link href="/app">← Dashboard</Link>
        <span className="sep">/</span>
        <span>Paramètres</span>
        <span className="sep">/</span>
        <span style={{ color: "#1C2B1A" }}>Emails de relance</span>
      </div>
      <h1 className="settings-title">Emails de relance</h1>
      <p className="settings-sub">Personnalisez les messages envoyés à vos clients à J+3, J+7 et J+10.</p>

      <ProFeatureGate
        isPro={pro}
        title="Personnalisation des emails"
        description="Les abonnés Relya peuvent adapter chaque relance à leur voix et à leur métier."
      >
        <EmailTemplatesEditor initial={initial} />
      </ProFeatureGate>
    </>
  );
}
