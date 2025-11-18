import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, typography } from '../styles';

const LOGO_WIDTH = 94;
const LOGO_HEIGHT = 134;
const BRAND_NAME_FONT_SIZE = typography.heading1.fontSize;
const BRAND_NAME_LETTER_SPACING = BRAND_NAME_FONT_SIZE * 0.1;

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/fonts/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.brandName}>NORA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  brandName: {
    color: colors.primary,
    fontFamily: fontFamilies.extraBold,
    fontSize: BRAND_NAME_FONT_SIZE,
    lineHeight: BRAND_NAME_FONT_SIZE,
    letterSpacing: BRAND_NAME_LETTER_SPACING,
    textAlign: 'center',
  },
});

export default SplashScreen;
