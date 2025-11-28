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
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryDetails() {
  const dispatch = useAppDispatch();
  const { categoryValue, ownerType, ownerId, childId } = useLocalSearchParams();
  const [milestoneStatus, setMilestoneStatus] = useState("pending");

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["milestonesByCat", categoryValue, childId],
    queryFn: () =>
      getMilestonesByCategory(
        categoryValue as string,
        childId as string | undefined
      ),
  });

  useEffect(() => {
    if (data) {
      dispatch(onAddMilestoneOnMount(data));
    }
  }, [data, dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.container}>
            <BackButton categoryHeading={categoryValue as string} />

            {/* main content */}
            <View style={styles.milestoneContainer}>
              <MilestoneProgressBar />

              <View>
                {/* header */}
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
                      {section?.status}
                    </Text>
                  ))}
                </View>
              </View>

              <MilestonesList milestoneStatus={milestoneStatus} />
            </View>

            <CreateForm />
            <SuccessModal />
            <DeleteModal />
            <EditForm />
          </View>
        </ScrollView>

        <Pressable
          style={styles.createMilestoneButton}
          onPress={() => dispatch(onToggleCreateForm(true))}
        >
          <Image
            source={require("../../assets/images/add-icon.png")}
            style={styles.createIcon}
          />
        </Pressable>
      </KeyboardAwareScrollView>
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
