import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
} from 'react-native';

interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  chats: ChatHistoryItem[];
  onChatPress: (chatId: string) => void;
  onNewChat: () => void;
  onRenameChat: (chatId: string) => void;
}

export const ChatHistory = ({ 
  chats, 
  onChatPress, 
  onNewChat,
  onRenameChat 
}: ChatHistoryProps) => {
  const renderChatItem = ({ item }: { item: ChatHistoryItem }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => onChatPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.chatItemContent}>
        <Text style={styles.chatTitle}>{item.title}</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onRenameChat(item.id)}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* New Chat Button */}
      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={onNewChat}
        activeOpacity={0.7}
      >
        <Text style={styles.newChatIcon}>✏️</Text>
        <Text style={styles.newChatText}>New Chat</Text>
      </TouchableOpacity>

      {/* Chats Section */}
      <View style={styles.chatsSection}>
        <Text style={styles.sectionTitle}>Chats</Text>
        
        {chats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent chats</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  newChatIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  chatsSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  chatItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chatItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#999999',
  },
});