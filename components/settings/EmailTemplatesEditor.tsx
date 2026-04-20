"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_TEMPLATES, fillVars, formatDateEnvoi, formatMontant, type EmailTemplatesSet } from "@/lib/emails/templates";

type Tab = "j3" | "j7" | "j10";

const TAB_LABELS: Record<Tab, string> = {
  j3: "Relance J+3",
  j7: "Relance J+7",
  j10: "Relance J+10",
};

const SAMPLE_VARS = {
  nom_client: "Jean Dupont",
  montant: formatMontant(1500),
  date_envoi: formatDateEnvoi(new Date().toISOString()),
};

export default function EmailTemplatesEditor({ initial }: { initial: EmailTemplatesSet }) {
  const [tpls, setTpls] = useState<EmailTemplatesSet>(initial);
  const [tab, setTab] = useState<Tab>("j3");
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [testingNum, setTestingNum] = useState<1 | 2 | 3 | null>(null);

  const currentTpl = tpls[tab];
  const vars = { ...SAMPLE_VARS, nom_artisan: tpls.artisan_name || "Votre nom" };

  const preview = useMemo(() => ({
    subject: fillVars(currentTpl.subject, vars),
    body: fillVars(currentTpl.body, vars),
  }), [currentTpl, vars]);

  function setField(field: "subject" | "body", value: string) {
    setTpls((prev) => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/email-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tpls),
    });
    setSaving(false);
    if (res.ok) toast.success("Templates enregistrés");
    else toast.error("Enregistrement impossible");
  }

  async function resetAll() {
    if (!confirm("Réinitialiser tous les templates avec les valeurs par défaut ?")) return;
    setResetting(true);
    await fetch("/api/email-templates", { method: "DELETE" });
    setTpls(DEFAULT_TEMPLATES);
    setResetting(false);
    toast.success("Templates réinitialisés");
  }

  async function sendTest() {
    const num: 1 | 2 | 3 = tab === "j3" ? 1 : tab === "j7" ? 2 : 3;
    setTestingNum(num);
    const res = await fetch("/api/email-templates/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templates: tpls, numeroRelance: num }),
    });
    setTestingNum(null);
    if (res.ok) toast.success("Email de test envoyé à votre adresse");
    else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "Envoi impossible");
    }
  }

  return (
    <>
      <style>{`
        .tpl-root { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        @media (max-width: 960px) { .tpl-root { grid-template-columns: 1fr; } }
        .tpl-card { background: #fff; border: 1px solid #ECEAE6; border-radius: 14px; padding: 22px; }
        .tpl-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
        .tpl-tab {
          padding: 8px 14px; border-radius: 8px; font-size: 13px; cursor: pointer;
          border: 1px solid #ECEAE6; background: #fff; color: #6B7280; font-family: inherit;
        }
        .tpl-tab.active { background: #1C2B1A; color: #F7F5F2; border-color: #1C2B1A; }
        .tpl-label { display: block; font-size: 12px; font-weight: 500; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .tpl-input, .tpl-textarea {
          width: 100%; padding: 11px 14px; border: 1.5px solid #E0DDD8; border-radius: 10px;
          font-size: 14px; font-family: inherit; color: #1C2B1A; background: #fff; outline: none;
          box-sizing: border-box; transition: border-color 0.15s;
        }
        .tpl-textarea { min-height: 200px; resize: vertical; line-height: 1.6; font-family: 'DM Sans', sans-serif; }
        .tpl-input:focus, .tpl-textarea:focus { border-color: #1C2B1A; }
        .tpl-section { margin-bottom: 18px; }
        .vars-box {
          background: #FAF6EE; border: 1px solid #EFD9B1; border-radius: 10px;
          padding: 12px 14px; font-size: 12.5px; color: #8A5A1A; line-height: 1.75; margin-bottom: 18px;
        }
        .vars-box code { background: #fff; padding: 1px 6px; border-radius: 4px; border: 1px solid #EFD9B1; font-family: ui-monospace, monospace; font-size: 12px; color: #1C2B1A; cursor: pointer; }
        .tpl-identity { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
        @media (max-width: 640px) { .tpl-identity { grid-template-columns: 1fr; } }

        .tpl-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; padding-top: 18px; border-top: 1px solid #F0EDE8; }
        .tpl-btn {
          padding: 10px 18px; border-radius: 10px; font-size: 13px; cursor: pointer;
          font-family: inherit; border: 1px solid #D9D5CC; background: #fff; color: #1C2B1A;
        }
        .tpl-btn:hover:not(:disabled) { background: #F7F5F2; }
        .tpl-btn.primary { background: #1C2B1A; color: #F7F5F2; border-color: #1C2B1A; }
        .tpl-btn.primary:hover:not(:disabled) { background: #2C3F2A; }
        .tpl-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .preview-wrap { background: #fff; border: 1px solid #ECEAE6; border-radius: 14px; padding: 0; overflow: hidden; position: sticky; top: 24px; }
        .preview-label { padding: 14px 20px; font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #F0EDE8; background: #FAFAF8; display: flex; justify-content: space-between; }
        .preview-label strong { color: #1C2B1A; }
        .preview-body { padding: 20px; }
        .preview-subject { font-size: 15px; font-weight: 500; color: #1C2B1A; padding: 10px 14px; background: #F7F5F2; border-radius: 8px; margin-bottom: 14px; border-left: 3px solid #D2A050; }
        .preview-content {
          font-size: 14px; color: #1C2B1A; line-height: 1.7; white-space: pre-wrap;
          background: #fff; padding: 16px; border: 1px solid #F0EDE8; border-radius: 8px;
        }
        .preview-signature {
          margin-top: 16px; padding-top: 14px; border-top: 1px solid #F0EDE8;
          font-size: 12.5px; color: #6B7280; white-space: pre-wrap;
        }
      `}</style>

      <div className="tpl-root">
        <div className="tpl-card">
          <div className="tpl-tabs">
            {(["j3", "j7", "j10"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`tpl-tab ${tab === t ? "active" : ""}`}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="vars-box">
            Variables disponibles — clic pour copier dans le presse-papier :{" "}
            {["{nom_client}", "{montant}", "{date_envoi}", "{nom_artisan}"].map((v) => (
              <span key={v}>
                <code onClick={() => { navigator.clipboard.writeText(v); toast.success(`${v} copié`); }}>{v}</code>{" "}
              </span>
            ))}
          </div>

          <div className="tpl-section">
            <label className="tpl-label">Objet</label>
            <input
              className="tpl-input"
              value={currentTpl.subject}
              onChange={(e) => setField("subject", e.target.value)}
              placeholder="Votre devis — avez-vous eu le temps…"
            />
          </div>

          <div className="tpl-section">
            <label className="tpl-label">Message</label>
            <textarea
              className="tpl-textarea"
              value={currentTpl.body}
              onChange={(e) => setField("body", e.target.value)}
            />
          </div>

          <div className="tpl-identity">
            <div>
              <label className="tpl-label">Nom affiché (signature)</label>
              <input
                className="tpl-input"
                value={tpls.artisan_name}
                onChange={(e) => setTpls((p) => ({ ...p, artisan_name: e.target.value }))}
                placeholder="Jean Martin"
              />
            </div>
            <div>
              <label className="tpl-label">Complément de signature</label>
              <input
                className="tpl-input"
                value={tpls.artisan_signature}
                onChange={(e) => setTpls((p) => ({ ...p, artisan_signature: e.target.value }))}
                placeholder="Plombier • 06 12 34 56 78"
              />
            </div>
          </div>

          <div className="tpl-actions">
            <button className="tpl-btn primary" onClick={save} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button className="tpl-btn" onClick={sendTest} disabled={testingNum !== null}>
              {testingNum !== null ? "Envoi…" : "Envoyer un test"}
            </button>
            <button className="tpl-btn" onClick={resetAll} disabled={resetting}>
              {resetting ? "Réinitialisation…" : "Réinitialiser"}
            </button>
          </div>
        </div>

        <div className="preview-wrap">
          <div className="preview-label">
            <span>Aperçu en temps réel</span>
            <strong>{TAB_LABELS[tab]}</strong>
          </div>
          <div className="preview-body">
            <div className="preview-subject">{preview.subject}</div>
            <div className="preview-content">{preview.body}</div>
            <div className="preview-signature">
              {[tpls.artisan_name, tpls.artisan_signature].filter(Boolean).join("\n") || "— Ajoutez votre nom ci-dessous pour signer vos emails"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
