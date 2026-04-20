import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStep } from '../../components/OnboardingStep';
import { FormField, OptionPill } from '../../components/FormField';
import { useUserStore } from '../../lib/store/user-store';

const ACTIVITY_LEVELS = [
  { key: 'sedentaire', label: 'Sédentaire' },
  { key: 'leger', label: 'Léger' },
  { key: 'modere', label: 'Modéré' },
  { key: 'actif', label: 'Actif' },
  { key: 'tres_actif', label: 'Très actif' },
];

export default function Step1Identity() {
  const draft = useUserStore((s) => s.draft);
  const setDraft = useUserStore((s) => s.setDraft);

  const valid =
    !!draft.first_name &&
    !!draft.date_of_birth &&
    !!draft.biological_sex &&
    !!draft.height_cm &&
    !!draft.weight_kg;

  return (
    <OnboardingStep
      step={1}
      total={5}
      title="Faisons connaissance"
      subtitle="Maya a besoin de quelques infos pour te calibrer."
      primaryLabel="Suivant"
      primaryDisabled={!valid}
      onPrimary={() => router.push('/(onboarding)/step-2-medical')}
    >
      <FormField
        label="Prénom"
        placeholder="Ex : Morgan"
        value={draft.first_name ?? ''}
        onChangeText={(v) => setDraft({ first_name: v })}
      />

      <FormField
        label="Date de naissance"
        hint="Format AAAA-MM-JJ"
        placeholder="1995-06-15"
        value={draft.date_of_birth ?? ''}
        onChangeText={(v) => setDraft({ date_of_birth: v })}
        autoCapitalize="none"
      />

      <FormField label="Sexe biologique">
        <View className="flex-row gap-2">
          <OptionPill
            label="Homme"
            selected={draft.biological_sex === 'male'}
            onPress={() => setDraft({ biological_sex: 'male' })}
          />
          <OptionPill
            label="Femme"
            selected={draft.biological_sex === 'female'}
            onPress={() => setDraft({ biological_sex: 'female' })}
          />
        </View>
      </FormField>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="Taille (cm)"
            placeholder="175"
            keyboardType="numeric"
            value={draft.height_cm?.toString() ?? ''}
            onChangeText={(v) => setDraft({ height_cm: v ? parseInt(v, 10) : undefined })}
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Poids (kg)"
            placeholder="72"
            keyboardType="numeric"
            value={draft.weight_kg?.toString() ?? ''}
            onChangeText={(v) =>
              setDraft({ weight_kg: v ? parseFloat(v.replace(',', '.')) : undefined })
            }
          />
        </View>
      </View>

      <FormField
        label="Masse grasse (%) — optionnel"
        placeholder="18"
        keyboardType="numeric"
        value={draft.body_fat_pct?.toString() ?? ''}
        onChangeText={(v) =>
          setDraft({ body_fat_pct: v ? parseFloat(v.replace(',', '.')) : undefined })
        }
      />

      <FormField label="Niveau d'activité quotidien (hors training)">
        <View className="flex-row flex-wrap gap-2">
          {ACTIVITY_LEVELS.map((a) => (
            <OptionPill
              key={a.key}
              label={a.label}
              selected={draft.activity_level === a.key}
              onPress={() => setDraft({ activity_level: a.key })}
            />
          ))}
        </View>
      </FormField>
    </OnboardingStep>
  );
}
