import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RelanceDevis — Relances automatiques pour artisans",
  description: "Transformez vos devis non répondus en clients payés.",
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
