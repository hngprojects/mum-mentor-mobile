import { colors } from "@/src/core/styles";
import { rbr, rfs, s, vs } from "@/src/core/styles/scaling";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  isAiSpeaking?: boolean;
}

export const ChatInput = ({
  value,
  onChangeText,
  onSend,
  placeholder = "Ask anything...",
  isAiSpeaking = false,
}: ChatInputProps) => {
  const hasText = value.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {/* Text Input Area with Gray Background */}
          <View style={styles.textInputWrapper} pointerEvents="box-none">
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.textGrey2}
              multiline
              maxLength={500}
              editable={!isAiSpeaking}
            />
          </View>

          {/* Send/Stop Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: isAiSpeaking
                  ? colors.primary
                  : hasText
                    ? colors.primary
                    : colors.outlineVariant,
              },
            ]}
            onPress={onSend}
            disabled={!hasText && !isAiSpeaking}
            activeOpacity={0.7}
          >
            {isAiSpeaking ? (
              // Stop icon (small square)
              <View style={styles.stopIcon} />
            ) : (
              // Send icon
              <Image
                source={require("../../assets/images/ai-chat/send-message-icon.png")}
                style={styles.sendIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.textWhite,
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: vs(56),
    backgroundColor: colors.textWhite,
    borderRadius: rbr(8),
    paddingHorizontal: s(16),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: s(16),
  },
  textInputWrapper: {
    flex: 1,
    borderRadius: rbr(8),
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    height: vs(56),
    justifyContent: "center",
  },
  input: {
    fontSize: rfs(15),
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
    maxHeight: vs(100),
  },
  sendButton: {
    width: s(44),
    height: s(44),
    borderRadius: rbr(6.29),
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: s(20),
    height: s(20),
    tintColor: colors.textWhite,
  },
  stopIcon: {
    width: s(14),
    height: s(14),
    backgroundColor: colors.textWhite,
    borderRadius: rbr(3),
  },
});
