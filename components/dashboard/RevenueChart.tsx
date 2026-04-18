"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ProFeatureGate from "@/components/ProFeatureGate";
import type { Devis } from "@/lib/types";

interface Props {
  devis: Devis[];
  isPro: boolean;
}

const MONTHS_FR = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

function buildMonthlySeries(devis: Devis[]): { label: string; ca: number }[] {
  const now = new Date();
  const buckets: { key: string; label: string; ca: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = MONTHS_FR[d.getMonth()];
    buckets.push({ key, label, ca: 0 });
  }
  const index = new Map(buckets.map((b, i) => [b.key, i]));
  for (const d of devis) {
    if (d.statut !== "gagne") continue;
    const date = new Date(d.date_envoi);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const i = index.get(key);
    if (i !== undefined) buckets[i].ca += d.montant;
  }
  return buckets.map(({ label, ca }) => ({ label, ca }));
}

function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function Chart({ devis }: { devis: Devis[] }) {
  const data = useMemo(() => buildMonthlySeries(devis), [devis]);
  const hasAny = data.some((d) => d.ca > 0);

  return (
    <>
      <style>{`
        .rev-card {
          background: #fff; border: 1px solid #ECEAE6; border-radius: 14px;
          padding: 20px; height: 280px;
        }
        .rev-empty { color: #9A9A9A; font-size: 14px; text-align: center; padding: 60px 0; }
      `}</style>
      <div className="rev-card">
        {hasAny ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D2A050" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#D2A050" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
              <XAxis dataKey="label" stroke="#9A9A9A" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9A9A9A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}€`} />
              <Tooltip
                formatter={(v) => formatEur(typeof v === "number" ? v : Number(v))}
                contentStyle={{ background: "#fff", border: "1px solid #ECEAE6", borderRadius: 10, fontSize: 13 }}
                labelStyle={{ color: "#1C2B1A", fontWeight: 500 }}
              />
              <Area type="monotone" dataKey="ca" stroke="#D2A050" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="rev-empty">Aucun devis gagné sur les 6 derniers mois.<br/>Marquez un devis comme « Gagné » pour voir votre chiffre d&apos;affaires s&apos;afficher ici.</p>
        )}
      </div>
    </>
  );
}

export default function RevenueChart({ devis, isPro }: Props) {
  return (
    <ProFeatureGate
      isPro={isPro}
      title="Graphique d'évolution"
      description="Visualisez votre chiffre d'affaires sur les 6 derniers mois avec un abonnement."
    >
      <Chart devis={devis} />
    </ProFeatureGate>
  );
}
