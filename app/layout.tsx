import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relya — Relancez vos devis automatiquement",
  description:
    "Le logiciel de relance automatique pour artisans, freelances, agences et consultants. 3× plus de devis signés, sans y penser.",
  openGraph: {
    title: "Relya — Relancez vos devis automatiquement",
    description:
      "Le logiciel de relance automatique pour artisans, freelances, agences et consultants. 3× plus de devis signés, sans y penser.",
    type: "website",
    locale: "fr_FR",
    siteName: "Relya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relya — Relancez vos devis automatiquement",
    description:
      "Le logiciel de relance automatique pour artisans, freelances, agences et consultants. 3× plus de devis signés, sans y penser.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
