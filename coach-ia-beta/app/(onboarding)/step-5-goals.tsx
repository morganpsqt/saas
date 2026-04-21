import { useState } from 'react';
import { View, Alert } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStep } from '../../components/OnboardingStep';
import { FormField, OptionPill } from '../../components/FormField';
import { useUserStore } from '../../lib/store/user-store';
import {
  createProfile,
  upsertMedical,
  upsertNutrition,
  upsertTraining,
  createGoal,
} from '../../lib/db/queries';
import { detectRedFlags, serializeFlags } from '../../lib/ai/red-flags';

const GOALS = [
  { key: 'perte', label: 'Perte (sèche)' },
  { key: 'prise_masse', label: 'Prise de masse' },
  { key: 'recomposition', label: 'Recompo' },
  { key: 'performance', label: 'Performance' },
  { key: 'maintien', label: 'Maintien / santé' },
];

export default function Step5Goals() {
  const draft = useUserStore((s) => s.draft);
  const setDraft = useUserStore((s) => s.setDraft);
  const setUserId = useUserStore((s) => s.setUserId);
  const resetDraft = useUserStore((s) => s.resetDraft);
  const [saving, setSaving] = useState(false);

  async function finish() {
    if (!draft.goal_type) return;
    setSaving(true);
    try {
      const userId = await createProfile({
        first_name: draft.first_name,
        date_of_birth: draft.date_of_birth,
        biological_sex: draft.biological_sex,
        height_cm: draft.height_cm ?? null,
        weight_kg: draft.weight_kg ?? null,
        body_fat_pct: draft.body_fat_pct ?? null,
        activity_level: draft.activity_level,
      });

      const flags = detectRedFlags({
        date_of_birth: draft.date_of_birth,
        height_cm: draft.height_cm,
        weight_kg: draft.weight_kg,
        pregnancy_or_lactation: draft.pregnancy_or_lactation,
        medications: draft.medications,
        free_text: draft.medical_free_text,
        goal_type: draft.goal_type,
      });

      await upsertMedical(userId, {
        conditions: draft.conditions,
        medications: draft.medications,
        injuries: draft.injuries,
        allergies: draft.allergies,
        menstrual_cycle_regular:
          draft.menstrual_cycle_regular === undefined
            ? null
            : draft.menstrual_cycle_regular
            ? 1
            : 0,
        pregnancy_or_lactation: draft.pregnancy_or_lactation ? 1 : 0,
        red_flags: serializeFlags(flags),
        free_text: draft.medical_free_text,
      });

      await upsertNutrition(userId, {
        dietary_pattern: draft.dietary_pattern,
        intolerances: draft.intolerances,
        disliked_foods: draft.disliked_foods,
        meals_per_day: draft.meals_per_day,
        cooking_minutes_per_day: draft.cooking_minutes_per_day,
        weekly_food_budget: draft.weekly_food_budget,
        current_habits_notes: draft.current_habits_notes,
      });

      await upsertTraining(userId, {
        experience_years: draft.experience_years,
        equipment: draft.equipment,
        sessions_per_week: draft.sessions_per_week,
        max_session_minutes: draft.max_session_minutes,
        preferences: draft.training_preferences,
        injuries_to_respect: draft.injuries_to_respect,
      });

      await createGoal(userId, {
        goal_type: draft.goal_type,
        target_date: draft.target_date,
        target_metric: draft.target_metric,
        motivation_text: draft.motivation_text,
      });

      setUserId(userId);
      resetDraft();
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erreur', String(e?.message ?? e));
      setSaving(false);
    }
  }

  return (
    <OnboardingStep
      step={5}
      total={5}
      title="Ton objectif"
      subtitle="On part sur quoi ?"
      secondaryLabel="Retour"
      onSecondary={() => router.back()}
      primaryLabel={saving ? 'Sauvegarde…' : 'Terminer'}
      primaryDisabled={!draft.goal_type || saving}
      onPrimary={finish}
    >
      <FormField label="Type d'objectif">
        <View className="flex-row flex-wrap gap-2">
          {GOALS.map((g) => (
            <OptionPill
              key={g.key}
              label={g.label}
              selected={draft.goal_type === g.key}
              onPress={() => setDraft({ goal_type: g.key })}
            />
          ))}
        </View>
      </FormField>

      <FormField
        label="Cible mesurable"
        hint="Poids cible, tour de taille, perf… ce que tu veux."
        placeholder="Ex : 68 kg, ou 100kg au DC"
        value={draft.target_metric ?? ''}
        onChangeText={(v) => setDraft({ target_metric: v })}
      />

      <FormField
        label="Échéance (optionnel)"
        hint="Format AAAA-MM-JJ"
        placeholder="2026-12-31"
        value={draft.target_date ?? ''}
        onChangeText={(v) => setDraft({ target_date: v })}
        autoCapitalize="none"
      />

      <FormField
        label="Ta motivation profonde"
        hint="Pourquoi c'est important pour toi ? Maya s'en souviendra."
        placeholder="Ex : me sentir bien dans mon corps, tenir sur la durée"
        multiline
        value={draft.motivation_text ?? ''}
        onChangeText={(v) => setDraft({ motivation_text: v })}
      />
    </OnboardingStep>
  );
}
