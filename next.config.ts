import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Évite le warning "multiple lockfiles detected" de Next.js 15 : on lui
  // dit explicitement que la racine du projet est le dossier courant.
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
