"use client";

function pickGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Vous travaillez tard";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

function extractName(email: string): string {
  if (!email) return "";
  const local = email.split("@")[0] ?? "";
  const first = local.split(/[._+-]/)[0] ?? "";
  if (!first) return "";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default function DashboardGreeting({ email }: { email: string }) {
  const name = extractName(email);
  const greeting = pickGreeting();
  return (
    <>
      <style>{`
        .dash-greeting {
          font-size: 13px;
          color: #9A9A9A;
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }
        .dash-greeting span { color: #1C2B1A; font-weight: 500; }
        .wave { display: inline-block; animation: wave 1.8s ease-in-out infinite; transform-origin: 70% 70%; }
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
      <p className="dash-greeting">
        {greeting}{name ? <> <span>{name}</span></> : ""} <span className="wave">👋</span>
      </p>
    </>
  );
}
