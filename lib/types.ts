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

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

export interface Subscription {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  setup_paid: boolean;
  created_at: string;
  updated_at: string;
}
