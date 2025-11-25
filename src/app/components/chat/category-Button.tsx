import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { s, vs, rfs, rbr } from '@/src/core/styles/scaling';

interface CategoryButtonProps {
  title: string;
  onPress: () => void;
}

export const CategoryButton = ({ title, onPress }: CategoryButtonProps) => {
  return (
    <TouchableOpacity 
      style={styles.button}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.contentRow}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: s(196),                // exact Figma width
    height: vs(48),               // exact Figma height
    borderRadius: rbr(8),         // Figma radius 8px
    borderWidth: 0.5,             // exact border
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",

    paddingVertical: vs(8),       // Figma top/bottom padding
    paddingHorizontal: s(16),     // Figma left/right padding

    justifyContent: "center",
    alignItems: "flex-start",

    marginBottom: vs(16),         // same spacing as Figma rows
  },

  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),                   // exact gap between text & emoji
  },

  title: {
    fontSize: rfs(14),            // exact Figma font size
    fontWeight: "400",            // Hanken Grotesk regular
    color: "#1A1A1A",
  },
});
