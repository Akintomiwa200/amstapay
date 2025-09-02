
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

// Ensure dependencies are installed:
// expo install expo-image-picker @react-native-picker/picker

export default function BusinessInfo({ data, handleInputChange }) {
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const businessTypes = ["Kiosk", "Store", "Office", "Other"];
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

  // Validate input fields in real-time
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (["businessName", "businessAddress", "businessType"].includes(field)) {
      newErrors[field] = value.trim() ? "" : `${field} is required`;
    }
    setErrors(newErrors);
  };

  // Handle input changes with validation
  const handleChange = (field, value) => {
    handleInputChange(field, value);
    validateField(field, value);
  };

  // Handle document upload
  const handleDocumentUpload = async (docType) => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your photo library to upload documents.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true, // Include base64 for backend submission
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri, base64 } = result.assets[0];
      handleInputChange(docType, { uri, base64 });

      // Upload document to /auth/upload-documents endpoint
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append(docType, {
          uri,
          type: "image/jpeg", // Adjust based on actual file type if needed
          name: `${docType}_${Date.now()}.jpg`,
        });

        const response = await fetch(`${API_BASE_URL}/auth/upload-documents`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          body: formData,
        });

        const responseData = await response.json();
        if (response.ok) {
          Alert.alert("Success", `${docType} uploaded successfully`);
        } else {
          throw new Error(responseData.message || "Failed to upload document");
        }
      } catch (error) {
        console.error(`Error uploading ${docType}:`, error);
        Alert.alert("Error", `Failed to upload ${docType}. Please try again.`);
      } finally {
        setIsUploading(false);
      }
    } else if (result.canceled) {
      Alert.alert("Cancelled", "Document upload cancelled");
    }
  };

  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Business Information</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Fill in your business details if you are registering as a business
      </Text>

      {/* Business Name */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Business Name *</Text>
        <TextInput
          placeholder="Enter business name"
          placeholderTextColor="#9CA3AF"
          value={data.businessName}
          onChangeText={(text) => handleChange("businessName", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
        {errors.businessName && <Text className="text-red-500 text-sm mt-1">{errors.businessName}</Text>}
      </View>

      {/* Business Address */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Business Address *</Text>
        <TextInput
          placeholder="Enter business address"
          placeholderTextColor="#9CA3AF"
          value={data.businessAddress}
          onChangeText={(text) => handleChange("businessAddress", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          multiline
        />
        {errors.businessAddress && (
          <Text className="text-red-500 text-sm mt-1">{errors.businessAddress}</Text>
        )}
      </View>

      {/* Business Type */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Business Type *</Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={data.businessType}
            onValueChange={(value) => handleChange("businessType", value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select business type" value="" />
            {businessTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
        {errors.businessType && <Text className="text-red-500 text-sm mt-1">{errors.businessType}</Text>}
      </View>

      {/* Upload Documents */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Upload Documents (Optional)</Text>
        <Text className="text-gray-500 text-xs mb-4">
          ID Document, Utility Bill, Passport Photo
        </Text>
        <View className="flex-row justify-between">
          {["idDocument", "utilityBill", "passportPhoto"].map((doc) => (
            <TouchableOpacity
              key={doc}
              className="items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-3"
              style={{ width: "30%" }}
              onPress={() => handleDocumentUpload(doc)}
              disabled={isUploading}
            >
              {data[doc] ? (
                <Image
                  source={{ uri: data[doc].uri }}
                  style={{ width: "100%", height: 80, borderRadius: 8 }}
                />
              ) : (
                <>
                  <Text className="text-2xl text-gray-400">+</Text>
                  <Text className="text-xs text-gray-500 mt-1 text-center">
                    {doc
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {isUploading && (
          <Text className="text-blue-600 text-sm mt-2">Uploading document...</Text>
        )}
      </View>
    </View>
  );
}
