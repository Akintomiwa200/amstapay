
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AccountTypeSelection({ accountType, setAccountType }) {
  const accountTypes = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "agent", label: "Agent", icon: "🤝" },
    { id: "business", label: "Business", icon: "🏢" },
    { id: "enterprise", label: "Enterprise", icon: "🏭" },
    { id: "company", label: "Company", icon: "🏛️" },
  ];

  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">Select Account Type</Text>
      <Text className="text-gray-500 text-sm mb-6">
        Choose the type of account you want to create
      </Text>
      <View className="space-y-3">
        {accountTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`p-4 rounded-xl border ${
              accountType === type.id
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 bg-white"
            } flex-row items-center`}
            onPress={() => setAccountType(type.id)}
          >
            <Text className="text-2xl mr-3">{type.icon}</Text>
            <Text
              className={`font-medium flex-1 ${
                accountType === type.id ? "text-orange-600" : "text-gray-700"
              }`}
            >
              {type.label}
            </Text>
            {accountType === type.id && <Text className="text-orange-600">✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
