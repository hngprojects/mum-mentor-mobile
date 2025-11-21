import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      {!isUser && (
        <View style={styles.botIconContainer}>
          <View style={styles.botIcon}>
            <Text style={styles.botEmoji}>👶</Text>
          </View>
        </View>
      )}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {message}
        </Text>
      </View>
      
      {isUser && (
        <View style={styles.userIconContainer}>
          <View style={styles.userIcon}>
            <Text style={styles.userEmoji}>👤</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  botIconContainer: {
    marginRight: 8,
  },
  botIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4B6E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botEmoji: {
    fontSize: 16,
  },
  userIconContainer: {
    marginLeft: 8,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '70%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#FF4B6E',
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#1A1A1A',
  },
});