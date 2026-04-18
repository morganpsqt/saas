"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Devis, Statut } from "@/lib/types";

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

export default function DevisTable({ devis }: { devis: Devis[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatut(id: string, statut: Statut) {
    setUpdating(id);
    await fetch(`/api/devis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    router.refresh();
    setUpdating(null);
  }

  async function deleteDevis(id: string) {
    if (!confirm("Supprimer ce devis ?")) return;
    setUpdating(id);
    await fetch(`/api/devis/${id}`, { method: "DELETE" });
    router.refresh();
    setUpdating(null);
  }

  if (devis.length === 0) {
    return (
      <>
        <style>{`
          .empty-state {
            background: #fff;
            border-radius: 16px;
            border: 1px solid #ECEAE6;
            padding: 64px 24px;
            text-align: center;
          }
          .empty-icon { font-size: 40px; margin-bottom: 16px; }
          .empty-title { font-family: 'Fraunces', serif; font-size: 20px; color: #1C2B1A; margin-bottom: 8px; }
          .empty-desc { font-size: 14px; color: #9A9A9A; }
        `}</style>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-title">Aucun devis pour l&apos;instant</p>
          <p className="empty-desc">Ajoutez votre premier devis pour démarrer les relances automatiques.</p>
        </div>
      </>
    );
  }

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
        .statut-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: #F7F5F2;
        }
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
      `}</style>

      <div className="table-wrap">
        {/* Desktop */}
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
                  <button onClick={() => deleteDevis(d.id)} disabled={updating === d.id} className="delete-btn">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile */}
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
                <button onClick={() => deleteDevis(d.id)} disabled={updating === d.id} className="delete-btn">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
