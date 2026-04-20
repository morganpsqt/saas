import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStep } from '../../components/OnboardingStep';
import { FormField, OptionPill } from '../../components/FormField';
import { useUserStore } from '../../lib/store/user-store';

export default function Step2Medical() {
  const draft = useUserStore((s) => s.draft);
  const setDraft = useUserStore((s) => s.setDraft);
  const isFemale = draft.biological_sex === 'female';

  return (
    <OnboardingStep
      step={2}
      total={5}
      title="Dossier médical"
      subtitle="Pour t'accompagner en sécurité. Tout reste sur ton appareil."
      secondaryLabel="Retour"
      onSecondary={() => router.back()}
      primaryLabel="Suivant"
      onPrimary={() => router.push('/(onboarding)/step-3-nutrition')}
    >
      <FormField
        label="Conditions médicales"
        hint="Diabète, hypertension, thyroïde, etc. Laisse vide si rien."
        placeholder="Ex : aucune"
        multiline
        value={draft.conditions ?? ''}
        onChangeText={(v) => setDraft({ conditions: v })}
      />

      <FormField
        label="Médicaments"
        hint="Traitements en cours"
        placeholder="Ex : aucun"
        multiline
        value={draft.medications ?? ''}
        onChangeText={(v) => setDraft({ medications: v })}
      />

      <FormField
        label="Blessures / douleurs"
        hint="Actuelles ou chroniques, à respecter à l'entraînement"
        placeholder="Ex : genou gauche sensible en flexion profonde"
        multiline
        value={draft.injuries ?? ''}
        onChangeText={(v) => setDraft({ injuries: v })}
      />

      <FormField
        label="Allergies"
        placeholder="Ex : arachide, lactose"
        value={draft.allergies ?? ''}
        onChangeText={(v) => setDraft({ allergies: v })}
      />

      {isFemale ? (
        <>
          <FormField label="Cycle menstruel régulier ?">
            <View className="flex-row gap-2">
              <OptionPill
                label="Oui"
                selected={draft.menstrual_cycle_regular === true}
                onPress={() => setDraft({ menstrual_cycle_regular: true })}
              />
              <OptionPill
                label="Non"
                selected={draft.menstrual_cycle_regular === false}
                onPress={() => setDraft({ menstrual_cycle_regular: false })}
              />
            </View>
          </FormField>

          <FormField label="Grossesse ou allaitement ?">
            <View className="flex-row gap-2">
              <OptionPill
                label="Oui"
                selected={draft.pregnancy_or_lactation === true}
                onPress={() => setDraft({ pregnancy_or_lactation: true })}
              />
              <OptionPill
                label="Non"
                selected={draft.pregnancy_or_lactation === false}
                onPress={() => setDraft({ pregnancy_or_lactation: false })}
              />
            </View>
          </FormField>
        </>
      ) : null}

      <FormField
        label="Autre chose à partager (optionnel)"
        hint="Rapport à la nourriture, historique, état mental récent… Tout reste privé."
        placeholder="Ex : j'ai tendance à me restreindre quand je stresse"
        multiline
        value={draft.medical_free_text ?? ''}
        onChangeText={(v) => setDraft({ medical_free_text: v })}
      />
    </OnboardingStep>
  );
}
