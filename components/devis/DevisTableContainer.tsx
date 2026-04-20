"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DevisTable from "@/components/devis/DevisTable";
import ExportCsvButton from "@/components/devis/ExportCsvButton";
import type { Devis, Statut } from "@/lib/types";

type StatutFilter = "all" | Statut;
type SortKey = "date" | "client" | "montant" | "statut";
type SortDir = "asc" | "desc";

const STATUT_LABELS: Record<StatutFilter, string> = {
  all: "Tous les statuts",
  en_attente: "En attente",
  relance: "Relancé",
  gagne: "Gagné",
  perdu: "Perdu",
};

const STATUT_ORDER: Record<Statut, number> = {
  en_attente: 0,
  relance: 1,
  gagne: 2,
  perdu: 3,
};

export default function DevisTableContainer({ devis, isPro }: { devis: Devis[]; isPro: boolean }) {
  const [statut, setStatut] = useState<StatutFilter>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return devis.filter((d) => {
      if (statut !== "all" && d.statut !== statut) return false;
      if (q && !(d.nom_client.toLowerCase().includes(q) || d.email_client.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [devis, statut, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = new Date(a.date_envoi).getTime() - new Date(b.date_envoi).getTime();
      else if (sortKey === "client") cmp = a.nom_client.localeCompare(b.nom_client, "fr");
      else if (sortKey === "montant") cmp = a.montant - b.montant;
      else if (sortKey === "statut") cmp = STATUT_ORDER[a.statut] - STATUT_ORDER[b.statut];
      return cmp * dir;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  const showResetFilters = statut !== "all" || search.trim() !== "";

  return (
    <>
      <style>{`
        .dt-head {
          display: flex; align-items: center; justify-content: space-between;
          margin: 32px 0 14px; gap: 12px; flex-wrap: wrap;
        }
        .dt-title { font-family: 'Fraunces', serif; font-size: 22px; color: #1C2B1A; }
        .dt-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .dt-add {
          background: #1C2B1A; color: #F7F5F2;
          padding: 11px 18px; border-radius: 10px;
          font-size: 14px; font-weight: 500; text-decoration: none;
          font-family: inherit; transition: background 0.2s;
          white-space: nowrap;
        }
        .dt-add:hover { background: #2C3F2A; }

        .dt-toolbar {
          display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1px solid #ECEAE6; border-radius: 12px;
          padding: 10px 14px; margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .dt-search {
          flex: 1; min-width: 220px;
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px; background: #F7F5F2;
        }
        .dt-search-icon { color: #9A9A9A; font-size: 14px; }
        .dt-search input {
          flex: 1; border: none; background: transparent; outline: none;
          font-size: 13.5px; font-family: inherit; color: #1C2B1A;
        }
        .dt-search input::placeholder { color: #9A9A9A; }
        .dt-select {
          border: 1px solid #ECEAE6; background: #fff;
          padding: 7px 12px; border-radius: 8px;
          font-family: inherit; font-size: 13.5px; color: #1C2B1A;
          outline: none; cursor: pointer;
        }
        .dt-select:focus { border-color: #1C2B1A; }
        .dt-reset {
          border: none; background: none; color: #9A9A9A; cursor: pointer;
          font-family: inherit; font-size: 12.5px; text-decoration: underline;
        }
        .dt-reset:hover { color: #1C2B1A; }

        .dt-sort-row {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          font-size: 12.5px; color: #9A9A9A; margin-bottom: 10px; padding: 0 2px;
        }
        .dt-sort-label { text-transform: uppercase; letter-spacing: 0.5px; }
        .dt-sort-btn {
          padding: 4px 10px; border-radius: 6px; border: 1px solid #ECEAE6;
          background: #fff; color: #6B7280; cursor: pointer; font-family: inherit; font-size: 12.5px;
        }
        .dt-sort-btn.active { background: #1C2B1A; color: #F7F5F2; border-color: #1C2B1A; }
        .dt-results {
          font-size: 12.5px; color: #9A9A9A; margin-bottom: 10px; padding: 0 2px;
        }
      `}</style>

      <div className="dt-head">
        <h2 className="dt-title">Mes devis</h2>
        <div className="dt-actions">
          <ExportCsvButton devis={sorted} isPro={isPro} />
          <Link href="/app/devis/nouveau" className="dt-add">+ Ajouter un devis</Link>
        </div>
      </div>

      {devis.length > 0 && (
        <>
          <div className="dt-toolbar">
            <div className="dt-search">
              <span className="dt-search-icon">🔍</span>
              <input
                placeholder="Chercher un client (nom ou email)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="dt-select" value={statut} onChange={(e) => setStatut(e.target.value as StatutFilter)}>
              {(Object.keys(STATUT_LABELS) as StatutFilter[]).map((k) => (
                <option key={k} value={k}>{STATUT_LABELS[k]}</option>
              ))}
            </select>
            {showResetFilters && (
              <button className="dt-reset" onClick={() => { setStatut("all"); setSearch(""); }}>
                Réinitialiser
              </button>
            )}
          </div>

          <div className="dt-sort-row">
            <span className="dt-sort-label">Trier par :</span>
            {(["date", "client", "montant", "statut"] as SortKey[]).map((k) => (
              <button key={k} className={`dt-sort-btn ${sortKey === k ? "active" : ""}`} onClick={() => toggleSort(k)}>
                {k === "date" ? "Date d'envoi" : k === "client" ? "Client" : k === "montant" ? "Montant" : "Statut"}
                {sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </button>
            ))}
          </div>

          {showResetFilters && (
            <div className="dt-results">
              {sorted.length} résultat{sorted.length > 1 ? "s" : ""} sur {devis.length}
            </div>
          )}
        </>
      )}

      {devis.length > 0 && sorted.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #ECEAE6", borderRadius: 14,
          padding: "40px 24px", textAlign: "center", color: "#6B7280", fontSize: 14,
        }}>
          Aucun devis ne correspond à vos filtres.
          <br />
          <button className="dt-reset" onClick={() => { setStatut("all"); setSearch(""); }} style={{ marginTop: 8 }}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <DevisTable devis={sorted} isPro={isPro} />
      )}
    </>
  );
}
