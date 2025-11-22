import { View, Image, StyleSheet } from "react-native";
import { spacing } from "@/src/core/styles";

export default function PostMediaGrid({ images = [], full = false }: any) {
  if (!images?.length) return null;

  if (full) {
    return images.map((img: any, i: number) => (
      <Image key={i} source={{ uri: img }} style={styles.fullImage} />
    ));
  }

  return (
    <View style={styles.grid}>
      {images.slice(0, 4).map((img: any, i: number) => (
        <Image key={i} source={{ uri: img }} style={styles.gridImage} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  gridImage: {
    width: "48%",
    height: 150,
    borderRadius: 12,
  },
  fullImage: {
    width: "100%",
    height: 350,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
});
