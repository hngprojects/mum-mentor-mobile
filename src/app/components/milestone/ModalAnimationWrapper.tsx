import React, { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";

import Modal from "react-native-modal";

interface ModalAnimationProps extends PropsWithChildren {
  isVisible: boolean;
  onBackdropPress: () => void;
}

export default function ModalAnimationWrapper({
  children,
  isVisible,
  onBackdropPress,
}: ModalAnimationProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.5}
      animationIn={animationIn}
      animationOut={animationOut}
      animationInTiming={300}
      animationOutTiming={300}
      useNativeDriver={true}
      style={styles.overlay}
    >
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: "center",
    margin: 0,
    paddingHorizontal: 24,
  },
});

const animationIn = {
  from: {
    opacity: 0,
    transform: [{ scale: 0.9 }],
  },
  to: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
};

const animationOut = {
  from: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  to: {
    opacity: 0,
    transform: [{ scale: 0.9 }],
  },
};
