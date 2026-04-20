import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import TrialBanner from "@/components/TrialBanner";
import ToastListener from "@/components/ToastListener";
import OnboardingWizard from "@/components/OnboardingWizard";
import { getOrCreateSubscription, hasActiveAccess } from "@/lib/subscriptions";
import type { Profile } from "@/lib/profiles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const subscription = await getOrCreateSubscription(user.id);

  if (!hasActiveAccess(subscription)) {
    redirect("/subscribe");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const profile = (profileRow as Profile | null) ?? null;

  return (
    <>
      <style>{`
        .dash-root { min-height: 100vh; background: #F7F5F2; font-family: 'DM Sans', sans-serif; }
        .dash-nav {
          background: #1C2B1A;
          padding: 0 40px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dash-nav-brand {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: #F7F5F2;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dash-nav-brand-dot {
          width: 8px; height: 8px;
          background: #D2A050;
          border-radius: 50%;
        }
        .dash-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .dash-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        @media (max-width: 640px) {
          .dash-nav { padding: 0 20px; }
          .dash-main { padding: 24px 20px; }
        }
      `}</style>
      <div className="dash-root">
        <nav className="dash-nav">
          <Link href="/app" className="dash-nav-brand">
            <span className="dash-nav-brand-dot" />
            Relya
          </Link>
          <div className="dash-nav-right">
            <UserMenu
              email={user.email ?? ""}
              avatarUrl={profile?.avatar_url ?? null}
              displayName={profile?.display_name ?? null}
            />
          </div>
        </nav>
        <TrialBanner subscription={subscription} />
        <main className="dash-main">{children}</main>
        <ToastListener />
        {!profile?.has_seen_onboarding && (
          <OnboardingWizard hasProfile={!!profile?.display_name} />
        )}
      </div>
    </>
  );
}
