import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function MerchantPaymentScreen() {
  const { merchantId, merchantName, type } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Merchant Payment</Text>
      <Text>Merchant ID: {merchantId}</Text>
      <Text>Merchant Name: {merchantName}</Text>
      <Text>Type: {type}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
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
