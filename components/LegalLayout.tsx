import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <style>{`
        .lg-root {
          min-height: 100vh;
          background: #F7F5F2;
          color: #1C2B1A;
          font-family: 'DM Sans', sans-serif;
        }
        .lg-nav {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lg-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          text-decoration: none;
        }
        .lg-brand-dot { width: 10px; height: 10px; background: #D2A050; border-radius: 50%; }
        .lg-nav a { color: #3A3A3A; text-decoration: none; font-size: 14px; }
        .lg-main {
          max-width: 760px;
          margin: 20px auto 80px;
          padding: 40px 28px;
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 16px;
        }
        .lg-main h1 {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lg-date { color: #9A9A9A; font-size: 13px; margin-bottom: 28px; }
        .lg-main h2 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          margin-top: 28px;
          margin-bottom: 10px;
        }
        .lg-main p, .lg-main li {
          font-size: 15px;
          line-height: 1.65;
          color: #3A3A3A;
          margin-bottom: 10px;
        }
        .lg-main ul { padding-left: 20px; margin-bottom: 14px; }
        .lg-placeholder {
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          color: #8A5A1A;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 13.5px;
          margin-bottom: 24px;
        }
        .lg-footer {
          text-align: center;
          padding: 24px;
          font-size: 13px;
          color: #9A9A9A;
        }
        .lg-footer a { color: #6B7280; margin: 0 8px; text-decoration: none; }
      `}</style>

      <div className="lg-root">
        <nav className="lg-nav">
          <Link href="/" className="lg-brand">
            <span className="lg-brand-dot" />
            Relya
          </Link>
          <Link href="/">← Retour</Link>
        </nav>
        <main className="lg-main">
          <h1>{title}</h1>
          <div className="lg-date">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
          <div className="lg-placeholder">
            ⚠️ Ce document est un modèle provisoire. Il doit être validé et complété par un juriste avant la mise en production commerciale de Relya.
          </div>
          {children}
        </main>
        <div className="lg-footer">
          © {new Date().getFullYear()} Relya ·
          <Link href="/cgu">CGU</Link>·
          <Link href="/mentions-legales">Mentions légales</Link>·
          <Link href="/politique-confidentialite">Confidentialité</Link>
        </div>
      </div>
    </>
  );
}
