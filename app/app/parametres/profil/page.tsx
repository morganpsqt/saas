import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileEditor from "@/components/settings/ProfileEditor";
import type { Profile } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile = (data as Profile | null) ?? null;

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
        <span style={{ color: "#1C2B1A" }}>Profil</span>
      </div>
      <h1 className="settings-title">Mon profil</h1>
      <p className="settings-sub">Ces informations apparaissent dans vos emails de relance et votre dashboard.</p>

      <ProfileEditor profile={profile} defaultEmail={user.email ?? ""} />
    </>
  );
}
