import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Stats from "@/components/dashboard/Stats";
import DevisTable from "@/components/devis/DevisTable";
import type { Devis } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: devis } = await supabase
    .from("devis")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const list: Devis[] = devis ?? [];

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
        .add-btn {
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 11px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .add-btn:hover { background: #2C3F2A; }
      `}</style>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mes devis</h1>
          <p className="page-subtitle">Suivez et relancez vos clients automatiquement</p>
        </div>
        <Link href="/app/devis/nouveau" className="add-btn">+ Ajouter un devis</Link>
      </div>

      <Stats total={total} gagnes={gagnes} montantGagne={montantGagne} tauxConversion={tauxConversion} />
      <DevisTable devis={list} />
    </>
  );
}
