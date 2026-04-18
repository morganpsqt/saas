"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou mot de passe incorrect.");
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

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #F7F5F2;
        }

        /* LEFT PANEL */
        .login-left {
          width: 45%;
          background: #1C2B1A;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(210,160,80,0.18) 0%, transparent 70%);
        }

        .login-left::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(210,160,80,0.12) 0%, transparent 70%);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: #D2A050;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #F7F5F2;
          letter-spacing: -0.3px;
        }

        .left-content {
          position: relative;
          z-index: 1;
        }

        .left-tagline {
          font-family: 'Fraunces', serif;
          font-size: 38px;
          line-height: 1.2;
          color: #F7F5F2;
          margin-bottom: 20px;
        }

        .left-tagline em {
          color: #D2A050;
          font-style: italic;
        }

        .left-desc {
          font-size: 15px;
          color: rgba(247,245,242,0.55);
          line-height: 1.6;
          max-width: 300px;
        }

        .left-stats {
          display: flex;
          gap: 32px;
          position: relative;
          z-index: 1;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          color: #D2A050;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(247,245,242,0.45);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* RIGHT PANEL */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .login-card {
          width: 100%;
          max-width: 380px;
        }

        .login-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          color: #1C2B1A;
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 14px;
          color: #8A8A8A;
          margin-bottom: 36px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #3A3A3A;
          margin-bottom: 7px;
          letter-spacing: 0.1px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #E0DDD8;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1C2B1A;
          background: #FFFFFF;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: #1C2B1A;
          box-shadow: 0 0 0 3px rgba(28,43,26,0.08);
        }

        .form-input::placeholder {
          color: #BBBBBB;
        }

        .error-box {
          background: #FFF3F3;
          border: 1px solid #FFCDD2;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #C0392B;
          margin-bottom: 20px;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #1C2B1A;
          color: #F7F5F2;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2C3F2A;
        }

        .submit-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          font-size: 13px;
          color: #8A8A8A;
        }

        .login-footer a {
          color: #D2A050;
          font-weight: 500;
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #E8E5E0;
        }

        .divider-text {
          font-size: 12px;
          color: #BBBBBB;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { padding: 32px 24px; }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 5h12M4 10h8M4 15h10" stroke="#1C2B1A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="brand-name">RelanceDevis</span>
          </div>

          <div className="left-content">
            <h2 className="left-tagline">
              Relancez vos clients,<br />
              <em>sans y penser.</em>
            </h2>
            <p className="left-desc">
              Envoyez vos devis et laissez le système s&apos;occuper des relances automatiquement — pour que vous vous concentriez sur votre métier.
            </p>
          </div>

          <div className="left-stats">
            <div className="stat-item">
              <span className="stat-number">3×</span>
              <span className="stat-label">Plus de réponses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0 h</span>
              <span className="stat-label">De relance manuelle</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5 min</span>
              <span className="stat-label">Pour démarrer</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">
            <h1 className="login-title">Bon retour 👋</h1>
            <p className="login-subtitle">Connectez-vous à votre espace artisan</p>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="vous@exemple.fr"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Connexion en cours..." : "Se connecter →"}
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">pas encore de compte ?</span>
              <div className="divider-line" />
            </div>

            <p className="login-footer">
              <Link href="/signup">Créer un compte gratuitement</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
