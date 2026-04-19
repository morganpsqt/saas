import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .lp-root {
          background: #F7F5F2;
          color: #1C2B1A;
          font-family: 'DM Sans', sans-serif;
        }
        .lp-nav {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lp-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
        }
        .lp-brand-dot {
          width: 10px; height: 10px;
          background: #D2A050;
          border-radius: 50%;
        }
        .lp-nav-links { display: flex; gap: 24px; align-items: center; font-size: 14px; }
        .lp-nav-links a { color: #3A3A3A; text-decoration: none; }
        .lp-nav-links a:hover { color: #1C2B1A; }
        .lp-cta-primary {
          background: #1C2B1A;
          color: #F7F5F2 !important;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        .lp-cta-primary:hover { background: #2C3F2A; }

        .lp-hero {
          max-width: 860px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          text-align: center;
        }
        .lp-tag {
          display: inline-block;
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          color: #8A5A1A;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .lp-h1 {
          font-family: 'Fraunces', serif;
          font-size: 56px;
          line-height: 1.05;
          color: #1C2B1A;
          margin-bottom: 20px;
        }
        .lp-h1 em {
          font-style: italic;
          color: #D2A050;
        }
        .lp-sub {
          font-size: 18px;
          color: #4A4A4A;
          line-height: 1.55;
          max-width: 680px;
          margin: 0 auto 32px;
        }
        .lp-hero-ctas {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .lp-cta-big {
          background: #1C2B1A;
          color: #F7F5F2 !important;
          padding: 14px 26px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
        }
        .lp-cta-big:hover { background: #2C3F2A; }
        .lp-cta-ghost {
          color: #1C2B1A !important;
          padding: 14px 22px;
          border-radius: 12px;
          border: 1px solid #D9D5CC;
          font-size: 15px;
          text-decoration: none;
          background: transparent;
        }
        .lp-cta-ghost:hover { background: #ECEAE6; }
        .lp-hero-meta {
          font-size: 13px;
          color: #7A7A7A;
        }

        .lp-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 24px;
        }
        .lp-section-title {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          color: #1C2B1A;
          margin-bottom: 12px;
          text-align: center;
        }
        .lp-section-intro {
          text-align: center;
          color: #6B7280;
          max-width: 620px;
          margin: 0 auto 48px;
          line-height: 1.55;
        }

        /* ---------- Section "Pour qui ?" ---------- */
        .lp-who {
          background: #FAF6EE;
          padding: 72px 24px;
        }
        .lp-who-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .lp-who-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .lp-who-card {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 16px;
          padding: 28px 22px;
          text-align: center;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .lp-who-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(28,43,26,.06);
          border-color: #EFD9B1;
        }
        .lp-who-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 18px;
          background: #FAF6EE;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D2A050;
        }
        .lp-who-card.alt .lp-who-icon {
          background: #E9EFE5;
          color: #1C2B1A;
        }
        .lp-who-icon svg {
          width: 26px; height: 26px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .lp-who-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 19px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-who-card p {
          font-size: 13.5px;
          color: #6B7280;
          line-height: 1.5;
        }

        .lp-problem {
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 80px 24px;
        }
        .lp-problem .lp-section-title { color: #F7F5F2; }
        .lp-problem .lp-section-intro { color: #C8C8C0; }
        .lp-problem-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .lp-problem-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 24px;
        }
        .lp-problem-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          margin-bottom: 8px;
          color: #F7F5F2;
        }
        .lp-problem-card p { font-size: 14px; color: #BFBFB8; line-height: 1.55; }

        .lp-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .lp-step {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 16px;
          padding: 28px;
        }
        .lp-step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #FAF6EE;
          color: #8A5A1A;
          font-family: 'Fraunces', serif;
          font-size: 16px;
          margin-bottom: 14px;
        }
        .lp-step h3 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-step p { font-size: 14px; color: #6B7280; line-height: 1.55; }

        .lp-stats {
          background: #FAF6EE;
          padding: 60px 24px;
        }
        .lp-stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 28px;
          text-align: center;
        }
        .lp-stat-num {
          font-family: 'Fraunces', serif;
          font-size: 44px;
          color: #1C2B1A;
          line-height: 1;
          margin-bottom: 8px;
        }
        .lp-stat-label {
          color: #6B7280;
          font-size: 14px;
        }

        .lp-testimonials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .lp-testimonial {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 16px;
          padding: 28px;
        }
        .lp-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #D2A050;
          color: #1C2B1A;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }
        .lp-avatar.green {
          background: #E9EFE5;
          color: #1C2B1A;
        }
        .lp-testimonial-quote {
          font-family: 'Fraunces', serif;
          font-size: 17px;
          color: #1C2B1A;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .lp-testimonial-author { font-size: 14px; color: #3A3A3A; font-weight: 500; }
        .lp-testimonial-role { font-size: 13px; color: #9A9A9A; }
        .lp-testimonial-tag {
          display: inline-block;
          font-size: 11px;
          color: #8A5A1A;
          background: #FAF6EE;
          padding: 2px 8px;
          border-radius: 6px;
          margin-top: 8px;
        }

        .lp-pricing {
          max-width: 520px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
        }
        .lp-pricing h3 {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-pricing-sub { color: #6B7280; margin-bottom: 28px; font-size: 14px; }
        .lp-pricing-lines {
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 22px;
          text-align: left;
        }
        .lp-pricing-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 6px 0;
          font-size: 14px;
          color: #3A3A3A;
        }
        .lp-pricing-line strong {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
        }
        .lp-pricing-features { list-style: none; text-align: left; margin: 0 0 24px; padding: 0; }
        .lp-pricing-features li {
          font-size: 14px;
          color: #3A3A3A;
          padding: 6px 0;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .lp-pricing-features li::before { content: "✓"; color: #D2A050; font-weight: 700; }

        .lp-faq-list { max-width: 720px; margin: 0 auto; }
        .lp-faq-item {
          border-bottom: 1px solid #ECEAE6;
          padding: 22px 0;
        }
        .lp-faq-q {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-faq-a { color: #6B7280; line-height: 1.55; font-size: 14.5px; }

        .lp-final {
          text-align: center;
          padding: 80px 24px;
          background: #1C2B1A;
          color: #F7F5F2;
        }
        .lp-final h2 {
          font-family: 'Fraunces', serif;
          font-size: 40px;
          margin-bottom: 14px;
        }
        .lp-final p { color: #C8C8C0; margin-bottom: 26px; }
        .lp-final-cta {
          display: inline-block;
          background: #D2A050;
          color: #1C2B1A !important;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 500;
          text-decoration: none;
        }
        .lp-final-cta:hover { background: #E1B064; }

        .lp-footer {
          background: #F7F5F2;
          padding: 40px 24px;
          border-top: 1px solid #ECEAE6;
        }
        .lp-footer-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #9A9A9A;
        }
        .lp-footer a { color: #6B7280; text-decoration: none; margin-right: 16px; }
        .lp-footer a:hover { color: #1C2B1A; }

        @media (max-width: 980px) {
          .lp-who-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .lp-h1 { font-size: 40px; }
          .lp-section-title { font-size: 28px; }
          .lp-final h2 { font-size: 30px; }
          .lp-who-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="lp-root">
        <header>
          <nav className="lp-nav">
            <div className="lp-brand">
              <span className="lp-brand-dot" />
              Relya
            </div>
            <div className="lp-nav-links">
              <Link href="/pricing">Tarifs</Link>
              <Link href="/login">Connexion</Link>
              <Link href="/signup" className="lp-cta-primary">Essayer gratuitement</Link>
            </div>
          </nav>
        </header>

        <section className="lp-hero">
          <div className="lp-tag">Pour tous les pros qui envoient des devis</div>
          <h1 className="lp-h1">
            3× plus de devis <em>signés</em>.<br />Sans y penser.
          </h1>
          <p className="lp-sub">
            Que vous soyez artisan, freelance, agence ou consultant, Relya relance
            vos clients à votre place — pendant que vous travaillez sur ce qui
            compte vraiment.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/signup" className="lp-cta-big">Essayer gratuitement 14 jours →</Link>
            <Link href="/pricing" className="lp-cta-ghost">Voir les tarifs</Link>
          </div>
          <div className="lp-hero-meta">
            Aucune carte bancaire requise • Configuration en 2 minutes
          </div>
        </section>

        {/* ---------- Section "Pour qui ?" ---------- */}
        <section className="lp-who">
          <div className="lp-who-inner">
            <h2 className="lp-section-title">Fait pour tous les pros qui envoient des devis</h2>
            <p className="lp-section-intro">
              Artisans, freelances, agences, indépendants — partout où un devis
              attend une réponse, Relya relance à votre place.
            </p>
            <div className="lp-who-grid">
              <div className="lp-who-card">
                <div className="lp-who-icon" aria-hidden>
                  {/* clé à molette stylisée */}
                  <svg viewBox="0 0 24 24">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
                  </svg>
                </div>
                <h3>Artisans</h3>
                <p>Plombiers, électriciens, peintres, menuisiers, maçons, chauffagistes…</p>
              </div>

              <div className="lp-who-card alt">
                <div className="lp-who-icon" aria-hidden>
                  {/* laptop */}
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                </div>
                <h3>Freelances</h3>
                <p>Graphistes, devs, rédacteurs, consultants, coachs, traducteurs…</p>
              </div>

              <div className="lp-who-card">
                <div className="lp-who-icon" aria-hidden>
                  {/* équipe — 3 personnages */}
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3>Agences</h3>
                <p>Com, marketing, web, événementiel, digital, design…</p>
              </div>

              <div className="lp-who-card alt">
                <div className="lp-who-icon" aria-hidden>
                  {/* étoile */}
                  <svg viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3>Autres pros</h3>
                <p>Photographes, architectes, experts, avocats, formateurs…</p>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-problem">
          <h2 className="lp-section-title">Vos devis dorment. Vos clients hésitent.</h2>
          <p className="lp-section-intro">
            70 % des devis signés le sont après une ou plusieurs relances. Mais
            relancer prend du temps — et c'est souvent la tâche qu'on repousse.
          </p>
          <div className="lp-problem-grid">
            <div className="lp-problem-card">
              <h3>Sans relance</h3>
              <p>Votre client oublie, part ailleurs, ou repousse indéfiniment. Votre proposition finit aux oubliettes.</p>
            </div>
            <div className="lp-problem-card">
              <h3>Relances manuelles</h3>
              <p>Vous y pensez le dimanche soir, jamais au bon moment. Résultat : vous n'envoyez rien.</p>
            </div>
            <div className="lp-problem-card">
              <h3>Avec Relya</h3>
              <p>Chaque devis est relancé automatiquement aux bons moments, avec un ton pro. Vous ne faites rien.</p>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">Comment ça marche</h2>
          <p className="lp-section-intro">En 3 étapes, vous ne ratez plus aucun devis.</p>
          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <h3>Ajoutez vos devis</h3>
              <p>Nom du client, email, montant, date d'envoi. 30 secondes par devis.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <h3>Les relances partent toutes seules</h3>
              <p>Jour 2, jour 5, jour 10. Emails personnalisés, envoyés en votre nom. Vous ne touchez à rien.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <h3>Vous signez plus de contrats</h3>
              <p>Suivez vos conversions dans votre tableau de bord. Notes, stats, export CSV.</p>
            </div>
          </div>
        </section>

        <section className="lp-stats">
          <div className="lp-stats-grid">
            <div>
              <div className="lp-stat-num">3×</div>
              <div className="lp-stat-label">Plus de devis signés en moyenne</div>
            </div>
            <div>
              <div className="lp-stat-num">0 min</div>
              <div className="lp-stat-label">Passées à relancer chaque semaine</div>
            </div>
            <div>
              <div className="lp-stat-num">2 min</div>
              <div className="lp-stat-label">Pour configurer votre compte</div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">Ce qu'en disent nos utilisateurs</h2>
          <p className="lp-section-intro">Trois profils différents, un seul problème résolu.</p>
          <div className="lp-testimonials">
            {/* témoignage fictif — à remplacer par un vrai */}
            <div className="lp-testimonial">
              <div className="lp-avatar" aria-hidden>ML</div>
              <div className="lp-testimonial-quote">
                Depuis Relya, je signe 2 devis de plus par semaine sans me prendre la
                tête. Je fais mon métier, Relya gère le reste.
              </div>
              <div className="lp-testimonial-author">Marc L.</div>
              <div className="lp-testimonial-role">Plombier, Lyon</div>
              <div className="lp-testimonial-tag">exemple</div>
            </div>

            {/* témoignage fictif — à remplacer par un vrai */}
            <div className="lp-testimonial">
              <div className="lp-avatar green" aria-hidden>SM</div>
              <div className="lp-testimonial-quote">
                J'oubliais toujours de relancer mes prospects. Maintenant c'est
                automatique, et je vois mon CA grimper sans effort.
              </div>
              <div className="lp-testimonial-author">Sophie M.</div>
              <div className="lp-testimonial-role">Graphiste freelance, Nantes</div>
              <div className="lp-testimonial-tag">exemple</div>
            </div>

            {/* témoignage fictif — à remplacer par un vrai */}
            <div className="lp-testimonial">
              <div className="lp-avatar" aria-hidden>SR</div>
              <div className="lp-testimonial-quote">
                On envoie 20 à 30 propositions par mois. Sans Relya, on perdait la
                moitié des opportunités. C'est devenu indispensable chez nous.
              </div>
              <div className="lp-testimonial-author">Samir R.</div>
              <div className="lp-testimonial-role">Fondateur d'une agence web, Paris</div>
              <div className="lp-testimonial-tag">exemple</div>
            </div>
          </div>
        </section>

        <section className="lp-section" id="pricing">
          <h2 className="lp-section-title">Un tarif simple</h2>
          <p className="lp-section-intro">Pas d'engagement. Résiliable à tout moment.</p>
          <div className="lp-pricing">
            <h3>Relya complet</h3>
            <p className="lp-pricing-sub">14 jours d'essai gratuit, puis :</p>
            <div className="lp-pricing-lines">
              <div className="lp-pricing-line">
                <span>Frais d'installation (une fois)</span>
                <strong>29 €</strong>
              </div>
              <div className="lp-pricing-line">
                <span>Abonnement mensuel</span>
                <strong>19 €</strong>
              </div>
            </div>
            <ul className="lp-pricing-features">
              <li>Devis illimités</li>
              <li>Relances automatiques J+2, J+5, J+10</li>
              <li>Emails personnalisés à votre nom</li>
              <li>Tableau de bord avec vos statistiques</li>
              <li>Support par email</li>
            </ul>
            <Link href="/signup" className="lp-cta-big" style={{ display: "block" }}>
              Commencer mon essai gratuit →
            </Link>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">Questions fréquentes</h2>
          <div className="lp-faq-list">
            <div className="lp-faq-item">
              <div className="lp-faq-q">C'est pour quel type de pro ?</div>
              <div className="lp-faq-a">
                Pour toute personne qui envoie régulièrement des devis — artisans
                (plombiers, électriciens, peintres, menuisiers…), freelances
                (graphistes, devs, rédacteurs, consultants…), agences (com,
                marketing, web, événementiel) et autres indépendants
                (photographes, architectes, coachs, avocats…). Tant que vous
                envoyez des devis, Relya vous fait gagner du temps et des
                signatures.
              </div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Comment fonctionne l'essai gratuit ?</div>
              <div className="lp-faq-a">Vous avez 14 jours pour tester Relya gratuitement, sans saisir de carte bancaire. À la fin de l'essai, vous activez votre abonnement ou vous arrêtez, sans frais.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Les relances sont-elles envoyées à mon nom ?</div>
              <div className="lp-faq-a">Oui. Vos clients reçoivent une relance signée en votre nom, avec votre email en réponse directe.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Pourquoi des frais d'installation de 29 € ?</div>
              <div className="lp-faq-a">Ils couvrent la configuration initiale de votre compte et garantissent que chaque utilisateur est engagé. Ils sont facturés une seule fois.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Puis-je résilier à tout moment ?</div>
              <div className="lp-faq-a">Oui. Vous gérez votre abonnement depuis votre espace client et pouvez l'annuler en un clic, sans justificatif.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Mes données sont-elles en sécurité ?</div>
              <div className="lp-faq-a">Vos données sont hébergées en Europe (serveurs Supabase Francfort) et ne sont jamais revendues. Paiements sécurisés via Stripe.</div>
            </div>
          </div>
        </section>

        <section className="lp-final">
          <h2>Laissez Relya travailler pour vous.</h2>
          <p>14 jours d'essai gratuit. Configuration en 2 minutes.</p>
          <Link href="/signup" className="lp-final-cta">Créer mon compte gratuitement →</Link>
        </section>

        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div>© {new Date().getFullYear()} Relya. Tous droits réservés.</div>
            <div>
              <Link href="/cgu">CGU</Link>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/politique-confidentialite">Confidentialité</Link>
              <Link href="/pricing">Tarifs</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
