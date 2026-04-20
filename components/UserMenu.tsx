"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu({ email, avatarUrl, displayName }: { email: string; avatarUrl: string | null; displayName: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (displayName || email).slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        .um-wrap { position: relative; }
        .um-trigger {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          font-family: inherit; padding: 4px; border-radius: 999px;
        }
        .um-trigger:hover { background: rgba(247,245,242,0.08); }
        .um-avatar {
          width: 32px; height: 32px; border-radius: 50%; overflow: hidden;
          background: #D2A050; display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #1C2B1A; font-weight: 600; flex-shrink: 0;
        }
        .um-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .um-caret { color: rgba(247,245,242,0.45); font-size: 10px; }
        .um-menu {
          position: absolute; right: 0; top: calc(100% + 8px);
          background: #fff; border: 1px solid #ECEAE6; border-radius: 12px;
          min-width: 220px; padding: 6px; z-index: 40;
          box-shadow: 0 12px 40px rgba(28,43,26,0.14);
        }
        .um-email { padding: 10px 12px; font-size: 12px; color: #9A9A9A; border-bottom: 1px solid #F0EDE8; margin-bottom: 4px; word-break: break-all; }
        .um-item {
          display: block; width: 100%; text-align: left;
          padding: 9px 12px; font-size: 13.5px; color: #1C2B1A;
          text-decoration: none; background: none; border: none; cursor: pointer;
          font-family: inherit; border-radius: 8px;
        }
        .um-item:hover { background: #F7F5F2; }
        .um-item.danger { color: #B84040; }
        .um-sep { height: 1px; background: #F0EDE8; margin: 4px 0; }
      `}</style>
      <div className="um-wrap" ref={ref}>
        <button className="um-trigger" onClick={() => setOpen((o) => !o)}>
          <span className="um-avatar">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
          </span>
          <span className="um-caret">▼</span>
        </button>
        {open && (
          <div className="um-menu">
            <div className="um-email">{email}</div>
            <Link className="um-item" href="/app/parametres/profil" onClick={() => setOpen(false)}>
              👤 Mon profil
            </Link>
            <Link className="um-item" href="/app/parametres/emails" onClick={() => setOpen(false)}>
              ✉ Personnaliser les emails
            </Link>
            <div className="um-sep" />
            <button className="um-item danger" onClick={handleLogout}>Déconnexion</button>
          </div>
        )}
      </div>
    </>
  );
}
