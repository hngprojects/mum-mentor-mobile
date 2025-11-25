import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Clipboard,
  Alert,
} from "react-native";
import { ChatWelcome } from "../components/chat/chat-Welcome";
import { ChatMessage } from "../components/chat/chat-Message";
import { ChatInput } from "../components/chat/chat-Input";
import { MessageActions } from "../components/chat/message-Action";
import { TypingIndicator } from "../components/chat/typing-Indicator";
import { HistoryEmptyState } from "../components/chat/history-Empty-State";
import { colors } from "@/src/core/styles";
import { s, vs, rfs } from "@/src/core/styles/scaling";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  link?: {
    url: string;
    title: string;
  };
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export default function ChatScreen() {
  const [currentView, setCurrentView] = useState<"welcome" | "chat">("welcome");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showHistoryEmpty, setShowHistoryEmpty] = useState(false);

  // Handle sending a message
  const handleSend = () => {
    if (!inputText.trim() || isAiSpeaking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Create new chat if none exists
    if (!currentChat) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: inputText.trim().substring(0, 30) + (inputText.length > 30 ? "..." : ""),
        messages: [userMessage],
        timestamp: new Date(),
      };
      setCurrentChat(newChat);
      setChats((prev) => [newChat, ...prev]);
    } else {
      // Add to existing chat
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
      };
      setCurrentChat(updatedChat);
      
      // Update in chats list
      setChats((prev) =>
        prev.map((chat) => (chat.id === currentChat.id ? updatedChat : chat))
      );
    }

    setInputText("");
    setCurrentView("chat");
    setIsAiSpeaking(true);

    // Simulate AI response with link
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Here's something you might find helpful:",
        isUser: false,
        timestamp: new Date(),
        link: {
          url: "https://example.com/guide",
          title: "Making_Mealtimes_Fun_for_Picky_Eaters - CalmParent Guide"
        }
      };

      setCurrentChat((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          messages: [...prev.messages, botMessage],
        };
        
        // Update in chats list
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === prev.id ? updated : chat))
        );
        
        return updated;
      });
      
      setIsAiSpeaking(false);
    }, 2000);
  };

  // Handle category selection
  const handleCategoryPress = (category: string) => {
    setInputText(category);
    setShowHistoryEmpty(true);
  };

  // Handle new chat from history
  const handleNewChat = () => {
    setCurrentChat(null);
    setCurrentView("chat");
    setInputText("");
  };

  // Ask Anything opens the HistoryEmptyState modal
  const handleAskAnything = () => {
    setShowHistoryEmpty(true);
  };

  // Handle chat selection from history
  const handleChatPress = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setCurrentView("chat");
    }
  };

  // Handle rename - NOW takes chatId AND newTitle
  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
    if (currentChat?.id === chatId) {
      setCurrentChat((prev) => (prev ? { ...prev, title: newTitle } : null));
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
    setIsAiSpeaking(true);
    setTimeout(() => {
      Alert.alert("Refreshed", "New response generated");
      setIsAiSpeaking(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (currentChat && currentChat.messages.length > 0) {
      const lastBotMessage = [...currentChat.messages]
        .reverse()
        .find((m) => !m.isUser);
      if (lastBotMessage) {
        Clipboard.setString(lastBotMessage.text);
        Alert.alert("Copied", "Message copied to clipboard");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowHistoryEmpty(true)}
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
        chats={chats}
        onChatPress={handleChatPress}
        onRenameChat={handleRenameChat}
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
            data={currentChat?.messages || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <>
                <ChatMessage 
                  message={item.text} 
                  isUser={item.isUser}
                  link={item.link}
                />
                
                {/* Show typing indicator after last user message */}
                {item.isUser && 
                 index === (currentChat?.messages.length || 0) - 1 && 
                 isAiSpeaking && (
                  <TypingIndicator isAiSpeaking={true} />
                )}
              </>
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {!isAiSpeaking && currentChat && currentChat.messages.length > 0 && (
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