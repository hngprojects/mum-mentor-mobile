// screens/ChildInfoScreen.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AddChildModal } from "./AddChildModal";
import { EditChildModal } from "./EditChildModal";

interface Child {
  id: number;
  name: string;
  age: string;
  image: string;
  gender: string;
  dateOfBirth: string;
  birthOrder: string;
}

// Main Child Info Screen
export default function ChildInfoScreen({ navigation }: any) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const [children] = useState<Child[]>([
    {
      id: 1,
      name: "Maya Michaels",
      age: "9 month old",
      image: "https://i.pravatar.cc/150?img=1",
      gender: "Female",
      dateOfBirth: "06/05/2025",
      birthOrder: "First born",
    },
    {
      id: 2,
      name: "Joy Stephens",
      age: "5 month old",
      image: "https://i.pravatar.cc/150?img=2",
      gender: "Female",
      dateOfBirth: "10/09/2025",
      birthOrder: "Second born",
    },
  ]);

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Child Info</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Children List */}
        {children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <Image source={{ uri: child.image }} style={styles.childAvatar} />
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childAge}>{child.age}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditChild(child)}
            >
              <Feather name="edit-2" size={20} color="#666" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Another Child Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add another child</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <EditChildModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedChild(null);
        }}
        child={selectedChild}
      />

      <AddChildModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  childCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    marginBottom: 16,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    borderWidth: 2,
    borderColor: "#E63946",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  addButtonText: {
    color: "#E63946",
    fontSize: 16,
    fontWeight: "600",
  },
});
