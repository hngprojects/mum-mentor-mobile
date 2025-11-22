import { Pressable, Image, StyleSheet, View } from "react-native";
import { colors } from "@/src/core/styles";

export default function PhotoThumbnail({ photo, selected, onPress }: any) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.image} />

      {selected && <View style={styles.overlay} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "33%",
    height: 120,
    padding: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(221, 45, 74, 0.35)",
    borderRadius: 10,
  },
});
