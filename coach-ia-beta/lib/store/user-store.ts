import { create } from 'zustand';

type OnboardingDraft = {
  // step 1 — identity
  first_name?: string;
  date_of_birth?: string;
  biological_sex?: 'male' | 'female';
  height_cm?: number;
  weight_kg?: number;
  body_fat_pct?: number;
  activity_level?: string;

  // step 2 — medical
  conditions?: string;
  medications?: string;
  injuries?: string;
  allergies?: string;
  menstrual_cycle_regular?: boolean;
  pregnancy_or_lactation?: boolean;
  medical_free_text?: string;

  // step 3 — nutrition
  dietary_pattern?: string;
  intolerances?: string;
  disliked_foods?: string;
  meals_per_day?: number;
  cooking_minutes_per_day?: number;
  weekly_food_budget?: number;
  current_habits_notes?: string;

  // step 4 — training
  experience_years?: number;
  equipment?: string;
  sessions_per_week?: number;
  max_session_minutes?: number;
  training_preferences?: string;
  injuries_to_respect?: string;

  // step 5 — goals
  goal_type?: string;
  target_date?: string;
  target_metric?: string;
  motivation_text?: string;
};

type State = {
  userId: number | null;
  setUserId: (id: number | null) => void;

  draft: OnboardingDraft;
  setDraft: (patch: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
};

export const useUserStore = create<State>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),

  draft: {},
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  resetDraft: () => set({ draft: {} }),
}));
