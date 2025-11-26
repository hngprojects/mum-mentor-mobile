import { colors } from "@/src/core/styles";
import { rfs, s, vs } from "@/src/core/styles/scaling";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Clipboard,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useChatList,
  useChatMessages,
  useCreateChat,
  useDeleteConversation,
  useRenameConversation,
  useSendAiMessage,
} from "../../core/hooks/useAiChat";
import { ChatInput } from "../components/chat/chat-Input";
import { ChatMessage } from "../components/chat/chat-Message";
import { ChatWelcome } from "../components/chat/chat-Welcome";
import { HistoryEmptyState } from "../components/chat/history-Empty-State";
import { MessageActions } from "../components/chat/message-Action";
import { TypingIndicator } from "../components/chat/typing-Indicator";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

interface StreamingMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isStreaming?: boolean;
}

export default function ChatScreen() {
  const [currentView, setCurrentView] = useState<"welcome" | "chat">("welcome");
  const { data: chats } = useChatList();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showHistoryEmpty, setShowHistoryEmpty] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const hasReceivedChunkRef = useRef(false);

  const createChat = useCreateChat();
  const sendMessage = useSendAiMessage();
  const deleteConversation = useDeleteConversation();
  const renameConversation = useRenameConversation();
  const { data: chatMessages } = useChatMessages(currentChat?.id);

  // Update currentChat title when messages are loaded
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

  // Handle sending a message
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
      if (!hasReceivedChunkRef.current) {
        Alert.alert("Error", "Failed to send message");
      }
      console.error(error);
    } finally {
      setIsAiSpeaking(false);
    }
  };

  // Handle category selection
  const handleCategoryPress = async (category: string) => {
    setInputText(category);
    setCurrentView("chat");

    if (!currentChat) {
      try {
        const newChat = await createChat.mutateAsync();
        setCurrentChat(newChat);
      } catch {
        Alert.alert("Error", "Failed to start chat");
      }
    }
  };

  // Handle new chat from history
  const handleNewChat = () => {
    setCurrentChat(null);
    setCurrentView("chat");
    setInputText("");
    setStreamingText("");
  };

  // Ask Anything opens the HistoryEmptyState modal
  const handleAskAnything = () => {
    setShowHistoryEmpty(true);
  };

  // Handle chat selection from history
  const handleChatPress = (chatId: string) => {
    const chat = chats?.conversations.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setCurrentView("chat");
      setStreamingText("");
    }
  };

  // Handle rename
  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await renameConversation.mutateAsync({
        conversation_id: chatId,
        newTitle,
      });

      // Update current chat if it's the one being renamed
      if (currentChat?.id === chatId) {
        setCurrentChat((prev) => (prev ? { ...prev, title: newTitle } : null));
      }

      Alert.alert("Success", "Chat renamed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to rename chat");
      console.error(error);
    }
  };

  // Handle delete
  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteConversation.mutateAsync(chatId);

      // success only if no error thrown:
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        setCurrentView("welcome");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete chat");
      console.error(error);
      throw error; // OPTIONAL but recommended
    }
  };

  // Message actions
  const handleLike = () => {
    Alert.alert("Liked", "Message feedback recorded");
  };

  const handleDislike = () => {
    Alert.alert("Disliked", "Message feedback recorded");
  };

  const handleRefresh = () => {
    Alert.alert("Refresh", "This would regenerate the last response");
  };

  const handleCopy = () => {
    const lastBotMessage = [...displayMessages]
      .reverse()
      .find((m) => !m.isUser);
    if (lastBotMessage) {
      Clipboard.setString(lastBotMessage.text);
      Alert.alert("Copied", "Message copied to clipboard");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            currentView === "welcome"
              ? router.back()
              : setCurrentView("welcome")
          }
          style={styles.backTouchable}
        >
          <Image
            source={require("../assets/images/ai-chat/Line-arrow-left.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {currentView === "welcome"
            ? "NORA"
            : currentChat?.title || "New Chat"}
        </Text>

        <TouchableOpacity onPress={() => setShowHistoryEmpty(true)}>
          <Image
            source={require("../assets/images/ai-chat/menu.png")}
            style={styles.menuButton}
          />
        </TouchableOpacity>
      </View>

      {/* History Empty State Modal */}
      <HistoryEmptyState
        visible={showHistoryEmpty}
        onClose={() => setShowHistoryEmpty(false)}
        onNewChat={handleNewChat}
        chats={chats?.conversations || []}
        onChatPress={handleChatPress}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Content Views */}
      {currentView === "welcome" && (
        <ChatWelcome
          userName="Tracy"
          onCategoryPress={handleCategoryPress}
          onAskAnything={handleAskAnything}
        />
      )}

      {currentView === "chat" && (
        <>
          <FlatList
            ref={flatListRef}
            data={displayMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessage
                message={item.text}
                isUser={item.isUser}
                link={item.link}
              />
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />

          {/* Show typing indicator when waiting for first chunk */}
          {isAiSpeaking && !streamingText && (
            <TypingIndicator isAiSpeaking={true} />
          )}

          {/* Message Actions */}
          {!isAiSpeaking && displayMessages.length > 0 && (
            <MessageActions
              onLike={handleLike}
              onDislike={handleDislike}
              onRefresh={handleRefresh}
              onCopy={handleCopy}
            />
          )}

          {/* Chat Input */}
          <ChatInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            isAiSpeaking={isAiSpeaking}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.textWhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(8),
    paddingVertical: vs(12),
  },
  backTouchable: {
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
  },
  backButton: {
    width: s(24),
    height: s(24),
  },
  headerTitle: {
    flex: 1,
    fontSize: rfs(18),
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "left",
    marginLeft: s(8),
  },
  menuButton: {
    width: s(24),
    height: s(24),
  },
  messagesList: {
    paddingVertical: vs(16),
  },
});
