import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { colors, typography } from "@/src/core/styles";
import { s, vs, rbr } from "@/src/core/styles/scaling";

interface ChatItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface HistoryEmptyStateProps {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  chats: ChatItem[];
  onChatPress: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export const HistoryEmptyState = ({
  visible,
  onClose,
  onNewChat,
  chats,
  onChatPress,
  onRenameChat,
}: HistoryEmptyStateProps) => {
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  const startRenaming = (chatId: string, currentTitle: string) => {
    setRenamingChatId(chatId);
    setRenameTitle(currentTitle);
  };

  const cancelRenaming = () => {
    setRenamingChatId(null);
    setRenameTitle("");
  };

  const saveRename = () => {
    if (renamingChatId && renameTitle.trim()) {
      onRenameChat(renamingChatId, renameTitle.trim());
      setRenamingChatId(null);
      setRenameTitle("");
    }
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        onChatPress(item.id);
        onClose();
      }}
      activeOpacity={0.7}
      disabled={renamingChatId !== null}
    >
      <View style={styles.chatItemContent}>
        <Text style={styles.chatTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            startRenaming(item.id, item.title);
          }}
        >
          <Image
            source={require("../../assets/images/ai-chat/edit-2.png")}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Show rename view when renaming
  if (renamingChatId) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.renameContentBox}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Rename Title Header */}
            <Text style={styles.renameTitle}>Rename Title</Text>
            <Text style={styles.renameSubtitle}>Edit your title name</Text>

            {/* Title Input with Icon */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title Name</Text>
              <View style={styles.inputWrapper}>
                <Image
                  source={require("../../assets/images/ai-chat/edit-2.png")}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={renameTitle}
                  onChangeText={setRenameTitle}
                  placeholder="Baby Feeding Inquiry"
                  placeholderTextColor={colors.textGrey1}
                  autoFocus
                />
              </View>
            </View>

            {/* Buttons - Stacked Vertically */}
            <View style={styles.renameButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelRenaming}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveRename}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }

  // Normal view (search, new chat, list)
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.contentBox}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Image
              source={require("../../assets/images/ai-chat/search-normal.png")}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.textGrey1}
            />
          </View>

          {/* New Chat Button */}
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              onNewChat();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/ai-chat/edit.png")}
              style={styles.newChatIcon}
            />
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>

          {chats.length === 0 ? (
            // Empty State
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyState}>
                <Image
                  source={require("../../assets/images/ai-chat/message-remove.png")}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>No recent chats</Text>
              </View>
            </View>
          ) : (
            // Chat List
            <View style={styles.chatsContainer}>
              <Text style={styles.chatsLabel}>Chats</Text>
              <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  contentBox: {
    backgroundColor: colors.textWhite,
    borderTopLeftRadius: rbr(24),
    borderTopRightRadius: rbr(24),
    paddingTop: vs(12),
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
    maxHeight: "70%",
  },
  renameContentBox: {
    backgroundColor: colors.textWhite,
    borderTopLeftRadius: rbr(24),
    borderTopRightRadius: rbr(24),
    paddingTop: vs(12),
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
  },
  dragHandle: {
    width: s(40),
    height: vs(4),
    backgroundColor: colors.outlineVariant,
    borderRadius: rbr(2),
    alignSelf: "center",
    marginBottom: vs(20),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textWhite,
    borderRadius: rbr(12),
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: "#D5D5D5",
  },
  searchIcon: {
    width: s(20),
    height: s(20),
    marginRight: s(10),
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(16),
    paddingHorizontal: s(4),
    backgroundColor: colors.textWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.disabledBorder,
    marginBottom: vs(8),
  },
  newChatIcon: {
    width: s(20),
    height: s(20),
    marginRight: s(12),
  },
  newChatText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  emptyStateContainer: {
    paddingVertical: vs(32),
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: s(4),
  },
  emptyIcon: {
    width: s(20),
    height: s(20),
    marginRight: s(12),
    opacity: 0.5,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textGrey1,
  },

  // Chat List
  chatsContainer: {
    flex: 1,
    marginTop: vs(8),
  },
  chatsLabel: {
    ...typography.labelMedium,
    color: colors.textGrey1,
    marginBottom: vs(12),
    paddingHorizontal: s(4),
  },
  chatItem: {
    paddingVertical: vs(12),
    paddingHorizontal: s(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.disabledBorder,
  },
  chatItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatTitle: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  editButton: {
    padding: s(4),
  },
  editIcon: {
    width: s(20),
    height: s(20),
  },

  // Rename View
  renameTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: vs(4),
    textAlign: "center",
  },
  renameSubtitle: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginBottom: vs(32),
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: vs(32),
  },
  inputLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: vs(12),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundMain,
    borderRadius: rbr(12),
    paddingHorizontal: s(16),
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
  },
  inputIcon: {
    width: s(20),
    height: s(20),
    marginRight: s(12),
  },
  input: {
    flex: 1,
    paddingVertical: vs(14),
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  renameButtons: {
    gap: vs(16),
  },
  cancelButton: {
    width: "100%",
    paddingVertical: vs(16),
    borderRadius: rbr(14),
    backgroundColor: colors.textWhite,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  cancelButtonText: {
    ...typography.buttonText,
    color: colors.textPrimary,
  },
  saveButton: {
    width: "100%",
    paddingVertical: vs(16),
    borderRadius: rbr(14),
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  saveButtonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },
});