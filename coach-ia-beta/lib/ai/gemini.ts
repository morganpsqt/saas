import type { Message } from '../db/queries';
import { MAYA_SYSTEM_PROMPT } from './system-prompt';
import { mockReply } from './mock';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const apiKeyClean = (apiKey ?? '').trim();

export const isMockMode = apiKeyClean === '';

type SendArgs = {
  dossier: string;
  history: Message[];
  userMessage: string;
};

export async function sendMessage({ dossier, history, userMessage }: SendArgs): Promise<string> {
  if (isMockMode) {
    return mockReply({ dossier, history, userMessage });
  }

  // Lazy import so the SDK isn't loaded in mock mode
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: apiKeyClean });

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const systemInstruction = `${MAYA_SYSTEM_PROMPT}\n\n${dossier}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    const text = res.text ?? '';
    return text || 'Désolée, je n\'ai pas de réponse pour l\'instant.';
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    console.warn('[Gemini] erreur, fallback mock:', msg);
    return mockReply({ dossier, history, userMessage });
  }
}

export function getAiMode(): 'mock' | 'gemini' {
  return isMockMode ? 'mock' : 'gemini';
}
