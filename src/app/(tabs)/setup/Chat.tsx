// src/app/(tabs)/chat.tsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Clipboard,
  Alert,
} from "react-native";
import { ChatWelcome } from "../../components/chat/chat-Welcome";
import { ChatHistory } from "../../components/chat/chat-history";
import { ChatMessage } from "../../components/chat/chat-Message";
import { ChatInput } from "../../components/chat/chat-Input";
import { MessageActions } from "../../components/chat/message-Action";
import { RenameChatModal } from "../../components/chat/rename-Modal";
import { TypingIndicator } from "../../components/chat/typing-Indicator";
import { HistoryEmptyState } from "../../components/chat/history-Empty-State";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export default function ChatScreen() {
  const [currentView, setCurrentView] = useState<
    "welcome" | "history" | "chat"
  >("welcome");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [chatToRename, setChatToRename] = useState<string | null>(null);
  const [showHistoryEmpty, setShowHistoryEmpty] = useState(false);

  // Handle sending a message
  const handleSend = () => {
    if (!inputText.trim()) return;

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
        title:
          inputText.trim().substring(0, 30) +
          (inputText.length > 30 ? "..." : ""),
        messages: [userMessage],
        timestamp: new Date(),
      };
      setCurrentChat(newChat);
      setChats((prev) => [newChat, ...prev]);
    } else {
      // Add to existing chat
      setCurrentChat((prev) => ({
        ...prev!,
        messages: [...prev!.messages, userMessage],
      }));
    }

    setInputText("");
    setCurrentView("chat");
    setIsAiSpeaking(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "That sounds tough. How long has this been happening?",
        isUser: false,
        timestamp: new Date(),
      };

      setCurrentChat((prev) => ({
        ...prev!,
        messages: [...prev!.messages, botMessage],
      }));
      setIsAiSpeaking(false);
    }, 2000);
  };

  // Handle category selection
  const handleCategoryPress = (category: string) => {
    setInputText(category);
  };

  // Handle new chat (from history empty state's New Chat)
  const handleNewChat = () => {
    // start fresh chat and go to chat view
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      timestamp: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChat(newChat);
    setInputText("");
    setCurrentView("chat");
    setShowHistoryEmpty(false);
  };

  // Ask Anything still opens the HistoryEmptyState modal (per your desired flow)
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

  // Handle rename
  const handleRenameChat = (chatId: string) => {
    setChatToRename(chatId);
    setRenameModalVisible(true);
  };

  const handleSaveRename = (newTitle: string) => {
    if (chatToRename) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatToRename ? { ...chat, title: newTitle } : chat
        )
      );
      if (currentChat?.id === chatToRename) {
        setCurrentChat((prev) => ({ ...prev!, title: newTitle }));
      }
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

  // Show history view (list)
  const showHistory = () => {
    setCurrentView("history");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back arrow opens HistoryEmptyState modal (per your request) */}
        <TouchableOpacity
          onPress={() => {
            setShowHistoryEmpty(true);
          }}
          style={styles.backTouchable}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>

        {/* Title sits beside arrow (left-aligned) */}
        <Text style={styles.headerTitle}>
          {currentView === "welcome"
            ? "NORA"
            : currentView === "history"
            ? "Baby Feeding Inquiry"
            : currentChat?.title || "New Chat"}
        </Text>

        <TouchableOpacity onPress={() => setShowHistoryEmpty(true)}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* HistoryEmptyState is available globally (can be opened by header or Ask Anything) */}
      <HistoryEmptyState
        visible={showHistoryEmpty}
        onClose={() => setShowHistoryEmpty(false)}
        onNewChat={() => {
          // When New Chat pressed inside the empty-state, create new chat & go to chat
          handleNewChat();
        }}
      />

      {/* Content Views */}
      {currentView === "welcome" && (
        <ChatWelcome
          userName="Tracy"
          onCategoryPress={handleCategoryPress}
          onAskAnything={handleAskAnything}
        />
      )}

      {currentView === "history" && (
        <ChatHistory
          chats={chats}
          onChatPress={handleChatPress}
          onNewChat={() => {
            // If user creates a chat from history list, create and go to chat
            handleNewChat();
          }}
          onRenameChat={handleRenameChat}
        />
      )}

      {currentView === "chat" && currentChat && (
        <>
          <FlatList
            data={currentChat.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessage message={item.text} isUser={item.isUser} />
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing indicator inside chat, right below messages */}
          <TypingIndicator isAiSpeaking={isAiSpeaking} />

          {!isAiSpeaking && currentChat.messages.length > 0 && (
            <MessageActions
              onLike={handleLike}
              onDislike={handleDislike}
              onRefresh={handleRefresh}
              onCopy={handleCopy}
            />
          )}
        </>
      )}

      {/* Chat input only in chat view */}
      {currentView === "chat" && (
        <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} />
      )}

      {/* Rename Modal */}
      <RenameChatModal
        visible={renameModalVisible}
        currentTitle={
          chatToRename
            ? chats.find((c) => c.id === chatToRename)?.title || ""
            : ""
        }
        onClose={() => setRenameModalVisible(false)}
        onSave={handleSaveRename}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backTouchable: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButton: {
    fontSize: 24,
    color: "#1A1A1A",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    // place title beside arrow
    textAlign: "left",
    marginLeft: 8,
  },
  menuButton: {
    fontSize: 24,
    color: "#1A1A1A",
    paddingHorizontal: 8,
  },
  messagesList: {
    paddingVertical: 16,
  },
});
