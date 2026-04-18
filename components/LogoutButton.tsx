"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <style>{`
        .logout-btn {
          font-size: 13px;
          color: rgba(247,245,242,0.45);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
          padding: 0;
        }
        .logout-btn:hover { color: #D2A050; }
      `}</style>
      <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
    </>
  );
}
