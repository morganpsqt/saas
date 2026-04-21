"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Best-effort client-side reporting (prod can plug Sentry here later).
    // eslint-disable-next-line no-console
    console.error("[app error]", error);
  }, [error]);

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
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#dc2626",
            marginBottom: 12,
          }}
        >
          Quelque chose a mal tourné
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
          On a rencontré une erreur inattendue.
        </h1>
        <p style={{ color: "#52525b", marginBottom: 20, lineHeight: 1.6 }}>
          Un rechargement suffit souvent à régler le souci. Si le problème persiste, écris-nous.
        </p>
        {error?.digest ? (
          <p
            style={{
              fontSize: 12,
              color: "#71717a",
              fontFamily: "ui-monospace, monospace",
              marginBottom: 24,
            }}
          >
            Code : {error.digest}
          </p>
        ) : null}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#111",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
          <Link
            href="/"
            style={{
              background: "#fff",
              color: "#111",
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid #e5e5e5",
            }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
