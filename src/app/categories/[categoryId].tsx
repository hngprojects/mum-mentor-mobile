import BackButton from "@/src/app/components/milestone/BackButton";
import CreateForm from "@/src/app/components/milestone/CreateForm";
import DeleteModal from "@/src/app/components/milestone/DeleteModal";
import EditForm from "@/src/app/components/milestone/EditForm";
import MilestoneProgressBar from "@/src/app/components/milestone/MilestoneProgressBar";
import MilestonesList from "@/src/app/components/milestone/MilestonesList";
import SuccessModal from "@/src/app/components/milestone/SuccessModal";
import { MILESTONE_STATUS } from "@/src/core/data/milestone-data";
import { colors, typography } from "@/src/core/styles";
import { useMilestoneTypeChange } from "@/src/hooks/useMilestoneTypeChange";
import { useAppDispatch } from "@/src/store/hooks";
import { onToggleCreateForm } from "@/src/store/milestoneSlice";
import { useLocalSearchParams } from "expo-router";

import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams();

  const dispatch = useAppDispatch();
  const {
    mileStoneType: milestoneStatus,
    saveMilestoneType: saveMilestoneStatus,
  } = useMilestoneTypeChange("completed", "milestone_status");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <BackButton />

          {/* main content */}
          <View style={styles.milestoneContainer}>
            <MilestoneProgressBar />

            <View>
              {/* header */}
              <View style={styles.mileStonesHeading}>
                {MILESTONE_STATUS.map((section) => (
                  <Text
                    onPress={() => saveMilestoneStatus(section.status)}
                    key={section.id}
                    style={[
                      styles.sectionText,
                      section.status === milestoneStatus &&
                        styles.sectionTextActive,
                    ]}
                  >
                    {section?.status}
                  </Text>
                ))}
              </View>
            </View>

            <MilestonesList />

            {/* <EmptyMilestoneMessage /> */}

            <Pressable
              style={styles.createMilestoneButton}
              onPress={() => dispatch(onToggleCreateForm(true))}
            >
              <Image
                source={require("../../assets/images/add-icon.png")}
                style={styles.createIcon}
              />
            </Pressable>
          </View>

          <CreateForm />
          <SuccessModal />
          <DeleteModal />
          <EditForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // create milestone button
  createIcon: {
    height: 24,
    width: 24,
  },
  createMilestoneButton: {
    width: 56,
    height: 56,
    position: "fixed",
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.primary,
    bottom: 30,
    right: 24,
  },

  milestoneContainer: {
    gap: 24,
    marginTop: 32,
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

  mileStonesHeading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    gap: 10,
    marginTop: 0,
  },

  // general
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 14,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
});

// continue with the add milestone buttons.
