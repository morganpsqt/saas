import { View, Text, Pressable, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import type { DailyHabit } from '../../lib/db/queries-v2';
import {
  incrementWater,
  resetWater,
  updateTodayHabits,
  ensureTodayHabits,
} from '../../lib/db/queries-v2';

const WATER_GOAL_ML = 2000;
const WATER_STEP_ML = 250;

type Props = {
  userId: number;
  habit: DailyHabit | null;
  onChanged: (h: DailyHabit) => void;
};

export function HabitsTracker({ userId, habit, onChanged }: Props) {
  const [sleepStr, setSleepStr] = useState('');
  const [weightStr, setWeightStr] = useState('');

  useEffect(() => {
    if (habit) {
      setSleepStr(habit.sleep_hours !== null ? String(habit.sleep_hours) : '');
      setWeightStr(habit.weight_kg !== null ? String(habit.weight_kg) : '');
    }
  }, [habit?.id]);

  async function addWater() {
    const h = await incrementWater(userId, WATER_STEP_ML);
    onChanged(h);
  }

  async function clearWater() {
    const h = await resetWater(userId);
    onChanged(h);
  }

  async function saveSleep() {
    const v = parseFloat(sleepStr.replace(',', '.'));
    const h = await updateTodayHabits(userId, {
      sleep_hours: isNaN(v) ? null : v,
    });
    onChanged(h);
  }

  async function saveWeight() {
    const v = parseFloat(weightStr.replace(',', '.'));
    const h = await updateTodayHabits(userId, {
      weight_kg: isNaN(v) ? null : v,
    });
    onChanged(h);
  }

  async function setEnergy(val: number) {
    await ensureTodayHabits(userId);
    const h = await updateTodayHabits(userId, { energy_1_10: val });
    onChanged(h);
  }

  const waterMl = habit?.water_ml ?? 0;
  const waterPct = Math.min(100, Math.round((waterMl / WATER_GOAL_ML) * 100));
  const energy = habit?.energy_1_10 ?? null;

  return (
    <View className="bg-maya-panel rounded-2xl border border-maya-border p-4">
      <Text className="text-maya-text font-bold text-base mb-3">
        Mes habitudes du jour
      </Text>

      {/* Water */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <View className="flex-row items-center gap-2">
            <Text style={{ fontSize: 18 }}>💧</Text>
            <Text className="text-maya-text font-semibold">Eau</Text>
          </View>
          <Text className="text-maya-muted text-xs">
            {waterMl} / {WATER_GOAL_ML} ml
          </Text>
        </View>
        <View className="h-2 bg-maya-border rounded-full overflow-hidden mb-2">
          <View
            className="h-full bg-maya-accent"
            style={{ width: `${waterPct}%` }}
          />
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={addWater}
            className="bg-maya-accent px-3 py-1.5 rounded-lg flex-row items-center gap-1"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white text-xs font-semibold">+250 ml</Text>
          </Pressable>
          {waterMl > 0 ? (
            <Pressable
              onPress={clearWater}
              className="bg-maya-panelAlt px-3 py-1.5 rounded-lg"
            >
              <Text className="text-maya-muted text-xs">Reset</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Sleep + Weight (row) */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Text style={{ fontSize: 16 }}>😴</Text>
            <Text className="text-maya-muted text-xs font-medium">
              Sommeil (h)
            </Text>
          </View>
          <TextInput
            value={sleepStr}
            onChangeText={setSleepStr}
            onBlur={saveSleep}
            onSubmitEditing={saveSleep}
            placeholder="7.5"
            placeholderTextColor="#a8a29e"
            keyboardType="decimal-pad"
            className="bg-maya-bg border border-maya-border rounded-lg px-3 py-2 text-maya-text"
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Text style={{ fontSize: 16 }}>⚖️</Text>
            <Text className="text-maya-muted text-xs font-medium">
              Poids (kg)
            </Text>
          </View>
          <TextInput
            value={weightStr}
            onChangeText={setWeightStr}
            onBlur={saveWeight}
            onSubmitEditing={saveWeight}
            placeholder="72.0"
            placeholderTextColor="#a8a29e"
            keyboardType="decimal-pad"
            className="bg-maya-bg border border-maya-border rounded-lg px-3 py-2 text-maya-text"
          />
        </View>
      </View>

      {/* Energy */}
      <View>
        <View className="flex-row items-center gap-1.5 mb-2">
          <Text style={{ fontSize: 16 }}>⚡</Text>
          <Text className="text-maya-muted text-xs font-medium">
            Énergie {energy !== null ? `· ${energy}/10` : ''}
          </Text>
        </View>
        <View className="flex-row gap-1">
          {Array.from({ length: 10 }).map((_, i) => {
            const val = i + 1;
            const active = energy !== null && val <= energy;
            return (
              <Pressable
                key={val}
                onPress={() => setEnergy(val)}
                className={`flex-1 h-8 rounded-md border items-center justify-center ${
                  active
                    ? 'bg-maya-accent border-maya-accent'
                    : 'bg-maya-bg border-maya-border'
                }`}
                style={Platform.OS === 'web' ? { cursor: 'pointer' } as any : undefined}
              >
                <Text
                  className={`text-[11px] font-semibold ${
                    active ? 'text-white' : 'text-maya-muted'
                  }`}
                >
                  {val}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
