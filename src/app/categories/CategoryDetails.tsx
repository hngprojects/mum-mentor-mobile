import BackButton from "@/src/app/components/milestone/BackButton";
import CreateForm from "@/src/app/components/milestone/CreateForm";
import DeleteModal from "@/src/app/components/milestone/DeleteModal";
import EditForm from "@/src/app/components/milestone/EditForm";
import EditSuccessModal from "@/src/app/components/milestone/EditSuccessModal";
import MilestoneProgressBar from "@/src/app/components/milestone/MilestoneProgressBar";
import MilestonesList from "@/src/app/components/milestone/MilestonesList";
import SuccessModal from "@/src/app/components/milestone/SuccessModal";
import { MILESTONE_STATUS } from "@/src/core/data/milestone-data";
import { getMilestonesByCategory } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { useMilestoneStore } from "@/src/store/useMilestone";

import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryDetails() {
  const onAddMilestoneOnMount = useMilestoneStore(
    (state) => state.onAddMilestoneOnMount
  );
  const onToggleCreateForm = useMilestoneStore(
    (state) => state.onToggleCreateForm
  );

  const { categoryValue, childId } = useLocalSearchParams();

  const [milestoneStatus, setMilestoneStatus] = useState("pending");

  const category = categoryValue ? String(categoryValue) : "";
  const child = childId ? String(childId) : undefined;

  const { data, error, isLoading } = useQuery({
    queryKey: ["milestonesByCat", category, child],
    queryFn: () => getMilestonesByCategory(category, child),
    enabled: !!category,
  });

  console.log(data);
  useEffect(() => {
    if (data) {
      onAddMilestoneOnMount(data);
    }
  }, [data, onAddMilestoneOnMount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.container}>
          <BackButton categoryHeading={category} />

          {/* main content */}

          <View style={styles.milestoneContainer}>
            <MilestoneProgressBar />

            {/* Status header */}
            <View style={styles.mileStonesHeading}>
              {MILESTONE_STATUS.map((section) => (
                <Text
                  onPress={() => setMilestoneStatus(section.status)}
                  key={section.id}
                  style={[
                    styles.sectionText,
                    section.status === milestoneStatus &&
                      styles.sectionTextActive,
                  ]}
                >
                  {section.status}
                </Text>
              ))}
            </View>

            <MilestonesList milestoneStatus={milestoneStatus} />
          </View>

          {/* Modals */}
          <CreateForm />
          <SuccessModal />
          <DeleteModal />
          <EditForm />
          <EditSuccessModal />
        </View>
      </KeyboardAwareScrollView>

      {/* Floating Add Button */}
      <Pressable
        style={styles.createMilestoneButton}
        onPress={() => onToggleCreateForm(true)}
      >
        <Image
          source={require("../../assets/images/add-icon.png")}
          style={styles.createIcon}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 14,
  },

  scrollContent: {
    paddingBottom: 80,
  },

  milestoneContainer: {
    marginTop: 32,
  },

  mileStonesHeading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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

  // Floating create button
  createMilestoneButton: {
    width: 56,
    height: 56,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.primary,
    position: "absolute",
    bottom: 30,
    right: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  createIcon: {
    width: 24,
    height: 24,
  },
});
