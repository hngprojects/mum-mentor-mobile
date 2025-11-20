import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontFamilies } from "../../core/styles";

const AiChatScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>AI Chat</Text>
    <Text style={styles.subtitle}>Coming soon.</Text>
  </View>
);

export default AiChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundMain,
    padding: 24,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
});
