import { View, StyleSheet } from "react-native";
import { colors } from "@/src/core/styles";

export default function UploadProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.bar, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "80%",
    height: 10,
    backgroundColor: colors.outlineVariant,
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: colors.primary,
  },
});
