import { Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "@/src/core/styles/";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FloatingCreateButton({ href }: { href: string }) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.button}>
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
