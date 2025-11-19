import { colors, fontFamilies, typography } from "@/src/core/styles";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const LOGO_WIDTH = 120;
const LOGO_HEIGHT = 172;
const BRAND_FONT_SIZE = typography.heading1.fontSize;

export default function OnboardingSplash() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/src/core/assets/fonts/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.brandName}>NORA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  brandName: {
    fontFamily: fontFamilies.extraBold,
    fontSize: BRAND_FONT_SIZE,
    lineHeight: BRAND_FONT_SIZE,
    color: colors.primary,
    letterSpacing: BRAND_FONT_SIZE * 0.1,
    textAlign: "center",
  },
});
