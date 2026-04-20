import { createClient } from "@/lib/supabase/server";
import Stats from "@/components/dashboard/Stats";
import DevisTableContainer from "@/components/devis/DevisTableContainer";
import SubscriptionCard from "@/components/SubscriptionCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardShortcuts from "@/components/dashboard/DashboardShortcuts";
import TipOfTheDay from "@/components/dashboard/TipOfTheDay";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { getOrCreateSubscription } from "@/lib/subscriptions";
import { getSubscriptionState, isPro as isProFn } from "@/lib/subscriptions-shared";
import type { Devis } from "@/lib/types";
import type { Profile } from "@/lib/profiles";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: devis } = await supabase
    .from("devis")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const list: Devis[] = devis ?? [];

  const subscription = await getOrCreateSubscription(user!.id);
  const state = getSubscriptionState(subscription);
  const pro = isProFn(state);

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user!.id)
    .maybeSingle();
  const profile = (profileRow as Pick<Profile, "display_name"> | null) ?? null;

  const total = list.length;
  const gagnes = list.filter((d) => d.statut === "gagne").length;
  const montantGagne = list
    .filter((d) => d.statut === "gagne")
    .reduce((sum, d) => sum + d.montant, 0);
  const tauxConversion = total > 0 ? Math.round((gagnes / total) * 100) : 0;

  return (
    <>
      <style>{`
        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
        }
        .page-title {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          color: #1C2B1A;
          line-height: 1;
          margin-bottom: 6px;
        }
        .page-subtitle {
          font-size: 14px;
          color: #9A9A9A;
        }
        .section-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          margin: 28px 0 14px;
        }
      `}</style>
      <DashboardShortcuts isPro={pro} devisJson={JSON.stringify(list)} />
      <div className="page-header">
        <div>
          <DashboardGreeting email={user!.email ?? ""} displayName={profile?.display_name ?? null} />
          <h1 className="page-title">Mes devis</h1>
          <p className="page-subtitle">Suivez et relancez vos clients automatiquement</p>
        </div>
      </div>

      <Stats total={total} gagnes={gagnes} montantGagne={montantGagne} tauxConversion={tauxConversion} />

      <TipOfTheDay />

      <h2 className="section-title">Évolution du chiffre d&apos;affaires</h2>
      <RevenueChart devis={list} isPro={pro} />

      <DevisTableContainer devis={list} isPro={pro} />

      <ActivityFeed devis={list} />

      <SubscriptionCard subscription={subscription} state={state} />
    </>
  );
}
