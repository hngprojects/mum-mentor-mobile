import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors, spacing, typography } from "../../../core/styles";
import { ms, rfs } from "../../../core/styles/scaling";

interface SearchBarProps extends Pick<TextInputProps, "value" | "onChangeText" | "placeholder" | "editable"> {}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = "Search", editable = true }) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={ms(18)}
        color={colors.textGrey1}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textGrey2}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: ms(spacing.md),
    height: ms(48),
  },
  icon: {
    marginRight: ms(spacing.sm),
  },
  input: {
    flex: 1,
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
  },
});

export default SearchBar;
