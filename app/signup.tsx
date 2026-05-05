// signup.tsx - Minimal 2-step signup flow
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Check,
} from "lucide-react-native";

const C = {
  bg: "#FFFFFF",
  primary: "#2D0057",
  primaryLight: "#F3E8F0",
  mint: "#22f0c3",
  blue: "#2db3ff",
  violet: "#8b5cf6",
  pink: "#ff3cac",
  text: "#1a0035",
  textSub: "#6B7280",
  border: "#E8E0F0",
  inputBg: "#FAF8FC",
  error: "#ef4444",
};

function GradientButton({ label, onPress, loading, disabled }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btnOuter, (disabled || loading) && styles.btnDimmed]}
    >
      <LinearGradient
        colors={
          disabled || loading
            ? ["#D1C4E9", "#D1C4E9"]
            : [C.mint, C.blue, C.violet, C.pink]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btnInner}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnLabel}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

function StyledInput({ label, placeholder, value, onChangeText, icon, secure, keyboardType, error, autoCapitalize, editable }: any) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secure);

  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputFocused,
          !!error && styles.inputErrored,
          !editable && styles.inputDisabled,
        ]}
      >
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <TextInput
          style={styles.input}
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
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eye}>
            {visible ? (
              <Eye size={18} color={C.textSub} />
            ) : (
              <EyeOff size={18} color={C.textSub} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  if (!password) return null;

  return (
    <View style={styles.psWrap}>
      <View style={styles.psBars}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              styles.psBar,
              {
                backgroundColor:
                  i < score
                    ? score === 3
                      ? C.mint
                      : "#f97316"
                    : C.border,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.psChecks}>
        {checks.map((c, i) => (
          <View key={i} style={styles.psCheckRow}>
            <View
              style={[styles.psDot, { backgroundColor: c.ok ? C.mint : C.border }]}
            />
            <Text
              style={[
                styles.psCheckLabel,
                { color: c.ok ? C.primary : C.textSub },
              ]}
            >
              {c.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Header({ onBack }: any) {
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.headerBack} onPress={onBack}>
        <ChevronLeft size={22} color={C.primary} />
      </TouchableOpacity>
      <View style={styles.headerLogo}>
        <LinearGradient
          colors={[C.mint, C.blue, C.violet, C.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerBar}
        />
        <Text style={styles.headerWord}>AmstaPay</Text>
      </View>
      <View style={{ width: 36 }} />
    </View>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepWrap}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i < current ? styles.stepDotActive : styles.stepDotInactive,
          ]}
        />
      ))}
    </View>
  );
}

function StepAccount({ email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, onNext }: any) {
  return (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subheading}>Start with your email and a secure password.</Text>
      </View>

      <StyledInput
        label="Email address"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        icon={<Mail size={18} color={errors.email ? C.error : C.primary} />}
        keyboardType="email-address"
        error={errors.email}
      />

      <StyledInput
        label="Password"
        placeholder="Create a strong password"
        value={password}
        onChangeText={setPassword}
        icon={<Lock size={18} color={errors.password ? C.error : C.primary} />}
        secure
        error={errors.password}
      />

      <PasswordStrength password={password} />

      <StyledInput
        label="Confirm password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon={<Lock size={18} color={errors.confirmPassword ? C.error : C.primary} />}
        secure
        error={errors.confirmPassword}
      />

      <StepIndicator current={1} total={2} />

      <GradientButton
        label="Continue"
        onPress={onNext}
        disabled={!email.trim() || !password || !confirmPassword}
      />
    </View>
  );
}

function StepPersonal({ fullName, setFullName, phoneNumber, setPhoneNumber, errors, onBack, onSubmit, loading }: any) {
  return (
    <View>
      <View style={styles.titleBlock}>
        <Text style={styles.heading}>Almost there</Text>
        <Text style={styles.subheading}>Tell us a bit about yourself.</Text>
      </View>

      <StyledInput
        label="Full name"
        placeholder="John Doe"
        value={fullName}
        onChangeText={setFullName}
        icon={<User size={18} color={errors.fullName ? C.error : C.primary} />}
        error={errors.fullName}
        autoCapitalize="words"
      />

      <StyledInput
        label="Phone number"
        placeholder="+234 800 000 0000"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        icon={<Phone size={18} color={errors.phoneNumber ? C.error : C.primary} />}
        keyboardType="phone-pad"
        error={errors.phoneNumber}
      />

      <StepIndicator current={2} total={2} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <GradientButton
          label="Create Account"
          onPress={onSubmit}
          loading={loading}
          disabled={!fullName.trim() || !phoneNumber.trim()}
        />
      </View>
    </View>
  );
}

function SuccessScreen({ onDone }: any) {
  return (
    <View style={styles.scWrap}>
      <View style={styles.scIconWrap}>
        <LinearGradient
          colors={[C.mint, C.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scIcon}
        >
          <Check size={40} color="#fff" strokeWidth={3} />
        </LinearGradient>
      </View>
      <Text style={styles.scHeading}>Welcome to AmstaPay!</Text>
      <Text style={styles.scSub}>Your account has been created. Check your email to verify.</Text>
      <GradientButton label="Get Started" onPress={onDone} />
    </View>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs: any = {};
    if (!email.includes("@")) errs.email = "Enter a valid email";
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: any = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (phoneNumber.replace(/\D/g, "").length < 10) errs.phoneNumber = "Enter a valid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const response = await fetch("https://amstapay-backend.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      setSuccess(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <SuccessScreen onDone={() => router.replace("/login")} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header onBack={() => (step === 1 ? router.back() : setStep(1))} />

        {step === 1 && (
          <StepAccount
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <StepPersonal
            fullName={fullName}
            setFullName={setFullName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            errors={errors}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        <TouchableOpacity style={styles.loginRow} onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text style={styles.loginAccent}>Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, backgroundColor: C.bg },
  titleBlock: { marginBottom: 28 },
  heading: { fontSize: 28, fontWeight: "800", color: C.primary, letterSpacing: -0.5, marginBottom: 10 },
  subheading: { fontSize: 15, color: C.textSub, lineHeight: 23 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  backBtn: { flex: 1, height: 56, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: C.primaryLight },
  backBtnText: { color: C.primary, fontSize: 17, fontWeight: "700" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, paddingVertical: 8 },
  loginText: { fontSize: 14, color: C.textSub },
  loginAccent: { fontSize: 14, color: C.violet, fontWeight: "700" },

  // Buttons
  btnOuter: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
  btnDimmed: { opacity: 0.7 },
  btnInner: { height: 56, alignItems: "center", justifyContent: "center" },
  btnLabel: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },

  // Inputs
  inputWrap: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: C.primary, marginBottom: 8, letterSpacing: 0.2 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, height: 54 },
  inputFocused: { borderColor: C.primary, backgroundColor: "#fff" },
  inputErrored: { borderColor: C.error },
  inputDisabled: { opacity: 0.5 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: C.text, fontWeight: "500" },
  eye: { padding: 4 },
  inputError: { fontSize: 12, color: C.error, marginTop: 5, marginLeft: 2 },

  // Password strength
  psWrap: { marginTop: -10, marginBottom: 16 },
  psBars: { flexDirection: "row", gap: 6, marginBottom: 8 },
  psBar: { flex: 1, height: 3, borderRadius: 2 },
  psChecks: { flexDirection: "row", gap: 12 },
  psCheckRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  psDot: { width: 5, height: 5, borderRadius: 3 },
  psCheckLabel: { fontSize: 11, fontWeight: "500" },

  // Header
  headerWrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 36 },
  headerBack: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLight, alignItems: "center", justifyContent: "center" },
  headerLogo: { alignItems: "center", gap: 4 },
  headerBar: { width: 40, height: 3, borderRadius: 2 },
  headerWord: { fontSize: 15, fontWeight: "800", color: C.primary, letterSpacing: -0.3 },

  // Step indicator
  stepWrap: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 32 },
  stepDot: { height: 4, borderRadius: 2 },
  stepDotActive: { width: 24, backgroundColor: C.primary },
  stepDotInactive: { width: 8, backgroundColor: C.border },

  // Success screen
  scWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  scIconWrap: { marginBottom: 32 },
  scIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  scHeading: { fontSize: 28, fontWeight: "800", color: C.primary, letterSpacing: -0.5, marginBottom: 12, textAlign: "center" },
  scSub: { fontSize: 15, color: C.textSub, textAlign: "center", lineHeight: 23, marginBottom: 40, maxWidth: 320 },
});
