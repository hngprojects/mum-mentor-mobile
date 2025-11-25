import { colors, typography } from "@/src/core/styles";
import { ms, rfs, vs } from "@/src/core/styles/scaling";
import React from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
  iconComponent?: React.ReactNode;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title = "Set Up Successful",
  message,
  buttonText = "Done",
  onClose,
  iconComponent,
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible, scaleValue]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            {iconComponent || (
              <View style={styles.successIconWrapper}>
                <View style={styles.successIconOuter}>
                  <View style={styles.successIconInner}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Optional Message */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Done Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(24),
  },
  modalContainer: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    paddingVertical: vs(40),
    paddingHorizontal: ms(24),
    width: "100%",
    maxWidth: ms(400),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: vs(24),
  },
  successIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  successIconOuter: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: colors.successLight,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconInner: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: rfs(32),
    color: colors.textWhite,
    fontWeight: "bold",
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: vs(32),
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: "center",
    marginBottom: vs(24),
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: vs(16),
    paddingHorizontal: ms(48),
    borderRadius: ms(8),
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    ...typography.buttonText,
    color: colors.textWhite,
  },
});

// Export a hook for easier usage
export const useSuccessModal = () => {
  const [visible, setVisible] = React.useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return {
    visible,
    show,
    hide,
  };
};
