"use client";

import Link from "next/link";
import { toast } from "sonner";
import type { Devis } from "@/lib/types";

function csvEscape(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(devis: Devis[]): string {
  const header = [
    "Client",
    "Email",
    "Montant",
    "Date envoi",
    "Statut",
    "Relances envoyées",
    "Dernière relance",
    "Notes",
  ];
  const rows = devis.map((d) => [
    csvEscape(d.nom_client),
    csvEscape(d.email_client),
    csvEscape(d.montant),
    csvEscape(d.date_envoi),
    csvEscape(d.statut),
    csvEscape(d.nb_relances),
    csvEscape(d.derniere_relance_at ?? ""),
    csvEscape(d.notes ?? ""),
  ]);
  return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export default function ExportCsvButton({ devis, isPro }: { devis: Devis[]; isPro: boolean }) {
  function download() {
    if (devis.length === 0) {
      toast.info("Aucun devis à exporter");
      return;
    }
    const csv = buildCsv(devis);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `relya-devis-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  }

  return (
    <>
      <style>{`
        .csv-btn {
          background: #fff;
          border: 1px solid #D9D5CC;
          color: #1C2B1A;
          padding: 11px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .csv-btn:hover { background: #F7F5F2; }
        .csv-btn.locked { background: #FAF6EE; border-color: #EFD9B1; color: #8A5A1A; }
        .csv-btn.locked:hover { background: #F3EAD3; }
      `}</style>
      {isPro ? (
        <button onClick={download} className="csv-btn" title="Exporter tous les devis en CSV">
          ⬇ Export CSV
        </button>
      ) : (
        <Link href="/subscribe" className="csv-btn locked" title="Export CSV : fonctionnalité abonnés">
          🔒 Export CSV
        </Link>
      )}
    </>
  );
}
