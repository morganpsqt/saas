import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStep } from '../../components/OnboardingStep';
import { FormField, OptionPill } from '../../components/FormField';
import { useUserStore } from '../../lib/store/user-store';

const PATTERNS = [
  { key: 'omnivore', label: 'Omnivore' },
  { key: 'flexitarien', label: 'Flexi' },
  { key: 'pescetarien', label: 'Pescétarien' },
  { key: 'vegetarien', label: 'Végé' },
  { key: 'vegan', label: 'Vegan' },
];

export default function Step3Nutrition() {
  const draft = useUserStore((s) => s.draft);
  const setDraft = useUserStore((s) => s.setDraft);

  return (
    <OnboardingStep
      step={3}
      total={5}
      title="Ton rapport à la bouffe"
      subtitle="Ce qu'on peut utiliser, ce qu'on doit éviter."
      secondaryLabel="Retour"
      onSecondary={() => router.back()}
      primaryLabel="Suivant"
      onPrimary={() => router.push('/(onboarding)/step-4-training')}
    >
      <FormField label="Régime alimentaire">
        <View className="flex-row flex-wrap gap-2">
          {PATTERNS.map((p) => (
            <OptionPill
              key={p.key}
              label={p.label}
              selected={draft.dietary_pattern === p.key}
              onPress={() => setDraft({ dietary_pattern: p.key })}
            />
          ))}
        </View>
      </FormField>

      <FormField
        label="Intolérances"
        placeholder="Ex : lactose, gluten"
        value={draft.intolerances ?? ''}
        onChangeText={(v) => setDraft({ intolerances: v })}
      />

      <FormField
        label="Aliments que tu détestes"
        placeholder="Ex : brocolis, foie, poisson"
        value={draft.disliked_foods ?? ''}
        onChangeText={(v) => setDraft({ disliked_foods: v })}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="Repas / jour"
            placeholder="3"
            keyboardType="numeric"
            value={draft.meals_per_day?.toString() ?? ''}
            onChangeText={(v) =>
              setDraft({ meals_per_day: v ? parseInt(v, 10) : undefined })
            }
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Min cuisine / jour"
            placeholder="30"
            keyboardType="numeric"
            value={draft.cooking_minutes_per_day?.toString() ?? ''}
            onChangeText={(v) =>
              setDraft({ cooking_minutes_per_day: v ? parseInt(v, 10) : undefined })
            }
          />
        </View>
      </View>

      <FormField
        label="Budget hebdo bouffe (€) — optionnel"
        placeholder="80"
        keyboardType="numeric"
        value={draft.weekly_food_budget?.toString() ?? ''}
        onChangeText={(v) =>
          setDraft({
            weekly_food_budget: v ? parseFloat(v.replace(',', '.')) : undefined,
          })
        }
      />

      <FormField
        label="Habitudes alimentaires actuelles"
        hint="Tes journées typiques, ce qui marche, ce qui t'énerve"
        placeholder="Ex : je saute souvent le petit-dej, je grignote le soir"
        multiline
        value={draft.current_habits_notes ?? ''}
        onChangeText={(v) => setDraft({ current_habits_notes: v })}
      />
    </OnboardingStep>
  );
}
