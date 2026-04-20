import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStep } from '../../components/OnboardingStep';
import { FormField } from '../../components/FormField';
import { useUserStore } from '../../lib/store/user-store';

export default function Step4Training() {
  const draft = useUserStore((s) => s.draft);
  const setDraft = useUserStore((s) => s.setDraft);

  return (
    <OnboardingStep
      step={4}
      total={5}
      title="Ton entraînement"
      subtitle="Ton expérience, ton matos, ton temps dispo."
      secondaryLabel="Retour"
      onSecondary={() => router.back()}
      primaryLabel="Suivant"
      onPrimary={() => router.push('/(onboarding)/step-5-goals')}
    >
      <FormField
        label="Expérience musculation (années)"
        placeholder="2"
        keyboardType="numeric"
        value={draft.experience_years?.toString() ?? ''}
        onChangeText={(v) =>
          setDraft({ experience_years: v ? parseFloat(v.replace(',', '.')) : undefined })
        }
      />

      <FormField
        label="Équipement disponible"
        hint="Salle complète, home-gym, élastiques, poids du corps…"
        placeholder="Ex : home-gym barre + 100kg + élastiques"
        multiline
        value={draft.equipment ?? ''}
        onChangeText={(v) => setDraft({ equipment: v })}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="Séances / semaine"
            placeholder="3"
            keyboardType="numeric"
            value={draft.sessions_per_week?.toString() ?? ''}
            onChangeText={(v) =>
              setDraft({ sessions_per_week: v ? parseInt(v, 10) : undefined })
            }
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Durée max (min)"
            placeholder="60"
            keyboardType="numeric"
            value={draft.max_session_minutes?.toString() ?? ''}
            onChangeText={(v) =>
              setDraft({ max_session_minutes: v ? parseInt(v, 10) : undefined })
            }
          />
        </View>
      </View>

      <FormField
        label="Préférences d'entraînement"
        hint="Ce que tu aimes ou détestes"
        placeholder="Ex : j'aime le squat, je déteste le cardio sur tapis"
        multiline
        value={draft.training_preferences ?? ''}
        onChangeText={(v) => setDraft({ training_preferences: v })}
      />

      <FormField
        label="Blessures à respecter"
        hint="Mouvements à éviter"
        placeholder="Ex : éviter la compression lombaire"
        multiline
        value={draft.injuries_to_respect ?? ''}
        onChangeText={(v) => setDraft({ injuries_to_respect: v })}
      />
    </OnboardingStep>
  );
}
