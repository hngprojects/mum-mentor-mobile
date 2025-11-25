import CategoryBox from "@/src/app/components/milestone/CategoryBox";
import PendingMilestones from "@/src/app/components/milestone/PendingMilestones";
// import Checkbox from "@/src/assets/images/tick-square.png";
import {
  BOTTOM_CATEGORIES,
  MILESTONE_SECTION,
  TOP_CATEGORIES,
} from "@/src/core/data/milestone-data";
import { colors, typography } from "@/src/core/styles";
import { useMilestoneTypeChange } from "@/src/hooks/useMilestoneTypeChange";
import { MilestoneType } from "@/src/types/milestones";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Milestone() {
  const { mileStoneType, saveMilestoneType } = useMilestoneTypeChange(
    "mother",
    "milestone_type"
  );

  console.log(mileStoneType, "milestone");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* container */}
        <View style={styles.container}>
          {/* milestone header */}
          <View>
            <Text style={styles.headerText}>Milestones</Text>

            <View style={styles.milestoneSectionRow}>
              {MILESTONE_SECTION.map((section) => (
                <Text
                  onPress={() =>
                    saveMilestoneType(section.type as MilestoneType)
                  }
                  key={section.id}
                  style={[
                    styles.sectionText,
                    section.type === mileStoneType && styles.sectionTextActive,
                  ]}
                >
                  {section?.type}
                </Text>
              ))}
            </View>
          </View>

          {/* milestone data based on type (mother or child) */}

          <View style={styles.milestoneBody}>
            {/* categories */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>Category</Text>

              <View style={styles.categoryContents}>
                <View style={styles.categories}>
                  {TOP_CATEGORIES.map((category, idx) => (
                    <CategoryBox key={idx} category={category} />
                  ))}
                </View>

                <View style={styles.categories}>
                  {BOTTOM_CATEGORIES.map((category, idx) => (
                    <CategoryBox key={idx} category={category} />
                  ))}
                </View>
              </View>
            </View>

            <PendingMilestones />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
