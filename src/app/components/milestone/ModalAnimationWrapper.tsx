import React, { PropsWithChildren } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
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
  const { width, height } = Dimensions.get("screen");
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={300}
      deviceHeight={height}
      deviceWidth={width}
      statusBarTranslucent={true}
      useNativeDriver
      coverScreen={true}
      style={styles.overlay}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardWrapper}
      >
        <View style={styles.container}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: "center",
    margin: 0,
    paddingHorizontal: 24,
  },
  keyboardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
  },
});
