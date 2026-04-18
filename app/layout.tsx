import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relya — 3× plus de devis signés, sans y penser.",
  description:
    "Relya relance automatiquement vos clients à J+2, J+5 et J+10. Plus jamais de devis oublié. Pensé pour les artisans.",
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
