// components/signup/PersonalInfo.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PersonalInfo({ data, handleInputChange }) {
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = emailRegex.test(value) ? "" : "Invalid email format";
    }
    if (field === "password") {
      newErrors.password = value.length >= 6 ? "" : "Password must be at least 6 characters";
    }
    if (field === "bvnOrNin") {
      newErrors.bvnOrNin = value.length === 11 ? "" : "BVN/NIN must be 11 digits";
    }
    if (field === "phoneNumber") {
      const phoneRegex = /^\+?\d{10,14}$/;
      newErrors.phoneNumber = phoneRegex.test(value) ? "" : "Invalid phone number";
    }
    if (field === "dateOfBirth") {
      if (!value) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const today = new Date();
        const dob = new Date(value);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18) {
          newErrors.dateOfBirth = "You must be at least 18 years old";
        } else {
          newErrors.dateOfBirth = "";
        }
      }
    }
    if (["fullName", "residentialAddress"].includes(field)) {
      newErrors[field] = value.trim() ? "" : `${field} is required`;
    }
    if (field === "gender") {
      newErrors.gender = value ? "" : "Gender is required";
    }
    if (field === "idType") {
      newErrors.idType = value ? "" : "Please select an ID type";
    }
    setErrors(newErrors);
  };

  const handleChange = (field, value) => {
    handleInputChange(field, value);
    validateField(field, value);
  };

  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Personal Information</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Enter your personal details as they appear on your ID
      </Text>

      {/* Full Name */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Full Name *</Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#9CA3AF"
          value={data.fullName}
          onChangeText={(text) => handleChange("fullName", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
        {errors.fullName && <Text className="text-red-500 text-sm mt-1">{errors.fullName}</Text>}
      </View>

      {/* Email */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Email Address *</Text>
        <TextInput
          placeholder="Enter email address"
          placeholderTextColor="#9CA3AF"
          value={data.email}
          onChangeText={(text) => handleChange("email", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
      </View>

      {/* Password */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Password *</Text>
        <TextInput
          placeholder="Enter password (min 6 characters)"
          placeholderTextColor="#9CA3AF"
          value={data.password}
          onChangeText={(text) => handleChange("password", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          secureTextEntry
        />
        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}
      </View>

      {/* Date of Birth */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Date of Birth *</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
        >
          <Text className="text-gray-800">
            {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : "Select Date"}
          </Text>
        </TouchableOpacity>
        {errors.dateOfBirth && (
          <Text className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</Text>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={data.dateOfBirth ? new Date(data.dateOfBirth) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleChange("dateOfBirth", selectedDate.toISOString());
              }
            }}
          />
        )}
      </View>

      {/* Gender */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Gender *</Text>
        <View className="flex-row space-x-3">
          {["Male", "Female", "Other"].map((gender) => (
            <TouchableOpacity
              key={gender}
              className={`flex-1 px-4 py-3 rounded-lg ${
                data.gender === gender ? "bg-orange-600" : "bg-gray-100"
              }`}
              onPress={() => handleChange("gender", gender)}
            >
              <Text
                className={`text-center font-medium ${
                  data.gender === gender ? "text-white" : "text-gray-700"
                }`}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text className="text-red-500 text-sm mt-1">{errors.gender}</Text>}
      </View>

      {/* Phone */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">
          Phone Number (WhatsApp-enabled) *
        </Text>
        <TextInput
          placeholder="Enter phone number"
          placeholderTextColor="#9CA3AF"
          value={data.phoneNumber}
          onChangeText={(text) => handleChange("phoneNumber", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          keyboardType="phone-pad"
        />
        {errors.phoneNumber && (
          <Text className="text-red-500 text-sm mt-1">{errors.phoneNumber}</Text>
        )}
      </View>

      {/* Address */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Residential Address *</Text>
        <TextInput
          placeholder="Enter full address"
          placeholderTextColor="#9CA3AF"
          value={data.residentialAddress}
          onChangeText={(text) => handleChange("residentialAddress", text)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          multiline
        />
        {errors.residentialAddress && (
          <Text className="text-red-500 text-sm mt-1">{errors.residentialAddress}</Text>
        )}
      </View>

      {/* ID Type */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">ID Type *</Text>
        <View className="flex-row space-x-3">
          {["BVN", "NIN"].map((type) => (
            <TouchableOpacity
              key={type}
              className={`flex-1 px-4 py-3 rounded-lg ${
                data.idType === type.toLowerCase() ? "bg-orange-600" : "bg-gray-100"
              }`}
              onPress={() => handleChange("idType", type.toLowerCase())}
            >
              <Text
                className={`text-center font-medium ${
                  data.idType === type.toLowerCase() ? "text-white" : "text-gray-700"
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.idType && <Text className="text-red-500 text-sm mt-1">{errors.idType}</Text>}
      </View>

      {/* BVN/NIN */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">BVN or NIN Number *</Text>
        <View className="flex-row space-x-3">
          <TextInput
            placeholder="Enter BVN or NIN"
            placeholderTextColor="#9CA3AF"
            value={data.bvnOrNin}
            onChangeText={(text) => handleChange("bvnOrNin", text)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            keyboardType="numeric"
          />
          <TouchableOpacity className="px-4 py-3 rounded-lg bg-gray-400" disabled>
            <Text className="text-white font-medium">Verify Later</Text>
          </TouchableOpacity>
        </View>
        {errors.bvnOrNin && <Text className="text-red-500 text-sm mt-1">{errors.bvnOrNin}</Text>}
        <Text className="text-blue-600 text-sm mt-2">
          ℹ️ ID verification is temporarily disabled. You can proceed with registration.
        </Text>
      </View>
    </View>
  );
}
