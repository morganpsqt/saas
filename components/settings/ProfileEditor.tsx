"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/profiles";

const MAX_BYTES = 2 * 1024 * 1024;

export default function ProfileEditor({ profile, defaultEmail }: { profile: Profile | null; defaultEmail: string }) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [companyName, setCompanyName] = useState(profile?.company_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [contactEmail, setContactEmail] = useState(profile?.contact_email ?? defaultEmail);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: displayName || null,
        company_name: companyName || null,
        phone: phone || null,
        contact_email: contactEmail || null,
        avatar_url: avatarUrl,
      }),
    });
    setSaving(false);
    if (res.ok) toast.success("Profil enregistré");
    else toast.error("Enregistrement impossible");
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error("Image trop lourde (max 2 Mo)");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Session expirée");
      setUploading(false);
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      cacheControl: "3600",
    });
    if (error) {
      toast.error(`Upload impossible : ${error.message}`);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl);
    setUploading(false);
    toast.success("Image uploadée — n'oubliez pas d'enregistrer");
  }

  async function removeAvatar() {
    setAvatarUrl(null);
  }

  const initials = (displayName || defaultEmail).slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        .prof-card { background:#fff; border:1px solid #ECEAE6; border-radius:14px; padding:28px; max-width:640px; }
        .prof-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px; }
        @media (max-width:640px) { .prof-row { grid-template-columns:1fr; } }
        .prof-group { margin-bottom:18px; }
        .prof-label { display:block; font-size:12px; font-weight:500; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
        .prof-input {
          width:100%; padding:11px 14px; border:1.5px solid #E0DDD8; border-radius:10px;
          font-size:14px; font-family:inherit; color:#1C2B1A; background:#fff; outline:none;
          box-sizing:border-box; transition:border-color 0.15s;
        }
        .prof-input:focus { border-color:#1C2B1A; }
        .prof-avatar { display:flex; align-items:center; gap:18px; margin-bottom:24px; }
        .prof-img {
          width:72px; height:72px; border-radius:50%; overflow:hidden;
          background:#FAF6EE; border:2px solid #EFD9B1;
          display:flex; align-items:center; justify-content:center;
          font-family:'Fraunces', serif; font-size:22px; color:#8A5A1A;
          flex-shrink: 0;
        }
        .prof-img img { width:100%; height:100%; object-fit:cover; }
        .prof-avatar-info { flex:1; }
        .prof-hint { font-size:12px; color:#9A9A9A; margin-top:4px; }
        .prof-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:8px; padding-top:18px; border-top:1px solid #F0EDE8; }
        .prof-btn {
          padding:10px 18px; border-radius:10px; font-size:13px; cursor:pointer;
          font-family:inherit; border:1px solid #D9D5CC; background:#fff; color:#1C2B1A;
        }
        .prof-btn:hover:not(:disabled) { background:#F7F5F2; }
        .prof-btn.primary { background:#1C2B1A; color:#F7F5F2; border-color:#1C2B1A; }
        .prof-btn.primary:hover:not(:disabled) { background:#2C3F2A; }
        .prof-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .prof-btn.danger { color:#B84040; border-color:#F3C8C8; background:#fff; }
        .prof-btn.danger:hover { background:#FEECEC; }
      `}</style>

      <div className="prof-card">
        <div className="prof-avatar">
          <div className="prof-img">
            {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : initials}
          </div>
          <div className="prof-avatar-info">
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="prof-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? "Upload…" : avatarUrl ? "Changer l'image" : "Uploader un logo"}
              </button>
              {avatarUrl && (
                <button className="prof-btn danger" onClick={removeAvatar}>Retirer</button>
              )}
            </div>
            <div className="prof-hint">JPG, PNG — 2 Mo maximum. Utilisé comme signature visuelle.</div>
          </div>
        </div>

        <div className="prof-row">
          <div>
            <label className="prof-label">Nom affiché</label>
            <input className="prof-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jean Martin" />
          </div>
          <div>
            <label className="prof-label">Nom d'entreprise</label>
            <input className="prof-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Martin Plomberie" />
          </div>
        </div>

        <div className="prof-row">
          <div>
            <label className="prof-label">Téléphone</label>
            <input className="prof-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" />
          </div>
          <div>
            <label className="prof-label">Email de contact</label>
            <input className="prof-input" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@votre-domaine.fr" />
          </div>
        </div>

        <div className="prof-actions">
          <button className="prof-btn primary" onClick={save} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </>
  );
}
