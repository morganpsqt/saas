import type { Devis } from "@/lib/types";

type Item = {
  when: string;
  icon: string;
  text: string;
};

function formatRelative(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.round(h / 24);
  if (j < 7) return `il y a ${j} j`;
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function buildItems(devis: Devis[]): Item[] {
  const items: Item[] = [];
  for (const d of devis) {
    items.push({
      when: d.created_at,
      icon: "＋",
      text: `Devis ajouté pour ${d.nom_client} — ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(d.montant)}`,
    });
    if (d.derniere_relance_at) {
      items.push({
        when: d.derniere_relance_at,
        icon: "✉",
        text: `Relance ${d.nb_relances === 1 ? "J+3" : d.nb_relances === 2 ? "J+7" : "J+10"} envoyée à ${d.nom_client}`,
      });
    }
    if (d.statut === "gagne" && d.updated_at !== d.created_at) {
      items.push({
        when: d.updated_at,
        icon: "🎉",
        text: `Devis gagné chez ${d.nom_client} !`,
      });
    }
    if (d.statut === "perdu" && d.updated_at !== d.created_at) {
      items.push({
        when: d.updated_at,
        icon: "✕",
        text: `Devis perdu chez ${d.nom_client}`,
      });
    }
  }
  items.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  return items.slice(0, 8);
}

export default function ActivityFeed({ devis }: { devis: Devis[] }) {
  const items = buildItems(devis);
  if (items.length === 0) return null;

  return (
    <>
      <style>{`
        .feed-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          margin: 32px 0 14px;
        }
        .feed-card {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 14px;
          padding: 8px 0;
        }
        .feed-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 20px;
          border-bottom: 1px solid #F7F5F2;
        }
        .feed-item:last-child { border-bottom: none; }
        .feed-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #FAF6EE;
          color: #8A5A1A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .feed-text { flex: 1; font-size: 14px; color: #1C2B1A; }
        .feed-when { font-size: 12px; color: #9A9A9A; flex-shrink: 0; }
      `}</style>
      <h2 className="feed-title">Activité récente</h2>
      <div className="feed-card">
        {items.map((it, i) => (
          <div key={i} className="feed-item">
            <div className="feed-icon">{it.icon}</div>
            <div className="feed-text">{it.text}</div>
            <div className="feed-when">{formatRelative(it.when)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
