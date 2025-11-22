// src/app/components/ui/CustomInput.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- IMPORTS FROM CORE UTILITIES ---
import { colors, spacing, typography } from "../../core/styles/index";
import { ms, rfs } from "../../core/styles/scaling";

// --- ICON MAPPING (for custom PNG icons) ---
const icons: Record<string, any> = {
  "mail-outline": require("../../assets/images/mail.png"),
  "person-outline": require("../../assets/images/user.png"),
  "lock-outline": require("../../assets/images/lock.png"),
  "calendar-outline": require("../../assets/images/calendar.png"),
  "calendar-number": require("../../assets/images/calendar-num.png"),
  "gender-outline": require("../../assets/images/gender.png"),
};

// --- TYPES ---
interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  iconName?: string;
  isError?: boolean;
  errorMessage?: string;
  isPassword?: boolean;
  isValid?: boolean;
  inputRef?: React.RefObject<TextInput>;
  multiline?: boolean;
  editable?: boolean;
  defaultValue?: string;
}

// --- COMPONENT ---
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  iconName,
  isError = false,
  errorMessage,
  isPassword = false,
  isValid = false,
  inputRef,
  multiline,
  editable = true,
  defaultValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  const borderColor = isError
    ? colors.error
    : isFocused
    ? colors.primary
    : isValid
    ? colors.success
    : colors.outline;

  const labelColor = isError ? colors.error : colors.textGrey1;
  const showValidationIcon = isValid || isError;

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: ms(spacing.md),
    },
    label: {
      fontSize: rfs(typography.labelMedium.fontSize),
      fontFamily: typography.labelMedium.fontFamily,
      color: colors.textPrimary,
      marginBottom: ms(spacing.xs),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: borderColor,
      borderRadius: ms(10),
      paddingHorizontal: ms(spacing.sm),
      height: ms(50),
      backgroundColor: colors.backgroundMain,
    },
    icon: {
      marginRight: ms(spacing.sm),
      color: colors.textGrey2,
    },
    // --- FIX: ADDED (to display PNG icon) ---
    iconImage: {
      width: rfs(20),
      height: rfs(20),
      marginRight: ms(spacing.sm),
      resizeMode: "contain",
    },
    input: {
      flex: 1,
      fontSize: rfs(typography.bodyMedium.fontSize),
      fontFamily: typography.bodyMedium.fontFamily,
      color: colors.textPrimary,
      paddingVertical: ms(spacing.xs),
    },
    validationIcon: {
      marginLeft: ms(spacing.sm),
    },
    errorText: {
      fontSize: rfs(typography.caption.fontSize),
      fontFamily: typography.caption.fontFamily,
      color: colors.error,
      marginTop: ms(spacing.xs),
    },
    passwordToggle: {
      paddingLeft: ms(spacing.sm),
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        {/* Custom PNG Icon */}
        {iconName && icons[iconName] && (
          <Image source={icons[iconName]} style={styles.iconImage} />
        )}

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textGrey2}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          multiline={multiline}
          editable={editable}
          defaultValue={defaultValue}
        />

        <View style={styles.passwordToggle}>
          {isPassword && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={rfs(20)}
                color={colors.textGrey2}
              />
            </TouchableOpacity>
          )}

          {showValidationIcon && (
            <Ionicons
              name={isError ? "close-circle" : "checkmark-circle"}
              size={rfs(20)}
              color={isError ? colors.error : colors.primary}
              style={styles.validationIcon}
            />
          )}
        </View>
      </View>

      {isError && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

export default CustomInput;
