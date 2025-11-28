import { CATEGORIES } from "@/src/core/data/milestone-data";
import { getMilestonesByCategory } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { showToast } from "@/src/core/utils/toast";
import { Category } from "@/src/types/milestones";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

interface CategoryBoxType {
  category: Category;
  milestoneType: string;
  ownerId: string;
  childId?: string;
}

export default function CategoryBox({
  category,
  milestoneType,
  ownerId,
  childId,
}: CategoryBoxType) {
  // const { milestoneData } = useAppSelector(getMilestoneStates);

  console.log(category);

  const router = useRouter();
  const {
    data: milestoneData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["milestonesByCat", category.label, childId],
    queryFn: () => getMilestonesByCategory(category.label, childId),
  });

  const completedMilestones =
    milestoneData?.filter((milestone) => milestone.status === "completed")
      .length ?? 0;
  const milestonesDataLength = milestoneData?.length ?? 0;

  console.log(milestoneData, category.label, "milestone");

  if (isLoading) {
    return <View>Loading</View>;
  }

  const progress = milestonesDataLength
    ? (completedMilestones / milestonesDataLength) * 100
    : 0;

  console.log(progress, "progress", category.label, "ridwan");

  const categoryData = CATEGORIES[category.label];

  if (error) {
    showToast.error(error.message);
  }

  return (
    <Link
      href={{
        pathname: "/categories/CategoryDetails",
        params: {
          categoryValue: category.value,
          categoryLabel: category.label,
          ownerType: milestoneType,
          ownerId,
          childId,
        },
      }}
      asChild
    >
      <TouchableOpacity style={styles.contentBox}>
        <View style={styles.content}>
          {/* header */}
          <View style={styles.contentHeader}>
            <Image source={categoryData.icon} style={styles.contentIcon} />
            <CircularProgress
              value={progress}
              radius={28}
              duration={1000}
              progressValueColor={colors.textGrey1}
              activeStrokeColor={colors.success}
              inActiveStrokeColor={colors.outlineVariant}
              activeStrokeWidth={5}
              inActiveStrokeWidth={5}
              showProgressValue={false}
              title={`${Math.floor(progress)}%`}
              titleColor={colors.textGrey1}
              titleStyle={{ fontSize: 16, fontWeight: "500" }}
            />
          </View>

          {/* body */}
          <View style={styles.contentBody}>
            <Text style={styles.contentBodyTitle}>{categoryData.title}</Text>
            <Text style={styles.contentBodyDesc}>{categoryData.desc}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  contentBodyDesc: { ...typography.bodySmall, color: colors.textSecondary },

  content: {
    gap: 10,
  },

  contentBox: {
    width: "49%",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 16,
    gap: 10,
    borderColor: colors.outline,
  },

  contentBodyTitle: {
    ...typography.labelLarge,
    color: "#1f1f1f",
    textTransform: "capitalize",
  },
  contentBody: {
    gap: 4,
  },
  contentIcon: {
    width: 24,
    height: 24,
  },
  contentHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
