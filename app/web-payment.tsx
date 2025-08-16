import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WebPaymentScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  const openLink = () => {
    if (typeof url === "string") {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Web Payment</Text>
      <Text>URL: {url}</Text>

      <TouchableOpacity style={styles.button} onPress={openLink}>
        <Text style={styles.buttonText}>Open in Browser</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "gray" }]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  button: { backgroundColor: "#00aa44", padding: 12, borderRadius: 6, marginTop: 20 },
  buttonText: { color: "#fff" },
});
