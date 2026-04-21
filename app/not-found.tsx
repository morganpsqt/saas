import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#fafafa",
        color: "#111",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#b45309",
            marginBottom: 12,
          }}
        >
          Erreur 404
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
          Cette page n'existe pas.
        </h1>
        <p style={{ color: "#52525b", marginBottom: 28, lineHeight: 1.6 }}>
          Le lien est peut-être cassé, ou la page a été déplacée. Retour à la maison ?
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#111",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
