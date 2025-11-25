import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>About Nora</Text>

      {/* Mission Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Our Mission</Text>
        <Text style={styles.cardBody}>
          We aim to make motherhood easier by providing clear insights, gentle
          reminders, and helpful tools designed to bring confidence and calm to
          your daily experience.
        </Text>
      </View>

      {/* How It Works */}
      <Text style={styles.sectionTitle}>How It Works</Text>

      <View style={styles.cardList}>
        <AboutItem
          icon="notifications-outline"
          title="Personalized Guidance"
          text="Receive advice tailored to your unique journey and questions."
        />

        <AboutItem
          icon="time-outline"
          title="24/7 Support"
          text="We are here for you anytime, day or night."
        />

        <AboutItem
          icon="library-outline"
          title="Resource Library"
          text="Access a curated library of articles and tips."
        />
      </View>

      {/* Technology */}
      <Text style={styles.sectionTitle}>Our Technology</Text>

      <View style={styles.cardList}>
        <AboutItem
          icon="bulb-outline"
          title="Supportive AI"
          text="Our AI learns from your conversations to provide relevant and helpful guidance, always ensuring your privacy and data are safe."
        />
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

function AboutItem({
  icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.itemCard}>
      <Ionicons name={icon} size={22} color="#555" />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    borderColor: "#eee",
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  cardBody: { color: "#555", fontSize: 14, lineHeight: 20 },
  cardList: { gap: 12 },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    borderColor: "#eee",
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
  },
  itemTitle: { fontSize: 15, fontWeight: "600", marginBottom: 3 },
  itemText: { fontSize: 13.5, color: "#555", lineHeight: 18 },
  version: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    marginVertical: 40,
  },
});
