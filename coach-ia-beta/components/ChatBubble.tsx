import { View, Text } from 'react-native';

type Props = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatBubble({ role, content }: Props) {
  const isUser = role === 'user';
  return (
    <View
      className={`mb-3 ${isUser ? 'items-end' : 'items-start'} px-4`}
      style={{ width: '100%' }}
    >
      <View
        className={`rounded-2xl px-4 py-3 max-w-[85%] ${
          isUser
            ? 'bg-maya-accent rounded-br-md'
            : 'bg-maya-panel border border-maya-border rounded-bl-md'
        }`}
      >
        {!isUser ? (
          <Text className="text-maya-accent text-xs font-semibold mb-1">Maya</Text>
        ) : null}
        <Text
          className={`text-base ${isUser ? 'text-black' : 'text-maya-text'}`}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}
