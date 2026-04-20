"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Devis } from "@/lib/types";

function csvEscape(v: string | number | null): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(devis: Devis[]) {
  if (devis.length === 0) {
    toast.info("Aucun devis à exporter");
    return;
  }
  const header = ["Client", "Email", "Montant", "Date envoi", "Statut", "Relances envoyées", "Dernière relance", "Notes"];
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
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relya-devis-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Export CSV téléchargé");
}

export default function DashboardShortcuts({ isPro, devisJson }: { isPro: boolean; devisJson: string }) {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();
      if (k === "n") {
        e.preventDefault();
        router.push("/app/devis/nouveau");
      } else if (k === "e") {
        if (!isPro) {
          toast.info("Export CSV réservé aux abonnés");
          router.push("/subscribe");
          return;
        }
        e.preventDefault();
        const list = JSON.parse(devisJson) as Devis[];
        downloadCsv(list);
      } else if (k === "?" || (k === "/" && e.shiftKey)) {
        e.preventDefault();
        setHelpOpen(true);
      } else if (k === "escape") {
        setHelpOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPro, devisJson, router]);

  if (!helpOpen) return null;

  return (
    <>
      <style>{`
        .sh-backdrop {
          position: fixed; inset: 0; background: rgba(28,43,26,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 80; padding: 20px;
        }
        .sh-modal {
          background: #fff; border-radius: 14px; max-width: 420px; width: 100%;
          padding: 26px; box-shadow: 0 20px 60px rgba(28,43,26,0.2);
        }
        .sh-title { font-family: 'Fraunces', serif; font-size: 20px; color: #1C2B1A; margin-bottom: 4px; }
        .sh-sub { font-size: 13px; color: #9A9A9A; margin-bottom: 18px; }
        .sh-list { margin: 0; padding: 0; list-style: none; }
        .sh-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-bottom: 1px solid #F0EDE8; font-size: 13.5px;
        }
        .sh-item:last-child { border-bottom: none; }
        .sh-kbd {
          background: #F7F5F2; border: 1px solid #ECEAE6; border-radius: 6px;
          padding: 3px 9px; font-family: ui-monospace, monospace; font-size: 12px; color: #1C2B1A;
        }
        .sh-close {
          margin-top: 14px; width: 100%; padding: 9px; border-radius: 8px;
          background: #1C2B1A; color: #F7F5F2; border: none; cursor: pointer; font-family: inherit; font-size: 13px;
        }
        .sh-close:hover { background: #2C3F2A; }
      `}</style>
      <div className="sh-backdrop" onClick={() => setHelpOpen(false)}>
        <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
          <div className="sh-title">Raccourcis clavier</div>
          <div className="sh-sub">Accélérez votre flux de travail.</div>
          <ul className="sh-list">
            <li className="sh-item"><span>Nouveau devis</span><span className="sh-kbd">N</span></li>
            <li className="sh-item"><span>Exporter CSV</span><span className="sh-kbd">E</span></li>
            <li className="sh-item"><span>Afficher cette aide</span><span className="sh-kbd">?</span></li>
            <li className="sh-item"><span>Fermer</span><span className="sh-kbd">Échap</span></li>
          </ul>
          <button className="sh-close" onClick={() => setHelpOpen(false)}>Fermer</button>
        </div>
      </div>
    </>
  );
}
