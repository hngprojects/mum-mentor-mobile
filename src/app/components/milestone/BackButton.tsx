import { colors, typography } from "@/src/core/styles";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function BackButton() {
  const router = useRouter();
  return (
    <Pressable style={styles.backButton} onPress={() => router.back()}>
      <Image
        source={require("../../../assets/images/arrow-left.png")}
        style={styles.backButton}
      />
      <Text style={styles.buttonText}>Body Recovery</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonIcon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  backButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
