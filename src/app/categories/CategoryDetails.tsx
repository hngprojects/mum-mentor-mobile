import BackButton from "@/src/app/components/milestone/BackButton";
import CreateForm from "@/src/app/components/milestone/CreateForm";
import DeleteModal from "@/src/app/components/milestone/DeleteModal";
import EditForm from "@/src/app/components/milestone/EditForm";
import MilestoneProgressBar from "@/src/app/components/milestone/MilestoneProgressBar";
import MilestonesList from "@/src/app/components/milestone/MilestonesList";
import SuccessModal from "@/src/app/components/milestone/SuccessModal";
import { MILESTONE_STATUS } from "@/src/core/data/milestone-data";
import { getMilestonesByCategory } from "@/src/core/services/milestoneService";
import { colors, typography } from "@/src/core/styles";
import { useAppDispatch } from "@/src/store/hooks";
import {
  onAddMilestoneOnMount,
  onToggleCreateForm,
} from "@/src/store/milestoneSlice";

import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryDetails() {
  const dispatch = useAppDispatch();
  const { categoryValue, childId } = useLocalSearchParams();

  const [milestoneStatus, setMilestoneStatus] = useState("pending");

  const category = categoryValue ? String(categoryValue) : "";
  const child = childId ? String(childId) : undefined;

  const { data, error, isLoading } = useQuery({
    queryKey: ["milestonesByCat", category, child],
    queryFn: () => getMilestonesByCategory(category, child),
    enabled: Boolean(category && child),
  });

  useEffect(() => {
    if (data) dispatch(onAddMilestoneOnMount(data));
  }, [data]);

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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>

      {/* Floating Add Button */}
      <Pressable
        style={styles.createMilestoneButton}
        onPress={() => dispatch(onToggleCreateForm(true))}
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
