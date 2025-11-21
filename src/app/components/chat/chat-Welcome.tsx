import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { CategoryButton } from "./category-Button";

interface ChatWelcomeProps {
  userName: string;
  onCategoryPress: (category: string) => void;
  onAskAnything?: () => void; // ← ADD THIS LINE
}

export const ChatWelcome = ({
  userName,
  onCategoryPress,
  onAskAnything, // ← ADD THIS LINE
}: ChatWelcomeProps) => {
  const categories = [
    { id: "1", title: "Self-Care Routine", icon: "🌸", color: "#FFFFFF" },
    { id: "2", title: "Motivation", icon: " 🧠", color: "#FFFFFF" },
    { id: "3", title: "New Mom Tip", icon: "🤱", color: "#FFFFFF" },
    { id: "4", title: "Parenting Tip", icon: "💕", color: "#FFFFFF" },
    { id: "5", title: "Baby Care", icon: "👶", color: "#FFFFFF" },
    { id: "6", title: "Night Routine", icon: "🌙", color: "#FFFFFF" },
  ];

  return (
    <View style={styles.container}>
      {/* Centered Icon */}
      <View style={styles.iconWrapper}>
        <Image
          source={require("../../assets/images/ai-chat/Group-2.png")}
          style={styles.topIcon}
        />
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Hi {userName}, how</Text>
      <Text style={styles.greeting}>can I help today?</Text>

      {/* Category Grid */}
      <View style={styles.grid}>
        {categories.map((item) => (
          <CategoryButton
            key={item.id}
            title={item.title}
            icon={item.icon}
            backgroundColor={item.color}
            onPress={() => onCategoryPress(item.title)}
          />
        ))}
      </View>

      {/* Ask Anything Button */}
      <TouchableOpacity 
        style={styles.askButton}
        onPress={onAskAnything} // ← ADD THIS LINE (connect the button)
      >
        <Text style={styles.askButtonText}>Ask Anything</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  iconWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  topIcon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    lineHeight: 32,
  },

  grid: {
    marginTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  askButton: {
    backgroundColor: "#E93552",
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 40,
    marginBottom: 20,
  },

  askButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});