import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfigParams,
} from "react-native-toast-message";

import { colors, spacing, typography } from "../styles";

import { ms, rfs } from "../styles/scaling";

/**

 * Custom toast configuration with app theme

 */

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success,

        borderLeftWidth: ms(6),

        backgroundColor: colors.backgroundMain,

        height: ms(70),
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        fontSize: rfs(typography.bodyLarge.fontSize),

        fontWeight: "600",

        color: colors.textPrimary,

        fontFamily: "HankenGrotesk-SemiBold",
      }}
      text2Style={{
        fontSize: rfs(typography.bodyMedium.fontSize),

        color: colors.textSecondary,

        fontFamily: "HankenGrotesk-Regular",
      }}
      text2NumberOfLines={2}
    />
  ),

  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error,

        borderLeftWidth: ms(6),

        backgroundColor: colors.backgroundMain,

        height: ms(70),
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        fontSize: rfs(typography.bodyLarge.fontSize),

        fontWeight: "600",

        color: colors.textPrimary,

        fontFamily: "HankenGrotesk-SemiBold",
      }}
      text2Style={{
        fontSize: rfs(typography.bodyMedium.fontSize),

        color: colors.textSecondary,

        fontFamily: "HankenGrotesk-Regular",
      }}
      text2NumberOfLines={2}
    />
  ),

  warning: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#F39C12",

        borderLeftWidth: ms(6),

        backgroundColor: colors.backgroundMain,

        height: ms(70),
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        fontSize: rfs(typography.bodyLarge.fontSize),

        fontWeight: "600",

        color: colors.textPrimary,

        fontFamily: "HankenGrotesk-SemiBold",
      }}
      text2Style={{
        fontSize: rfs(typography.bodyMedium.fontSize),

        color: colors.textSecondary,

        fontFamily: "HankenGrotesk-Regular",
      }}
      text2NumberOfLines={2}
    />
  ),

  info: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary,

        borderLeftWidth: ms(6),

        backgroundColor: colors.backgroundMain,

        height: ms(70),
      }}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
      }}
      text1Style={{
        fontSize: rfs(typography.bodyLarge.fontSize),

        fontWeight: "600",

        color: colors.textPrimary,

        fontFamily: "HankenGrotesk-SemiBold",
      }}
      text2Style={{
        fontSize: rfs(typography.bodyMedium.fontSize),

        color: colors.textSecondary,

        fontFamily: "HankenGrotesk-Regular",
      }}
      text2NumberOfLines={2}
    />
  ),
};

/**

 * Utility function to show toast notifications

 */

export const showToast = {
  /**

   * Show success toast

   */

  success: (title: string, message?: string) => {
    Toast.show({
      type: "success",

      text1: title,

      text2: message,

      position: "top",

      visibilityTime: 3000,

      topOffset: 60,
    });
  },

  /**

   * Show error toast

   */

  error: (title: string, message?: string) => {
    Toast.show({
      type: "error",

      text1: title,

      text2: message,

      position: "top",

      visibilityTime: 4000,

      topOffset: 60,
    });
  },

  /**

   * Show warning toast

   */

  warning: (title: string, message?: string) => {
    Toast.show({
      type: "warning",

      text1: title,

      text2: message,

      position: "top",

      visibilityTime: 3500,

      topOffset: 60,
    });
  },

  /**

   * Show info toast

   */

  info: (title: string, message?: string) => {
    Toast.show({
      type: "info",

      text1: title,

      text2: message,

      position: "top",

      visibilityTime: 3000,

      topOffset: 60,
    });
  },
};
