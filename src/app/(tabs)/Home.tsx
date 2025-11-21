import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <View style={styles.buttonContainer}>
        <Link href="/(tabs)/setup/childSetupScreen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Go to Child Setup</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/setup/Mum" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Go to Mum Setup</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
  button: {
    width: "80%",
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
