import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import CaptionInput from "@/src/components/community/CaptionInput";
import Header from "@/src/components/community/Header";
import { useCreatePost } from "@/src/hooks/useCreatePost";
import { colors, spacing, typography } from "@/src/core/styles";

export default function CreateCaptionScreen() {
  const { caption, setCaption } = useCreatePost();

  const canContinue = caption.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Header title="New Post" />

      <View style={styles.content}>
        <CaptionInput value={caption} onChangeText={setCaption} />

        <Link
          href="/community/create/select-photos"
          asChild
          disabled={!canContinue}
        >
          <TouchableOpacity
            style={[styles.button, !canContinue && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.outline,
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },
});
