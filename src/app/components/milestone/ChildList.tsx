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
    if (!childId || !childName) return; // ensure safe navigation
    router.push({
      pathname: "/child-milestone/[id]",
      params: { id: childId, name: childName },
    });
  }

  if (error) {
    showToast.error((error as any)?.message || "Something went wrong"); // safe error handling
  }

  if (isLoading) {
    return <View>Loading...</View>;
  }

  // Ensure children array exists
  const children = childProfiles?.children ?? [];

  return (
    <View style={styles.childContainer}>
      {children.map((child) => (
        <TouchableOpacity
          key={child.id}
          style={styles.childBox}
          onPress={() => handleChildPress(child.id, child.full_name)}
        >
          <Image
            source={{
              uri: child.profile_picture_url || "https://via.placeholder.com/53", // fallback avatar
            }}
            style={styles.childBoxAvatar}
          />

          <View style={styles.childBoxTextBox}>
            <Text style={styles.childBoxTitle}>{child.full_name || "Unknown"}</Text>
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
