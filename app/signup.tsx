import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("");
  const router = useRouter();

  // Agent form state
  const [agentData, setAgentData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    residentialAddress: "",
    
    // Identity Verification
    bvnOrNin: "",
    idDocument: null,
    passportPhoto: null,
    signature: null,
    
    // Business Information
    businessName: "",
    businessAddress: "",
    businessType: "",
    utilityBill: null,
    businessPhoto: null,
    
    // Financial Details
    bankName: "",
    accountName: "",
    accountNumber: "",
    
    // Guarantor Information
    guarantorName: "",
    guarantorRelationship: "",
    guarantorPhone: "",
    guarantorAddress: "",
    guarantorId: null,
    
    // Security
    pin: "",
    securityQuestions: ["", "", ""],
    
    // Agreements
    termsAgreed: false,
    infoAccurate: false,
    verificationConsent: false,
  });

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      router.push("/verification-pending");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setAgentData({
      ...agentData,
      [field]: value
    });
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return accountType !== "";
      case 2:
        return agentData.fullName && agentData.dateOfBirth && agentData.gender && 
               agentData.phoneNumber && agentData.email && agentData.residentialAddress;
      // Add validation for other steps as needed
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <AccountTypeSelection 
                 accountType={accountType} 
                 setAccountType={setAccountType} 
               />;
      case 2:
        return <PersonalInfo 
                 data={agentData} 
                 handleInputChange={handleInputChange} 
               />;
      case 3:
        return <BusinessInfo 
                 data={agentData} 
                 handleInputChange={handleInputChange} 
               />;
      case 4:
        return <FinancialInfo 
                 data={agentData} 
                 handleInputChange={handleInputChange} 
               />;
      case 5:
        return <Agreements 
                 data={agentData} 
                 handleInputChange={handleInputChange} 
               />;
      default:
        return <AccountTypeSelection 
                 accountType={accountType} 
                 setAccountType={setAccountType} 
               />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Progress Bar */}
      <View className="h-2 bg-gray-200">
        <View 
          className="h-full bg-orange-500" 
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </View>
      
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="items-center mb-6">
          <View className="bg-orange-500 w-16 h-16 rounded-2xl items-center justify-center mb-2">
            <Text className="text-white text-2xl font-bold">A</Text>
          </View>
          <Text className="text-xl font-semibold text-black">Agent Registration</Text>
          <Text className="text-gray-500 mt-1">Step {currentStep} of 5</Text>
        </View>

        {/* Form Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <View className="flex-row justify-between mt-8 mb-10">
          <TouchableOpacity
            className={`py-3 px-6 rounded-lg ${currentStep === 1 ? "opacity-0" : "bg-gray-200"}`}
            onPress={handlePrevStep}
            disabled={currentStep === 1}
          >
            <Text className="text-gray-700 font-medium">Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`py-3 px-6 rounded-lg ${isStepValid() ? "bg-orange-500" : "bg-gray-300"}`}
            onPress={handleNextStep}
            disabled={!isStepValid()}
          >
            <Text className="text-white font-medium">
              {currentStep === 5 ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Step 1 Component
function AccountTypeSelection({ accountType, setAccountType }) {
  const accountTypes = [
    { id: "personal", label: "Personal" },
    { id: "business", label: "Business" },
    { id: "enterprise", label: "Enterprise" },
    { id: "company", label: "Company" },
    { id: "agent", label: "Agent", highlighted: true },
  ];

  return (
    <View>
      <Text className="text-lg font-medium text-black mb-6 text-center">
        Select your account type
      </Text>
      
      <View className="space-y-4">
        {accountTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`p-4 rounded-xl border-2 ${
              accountType === type.id 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 bg-white"
            } ${type.highlighted ? "border-green-500" : ""}`}
            onPress={() => setAccountType(type.id)}
          >
            <Text className={`text-center font-medium ${
              accountType === type.id ? "text-orange-500" : "text-gray-700"
            }`}>
              {type.label}
              {type.highlighted && " 🟢"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text className="text-gray-500 text-sm mt-6 text-center">
        Selecting Agent account will require additional verification steps
      </Text>
    </View>
  );
}

// Step 2 Component
function PersonalInfo({ data, handleInputChange }) {
  return (
    <View className="space-y-6">
      <Text className="text-lg font-medium text-black mb-2">Personal Information</Text>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Full Name (as on BVN/NIN)</Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#999"
          value={data.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Date of Birth</Text>
        <TextInput
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#999"
          value={data.dateOfBirth}
          onChangeText={(text) => handleInputChange("dateOfBirth", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Gender</Text>
        <View className="flex-row space-x-4">
          {["Male", "Female", "Other"].map((gender) => (
            <TouchableOpacity
              key={gender}
              className={`px-4 py-2 rounded-full ${
                data.gender === gender ? "bg-orange-500" : "bg-gray-200"
              }`}
              onPress={() => handleInputChange("gender", gender)}
            >
              <Text className={data.gender === gender ? "text-white" : "text-gray-700"}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Phone Number (WhatsApp-enabled)</Text>
        <TextInput
          placeholder="Enter phone number"
          placeholderTextColor="#999"
          value={data.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
          keyboardType="phone-pad"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Email Address</Text>
        <TextInput
          placeholder="Enter email address"
          placeholderTextColor="#999"
          value={data.email}
          onChangeText={(text) => handleInputChange("email", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Residential Address</Text>
        <TextInput
          placeholder="Enter full address"
          placeholderTextColor="#999"
          value={data.residentialAddress}
          onChangeText={(text) => handleInputChange("residentialAddress", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
          multiline
        />
      </View>
    </View>
  );
}

// Step 3 Component
function BusinessInfo({ data, handleInputChange }) {
  const businessTypes = ["Kiosk", "Store", "Office", "Other"];
  
  return (
    <View className="space-y-6">
      <Text className="text-lg font-medium text-black mb-2">Business Information</Text>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Shop/Business Name</Text>
        <TextInput
          placeholder="Enter business name"
          placeholderTextColor="#999"
          value={data.businessName}
          onChangeText={(text) => handleInputChange("businessName", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Shop/Business Address</Text>
        <TextInput
          placeholder="Enter business address with landmark"
          placeholderTextColor="#999"
          value={data.businessAddress}
          onChangeText={(text) => handleInputChange("businessAddress", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
          multiline
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Type of Business</Text>
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {businessTypes.map((type) => (
            <TouchableOpacity
              key={type}
              className={`px-4 py-2 rounded-full ${
                data.businessType === type ? "bg-orange-500" : "bg-gray-200"
              }`}
              onPress={() => handleInputChange("businessType", type)}
            >
              <Text className={data.businessType === type ? "text-white" : "text-gray-700"}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">BVN or NIN</Text>
        <TextInput
          placeholder="Enter BVN or NIN"
          placeholderTextColor="#999"
          value={data.bvnOrNin}
          onChangeText={(text) => handleInputChange("bvnOrNin", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
          keyboardType="numeric"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Upload Documents</Text>
        <Text className="text-gray-500 text-xs mb-4">
          Government ID, Utility Bill, Passport Photo, etc.
        </Text>
        
        <View className="flex-row justify-between">
          {["ID Document", "Utility Bill", "Passport Photo"].map((doc) => (
            <TouchableOpacity
              key={doc}
              className="items-center border border-dashed border-gray-400 rounded-lg p-4"
              style={{ width: "30%" }}
            >
              <Text className="text-3xl text-gray-400">+</Text>
              <Text className="text-xs text-gray-500 mt-1 text-center">{doc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Step 4 Component
function FinancialInfo({ data, handleInputChange }) {
  return (
    <View className="space-y-6">
      <Text className="text-lg font-medium text-black mb-2">Financial Details</Text>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Preferred Settlement Bank</Text>
        <TextInput
          placeholder="Enter bank name"
          placeholderTextColor="#999"
          value={data.bankName}
          onChangeText={(text) => handleInputChange("bankName", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Account Name (must match BVN)</Text>
        <TextInput
          placeholder="Enter account name"
          placeholderTextColor="#999"
          value={data.accountName}
          onChangeText={(text) => handleInputChange("accountName", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
        />
      </View>
      
      <View>
        <Text className="text-gray-700 text-sm mb-2">Account Number</Text>
        <TextInput
          placeholder="Enter account number"
          placeholderTextColor="#999"
          value={data.accountNumber}
          onChangeText={(text) => handleInputChange("accountNumber", text)}
          className="border-b border-gray-300 text-base py-3 text-black"
          keyboardType="numeric"
        />
      </View>
      
      <View className="mt-6">
        <Text className="text-lg font-medium text-black mb-2">Guarantor Information</Text>
        
        <View>
          <Text className="text-gray-700 text-sm mb-2">Full Name</Text>
          <TextInput
            placeholder="Enter guarantor's full name"
            placeholderTextColor="#999"
            value={data.guarantorName}
            onChangeText={(text) => handleInputChange("guarantorName", text)}
            className="border-b border-gray-300 text-base py-3 text-black"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-700 text-sm mb-2">Relationship</Text>
          <TextInput
            placeholder="Enter relationship"
            placeholderTextColor="#999"
            value={data.guarantorRelationship}
            onChangeText={(text) => handleInputChange("guarantorRelationship", text)}
            className="border-b border-gray-300 text-base py-3 text-black"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            value={data.guarantorPhone}
            onChangeText={(text) => handleInputChange("guarantorPhone", text)}
            className="border-b border-gray-300 text-base py-3 text-black"
            keyboardType="phone-pad"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-700 text-sm mb-2">Address</Text>
          <TextInput
            placeholder="Enter address"
            placeholderTextColor="#999"
            value={data.guarantorAddress}
            onChangeText={(text) => handleInputChange("guarantorAddress", text)}
            className="border-b border-gray-300 text-base py-3 text-black"
            multiline
          />
        </View>
      </View>
    </View>
  );
}

// Step 5 Component
function Agreements({ data, handleInputChange }) {
  const agreements = [
    {
      id: "infoAccurate",
      label: "I confirm that all information provided is accurate."
    },
    {
      id: "termsAgreed",
      label: "I agree to AmaPay's Agent Terms & Conditions."
    },
    {
      id: "verificationConsent",
      label: "I consent to AmaPay verifying my information with third-party databases."
    }
  ];
  
  return (
    <View className="space-y-6">
      <Text className="text-lg font-medium text-black mb-2">Declaration & Agreement</Text>
      
      <View className="space-y-4">
        {agreements.map((agreement) => (
          <TouchableOpacity
            key={agreement.id}
            className="flex-row items-start"
            onPress={() => handleInputChange(agreement.id, !data[agreement.id])}
          >
            <View className={`w-6 h-6 rounded-md border-2 mr-3 mt-1 items-center justify-center ${
              data[agreement.id] ? "bg-orange-500 border-orange-500" : "border-gray-400"
            }`}>
              {data[agreement.id] && <Text className="text-white text-lg">✓</Text>}
            </View>
            <Text className="text-gray-700 flex-1">{agreement.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View className="mt-8 p-4 bg-orange-50 rounded-lg">
        <Text className="text-orange-800 font-medium mb-2">Verification Process</Text>
        <Text className="text-orange-700 text-sm">
          After submission, your application will be reviewed within 24-48 hours. 
          You'll receive SMS/Email updates about your verification status.
        </Text>
      </View>
    </View>
  );
}