// components/signup/Security.js
import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Security({ data, handleInputChange }) {
  const securityQuestionsList = [
    "What was your childhood nickname?",
    "What is the name of your favorite childhood friend?",
    "What street did you live on in third grade?",
    "What was the name of your first pet?",
    "What was your favorite food as a child?",
    "What was the make and model of your first car?",
    "What is your mother's maiden name?",
    "What is the name of your favorite teacher?",
    "What is your favorite movie?",
    "In what city did your parents meet?"
  ];

  const updateArrayField = (field, index, value) => {
  const current = Array.isArray(data[field]) ? data[field] : [];
  const newArray = [...current];
  newArray[index] = value;
  handleInputChange(field, newArray);
};


  return (
    <View className="space-y-5 mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Security Setup</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Set up security for all transactions
      </Text>

      {/* Security PIN */}
      <View>
        <Text className="text-gray-700 text-sm mb-2 font-medium">Create a 4-digit PIN *</Text>
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <TextInput
              placeholder="Enter PIN"
              placeholderTextColor="#9CA3AF"
              value={data.pin}
              onChangeText={(text) => handleInputChange("pin", text)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
          <View className="flex-1">
            <TextInput
              placeholder="Confirm PIN"
              placeholderTextColor="#9CA3AF"
              value={data.confirmPin}
              onChangeText={(text) => handleInputChange("confirmPin", text)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>
        {data.pin && data.confirmPin && data.pin !== data.confirmPin && (
          <Text className="text-red-600 text-sm mt-2">PINs do not match</Text>
        )}
      </View>

      {/* Security Questions */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Security Questions</Text>
        <Text className="text-gray-500 text-sm mb-4">
          Answer three security questions for account recovery
        </Text>

        {[0, 1].map((index) => (
          <View key={index} className="mb-4">
            <Text className="text-gray-700 text-sm mb-2 font-medium">Question {index + 1} *</Text>
            <View className="border border-gray-300 rounded-lg mb-2">
              <Picker
                selectedValue={data.selectedQuestions ? data.selectedQuestions[index] : ""}
                onValueChange={(value) => updateArrayField("selectedQuestions", index, value)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Select a question" value="" />
                {securityQuestionsList.map((question, qIndex) => (
                  <Picker.Item key={qIndex} label={question} value={question} />
                ))}
              </Picker>
            </View>
            <TextInput
              placeholder="Enter your answer"
              placeholderTextColor="#9CA3AF"
              value={data.securityQuestions[index]}
              onChangeText={(text) => updateArrayField("securityQuestions", index, text)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              secureTextEntry
            />
          </View>
        ))}
      </View>
    </View>
  );
}