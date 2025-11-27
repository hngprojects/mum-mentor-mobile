import { colors } from "@/src/core/styles";
import { rbr, rfs, s, vs } from "@/src/core/styles/scaling";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CategoryButton } from "./category-Button";

interface ChatWelcomeProps {
  userName: string;
  onCategoryPress: (category: string) => void;
  onAskAnything?: () => void;
}

export const ChatWelcome = ({
  userName,
  onCategoryPress,
  onAskAnything,
}: ChatWelcomeProps) => {
  const categories = [
    { id: "1", title: "Self-Care Routine 🌸" },
    { id: "2", title: "Motivation 🧠" },
    { id: "3", title: "New Mom Tip 🤱" },
    { id: "4", title: "Parenting Tip 💕" },
    { id: "5", title: "Baby Care 👶" },
    { id: "6", title: "Night Routine 🌙" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image
          source={require("../../assets/images/ai-chat/Group-2.png")}
          style={styles.topIcon}
        />
      </View>

      <Text style={styles.greeting}>Hi{` ${userName}`}, how</Text>
      <Text style={styles.greeting}>can I help today?</Text>

      <View style={styles.grid}>
        {categories.map((item) => (
          <CategoryButton
            key={item.id}
            title={item.title}
            onPress={() => onCategoryPress(item.title)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.askButton} onPress={onAskAnything}>
        <Text style={styles.askButtonText}>Ask Anything</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: s(16),
    paddingTop: vs(60),
  },

  iconWrapper: {
    alignItems: "center",
    marginBottom: vs(24),
  },

  topIcon: {
    width: s(68),
    height: s(68),
    resizeMode: "contain",
  },

  greeting: {
    fontSize: rfs(26),
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
    letterSpacing: -0.2,
  },

  grid: {
    marginTop: vs(36),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    flexGrow: 1, // pushes Ask Anything button to bottom
  },

  askButton: {
    backgroundColor: colors.primary,
    paddingVertical: vs(14),
    borderRadius: rbr(12),

    // Make button stick to bottom with spacing
    marginBottom: vs(50),
  },

  askButtonText: {
    fontSize: rfs(18),
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
});
