// src/components/ChildSetupItem.tsx

import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rh, rw } from "@/src/core/styles/scaling";
import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "./CustomInput";
import DatePickerInput from "./DatePickerInput";
import DeleteConfirmModal from "./DeleteConfirmationModal";
import GenderDropdown from "./GenderDropdown";

interface ChildSetupItemProps {
  index: number;
  childData: ChildData;
  onUpdate: (index: number, updated: ChildData) => void;
  onDelete: () => void;
}

export interface ChildData {
  fullName: string;
  dob: string;
  gender: string;
}

const ChildSetupItem: React.FC<ChildSetupItemProps> = ({
  index,
  childData,
  onUpdate,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const age = useMemo(() => {
    const dob = childData.dob;

    // Return empty string if no date of birth
    if (!dob) return "";

    try {
      const parts = dob.split("/");
      if (parts.length !== 3) {
        console.warn("DOB format is incorrect:", dob);
        return "";
      }

      const birth = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      const today = new Date();

      // Check if the date is valid
      if (isNaN(birth.getTime())) {
        console.warn("Invalid date provided:", dob);
        return "";
      }

      // Check if date is in the future
      if (birth > today) {
        console.warn("Date of birth is in the future:", dob);
        return "";
      }

      // Calculate age
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      // Adjust if birthday hasn't occurred yet this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      // Return empty string if age is negative (shouldn't happen with future date check above)
      if (age < 0) return "";

      return age.toString();
    } catch (error) {
      console.error("Error computing age:", error);
      return "";
    }
  }, [childData.dob]);

  const handleChange = (key: keyof ChildData, value: string) => {
    onUpdate(index, { ...childData, [key]: value });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.headerText}>Child {index + 1} Set up</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => {
              setItemToDelete(index);
              setShowDeleteModal(true);
            }}
          >
            <Image
              source={require("@/src/assets/images/trash.png")}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>

          <Image
            source={
              expanded
                ? require("@/src/assets/images/arrow-up.png")
                : require("@/src/assets/images/arrow-down.png")
            }
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <>
          <View style={styles.divider} />
          <View style={styles.form}>
            {/* Child Full Name */}
            <CustomInput
              label="Child's Full Name"
              placeholder="Enter Full Name"
              value={childData.fullName}
              onChangeText={(t) => handleChange("fullName", t)}
              iconName="person-outline"
            />

            {/* Date of Birth - Now with Calendar Picker */}
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={childData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  width: "100%",
                  fontSize: 16,
                }}
              />
            ) : (
              <DatePickerInput
                label="Child's Date Of Birth"
                placeholder="Select Date"
                value={childData.dob}
                onDateChange={(date) => handleChange("dob", date)}
              />
            )}

            {/* Child Age - Auto-calculated */}
            <CustomInput
              label="Child's Age"
              placeholder="Auto-calculated from DOB"
              value={age ? `${age} years` : ""}
              onChangeText={() => {}}
              iconName="calendar-outline"
              editable={false}
            />

            {/* Gender - Now with Dropdown */}
            <GenderDropdown
              label="Child's Gender"
              value={childData.gender}
              onValueChange={(gender) => handleChange("gender", gender)}
            />
          </View>
        </>
      )}

      <DeleteConfirmModal
        visible={showDeleteModal}
        title={`Delete Child Setup ${index + 1}`}
        message="Are you sure you want to delete this child setup?"
        onCancel={() => setShowDeleteModal(false)}
        onDelete={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
      />
    </View>
  );
};

export default ChildSetupItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: colors.backgroundMain,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.backgroundSubtle,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ms(spacing.sm),
  },
  headerText: {
    ...typography.labelLarge,
  },
  arrowIcon: {
    width: rw(6),
    height: rh(6),
    resizeMode: "contain",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: colors.error,
  },
  divider: {
    height: rh(0.1),
    backgroundColor: colors.backgroundSubtle,
    marginHorizontal: ms(spacing.sm),
  },
  form: {
    padding: ms(spacing.md),
  },
});
