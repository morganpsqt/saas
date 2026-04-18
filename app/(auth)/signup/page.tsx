"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .signup-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
        }
        .signup-left {
          width: 45%;
          background: #1C2B1A;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .signup-left::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(210,160,80,0.18) 0%, transparent 70%);
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-icon {
          width: 36px; height: 36px;
          background: #D2A050;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-name { font-family: 'Fraunces', serif; font-size: 20px; color: #F7F5F2; }
        .left-tagline { font-family: 'Fraunces', serif; font-size: 38px; line-height: 1.2; color: #F7F5F2; margin-bottom: 20px; position: relative; z-index: 1; }
        .left-tagline em { color: #D2A050; font-style: italic; }
        .left-desc { font-size: 15px; color: rgba(247,245,242,0.55); line-height: 1.6; max-width: 300px; position: relative; z-index: 1; }
        .left-steps { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 16px; }
        .step { display: flex; align-items: center; gap: 14px; }
        .step-num {
          width: 28px; height: 28px;
          background: rgba(210,160,80,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 500; color: #D2A050;
          flex-shrink: 0;
        }
        .step-text { font-size: 13px; color: rgba(247,245,242,0.6); }
        .signup-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 48px;
        }
        .signup-card { width: 100%; max-width: 380px; }
        .signup-title { font-family: 'Fraunces', serif; font-size: 28px; color: #1C2B1A; margin-bottom: 6px; }
        .signup-subtitle { font-size: 14px; color: #8A8A8A; margin-bottom: 36px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: #3A3A3A; margin-bottom: 7px; }
        .form-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #E0DDD8; border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #1C2B1A; background: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus { border-color: #1C2B1A; box-shadow: 0 0 0 3px rgba(28,43,26,0.08); }
        .form-input::placeholder { color: #BBBBBB; }
        .error-box { background: #FFF3F3; border: 1px solid #FFCDD2; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #C0392B; margin-bottom: 20px; }
        .submit-btn {
          width: 100%; padding: 13px;
          background: #1C2B1A; color: #F7F5F2;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.2s; margin-bottom: 20px;
        }
        .submit-btn:hover:not(:disabled) { background: #2C3F2A; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .signup-footer { text-align: center; font-size: 13px; color: #8A8A8A; }
        .signup-footer a { color: #D2A050; font-weight: 500; text-decoration: none; }
        .signup-footer a:hover { text-decoration: underline; }
        @media (max-width: 768px) { .signup-left { display: none; } .signup-right { padding: 32px 24px; } }
      `}</style>

      <div className="signup-root">
        <div className="signup-left">
          <div className="brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 5h12M4 10h8M4 15h10" stroke="#1C2B1A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="brand-name">RelanceDevis</span>
          </div>

          <div>
            <h2 className="left-tagline">Commencez à<br /><em>gagner plus.</em></h2>
            <p className="left-desc">Créez votre compte et configurez vos premières relances en 5 minutes.</p>
          </div>

          <div className="left-steps">
            <div className="step"><span className="step-num">1</span><span className="step-text">Créez votre compte gratuitement</span></div>
            <div className="step"><span className="step-num">2</span><span className="step-text">Ajoutez vos devis en attente</span></div>
            <div className="step"><span className="step-num">3</span><span className="step-text">Les relances partent automatiquement</span></div>
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-card">
            <h1 className="signup-title">Créer un compte 🚀</h1>
            <p className="signup-subtitle">Gratuit, sans carte bancaire</p>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="vous@exemple.fr" />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" />
            </div>

            {error && <div className="error-box">{error}</div>}

            <button onClick={handleSubmit} disabled={loading} className="submit-btn">
              {loading ? "Création en cours..." : "Créer mon compte →"}
            </button>

            <p className="signup-footer">
              Déjà un compte ? <Link href="/login">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
