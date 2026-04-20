



// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   Modal,
//   ActivityIndicator,
// } from "react-native";

// // Import step components
// import PersonalInfo from "../components/signup/PersonalInfo";
// import BusinessInfo from "../components/signup/BusinessInfo";
// import FinancialInfo from "../components/signup/FinancialInfo";
// import GuarantorInfo from "../components/signup/GuarantorInfo";
// import Agreements from "../components/signup/Agreements";
// import AccountTypeSelection from "../components/signup/AccountTypeSelection";
// import Security from "../components/signup/Security";

// // API base
// const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

// export default function SignupScreen() {
//   const router = useRouter();

//   const [accountType, setAccountType] = useState("");
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   const [formData, setFormData] = useState({
//     // Personal
//     fullName: "",
//     dateOfBirth: "",
//     gender: "",
//     phoneNumber: "",
//     email: "",
//     password: "",
//     residentialAddress: "",
//     // ID
//     idType: "",
//     bvnOrNin: "",
//     idDocument: null,
//     utilityBill: null,
//     passportPhoto: null,
//     // Business
//     businessName: "",
//     businessAddress: "",
//     businessType: "",
//     // Financial
//     bankName: "",
//     accountName: "",
//     accountNumber: "",
//     // Guarantor
//     guarantorName: "",
//     guarantorRelationship: "",
//     guarantorPhone: "",
//     guarantorAddress: "",
//     // Security
//     pin: "",
//     confirmPin: "",
//     selectedQuestions: ["", ""], 
//     securityQuestions: ["", ""],
//     // Agreements
//     termsAgreed: false,
//     infoAccurate: false,
//     verificationConsent: false,
//   });

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Steps by type
//   const stepsByAccountType = {
//     personal: ["AccountTypeSelection", "PersonalInfo", "FinancialInfo", "Security", "Agreements"],
//     agent: [
//       "AccountTypeSelection",
//       "PersonalInfo",
//       "FinancialInfo",
//       "GuarantorInfo",
//       "Security",
//       "Agreements",
//     ],
//     business: [
//       "AccountTypeSelection",
//       "PersonalInfo",
//       "BusinessInfo",
//       "FinancialInfo",
//       "Security",
//       "Agreements",
//     ],
//     enterprise: [
//       "AccountTypeSelection",
//       "PersonalInfo",
//       "BusinessInfo",
//       "FinancialInfo",
//       "Security",
//       "Agreements",
//     ],
//     company: [
//       "AccountTypeSelection",
//       "PersonalInfo",
//       "BusinessInfo",
//       "FinancialInfo",
//       "Security",
//       "Agreements",
//     ],
//   };

//   const steps = stepsByAccountType[accountType] || [];
//   const currentStep = steps[currentStepIndex];

//   // Validate current step
//   const isStepValid = () => {
//     switch (currentStep) {
//       case "AccountTypeSelection":
//         return accountType !== "";
//       case "PersonalInfo":
//         return (
//           formData.fullName &&
//           formData.dateOfBirth &&
//           formData.gender &&
//           formData.phoneNumber &&
//           formData.email &&
//           formData.residentialAddress &&
//           formData.bvnOrNin &&
//           formData.password
//         );
//       case "BusinessInfo":
//         return (
//           !["business", "enterprise", "company"].includes(accountType) ||
//           (formData.businessName && formData.businessAddress && formData.businessType)
//         );
//       case "FinancialInfo":
//         return formData.bankName && formData.accountNumber && formData.accountName;
//       case "GuarantorInfo":
//         return (
//           accountType !== "agent" ||
//           (formData.guarantorName && formData.guarantorPhone)
//         );
//       case "Security":
//         return (
//           formData.pin &&
//           formData.confirmPin &&
//           formData.pin === formData.confirmPin &&
//           formData.pin.length === 4 &&
//           formData.securityQuestions.every((q) => q.trim() !== "")
//         );
//       case "Agreements":
//         return formData.termsAgreed && formData.infoAccurate && formData.verificationConsent;
//       default:
//         return true;
//     }
//   };

//   const handleNextStep = () => {
//     try {
//       if (!isStepValid()) {
//         Alert.alert("Error", "Please complete all required fields in this step");
//         return;
//       }
//       if (currentStepIndex < steps.length - 1) {
//         setCurrentStepIndex((prev) => prev + 1);
//       } else {
//         handleSubmit();
//       }
//     } catch (err) {
//       console.error("Navigation error:", err);
//       Alert.alert("Error", "Failed to proceed to the next step");
//     }
//   };

//   const handlePrevStep = () => {
//     try {
//       if (currentStepIndex > 0) {
//         setCurrentStepIndex((prev) => prev - 1);
//       }
//     } catch (err) {
//       console.error("Navigation error:", err);
//       Alert.alert("Error", "Failed to go back");
//     }
//   };

//  // Submit to backend
// const handleSubmit = async () => {
//   // Required field checks
//   const requiredFields = [
//     "fullName",
//     "email",
//     "phoneNumber",
//     "termsAgreed",
//     "infoAccurate",
//     "verificationConsent",
//     "password",
//     "pin",
//     "confirmPin",
//   ];

//   if (["business", "enterprise", "company"].includes(accountType)) {
//     requiredFields.push("businessName", "businessAddress", "businessType");
//   }

//   if (accountType === "agent") {
//     requiredFields.push("guarantorName", "guarantorPhone");
//   }

//   // Check for missing fields in formData
//   let missingFields = requiredFields.filter((field) => !formData[field]);

//   // Check accountType separately (since it's outside formData)
//   if (!accountType) {
//     missingFields.push("accountType");
//   }

//   if (missingFields.length > 0) {
//     Alert.alert(
//       "Error",
//       `Please fill in the following fields:\n\n${missingFields.join(", ")}`
//     );
//     return;
//   }

//   // Additional validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(formData.email)) {
//     Alert.alert("Error", "Invalid email format");
//     return;
//   }

//   if (formData.password.length < 6) {
//     Alert.alert("Error", "Password must be at least 6 characters");
//     return;
//   }

//   if (formData.pin !== formData.confirmPin || formData.pin.length !== 4) {
//     Alert.alert("Error", "PINs must match and be 4 digits");
//     return;
//   }

//   setIsSubmitting(true);
//   try {
//     const payload = {
//       ...formData,
//       accountType,
//       idDocument: formData.idDocument ? formData.idDocument.base64 : null,
//       utilityBill: formData.utilityBill ? formData.utilityBill.base64 : null,
//       passportPhoto: formData.passportPhoto ? formData.passportPhoto.base64 : null,
//       timestamp: new Date().toISOString(),
//     };

//     console.log("Submitting to:", `${API_BASE_URL}/auth/signup`);
//     console.log("Data:", JSON.stringify(payload, null, 2));

//     const response = await fetch(`${API_BASE_URL}/auth/signup`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       setVerificationSent(true);
//       Alert.alert(
//         "Success",
//         "Registration successful! Check your email for verification code."
//       );
//     } else {
//       const errorMessage =
//         {
//           400: "Invalid input data",
//           401: "Unauthorized request",
//           409: "Account already exists",
//           500: "Server error, please try again later",
//         }[response.status] || data.message || data.error || "Signup failed";
//       throw new Error(errorMessage);
//     }
//   } catch (err) {
//     console.error("Signup error:", err);
//     Alert.alert("Error", err.message || "Registration failed. Please try again.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   const renderStep = () => {
//     switch (currentStep) {
//       case "AccountTypeSelection":
//         return <AccountTypeSelection accountType={accountType} setAccountType={setAccountType} />;
//       case "PersonalInfo":
//         return <PersonalInfo data={formData} handleInputChange={handleInputChange} />;
//       case "BusinessInfo":
//         return <BusinessInfo data={formData} handleInputChange={handleInputChange} />;
//       case "FinancialInfo":
//         return <FinancialInfo data={formData} handleInputChange={handleInputChange} />;
//       case "GuarantorInfo":
//         return <GuarantorInfo data={formData} handleInputChange={handleInputChange} />;
//       case "Security":
//         return <Security data={formData} handleInputChange={handleInputChange} />;
//       case "Agreements":
//         return <Agreements data={formData} handleInputChange={handleInputChange} />;
//       default:
//         return (
//           <AccountTypeSelection accountType={accountType} setAccountType={setAccountType} />
//         );
//     }
//   };

//   // Success screen
//   if (verificationSent) {
//     return (
//       <View className="flex-1 bg-white justify-center items-center p-6">
//         <Text className="text-2xl font-bold text-green-600 mb-4">Verification Sent!</Text>
//         <Text className="text-lg text-gray-700 text-center mb-6">
//           A 6-digit verification code has been sent to your email. Enter it to activate your
//           account.
//         </Text>
//         <TouchableOpacity
//           className="bg-orange-600 py-4 px-8 rounded-lg"
//           onPress={() => router.push({ pathname: "/verify", params: { email: formData.email } })}
//         >
//           <Text className="text-white font-medium text-center">Enter Code</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
//         <TouchableOpacity onPress={() => router.back()} className="p-2">
//           <Text className="text-2xl">←</Text>
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-gray-800">Create Account</Text>
//         <View className="w-8" />
//       </View>

//       {/* Progress bar */}
//       <View className="flex-row px-6 pb-4">
//         {steps.map((step, idx) => (
//           <View
//             key={step}
//             className={`flex-1 h-1 mx-1 rounded-full ${
//               idx <= currentStepIndex ? "bg-orange-600" : "bg-gray-300"
//             }`}
//           />
//         ))}
//       </View>

//       {/* Form content */}
//       <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: 30 }}>
//         {renderStep()}

//         {/* Nav buttons */}
//         {steps.length > 0 && (
//           <View className="flex-row justify-between mt-8 mb-10">
//             <TouchableOpacity
//               className={`py-4 px-6 rounded-lg ${
//                 currentStepIndex === 0 ? "opacity-0" : "bg-gray-100"
//               }`}
//               onPress={handlePrevStep}
//               disabled={currentStepIndex === 0}
//             >
//               <Text className="text-gray-700 font-medium">Back</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               className={`py-4 px-8 rounded-lg ${isStepValid() ? "bg-orange-600" : "bg-gray-300"}`}
//               onPress={handleNextStep}
//               disabled={!isStepValid() || isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text className="text-white font-medium">
//                   {currentStepIndex === steps.length - 1 ? "Submit" : "Continue"}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>

//       {/* Modal for notes */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View className="flex-1 justify-center items-center bg-black/50">
//           <View className="bg-white p-6 rounded-lg w-5/6">
//             <Text className="text-lg font-bold text-gray-800 mb-4">Implementation Note</Text>
//             <Text className="text-gray-700 mb-2">• NIBSS API for BVN verification</Text>
//             <Text className="text-gray-700 mb-2">• NIMC for NIN verification</Text>
//             <Text className="text-gray-700 mb-4">• Paystack/Flutterwave for bank verification</Text>
//             <TouchableOpacity
//               className="bg-orange-600 py-3 rounded-lg mt-2"
//               onPress={() => setModalVisible(false)}
//             >
//               <Text className="text-white font-medium text-center">I Understand</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }





// signup.tsx
// import React, { useState, useRef } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   StatusBar,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
// import { Eye, EyeOff, User, Mail, Phone, Lock, ChevronLeft, Check } from 'lucide-react-native';

// const { width } = Dimensions.get('window');

// // ─── Color tokens ────────────────────────────────────────────────────────────
// const C = {
//   bg: '#FFFFFF',
//   primary: '#2D0057',
//   primaryMid: '#3D0070',
//   mint: '#22f0c3',
//   blue: '#2db3ff',
//   violet: '#8b5cf6',
//   pink: '#ff3cac',
//   text: '#1a0035',
//   textSub: '#6B7280',
//   border: '#E8E0F0',
//   inputBg: '#FAF8FC',
//   error: '#ef4444',
// };

// // ─── Step indicator ───────────────────────────────────────────────────────────
// function StepBar({ step }: { step: number }) {
//   const steps = ['Account', 'Personal', 'Security'];
//   return (
//     <View style={sb.wrap}>
//       {steps.map((label, i) => {
//         const done = i < step;
//         const active = i === step;
//         return (
//           <React.Fragment key={i}>
//             <View style={sb.stepCol}>
//               <View style={[sb.circle, done && sb.circleDone, active && sb.circleActive]}>
//                 {done ? (
//                   <Check size={12} color="#fff" strokeWidth={3} />
//                 ) : (
//                   <Text style={[sb.num, active && sb.numActive]}>{i + 1}</Text>
//                 )}
//               </View>
//               <Text style={[sb.label, active && sb.labelActive, done && sb.labelDone]}>
//                 {label}
//               </Text>
//             </View>
//             {i < steps.length - 1 && (
//               <View style={[sb.line, (done || (i === step - 1)) && sb.lineDone]} />
//             )}
//           </React.Fragment>
//         );
//       })}
//     </View>
//   );
// }

// const sb = StyleSheet.create({
//   wrap: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     marginBottom: 32,
//     paddingHorizontal: 8,
//   },
//   stepCol: { alignItems: 'center', gap: 6 },
//   circle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#EDE8F5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1.5,
//     borderColor: C.border,
//   },
//   circleDone: { backgroundColor: C.mint, borderColor: C.mint },
//   circleActive: { backgroundColor: C.primary, borderColor: C.primary },
//   num: { fontSize: 13, fontWeight: '600', color: C.textSub },
//   numActive: { color: '#fff' },
//   label: { fontSize: 11, color: C.textSub, fontWeight: '500', letterSpacing: 0.3 },
//   labelActive: { color: C.primary, fontWeight: '700' },
//   labelDone: { color: C.mint },
//   line: {
//     flex: 1,
//     height: 2,
//     backgroundColor: C.border,
//     marginTop: 15,
//     marginHorizontal: 6,
//     borderRadius: 1,
//   },
//   lineDone: { backgroundColor: C.mint },
// });

// // ─── Styled Input ─────────────────────────────────────────────────────────────
// interface InputProps {
//   label: string;
//   placeholder: string;
//   value: string;
//   onChangeText: (v: string) => void;
//   icon: React.ReactNode;
//   secure?: boolean;
//   keyboardType?: any;
//   error?: string;
//   autoCapitalize?: any;
// }

// function StyledInput({
//   label, placeholder, value, onChangeText,
//   icon, secure, keyboardType, error, autoCapitalize = 'none',
// }: InputProps) {
//   const [focused, setFocused] = useState(false);
//   const [visible, setVisible] = useState(!secure);

//   return (
//     <View style={inp.wrap}>
//       <Text style={inp.label}>{label}</Text>
//       <View style={[inp.row, focused && inp.rowFocused, !!error && inp.rowError]}>
//         <View style={inp.iconWrap}>{icon}</View>
//         <TextInput
//           style={inp.input}
//           placeholder={placeholder}
//           placeholderTextColor="#B0A8C0"
//           value={value}
//           onChangeText={onChangeText}
//           secureTextEntry={!visible}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//         />
//         {secure && (
//           <TouchableOpacity onPress={() => setVisible(v => !v)} style={inp.eye}>
//             {visible
//               ? <Eye size={18} color={C.textSub} />
//               : <EyeOff size={18} color={C.textSub} />}
//           </TouchableOpacity>
//         )}
//       </View>
//       {!!error && <Text style={inp.error}>{error}</Text>}
//     </View>
//   );
// }

// const inp = StyleSheet.create({
//   wrap: { marginBottom: 16 },
//   label: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: C.primary,
//     marginBottom: 8,
//     letterSpacing: 0.2,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: C.inputBg,
//     borderRadius: 14,
//     borderWidth: 1.5,
//     borderColor: C.border,
//     paddingHorizontal: 14,
//     height: 54,
//   },
//   rowFocused: { borderColor: C.primary, backgroundColor: '#fff' },
//   rowError: { borderColor: C.error },
//   iconWrap: { marginRight: 10 },
//   input: {
//     flex: 1,
//     fontSize: 15,
//     color: C.text,
//     fontWeight: '500',
//   },
//   eye: { padding: 4 },
//   error: { fontSize: 12, color: C.error, marginTop: 4, marginLeft: 4 },
// });

// // ─── Password strength ────────────────────────────────────────────────────────
// function PasswordStrength({ password }: { password: string }) {
//   const checks = [
//     { label: 'At least 8 characters', ok: password.length >= 8 },
//     { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
//     { label: 'Number', ok: /[0-9]/.test(password) },
//     { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
//   ];
//   const score = checks.filter(c => c.ok).length;
//   const colors = ['#ef4444', '#f97316', '#eab308', '#22f0c3'];
//   const labels = ['Weak', 'Fair', 'Good', 'Strong'];

//   if (!password) return null;

//   return (
//     <View style={ps.wrap}>
//       <View style={ps.bars}>
//         {[0, 1, 2, 3].map(i => (
//           <View
//             key={i}
//             style={[ps.bar, { backgroundColor: i < score ? colors[score - 1] : C.border }]}
//           />
//         ))}
//       </View>
//       <Text style={[ps.scoreLabel, { color: score > 0 ? colors[score - 1] : C.textSub }]}>
//         {score > 0 ? labels[score - 1] : ''}
//       </Text>
//       <View style={ps.checks}>
//         {checks.map((c, i) => (
//           <View key={i} style={ps.checkRow}>
//             <View style={[ps.dot, { backgroundColor: c.ok ? C.mint : C.border }]} />
//             <Text style={[ps.checkLabel, { color: c.ok ? C.primary : C.textSub }]}>{c.label}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// }

// const ps = StyleSheet.create({
//   wrap: { marginTop: -4, marginBottom: 16 },
//   bars: { flexDirection: 'row', gap: 6, marginBottom: 4 },
//   bar: { flex: 1, height: 4, borderRadius: 2 },
//   scoreLabel: { fontSize: 12, fontWeight: '700', marginBottom: 10 },
//   checks: { gap: 6 },
//   checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   dot: { width: 7, height: 7, borderRadius: 4 },
//   checkLabel: { fontSize: 12, fontWeight: '500' },
// });

// // ─── Gradient CTA button ──────────────────────────────────────────────────────
// function GradientButton({ label, onPress, loading }: { label: string; onPress: () => void; loading?: boolean }) {
//   return (
//     <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={btn.outer}>
//       <LinearGradient
//         colors={[C.mint, C.blue, C.violet, C.pink]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={btn.inner}
//       >
//         <Text style={btn.label}>{loading ? 'Creating account…' : label}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// }

// const btn = StyleSheet.create({
//   outer: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
//   inner: {
//     height: 56,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   label: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
// });

// // ─── Main screen ──────────────────────────────────────────────────────────────
// type FormData = {
//   email: string;
//   username: string;
//   phone: string;
//   firstName: string;
//   lastName: string;
//   dob: string;
//   password: string;
//   confirmPassword: string;
// };

// type Errors = Partial<Record<keyof FormData, string>>;

// export default function SignupScreen() {
//   const router = useRouter();
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState<FormData>({
//     email: '',
//     username: '',
//     phone: '',
//     firstName: '',
//     lastName: '',
//     dob: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState<Errors>({});
//   const [agreed, setAgreed] = useState(false);

//   const set = (key: keyof FormData) => (val: string) => {
//     setForm(f => ({ ...f, [key]: val }));
//     if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
//   };

//   // ── Validation per step ──
//   const validate = (): boolean => {
//     const e: Errors = {};
//     if (step === 0) {
//       if (!form.email.includes('@')) e.email = 'Enter a valid email address';
//       if (form.username.length < 3) e.username = 'Username must be at least 3 characters';
//       if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number';
//     }
//     if (step === 1) {
//       if (!form.firstName.trim()) e.firstName = 'First name is required';
//       if (!form.lastName.trim()) e.lastName = 'Last name is required';
//       if (!form.dob.match(/^\d{2}\/\d{2}\/\d{4}$/)) e.dob = 'Use format DD/MM/YYYY';
//     }
//     if (step === 2) {
//       if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
//       if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
//       if (!agreed) e.confirmPassword = (e.confirmPassword || '') + ' — please accept the terms';
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleNext = () => {
//     if (!validate()) return;
//     if (step < 2) {
//       setStep(s => s + 1);
//     } else {
//       setLoading(true);
//       setTimeout(() => {
//         setLoading(false);
//         router.replace('/dashboard');
//       }, 1800);
//     }
//   };

//   const stepTitles = [
//     { h: 'Create your account', sub: 'Start with your basic details' },
//     { h: 'Personal information', sub: 'We need to verify your identity' },
//     { h: 'Secure your wallet', sub: 'Choose a strong password' },
//   ];

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
//       <ScrollView
//         style={s.scroll}
//         contentContainerStyle={s.content}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={s.header}>
//           <TouchableOpacity
//             style={s.back}
//             onPress={() => step > 0 ? setStep(s => s - 1) : router.back()}
//           >
//             <ChevronLeft size={22} color={C.primary} />
//           </TouchableOpacity>

//           {/* Logo wordmark */}
//           <View style={s.logoWrap}>
//             <LinearGradient
//               colors={[C.mint, C.blue, C.violet, C.pink]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={s.logoBar}
//             />
//             <Text style={s.logoText}>AmstaPay</Text>
//           </View>

//           <View style={{ width: 36 }} />
//         </View>

//         {/* Step titles */}
//         <View style={s.titleBlock}>
//           <Text style={s.heading}>{stepTitles[step].h}</Text>
//           <Text style={s.sub}>{stepTitles[step].sub}</Text>
//         </View>

//         {/* Step bar */}
//         <StepBar step={step} />

//         {/* ── Step 0: Account ── */}
//         {step === 0 && (
//           <View style={s.form}>
//             <StyledInput
//               label="Email address"
//               placeholder="you@example.com"
//               value={form.email}
//               onChangeText={set('email')}
//               icon={<Mail size={18} color={errors.email ? C.error : C.primary} />}
//               keyboardType="email-address"
//               error={errors.email}
//             />
//             <StyledInput
//               label="Username"
//               placeholder="e.g. john_doe"
//               value={form.username}
//               onChangeText={set('username')}
//               icon={<User size={18} color={errors.username ? C.error : C.primary} />}
//               error={errors.username}
//             />
//             <StyledInput
//               label="Phone number"
//               placeholder="+234 800 000 0000"
//               value={form.phone}
//               onChangeText={set('phone')}
//               icon={<Phone size={18} color={errors.phone ? C.error : C.primary} />}
//               keyboardType="phone-pad"
//               error={errors.phone}
//             />
//           </View>
//         )}

//         {/* ── Step 1: Personal ── */}
//         {step === 1 && (
//           <View style={s.form}>
//             <View style={s.row2}>
//               <View style={{ flex: 1 }}>
//                 <StyledInput
//                   label="First name"
//                   placeholder="John"
//                   value={form.firstName}
//                   onChangeText={set('firstName')}
//                   icon={<User size={18} color={errors.firstName ? C.error : C.primary} />}
//                   autoCapitalize="words"
//                   error={errors.firstName}
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <StyledInput
//                   label="Last name"
//                   placeholder="Doe"
//                   value={form.lastName}
//                   onChangeText={set('lastName')}
//                   icon={<User size={18} color={errors.lastName ? C.error : C.primary} />}
//                   autoCapitalize="words"
//                   error={errors.lastName}
//                 />
//               </View>
//             </View>
//             <StyledInput
//               label="Date of birth"
//               placeholder="DD/MM/YYYY"
//               value={form.dob}
//               onChangeText={set('dob')}
//               icon={<Mail size={18} color={errors.dob ? C.error : C.primary} />}
//               keyboardType="numeric"
//               error={errors.dob}
//             />

//             {/* Info callout */}
//             <View style={s.infoBox}>
//               <Text style={s.infoIcon}>🔒</Text>
//               <Text style={s.infoText}>
//                 Your personal details are encrypted and used only for KYC verification. We never sell your data.
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* ── Step 2: Security ── */}
//         {step === 2 && (
//           <View style={s.form}>
//             <StyledInput
//               label="Password"
//               placeholder="Create a strong password"
//               value={form.password}
//               onChangeText={set('password')}
//               icon={<Lock size={18} color={errors.password ? C.error : C.primary} />}
//               secure
//               error={errors.password}
//             />
//             <PasswordStrength password={form.password} />

//             <StyledInput
//               label="Confirm password"
//               placeholder="Repeat your password"
//               value={form.confirmPassword}
//               onChangeText={set('confirmPassword')}
//               icon={<Lock size={18} color={errors.confirmPassword ? C.error : C.primary} />}
//               secure
//               error={errors.confirmPassword}
//             />

//             {/* Terms checkbox */}
//             <Pressable style={s.checkRow} onPress={() => setAgreed(a => !a)}>
//               <View style={[s.checkbox, agreed && s.checkboxOn]}>
//                 {agreed && <Check size={12} color="#fff" strokeWidth={3} />}
//               </View>
//               <Text style={s.termsText}>
//                 I agree to the{' '}
//                 <Text style={s.termsLink}>Terms of Service</Text>
//                 {' '}and{' '}
//                 <Text style={s.termsLink}>Privacy Policy</Text>
//               </Text>
//             </Pressable>
//           </View>
//         )}

//         {/* CTA */}
//         <View style={s.cta}>
//           <GradientButton
//             label={step === 2 ? 'Create Account' : 'Continue'}
//             onPress={handleNext}
//             loading={loading}
//           />
//         </View>

//         {/* Login link */}
//         <TouchableOpacity style={s.loginRow} onPress={() => router.push('/login')}>
//           <Text style={s.loginText}>Already have an account? </Text>
//           <Text style={s.loginAccent}>Sign in</Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const s = StyleSheet.create({
//   scroll: { flex: 1, backgroundColor: C.bg },
//   content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 32,
//   },
//   back: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: '#F3EFF8',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoWrap: { alignItems: 'center', gap: 4 },
//   logoBar: { width: 48, height: 3, borderRadius: 2 },
//   logoText: {
//     fontSize: 17,
//     fontWeight: '800',
//     color: C.primary,
//     letterSpacing: -0.3,
//   },

//   titleBlock: { marginBottom: 28 },
//   heading: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: C.primary,
//     letterSpacing: -0.5,
//     marginBottom: 6,
//   },
//   sub: { fontSize: 15, color: C.textSub, fontWeight: '400', lineHeight: 22 },

//   form: { gap: 0 },
//   row2: { flexDirection: 'row', gap: 12 },

//   infoBox: {
//     flexDirection: 'row',
//     backgroundColor: '#F3EFF8',
//     borderRadius: 12,
//     padding: 14,
//     gap: 10,
//     alignItems: 'flex-start',
//     marginTop: 4,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   infoIcon: { fontSize: 16 },
//   infoText: { flex: 1, fontSize: 13, color: C.textSub, lineHeight: 19, fontWeight: '400' },

//   checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 4, marginBottom: 8 },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 1.5,
//     borderColor: C.border,
//     backgroundColor: C.inputBg,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 1,
//   },
//   checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
//   termsText: { flex: 1, fontSize: 13, color: C.textSub, lineHeight: 20 },
//   termsLink: { color: C.violet, fontWeight: '700' },

//   cta: { marginTop: 24 },
//   loginRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//     paddingVertical: 8,
//   },
//   loginText: { fontSize: 14, color: C.textSub },
//   loginAccent: { fontSize: 14, color: C.violet, fontWeight: '700' },
// });








// signup.tsx
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  User,
  Phone,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  CreditCard,
  Users,
  Shield,
  FileText,
  AlertCircle,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// ─── Color tokens (shared app palette) ───────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  primary: "#2D0057",
  primaryLight: "#F3EFF8",
  mint: "#22f0c3",
  blue: "#2db3ff",
  violet: "#8b5cf6",
  pink: "#ff3cac",
  text: "#1a0035",
  textSub: "#6B7280",
  border: "#E8E0F0",
  inputBg: "#FAF8FC",
  error: "#ef4444",
  success: "#22f0c3",
  warning: "#f59e0b",
};

// ─── Gradient CTA ─────────────────────────────────────────────────────────────
function GradientButton({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || loading}
      style={[btn.outer, (disabled || loading) && btn.dimmed]}
    >
      <LinearGradient
        colors={
          disabled || loading
            ? ["#D1C4E9", "#D1C4E9"]
            : [C.mint, C.blue, C.violet, C.pink]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={btn.inner}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={btn.label}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  outer: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
  dimmed: { opacity: 0.7 },
  inner: { height: 56, alignItems: "center", justifyContent: "center" },
  label: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },
});

// ─── Secondary Button ─────────────────────────────────────────────────────────
function SecondaryButton({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || loading}
      style={[btnSec.outer, (disabled || loading) && btnSec.dimmed]}
    >
      <View style={btnSec.inner}>
        {loading ? (
          <ActivityIndicator color={C.primary} />
        ) : (
          <Text style={btnSec.label}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const btnSec = StyleSheet.create({
  outer: { borderRadius: 14, overflow: "hidden", marginTop: 8, flex: 1 },
  dimmed: { opacity: 0.7 },
  inner: { 
    height: 56, 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: C.primaryLight,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  label: { color: C.primary, fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },
});

// ─── Styled text input ────────────────────────────────────────────────────────
function StyledInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secure,
  keyboardType,
  error,
  editable = true,
  autoCapitalize = "none",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  icon?: React.ReactNode;
  secure?: boolean;
  keyboardType?: any;
  error?: string;
  editable?: boolean;
  autoCapitalize?: any;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secure);

  return (
    <View style={inp.wrap}>
      <Text style={inp.label}>{label}</Text>
      <View
        style={[
          inp.row,
          focused && inp.focused,
          !!error && inp.errored,
          !editable && inp.disabled,
        ]}
      >
        {icon && <View style={inp.icon}>{icon}</View>}
        <TextInput
          style={inp.input}
          placeholder={placeholder}
          placeholderTextColor="#B0A8C0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure && (
          <TouchableOpacity onPress={() => setVisible((v) => !v)} style={inp.eye}>
            {visible ? (
              <Eye size={18} color={C.textSub} />
            ) : (
              <EyeOff size={18} color={C.textSub} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={inp.err}>{error}</Text>}
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: C.primary, marginBottom: 8, letterSpacing: 0.2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    height: 54,
  },
  focused: { borderColor: C.primary, backgroundColor: "#fff" },
  errored: { borderColor: C.error },
  disabled: { opacity: 0.5 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: C.text, fontWeight: "500" },
  eye: { padding: 4 },
  err: { fontSize: 12, color: C.error, marginTop: 5, marginLeft: 2 },
});

// ─── Password strength meter ──────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColors = ["#ef4444", "#f97316", "#eab308", C.mint];
  const scoreLabels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;

  return (
    <View style={ps.wrap}>
      <View style={ps.bars}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[ps.bar, { backgroundColor: i < score ? barColors[score - 1] : C.border }]}
          />
        ))}
      </View>
      {score > 0 && (
        <Text style={[ps.scoreText, { color: barColors[score - 1] }]}>
          {scoreLabels[score - 1]}
        </Text>
      )}
      <View style={ps.checks}>
        {checks.map((c, i) => (
          <View key={i} style={ps.checkRow}>
            <View style={[ps.dot, { backgroundColor: c.ok ? C.mint : C.border }]} />
            <Text style={[ps.checkLabel, { color: c.ok ? C.primary : C.textSub }]}>
              {c.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const ps = StyleSheet.create({
  wrap: { marginTop: -10, marginBottom: 16 },
  bars: { flexDirection: "row", gap: 6, marginBottom: 5 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  scoreText: { fontSize: 12, fontWeight: "700", marginBottom: 10 },
  checks: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  checkLabel: { fontSize: 11, fontWeight: "500" },
});

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <View style={stepInd.wrap}>
      {steps.map((_, index) => (
        <React.Fragment key={index}>
          <View style={stepInd.stepContainer}>
            <View
              style={[
                stepInd.circle,
                index < currentStep && stepInd.circleCompleted,
                index === currentStep && stepInd.circleActive,
              ]}
            >
              {index < currentStep ? (
                <Check size={14} color="#fff" strokeWidth={3} />
              ) : (
                <Text style={[stepInd.circleText, index === currentStep && stepInd.circleTextActive]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                stepInd.label,
                index === currentStep && stepInd.labelActive,
                index < currentStep && stepInd.labelCompleted,
              ]}
            >
              {steps[index]}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                stepInd.line,
                index < currentStep && stepInd.lineCompleted,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const stepInd = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  stepContainer: { alignItems: "center", gap: 8 },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.border,
  },
  circleCompleted: { backgroundColor: C.mint, borderColor: C.mint },
  circleActive: { backgroundColor: C.primary, borderColor: C.primary },
  circleText: { fontSize: 14, fontWeight: "600", color: C.textSub },
  circleTextActive: { color: "#fff", fontWeight: "700" },
  label: { fontSize: 11, fontWeight: "500", color: C.textSub },
  labelActive: { color: C.primary, fontWeight: "700" },
  labelCompleted: { color: C.mint },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: C.border,
    marginHorizontal: 4,
    borderRadius: 1,
  },
  lineCompleted: { backgroundColor: C.mint },
});

// ─── Header Component ─────────────────────────────────────────────────────────
function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <View style={hdr.wrap}>
      <TouchableOpacity style={hdr.back} onPress={onBack}>
        <ChevronLeft size={22} color={C.primary} />
      </TouchableOpacity>
      <View style={hdr.logo}>
        <LinearGradient
          colors={[C.mint, C.blue, C.violet, C.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={hdr.bar}
        />
        <Text style={hdr.word}>AmstaPay</Text>
      </View>
      <View style={{ width: 36 }} />
    </View>
  );
}

const hdr = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 36 },
  back: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.primaryLight,
    alignItems: "center", justifyContent: "center",
  },
  logo: { alignItems: "center", gap: 4 },
  bar: { width: 40, height: 3, borderRadius: 2 },
  word: { fontSize: 15, fontWeight: "800", color: C.primary, letterSpacing: -0.3 },
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 0 — Account Type Selection
// ═══════════════════════════════════════════════════════════════════════════════
function StepAccountType({
  accountType,
  setAccountType,
  onNext,
}: {
  accountType: string;
  setAccountType: (type: string) => void;
  onNext: () => void;
}) {
  const types = [
    { id: "personal", name: "Personal", icon: User, description: "For individual use" },
    { id: "business", name: "Business", icon: Briefcase, description: "For small businesses" },
    { id: "agent", name: "Agent", icon: Users, description: "For banking agents" },
    { id: "enterprise", name: "Enterprise", icon: Building, description: "For large organizations" },
  ];

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Choose account type</Text>
        <Text style={s.subheading}>
          Select the account that best fits your needs. You can upgrade later.
        </Text>
      </View>

      <View style={at.grid}>
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = accountType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[at.card, isSelected && at.cardSelected]}
              onPress={() => setAccountType(type.id)}
            >
              <View style={[at.iconWrap, isSelected && at.iconWrapSelected]}>
                <Icon size={28} color={isSelected ? "#fff" : C.primary} />
              </View>
              <Text style={[at.name, isSelected && at.nameSelected]}>{type.name}</Text>
              <Text style={[at.desc, isSelected && at.descSelected]}>{type.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <GradientButton
        label="Continue"
        onPress={onNext}
        disabled={!accountType}
      />
    </>
  );
}

const at = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 },
  card: {
    flex: 1,
    minWidth: (width - 72) / 2,
    backgroundColor: C.inputBg,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.border,
  },
  cardSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconWrapSelected: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  nameSelected: { color: "#fff" },
  desc: {
    fontSize: 11,
    color: C.textSub,
    textAlign: "center",
  },
  descSelected: { color: "rgba(255,255,255,0.7)" },
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Personal Information
// ═══════════════════════════════════════════════════════════════════════════════
function StepPersonalInfo({
  data,
  onChange,
  onNext,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName) newErrors.fullName = "Full name is required";
    if (!data.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email format";
    if (!data.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!data.bvnOrNin) newErrors.bvnOrNin = "BVN or NIN is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Personal information</Text>
        <Text style={s.subheading}>
          We need your details for identity verification and security.
        </Text>
      </View>

      <StyledInput
        label="Full name"
        placeholder="John Doe"
        value={data.fullName}
        onChangeText={(v) => onChange("fullName", v)}
        icon={<User size={18} color={errors.fullName ? C.error : C.primary} />}
        error={errors.fullName}
        autoCapitalize="words"
      />

      <StyledInput
        label="Email address"
        placeholder="you@example.com"
        value={data.email}
        onChangeText={(v) => onChange("email", v)}
        icon={<Mail size={18} color={errors.email ? C.error : C.primary} />}
        keyboardType="email-address"
        error={errors.email}
      />

      <StyledInput
        label="Phone number"
        placeholder="+234 800 000 0000"
        value={data.phoneNumber}
        onChangeText={(v) => onChange("phoneNumber", v)}
        icon={<Phone size={18} color={errors.phoneNumber ? C.error : C.primary} />}
        keyboardType="phone-pad"
        error={errors.phoneNumber}
      />

      <StyledInput
        label="BVN or NIN"
        placeholder="Enter your BVN or NIN"
        value={data.bvnOrNin}
        onChangeText={(v) => onChange("bvnOrNin", v)}
        icon={<Shield size={18} color={errors.bvnOrNin ? C.error : C.primary} />}
        keyboardType="numeric"
        error={errors.bvnOrNin}
      />

      <View style={s.infoBox}>
        <AlertCircle size={18} color={C.violet} />
        <Text style={s.infoText}>
          Your BVN/NIN is encrypted and used only for KYC compliance.
        </Text>
      </View>

      <GradientButton label="Continue" onPress={handleNext} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Business Information (for business/enterprise/company)
// ═══════════════════════════════════════════════════════════════════════════════
function StepBusinessInfo({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.businessName) newErrors.businessName = "Business name is required";
    if (!data.businessAddress) newErrors.businessAddress = "Business address is required";
    if (!data.businessType) newErrors.businessType = "Business type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Business information</Text>
        <Text style={s.subheading}>
          Tell us about your business for compliance and verification.
        </Text>
      </View>

      <StyledInput
        label="Business name"
        placeholder="Your business name"
        value={data.businessName}
        onChangeText={(v) => onChange("businessName", v)}
        icon={<Building size={18} color={errors.businessName ? C.error : C.primary} />}
        error={errors.businessName}
        autoCapitalize="words"
      />

      <StyledInput
        label="Business address"
        placeholder="Full business address"
        value={data.businessAddress}
        onChangeText={(v) => onChange("businessAddress", v)}
        icon={<MapPin size={18} color={errors.businessAddress ? C.error : C.primary} />}
        error={errors.businessAddress}
      />

      <StyledInput
        label="Business type"
        placeholder="e.g., Retail, Tech, Services"
        value={data.businessType}
        onChangeText={(v) => onChange("businessType", v)}
        icon={<Briefcase size={18} color={errors.businessType ? C.error : C.primary} />}
        error={errors.businessType}
        autoCapitalize="words"
      />

      <View style={s.buttonRow}>
        <SecondaryButton label="Back" onPress={onBack} />
        <GradientButton label="Continue" onPress={handleNext} />
      </View>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Financial Information
// ═══════════════════════════════════════════════════════════════════════════════
function StepFinancialInfo({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.bankName) newErrors.bankName = "Bank name is required";
    if (!data.accountNumber) newErrors.accountNumber = "Account number is required";
    if (!data.accountName) newErrors.accountName = "Account name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Financial information</Text>
        <Text style={s.subheading}>
          Link your bank account for seamless transactions.
        </Text>
      </View>

      <StyledInput
        label="Bank name"
        placeholder="Select your bank"
        value={data.bankName}
        onChangeText={(v) => onChange("bankName", v)}
        icon={<CreditCard size={18} color={errors.bankName ? C.error : C.primary} />}
        error={errors.bankName}
      />

      <StyledInput
        label="Account number"
        placeholder="10-digit account number"
        value={data.accountNumber}
        onChangeText={(v) => onChange("accountNumber", v)}
        icon={<CreditCard size={18} color={errors.accountNumber ? C.error : C.primary} />}
        keyboardType="numeric"
        error={errors.accountNumber}
      />

      <StyledInput
        label="Account name"
        placeholder="Account holder name"
        value={data.accountName}
        onChangeText={(v) => onChange("accountName", v)}
        icon={<User size={18} color={errors.accountName ? C.error : C.primary} />}
        error={errors.accountName}
        autoCapitalize="words"
      />

      <View style={s.buttonRow}>
        <SecondaryButton label="Back" onPress={onBack} />
        <GradientButton label="Continue" onPress={handleNext} />
      </View>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — Guarantor Information (for agent only)
// ═══════════════════════════════════════════════════════════════════════════════
function StepGuarantorInfo({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.guarantorName) newErrors.guarantorName = "Guarantor name is required";
    if (!data.guarantorPhone) newErrors.guarantorPhone = "Guarantor phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Guarantor information</Text>
        <Text style={s.subheading}>
          As an agent, you need a guarantor for account verification.
        </Text>
      </View>

      <View style={s.infoBox}>
        <AlertCircle size={18} color={C.warning} />
        <Text style={s.infoText}>
          Your guarantor will be contacted for verification.
        </Text>
      </View>

      <StyledInput
        label="Guarantor full name"
        placeholder="Full name"
        value={data.guarantorName}
        onChangeText={(v) => onChange("guarantorName", v)}
        icon={<User size={18} color={errors.guarantorName ? C.error : C.primary} />}
        error={errors.guarantorName}
        autoCapitalize="words"
      />

      <StyledInput
        label="Relationship"
        placeholder="e.g., Parent, Colleague"
        value={data.guarantorRelationship}
        onChangeText={(v) => onChange("guarantorRelationship", v)}
        icon={<Users size={18} color={C.primary} />}
      />

      <StyledInput
        label="Guarantor phone number"
        placeholder="+234 800 000 0000"
        value={data.guarantorPhone}
        onChangeText={(v) => onChange("guarantorPhone", v)}
        icon={<Phone size={18} color={errors.guarantorPhone ? C.error : C.primary} />}
        keyboardType="phone-pad"
        error={errors.guarantorPhone}
      />

      <StyledInput
        label="Guarantor address"
        placeholder="Full address"
        value={data.guarantorAddress}
        onChangeText={(v) => onChange("guarantorAddress", v)}
        icon={<MapPin size={18} color={C.primary} />}
      />

      <View style={s.buttonRow}>
        <SecondaryButton label="Back" onPress={onBack} />
        <GradientButton label="Continue" onPress={handleNext} />
      </View>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — Security (PIN & Password)
// ═══════════════════════════════════════════════════════════════════════════════
function StepSecurity({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!data.pin) newErrors.pin = "PIN is required";
    else if (!/^\d{4}$/.test(data.pin)) newErrors.pin = "PIN must be 4 digits";
    if (data.pin !== data.confirmPin) newErrors.confirmPin = "PINs do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Secure your account</Text>
        <Text style={s.subheading}>
          Create a strong password and transaction PIN.
        </Text>
      </View>

      <StyledInput
        label="Password"
        placeholder="Create a strong password"
        value={data.password}
        onChangeText={(v) => onChange("password", v)}
        icon={<Lock size={18} color={errors.password ? C.error : C.primary} />}
        secure
        error={errors.password}
      />

      <PasswordStrength password={data.password} />

      <StyledInput
        label="Confirm password"
        placeholder="Repeat your password"
        value={data.confirmPassword}
        onChangeText={(v) => onChange("confirmPassword", v)}
        icon={<Lock size={18} color={errors.confirmPassword ? C.error : C.primary} />}
        secure
        error={errors.confirmPassword}
      />

      <StyledInput
        label="Transaction PIN"
        placeholder="4-digit PIN"
        value={data.pin}
        onChangeText={(v) => onChange("pin", v)}
        icon={<Shield size={18} color={errors.pin ? C.error : C.primary} />}
        keyboardType="numeric"
        secure
        error={errors.pin}
      />

      <StyledInput
        label="Confirm PIN"
        placeholder="Repeat 4-digit PIN"
        value={data.confirmPin}
        onChangeText={(v) => onChange("confirmPin", v)}
        icon={<Shield size={18} color={errors.confirmPin ? C.error : C.primary} />}
        keyboardType="numeric"
        secure
        error={errors.confirmPin}
      />

      <View style={s.buttonRow}>
        <SecondaryButton label="Back" onPress={onBack} />
        <GradientButton label="Continue" onPress={handleNext} />
      </View>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — Agreements
// ═══════════════════════════════════════════════════════════════════════════════
function StepAgreements({
  data,
  onChange,
  onSubmit,
  loading,
}: {
  data: any;
  onChange: (field: string, value: boolean) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const allChecked = data.termsAgreed && data.infoAccurate && data.verificationConsent;

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Almost there!</Text>
        <Text style={s.subheading}>
          Please review and accept the terms to complete your registration.
        </Text>
      </View>

      <View style={s.illustrationWrap}>
        <View style={s.iconCircle}>
          <LinearGradient colors={[C.primaryLight, "#E8E0F0"]} style={s.iconCircleGrad}>
            <FileText size={36} color={C.primary} />
          </LinearGradient>
        </View>
        <View style={s.iconBadge}>
          <Check size={14} color="#fff" />
        </View>
      </View>

      <TouchableOpacity style={s.agreementRow} onPress={() => onChange("termsAgreed", !data.termsAgreed)}>
        <View style={[s.checkbox, data.termsAgreed && s.checkboxChecked]}>
          {data.termsAgreed && <Check size={14} color="#fff" strokeWidth={3} />}
        </View>
        <Text style={s.agreementText}>
          I agree to the{" "}
          <Text style={s.agreementLink}>Terms of Service</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.agreementRow} onPress={() => onChange("infoAccurate", !data.infoAccurate)}>
        <View style={[s.checkbox, data.infoAccurate && s.checkboxChecked]}>
          {data.infoAccurate && <Check size={14} color="#fff" strokeWidth={3} />}
        </View>
        <Text style={s.agreementText}>
          I confirm that all information provided is accurate
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.agreementRow} onPress={() => onChange("verificationConsent", !data.verificationConsent)}>
        <View style={[s.checkbox, data.verificationConsent && s.checkboxChecked]}>
          {data.verificationConsent && <Check size={14} color="#fff" strokeWidth={3} />}
        </View>
        <Text style={s.agreementText}>
          I consent to identity verification checks
        </Text>
      </TouchableOpacity>

      <GradientButton
        label="Create Account"
        onPress={onSubmit}
        loading={loading}
        disabled={!allChecked}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function SuccessScreen({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 180 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={suc.wrap}>
      <Animated.View style={[suc.circle, { transform: [{ scale }], opacity }]}>
        <LinearGradient
          colors={[C.mint, C.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={suc.circleGrad}
        >
          <Check size={52} color="#fff" strokeWidth={3} />
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[suc.textBlock, { opacity }]}>
        <Text style={suc.heading}>Account created!</Text>
        <Text style={suc.sub}>
          Your AmstaPay account has been created successfully. A verification email has been sent to your inbox.
        </Text>
      </Animated.View>

      <View style={suc.dots}>
        {[C.mint, C.pink, C.violet, C.blue, C.mint, C.pink].map((color, i) => (
          <View key={i} style={[suc.dot, { backgroundColor: color }]} />
        ))}
      </View>

      <GradientButton label="Continue to Dashboard" onPress={onDone} />
    </View>
  );
}

const suc = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", paddingTop: 20 },
  circle: { marginBottom: 32 },
  circleGrad: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.mint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  textBlock: { alignItems: "center", marginBottom: 32 },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
    marginBottom: 14,
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    color: C.textSub,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 300,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 36,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  dot: { width: 10, height: 10, borderRadius: 5, opacity: 0.7 },
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function SignupScreen() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Personal
    fullName: "",
    email: "",
    phoneNumber: "",
    bvnOrNin: "",
    // Business
    businessName: "",
    businessAddress: "",
    businessType: "",
    // Financial
    bankName: "",
    accountName: "",
    accountNumber: "",
    // Guarantor
    guarantorName: "",
    guarantorRelationship: "",
    guarantorPhone: "",
    guarantorAddress: "",
    // Security
    password: "",
    confirmPassword: "",
    pin: "",
    confirmPin: "",
    // Agreements
    termsAgreed: false,
    infoAccurate: false,
    verificationConsent: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Dynamic steps based on account type
  const getSteps = () => {
    const baseSteps = ["AccountType", "PersonalInfo", "FinancialInfo", "Security", "Agreements"];
    if (accountType === "business" || accountType === "enterprise") {
      return ["AccountType", "PersonalInfo", "BusinessInfo", "FinancialInfo", "Security", "Agreements"];
    }
    if (accountType === "agent") {
      return ["AccountType", "PersonalInfo", "FinancialInfo", "GuarantorInfo", "Security", "Agreements"];
    }
    return baseSteps;
  };

  const steps = getSteps();
  const currentStep = steps[stepIndex];

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        accountType,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const errorMessage = data.message || data.error || "Signup failed";
        Alert.alert("Error", errorMessage);
      }
    } catch (err) {
      console.error("Signup error:", err);
      Alert.alert("Error", "Registration failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    router.replace("/dashboard");
  };

  // Success screen
  if (showSuccess) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: C.bg }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header onBack={() => {}} title="Success" />
          <SuccessScreen onDone={handleDone} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header onBack={handleBack} title="Sign Up" />

        {stepIndex === 0 && (
          <StepAccountType
            accountType={accountType}
            setAccountType={setAccountType}
            onNext={handleNext}
          />
        )}

        {stepIndex === 1 && currentStep === "PersonalInfo" && (
          <StepPersonalInfo
            data={formData}
            onChange={handleInputChange}
            onNext={handleNext}
          />
        )}

        {stepIndex === 2 && currentStep === "BusinessInfo" && (
          <StepBusinessInfo
            data={formData}
            onChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {stepIndex === (accountType === "business" ? 2 : 1) && currentStep === "FinancialInfo" && (
          <StepFinancialInfo
            data={formData}
            onChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {stepIndex === (accountType === "agent" ? 2 : accountType === "business" ? 3 : 2) && currentStep === "GuarantorInfo" && (
          <StepGuarantorInfo
            data={formData}
            onChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {stepIndex === steps.length - 2 && currentStep === "Security" && (
          <StepSecurity
            data={formData}
            onChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {stepIndex === steps.length - 1 && currentStep === "Agreements" && (
          <StepAgreements
            data={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={isSubmitting}
          />
        )}

        {/* Step indicator for non-first steps */}
        {stepIndex > 0 && stepIndex < steps.length - 1 && (
          <View style={s.stepIndicatorContainer}>
            <StepIndicator currentStep={stepIndex - 1} steps={steps.slice(1, -1)} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    backgroundColor: C.bg,
  },
  titleBlock: { marginBottom: 28 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subheading: { fontSize: 15, color: C.textSub, lineHeight: 23 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  infoText: { flex: 1, fontSize: 13, color: C.textSub, lineHeight: 19 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  illustrationWrap: {
    alignSelf: "center",
    marginBottom: 36,
    position: "relative",
  },
  iconCircle: { width: 100, height: 100 },
  iconCircleGrad: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  iconBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.mint,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: C.primary, borderColor: C.primary },
  agreementText: { flex: 1, fontSize: 14, color: C.textSub, lineHeight: 20 },
  agreementLink: { color: C.violet, fontWeight: "700" },
  stepIndicatorContainer: { marginTop: 8, marginBottom: 16 },
});