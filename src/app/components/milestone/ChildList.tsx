import { getChildProfiles } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { showToast } from "@/src/core/utils/toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChildList() {
  const router = useRouter();

  const {
    data: childProfiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["child-profiles"],
    queryFn: getChildProfiles,
  });

  function handleChildPress(childId: string, childName: string) {
    router.push({
      pathname: "/child-milestone/[id]",
      params: { id: childId, name: childName },
    });
  }

  if (error) {
    showToast.error(error.message);
  }

  if (isLoading) {
    return <View>Loading...</View>;
  }

  return (
    <View style={styles.childContainer}>
      {childProfiles?.children?.map((child) => (
        <TouchableOpacity
          key={child.id}
          style={styles.childBox}
          onPress={() => handleChildPress(child.id, child.full_name)}
        >
          <Image
            source={{ uri: child.profile_picture_url }}
            style={styles.childBoxAvatar}
          />

          <View style={styles.childBoxTextBox}>
            <Text style={styles.childBoxTitle}>{child.full_name}</Text>
            <Text style={styles.childBoxDesc}>5 months old</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  childBoxDesc: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  childBoxTitle: {
    ...typography.heading3,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  childBoxTextBox: { gap: 4 },
  childBoxAvatar: {
    width: 53.27,
    height: 53.27,
    borderRadius: 100,
  },
  childBox: {
    padding: 16,
    gap: 16,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  childContainer: {
    gap: 24,

    marginTop: 24,
    flex: 1,
    backgroundColor: "white",
  },
});

// 36d1f68a-4eaf-4960-a53e-b01ac1ce9887
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOiIzNmQxZjY4YS00ZWFmLTQ5NjAtYTUzZS1iMDFhYzFjZTk4ODciLCJyb2xlIjoidXNlciJ9LCJleHAiOjE3NjQzMDc5NzYsImlhdCI6MTc2NDMwNjE3NiwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.JvXkQgLO60dkPmzWAy9dYxt2li28-eS4WpOlArWIqTo

// cff9cf3c-f2eb-4b80-8e2d-fe1b2346b438
