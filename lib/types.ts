export type Statut = "en_attente" | "relance" | "gagne" | "perdu";

export interface Devis {
  id: string;
  user_id: string;
  nom_client: string;
  email_client: string;
  montant: number;
  date_envoi: string;
  statut: Statut;
  nb_relances: number;
  derniere_relance_at: string | null;
  created_at: string;
  updated_at: string;
}
