import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';

interface HistoryEmptyStateProps {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

export const HistoryEmptyState = ({ 
  visible, 
  onClose,
  onNewChat 
}: HistoryEmptyStateProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Semi-transparent background overlay */}
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* White content box at bottom */}
        <TouchableOpacity 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.contentBox}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999999"
            />
          </View>

          {/* New Chat Button - with bottom border only */}
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={() => {
              onNewChat();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.newChatIcon}>✏️</Text>
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>

          {/* No Recent Chats - Centered */}
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyText}>No recent chats</Text>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
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
  emptyStateContainer: {
    paddingVertical: 16,
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  emptyIcon: {
    fontSize: 24,
    marginRight: 12,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
});