import {
  useChatMessages,
  useCreateChat,
  useSendAiMessage,
} from "@/src/core/hooks/useAiChat";
import { colors } from "@/src/core/styles";
import { rbr, rfs, s, vs } from "@/src/core/styles/scaling";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { ChatInterface, StreamingMessage } from "../../(tabs)/AiChat";
import { CategoryButton } from "./category-Button";
import { ChatInput } from "./chat-Input";

interface ChatWelcomeProps {
  userName: string;
  onCategoryPress: (category: string) => void;
  onAskAnything?: () => void;
}

export const ChatWelcome = ({
  userName,
  onCategoryPress,
  onAskAnything,
}: ChatWelcomeProps) => {
  const categories = [
    { id: "1", title: "Self-Care Routine 🌸" },
    { id: "2", title: "Motivation 🧠" },
    { id: "3", title: "New Mom Tip 🤱" },
    { id: "4", title: "Parenting Tip 💕" },
    { id: "5", title: "Baby Care 👶" },
    { id: "6", title: "Night Routine 🌙" },
  ];
  const [inputText, setInputText] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatInterface | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const { data: chatMessages } = useChatMessages(currentChat?.id);

  const flatListRef = useRef<FlatList>(null);
  const hasReceivedChunkRef = useRef(false);

  const createChat = useCreateChat();
  const sendMessage = useSendAiMessage();

  const handleSend = async () => {
    if (!inputText.trim() || isAiSpeaking) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsAiSpeaking(true);
    setStreamingText("");

    hasReceivedChunkRef.current = false;

    try {
      let chatId = currentChat?.id;

      if (!chatId) {
        const newChat = await createChat.mutateAsync();
        chatId = newChat.id;
        setCurrentChat(newChat);
      }

      await sendMessage.mutateAsync({
        session_id: chatId!,
        message: userMessage,
        onChunk: (chunk: string) => {
          hasReceivedChunkRef.current = true;
          setStreamingText((prev) => prev + chunk);
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },

        onComplete: () => {
          setStreamingText("");
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiSpeaking(false);
    }
  };

  useEffect(() => {
    if (
      chatMessages?.conversation &&
      currentChat?.id === chatMessages.conversation.id
    ) {
      setCurrentChat(chatMessages.conversation);
    }
  }, [chatMessages?.conversation, currentChat?.id]);

  // Combine real messages with streaming message
  const displayMessages: StreamingMessage[] = [
    ...(chatMessages?.messages || []),
    ...(streamingText
      ? [
          {
            id: "streaming",
            text: streamingText,
            isUser: false,
            timestamp: new Date().toISOString(),
            isStreaming: true,
          },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image
          source={require("../../assets/images/ai-chat/Group-2.png")}
          style={styles.topIcon}
        />
      </View>

      <Text style={styles.greeting}>Hi{` ${userName}`}, how</Text>
      <Text style={styles.greeting}>can I help today?</Text>

      <View style={styles.grid}>
        {categories.map((item) => (
          <CategoryButton
            key={item.id}
            title={item.title}
            onPress={() => onCategoryPress(item.title)}
          />
        ))}
      </View>

      {/* <TouchableOpacity style={styles.askButton} onPress={onAskAnything}>
        <Text style={styles.askButtonText}>Ask Anything</Text>
      </TouchableOpacity> */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        isAiSpeaking={isAiSpeaking}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: s(16),
    paddingTop: vs(60),
  },

  iconWrapper: {
    alignItems: "center",
    marginBottom: vs(24),
  },

  topIcon: {
    width: s(68),
    height: s(68),
    resizeMode: "contain",
  },

  greeting: {
    fontSize: rfs(26),
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
    letterSpacing: -0.2,
  },

  grid: {
    marginTop: vs(36),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    flexGrow: 1, // pushes Ask Anything button to bottom
  },

  askButton: {
    backgroundColor: colors.primary,
    paddingVertical: vs(14),
    borderRadius: rbr(12),

    // Make button stick to bottom with spacing
    marginBottom: vs(50),
  },

  askButtonText: {
    fontSize: rfs(18),
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  messagesList: {
    paddingVertical: vs(16),
  },
});
