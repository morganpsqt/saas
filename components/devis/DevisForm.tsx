"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DevisForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      nom_client: (form.elements.namedItem("nom_client") as HTMLInputElement).value,
      email_client: (form.elements.namedItem("email_client") as HTMLInputElement).value,
      montant: (form.elements.namedItem("montant") as HTMLInputElement).value,
      date_envoi: (form.elements.namedItem("date_envoi") as HTMLInputElement).value,
    };

    const res = await fetch("/api/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Erreur lors de la création.");
      setLoading(false);
      return;
    }

    toast.success("Devis enregistré — relances programmées ✓");
    router.push("/app");
    router.refresh();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');
        .form-page { max-width: 520px; }
        .form-heading {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          color: #1C2B1A;
          margin-bottom: 6px;
        }
        .form-subheading { font-size: 14px; color: #9A9A9A; margin-bottom: 32px; }
        .form-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #ECEAE6;
          padding: 32px;
        }
        .f-group { margin-bottom: 20px; }
        .f-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #3A3A3A;
          margin-bottom: 7px;
        }
        .f-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #E0DDD8;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1C2B1A;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .f-input:focus {
          border-color: #1C2B1A;
          box-shadow: 0 0 0 3px rgba(28,43,26,0.08);
        }
        .f-input::placeholder { color: #C0C0C0; }
        .f-error {
          background: #FFF3F3;
          border: 1px solid #FFCDD2;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #C0392B;
          margin-bottom: 20px;
        }
        .f-actions { display: flex; gap: 12px; margin-top: 8px; }
        .f-cancel {
          flex: 1;
          padding: 12px;
          border: 1.5px solid #E0DDD8;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #6B7280;
          background: #fff;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .f-cancel:hover { background: #F7F5F2; }
        .f-submit {
          flex: 1;
          padding: 12px;
          background: #1C2B1A;
          color: #F7F5F2;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .f-submit:hover:not(:disabled) { background: #2C3F2A; }
        .f-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="form-page">
        <h1 className="form-heading">Nouveau devis</h1>
        <p className="form-subheading">Les relances seront envoyées automatiquement.</p>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="f-group">
              <label className="f-label">Nom du client</label>
              <input name="nom_client" type="text" required placeholder="Jean Dupont" className="f-input" />
            </div>
            <div className="f-group">
              <label className="f-label">Email du client</label>
              <input name="email_client" type="email" required placeholder="jean@exemple.fr" className="f-input" />
            </div>
            <div className="f-group">
              <label className="f-label">Montant du devis (€)</label>
              <input name="montant" type="number" min="1" step="0.01" required placeholder="1 500" className="f-input" />
            </div>
            <div className="f-group">
              <label className="f-label">Date d&apos;envoi du devis</label>
              <input name="date_envoi" type="date" required defaultValue={today} max={today} className="f-input" />
            </div>

            {error && <div className="f-error">{error}</div>}

            <div className="f-actions">
              <button type="button" onClick={() => router.back()} className="f-cancel">Annuler</button>
              <button type="submit" disabled={loading} className="f-submit">
                {loading ? "Enregistrement..." : "Enregistrer →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
