import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');
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
        .dash-nav-email {
          font-size: 13px;
          color: rgba(247,245,242,0.45);
        }
        .dash-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
        }
      `}</style>
      <div className="dash-root">
        <nav className="dash-nav">
          <Link href="/" className="dash-nav-brand">
            <span className="dash-nav-brand-dot" />
            RelanceDevis
          </Link>
          <div className="dash-nav-right">
            <span className="dash-nav-email">{user.email}</span>
            <LogoutButton />
          </div>
        </nav>
        <main className="dash-main">{children}</main>
      </div>
    </>
  );
}
