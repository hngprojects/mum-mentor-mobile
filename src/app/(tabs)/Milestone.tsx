import ChildList from "@/src/app/components/milestone/ChildList";
import MilestoneDashboard from "@/src/app/components/milestone/MilestoneDashboard";
// import Checkbox from "@/src/assets/images/tick-square.png";
import { MILESTONE_SECTION } from "@/src/core/data/milestone-data";

import { colors, typography } from "@/src/core/styles";
import { MilestoneType } from "@/src/types/milestones";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Milestone() {
  const [milestoneType, setMilestoneType] = useState("mother");

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
                    setMilestoneType(section.type as MilestoneType)
                  }
                  key={section.id}
                  style={[
                    styles.sectionText,
                    section.type === milestoneType && styles.sectionTextActive,
                  ]}
                >
                  {section?.type}
                </Text>
              ))}
            </View>
          </View>

          {/* milestone data based on type (mother or child) */}
          {milestoneType === "mother" ? (
            <MilestoneDashboard milestoneType={milestoneType} />
          ) : (
            <ChildList />
          )}
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
    backgroundColor: "white",
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
