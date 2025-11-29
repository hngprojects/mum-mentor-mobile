import {colors, typography} from "@/src/core/styles";
import {rbr, s, vs} from "@/src/core/styles/scaling";
import {showToast} from "@/src/core/utils/toast";
import React, {useState} from "react";
import {FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {useKeyboardState} from "react-native-keyboard-controller";

interface ChatItem {
    id: string;
    title: string;
    created_at: string;
}

interface HistoryEmptyStateProps {
    visible: boolean;
    onClose: () => void;
    onNewChat: () => void;
    chats: ChatItem[];
    onChatPress: (chatId: string) => void;
    onRenameChat: (chatId: string, newTitle: string) => Promise<void>;
    onDeleteChat: (chatId: string) => Promise<void>;
}

type ModalView = "list" | "rename" | "delete" | "success";

export const HistoryEmptyState = (
    {
        visible,
        onClose,
        onNewChat,
        chats,
        onChatPress,
        onRenameChat,
        onDeleteChat,
    }: HistoryEmptyStateProps
) => {
    const [currentView, setCurrentView] = useState<ModalView>("list");
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [renameTitle, setRenameTitle] = useState("");

    // Sort chats by created_at in descending order (newest first)
    const sortedChats = [...(chats || [])].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const startRenaming = (chatId: string, currentTitle: string) => {
        setSelectedChatId(chatId);
        setRenameTitle(currentTitle);
        setCurrentView("rename");
    };

    const startDeleting = (chatId: string) => {
        setSelectedChatId(chatId);
        setCurrentView("delete");
    };

    const cancelAction = () => {
        setCurrentView("list");
        setSelectedChatId(null);
        setRenameTitle("");
    };

    const saveRename = async () => {
        try {
            if (selectedChatId) {
                await onRenameChat(selectedChatId, renameTitle?.trim());
                setCurrentView("list");
                setSelectedChatId(null);
                setRenameTitle("");
            }
        } catch (error) {
            showToast.error("Error", "Failed to rename chat");
            console.error(error);
        }
    };

    const confirmDelete = async () => {
        if (!selectedChatId) return;

        try {
            await onDeleteChat(selectedChatId);

            // Only shown if API succeeded
            setCurrentView("success");

            setTimeout(() => {
                setCurrentView("list");
                setSelectedChatId(null);
            }, 2000);
        } catch (error) {
            setCurrentView("list"); // prevent stuck modal
            showToast.error("Error", "Failed to delete chat");
            console.error(error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
            });
        }
    };

    const renderChatItem = ({item}: { item: ChatItem }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
                onChatPress(item.id);
                onClose();
            }}
            activeOpacity={0.7}
        >
            <View style={styles.chatItemContent}>
                <View style={styles.chatTextContainer}>
                    <Text style={styles.chatTitle}>{item.title}</Text>
                    <Text style={styles.chatDate}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={styles.chatActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            startRenaming(item.id, item.title);
                        }}
                    >
                        <Image
                            source={require("../../assets/images/ai-chat/edit-2.png")}
                            style={styles.actionIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            startDeleting(item.id);
                        }}
                    >
                        <Image
                            source={require("../../assets/images/ai-chat/delete.png")}
                            style={styles.actionIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Render different views based on currentView
    const renderContent = () => {
        const Container = ({children}: { children: React.ReactNode }) => {
            const {height} = useKeyboardState();
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.actionContentBox]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.dragHandle}/>
                    {children}
                    <View style={{height}}/>
                </TouchableOpacity>
            );
        };
        switch (currentView) {
            case "rename":
                return (
                    <Container>
                        <Text style={styles.actionTitle}>Rename Title</Text>
                        <Text style={styles.actionSubtitle}>Edit your title name</Text>
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
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={cancelAction}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={saveRename}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.primaryButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </Container>
                );

            case "delete":
                return (
                    <Container>
                        <Text style={styles.actionTitle}>Delete Conversation?</Text>
                        <Text style={styles.actionSubtitle}>
                            This will permanently delete this conversation. This action cannot
                            be undone.
                        </Text>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={confirmDelete}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.primaryButtonText}>Delete</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={cancelAction}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Container>
                );

            case "success":
                return (
                    <Container>
                        <View style={styles.successContainer}>
                            <View style={styles.successIconContainer}>
                                <Image
                                    source={require("../../../assets/images/success-icon.png")}
                                    style={styles.successIcon}
                                />
                            </View>
                            <Text style={styles.successTitle}>
                                Conversation deleted successfully
                            </Text>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => {
                                    setCurrentView("list");
                                    setSelectedChatId(null);
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.primaryButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </Container>
                );

            default: // "list"
                return (
                    <Container>
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

                        {sortedChats?.length === 0 ? (
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
                            <View style={styles.chatsContainer}>
                                <Text style={styles.chatsLabel}>Chats</Text>
                                <FlatList
                                    data={sortedChats}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderChatItem}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        )}
                    </Container>
                );
        }
    };

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
                {renderContent()}
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
    actionContentContainer: {
        backgroundColor: colors.textWhite
    },
    actionContentBox: {
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
        marginTop: vs(8),
        maxHeight: vs(300),
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
    chatTextContainer: {
        flex: 1,
    },
    chatTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        marginBottom: vs(2),
    },
    chatDate: {
        ...typography.bodySmall,
        color: colors.textGrey1,
        fontSize: s(12),
    },
    chatActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(8),
    },
    actionButton: {
        padding: s(4),
    },
    actionIcon: {
        width: s(20),
        height: s(20),
    },

    // Action Views (Rename/Delete)
    actionTitle: {
        ...typography.heading3,
        color: colors.textPrimary,
        marginBottom: vs(8),
        textAlign: "center",
    },
    actionSubtitle: {
        ...typography.bodyMedium,
        color: colors.textGrey1,
        marginBottom: vs(32),
        textAlign: "center",
        lineHeight: vs(20),
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
    actionButtons: {
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
    primaryButton: {
        width: "100%",
        paddingVertical: vs(16),
        borderRadius: rbr(14),
        backgroundColor: colors.primary,
        alignItems: "center",
    },
    primaryButtonText: {
        ...typography.buttonText,
        color: colors.textWhite,
    },
    deleteButton: {
        width: "100%",
        paddingVertical: vs(16),
        borderRadius: rbr(14),
        backgroundColor: "#E53E3E",
        alignItems: "center",
    },

    // Success View
    successContainer: {
        alignItems: "center",
        paddingVertical: vs(24),
    },
    successIconContainer: {
        width: s(80),
        height: s(80),
        borderRadius: rbr(40),
        backgroundColor: "#D1FAE5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: vs(24),
    },
    successIcon: {
        width: s(40),
        height: s(40),
        tintColor: "#10B981",
    },
    successTitle: {
        ...typography.bodyLarge,
        color: colors.textPrimary,
        textAlign: "center",
        marginBottom: vs(32),
    },
});
