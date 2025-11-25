import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { colors, typography } from "@/src/core/styles";
import { s, vs, rbr } from "@/src/core/styles/scaling";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  link?: {
    url: string;
    title: string;
  };
}

export const ChatMessage = ({
  message,
  isUser,
  timestamp,
  link,
}: ChatMessageProps) => {
  const handleLinkPress = () => {
    if (link?.url) {
      Linking.openURL(link.url);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.botIconContainer}>
          <Image
            source={require("../../assets/images/ai-chat/small-icon.png")}
            style={styles.topIcon}
          />
        </View>
      )}

      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.botText,
          ]}
        >
          {message}
        </Text>

        {/* Link Preview - Inside the same bubble */}
        {!isUser && link && (
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={handleLinkPress}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/ai-chat/link-icon.png")}
              style={styles.linkIcon}
            />
            <Text style={styles.linkText} numberOfLines={1}>
              {link.title}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: vs(8),
    paddingHorizontal: s(16),
    alignItems: "flex-end",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  botContainer: {
    justifyContent: "flex-start",
  },
  botIconContainer: {
    width: s(32),
    height: s(32),
    marginRight: s(8),
    marginBottom: vs(2),
    justifyContent: "center",
    alignItems: "center",
  },
  topIcon: {
    width: s(32),
    height: s(32),
    resizeMode: "contain",
  },
  bubble: {
    maxWidth: s(343), // Figma width
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderRadius: rbr(20),
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: rbr(4),
  },
  botBubble: {
    backgroundColor: colors.textWhite,
    borderBottomLeftRadius: rbr(4),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  messageText: {
    ...typography.bodyMedium,
    lineHeight: vs(20),
    textAlign: "left",
  },
  userText: {
    color: colors.textWhite,
  },
  botText: {
    color: colors.textPrimary,
  },
  // Link Preview Styles
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.outlineVariant, // Figma soft grey #E5E5E5
    borderRadius: rbr(8), // Figma rounded corners

    marginTop: vs(12),
    gap: s(8),
    width: "100%", // Fill bubble width
  },
  linkIcon: {
    width: s(24), // Figma correct icon size
    height: s(24),
    resizeMode: "contain",
  },
  linkText: {
    flex: 1,
    fontSize: typography.labelMedium.fontSize, // Figma type scale
    fontFamily: typography.labelMedium.fontFamily,
    color: colors.textPrimary,
  },
});
