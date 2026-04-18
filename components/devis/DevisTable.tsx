"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { Devis, Statut } from "@/lib/types";
import DevisEmptyState from "@/components/devis/DevisEmptyState";

const STATUT_CONFIG: Record<Statut, { label: string; color: string }> = {
  en_attente: { label: "En attente", color: "#B45309" },
  relance:    { label: "Relancé",    color: "#1D4ED8" },
  gagne:      { label: "Gagné ✓",   color: "#15803D" },
  perdu:      { label: "Perdu",      color: "#6B7280" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatMontant(montant: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(montant);
}

export default function DevisTable({ devis, isPro }: { devis: Devis[]; isPro: boolean }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [noteDevis, setNoteDevis] = useState<Devis | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  async function updateStatut(id: string, statut: Statut) {
    setUpdating(id);
    const res = await fetch(`/api/devis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    if (res.ok) toast.success("Statut mis à jour");
    else toast.error("Impossible de modifier le statut");
    router.refresh();
    setUpdating(null);
  }

  async function deleteDevis(id: string) {
    if (!confirm("Supprimer ce devis ?")) return;
    setUpdating(id);
    const res = await fetch(`/api/devis/${id}`, { method: "DELETE" });
    if (res.ok) toast.success("Devis supprimé");
    else toast.error("Suppression impossible");
    router.refresh();
    setUpdating(null);
  }

  function openNote(d: Devis) {
    setNoteDevis(d);
    setNoteValue(d.notes ?? "");
  }

  async function saveNote() {
    if (!noteDevis) return;
    setNoteSaving(true);
    const res = await fetch(`/api/devis/${noteDevis.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: noteValue }),
    });
    setNoteSaving(false);
    if (res.ok) {
      toast.success("Note enregistrée");
      setNoteDevis(null);
      router.refresh();
    } else {
      toast.error("Enregistrement impossible");
    }
  }

  if (devis.length === 0) return <DevisEmptyState />;

  return (
    <>
      <style>{`
        .table-wrap {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #ECEAE6;
          overflow: hidden;
        }
        .devis-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .devis-table th {
          text-align: left;
          padding: 14px 20px;
          font-size: 11px;
          font-weight: 500;
          color: #9A9A9A;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          border-bottom: 1px solid #F0EDE8;
          background: #FAFAF8;
        }
        .devis-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #F7F5F2;
          vertical-align: middle;
        }
        .devis-table tr:last-child td { border-bottom: none; }
        .devis-table tr:hover td { background: #FAFAF8; }
        .client-name { font-weight: 500; color: #1C2B1A; margin-bottom: 2px; }
        .client-email { font-size: 12px; color: #9A9A9A; }
        .montant { font-family: 'Fraunces', serif; font-size: 16px; color: #1C2B1A; }
        .date-text { color: #6B7280; }
        .relances-text { color: #6B7280; }
        .statut-select {
          font-size: 12px;
          border: 1.5px solid #ECEAE6;
          border-radius: 8px;
          padding: 6px 10px;
          background: #fff;
          color: #1C2B1A;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          outline: none;
        }
        .statut-select:focus { border-color: #1C2B1A; }
        .row-actions { display: inline-flex; gap: 4px; align-items: center; }
        .icon-btn {
          background: none;
          border: none;
          color: #9A9A9A;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .icon-btn:hover { color: #1C2B1A; background: #FAFAF8; }
        .icon-btn.note-active { color: #8A5A1A; }
        .icon-btn.locked { color: #BFB8A8; cursor: pointer; }
        .delete-btn {
          background: none;
          border: none;
          color: #D1CFC9;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .delete-btn:hover { color: #EF4444; background: #FEF2F2; }

        /* Mobile cards */
        .mobile-cards { display: none; }
        @media (max-width: 640px) {
          .devis-table { display: none; }
          .mobile-cards { display: block; }
          .mobile-card {
            padding: 16px 20px;
            border-bottom: 1px solid #F7F5F2;
          }
          .mobile-card:last-child { border-bottom: none; }
          .mobile-card-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
          .mobile-card-bottom { display: flex; justify-content: space-between; align-items: center; }
        }

        /* Note modal */
        .note-backdrop {
          position: fixed; inset: 0; background: rgba(28,43,26,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 20px;
        }
        .note-modal {
          background: #fff; border-radius: 14px; padding: 24px;
          width: 100%; max-width: 460px;
          box-shadow: 0 20px 60px rgba(28,43,26,0.2);
        }
        .note-modal h3 {
          font-family: 'Fraunces', serif; font-size: 20px; color: #1C2B1A;
          margin-bottom: 4px;
        }
        .note-modal p { font-size: 13px; color: #9A9A9A; margin-bottom: 16px; }
        .note-modal textarea {
          width: 100%; min-height: 120px;
          border: 1.5px solid #ECEAE6; border-radius: 10px;
          padding: 12px; font-family: inherit; font-size: 14px;
          color: #1C2B1A; resize: vertical; outline: none;
        }
        .note-modal textarea:focus { border-color: #1C2B1A; }
        .note-actions {
          display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;
        }
        .note-btn {
          padding: 9px 16px; border-radius: 10px; font-size: 13px;
          font-family: inherit; cursor: pointer; border: 1px solid #D9D5CC;
          background: #fff; color: #1C2B1A;
        }
        .note-btn.primary { background: #1C2B1A; color: #F7F5F2; border-color: #1C2B1A; }
        .note-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="table-wrap">
        <table className="devis-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Montant</th>
              <th>Date envoi</th>
              <th>Relances</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {devis.map((d) => (
              <tr key={d.id}>
                <td>
                  <p className="client-name">{d.nom_client}</p>
                  <p className="client-email">{d.email_client}</p>
                </td>
                <td><span className="montant">{formatMontant(d.montant)}</span></td>
                <td><span className="date-text">{formatDate(d.date_envoi)}</span></td>
                <td><span className="relances-text">{d.nb_relances} / 3</span></td>
                <td>
                  <select
                    value={d.statut}
                    disabled={updating === d.id}
                    onChange={(e) => updateStatut(d.id, e.target.value as Statut)}
                    className="statut-select"
                    style={{ color: STATUT_CONFIG[d.statut].color }}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="relance">Relancé</option>
                    <option value="gagne">Gagné</option>
                    <option value="perdu">Perdu</option>
                  </select>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div className="row-actions">
                    {isPro ? (
                      <button
                        onClick={() => openNote(d)}
                        className={`icon-btn ${d.notes ? "note-active" : ""}`}
                        title={d.notes ? "Voir / modifier la note" : "Ajouter une note"}
                      >
                        {d.notes ? "📝" : "＋ note"}
                      </button>
                    ) : (
                      <Link href="/subscribe" className="icon-btn locked" title="Notes privées : fonctionnalité abonnés">
                        🔒 note
                      </Link>
                    )}
                    <button onClick={() => deleteDevis(d.id)} disabled={updating === d.id} className="delete-btn">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mobile-cards">
          {devis.map((d) => (
            <div key={d.id} className="mobile-card">
              <div className="mobile-card-top">
                <div>
                  <p className="client-name">{d.nom_client}</p>
                  <p className="client-email">{d.email_client}</p>
                </div>
                <span className="montant">{formatMontant(d.montant)}</span>
              </div>
              <div className="mobile-card-bottom">
                <select
                  value={d.statut}
                  disabled={updating === d.id}
                  onChange={(e) => updateStatut(d.id, e.target.value as Statut)}
                  className="statut-select"
                  style={{ color: STATUT_CONFIG[d.statut].color }}
                >
                  <option value="en_attente">En attente</option>
                  <option value="relance">Relancé</option>
                  <option value="gagne">Gagné</option>
                  <option value="perdu">Perdu</option>
                </select>
                <div className="row-actions">
                  {isPro ? (
                    <button onClick={() => openNote(d)} className={`icon-btn ${d.notes ? "note-active" : ""}`}>
                      {d.notes ? "📝" : "＋ note"}
                    </button>
                  ) : (
                    <Link href="/subscribe" className="icon-btn locked">🔒 note</Link>
                  )}
                  <button onClick={() => deleteDevis(d.id)} disabled={updating === d.id} className="delete-btn">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {noteDevis && (
        <div className="note-backdrop" onClick={() => setNoteDevis(null)}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Note privée</h3>
            <p>{noteDevis.nom_client} — visible uniquement par vous.</p>
            <textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Ex. A rappelé lundi, attend un devis ajusté sur le carrelage…"
              autoFocus
            />
            <div className="note-actions">
              <button className="note-btn" onClick={() => setNoteDevis(null)} disabled={noteSaving}>
                Annuler
              </button>
              <button className="note-btn primary" onClick={saveNote} disabled={noteSaving}>
                {noteSaving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
