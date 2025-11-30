import CategoryBox from "@/src/app/components/milestone/CategoryBox";
import PendingMilestones from "@/src/app/components/milestone/PendingMilestones";
import { useAuth } from "@/src/core/services/authContext";
import { getMilestoneCategories } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { showToast } from "@/src/core/utils/toast";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
// import Checkbox from "@/src/assets/images/tick-square.png";

import { StyleSheet, Text, View } from "react-native";

export default function MilestoneDashboard({
  milestoneType,
  childId,
}: {
  milestoneType: string;
  childId?: string;
}) {
  const { user } = useAuth();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["dashboard", milestoneType, childId],
    queryFn: () => getMilestoneCategories(childId),
  });

  const categories = data?.categories;

  useEffect(() => {
    if (isError) {
      showToast.error(error.message);
    }
  }, [isError, error]);

  if (isLoading) {
    return <View>Loading...</View>;
  }

  return (
    <View style={styles.milestoneBody}>
      {/* categories */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>Category</Text>

        <View style={styles.categoryContents}>
          <View
            style={{
              ...styles.categories,
              flexWrap: "wrap",
              flexDirection: "row",
              gap: 5.6,
            }}
          >
            {categories?.map((category, idx) => (
              <CategoryBox
                key={idx}
                category={category}
                milestoneType={milestoneType}
                ownerId={user?.id as string}
                childId={childId}
              />
            ))}
          </View>

          {/* <View style={styles.categories}>
            {categories?.slice(2).map((category, idx) => (
              <CategoryBox
                key={idx}
                category={category}
                milestoneType={milestoneType}
                ownerId={user?.id as string}
                childId={childId}
              />
            ))}
          </View> */}
        </View>
      </View>

      <PendingMilestones childId={childId} />
    </View>
  );
}

const styles = StyleSheet.create({
  // categories
  categories: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  categoryContents: {
    gap: 16,
    flexWrap: "wrap",
  },

  categoryContainer: {
    gap: 8,
  },
  milestoneBody: {
    gap: 40,
  },
  categoryText: {
    ...typography.heading3,
    color: "black",
    marginTop: 16,
  },
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "white",
    paddingBottom: 20,
  },

  headerText: {
    ...typography.heading2,
    color: colors.textPrimary,
  },

  milestoneSectionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    gap: 10,
    marginTop: 16,
  },

  sectionText: {
    ...typography.labelLarge,
    color: colors.textGrey1,
    textTransform: "capitalize",
    width: "50%",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  sectionTextActive: {
    color: colors.primary,
    borderColor: colors.primary,
    borderBottomWidth: 2,
  },
});
