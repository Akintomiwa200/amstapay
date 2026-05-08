import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");
  const router = useRouter();

  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessPhone: "",
    email: "",
  });

  const [personalData, setPersonalData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (dataSetter, field, value) => {
    dataSetter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    if (accountType === "business") {
      if (!businessData.businessName || !businessData.businessPhone) {
        alert("Please fill required fields");
        return;
      }
    } else if (accountType === "personal") {
      if (!personalData.fullName || !personalData.phone) {
        alert("Please fill required fields");
        return;
      }
    }

    router.push("/verification-pending");
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1); // go back to step 1
    } else {
      router.back(); // exit screen if on step 1
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>A</Text>
            </View>
            <Text style={styles.title}>Register Account</Text>
            <Text style={styles.subtitle}>Step {currentStep} of 2</Text>
          </View>

          {/* Step 1 */}
          {currentStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>Select your account type</Text>

              {["personal", "business"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    accountType === type && styles.optionButtonSelected,
                  ]}
                  onPress={() => setAccountType(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      accountType === type && styles.optionTextSelected,
                    ]}
                  >
                    {type === "personal"
                      ? "Personal Account"
                      : "Business Account"}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !accountType && styles.continueButtonDisabled,
                ]}
                disabled={!accountType}
                onPress={() => setCurrentStep(2)}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2 - Business */}
          {currentStep === 2 && accountType === "business" && (
            <View>
              <Text style={styles.formTitle}>Register for Business Account</Text>

              <TextInput
                placeholder="Business Name"
                value={businessData.businessName}
                onChangeText={(text) =>
                  handleInputChange(setBusinessData, "businessName", text)
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Business Phone Number"
                value={businessData.businessPhone}
                onChangeText={(text) =>
                  handleInputChange(setBusinessData, "businessPhone", text)
                }
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                placeholder="Email Address (optional)"
                value={businessData.email}
                onChangeText={(text) =>
                  handleInputChange(setBusinessData, "email", text)
                }
                keyboardType="email-address"
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2 - Personal */}
          {currentStep === 2 && accountType === "personal" && (
            <View>
              <Text style={styles.formTitle}>Register for Personal Account</Text>

              <TextInput
                placeholder="Full Name"
                value={personalData.fullName}
                onChangeText={(text) =>
                  handleInputChange(setPersonalData, "fullName", text)
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Phone Number"
                value={personalData.phone}
                onChangeText={(text) =>
                  handleInputChange(setPersonalData, "phone", text)
                }
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                placeholder="Email Address (optional)"
                value={personalData.email}
                onChangeText={(text) =>
                  handleInputChange(setPersonalData, "email", text)
                }
                keyboardType="email-address"
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: "#f97316",
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBox: {
    backgroundColor: "#f97316",
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 15,
    color: "#111",
  },
  optionButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  optionButtonSelected: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  optionText: {
    textAlign: "center",
    fontWeight: "500",
    color: "#374151",
  },
  optionTextSelected: {
    color: "#f97316",
  },
  continueButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  continueButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
    marginBottom: 12,
  },
});