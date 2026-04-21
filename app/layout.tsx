import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://relancedevis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Relya — 3× plus de devis signés, sans y penser.",
    template: "%s · Relya",
  },
  description:
    "Relya relance automatiquement vos clients à J+3, J+7 et J+10. Plus jamais de devis oublié. Pensé pour les artisans, freelances et agences.",
  applicationName: "Relya",
  keywords: [
    "relance devis",
    "suivi clients",
    "CRM artisan",
    "freelance",
    "agence",
    "consultant",
    "relance automatique",
  ],
  authors: [{ name: "Relya" }],
  creator: "Relya",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Relya",
    title: "Relya — 3× plus de devis signés, sans y penser.",
    description:
      "Relance automatique de vos devis en sommeil. Moins d'admin, plus de signatures.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Relya — 3× plus de devis signés, sans y penser.",
    description:
      "Relance automatique de vos devis en sommeil. Moins d'admin, plus de signatures.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
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
