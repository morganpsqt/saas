import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { ChatBubble } from '../../components/ChatBubble';
import { useUserStore } from '../../lib/store/user-store';
import {
  addMessage,
  getAllMessages,
  type Message,
} from '../../lib/db/queries';
import { buildContext } from '../../lib/ai/context-builder';
import { sendMessage, isMockMode } from '../../lib/ai/gemini';

export default function ChatScreen() {
  const userId = useUserStore((s) => s.userId);
  const params = useLocalSearchParams<{ prefill?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);
  const appliedPrefillRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const all = await getAllMessages(userId);
    setMessages(all);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const pf = typeof params.prefill === 'string' ? params.prefill : null;
    if (pf && appliedPrefillRef.current !== pf) {
      appliedPrefillRef.current = pf;
      setInput(pf);
    }
  }, [params.prefill]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [messages.length]);

  async function handleSend() {
    const text = input.trim();
    if (!text || !userId || sending) return;
    setInput('');
    setSending(true);
    try {
      await addMessage(userId, 'user', text);
      const { dossier, history } = await buildContext(userId);
      const userMsgs = await getAllMessages(userId);
      setMessages(userMsgs);

      const reply = await sendMessage({
        dossier,
        history,
        userMessage: text,
      });

      await addMessage(userId, 'assistant', reply);
      const finalMsgs = await getAllMessages(userId);
      setMessages(finalMsgs);
    } catch (e: any) {
      await addMessage(
        userId,
        'assistant',
        `Oups, petit souci technique : ${String(e?.message ?? e)}`
      );
      const finalMsgs = await getAllMessages(userId);
      setMessages(finalMsgs);
    } finally {
      setSending(false);
    }
  }

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center bg-maya-bg">
        <Text className="text-maya-muted">Aucun dossier trouvé.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isMockMode ? (
          <View className="bg-maya-accentSoft border-b border-maya-border px-4 py-2">
            <Text className="text-maya-accentDark text-xs text-center font-medium">
              Mode démo (sans API) — les réponses sont simulées
            </Text>
          </View>
        ) : null}

        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-maya-accent text-3xl font-bold mb-2">Maya</Text>
            <Text className="text-maya-muted text-center">
              Ton coach t'attend. Dis-lui bonjour pour démarrer.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => <ChatBubble role={item.role} content={item.content} />}
            contentContainerStyle={{ paddingVertical: 12 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        {sending ? (
          <View className="flex-row items-center gap-2 px-6 pb-2">
            <ActivityIndicator color="#10b981" size="small" />
            <Text className="text-maya-muted text-sm">Maya écrit…</Text>
          </View>
        ) : null}

        <View className="flex-row items-end gap-2 px-4 py-3 border-t border-maya-border bg-maya-panel">
          <TextInput
            className="flex-1 bg-maya-bg border border-maya-border rounded-2xl px-4 py-3 text-maya-text max-h-32"
            placeholder="Écris à Maya…"
            placeholderTextColor="#a8a29e"
            value={input}
            onChangeText={setInput}
            multiline
            editable={!sending}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || sending}
            className={`px-5 py-3 rounded-2xl ${
              !input.trim() || sending ? 'bg-maya-border' : 'bg-maya-accent'
            }`}
          >
            <Text
              className={`font-semibold ${
                !input.trim() || sending ? 'text-maya-muted' : 'text-white'
              }`}
            >
              Envoyer
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
