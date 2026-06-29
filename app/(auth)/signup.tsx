// signup.tsx - Minimal 2-step signup flow
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { emailService } from "@/services/email";
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
import { API, API_BASE_URL } from "@/lib/constants";
import { authService } from "@/services/auth";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Shield,
  Check,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

function createStyles(c: any) {
  return StyleSheet.create({
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, backgroundColor: c.surface },
    titleBlock: { marginBottom: 28 },
    heading: { fontSize: 28, fontWeight: "800", color: c.primary, letterSpacing: -0.5, marginBottom: 10 },
    subheading: { fontSize: 15, color: c.textSecondary, lineHeight: 23 },
    buttonRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    backBtn: { flex: 1, height: 56, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: c.primaryLight },
    backBtnText: { color: c.primary, fontSize: 17, fontWeight: "700" },
    loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, paddingVertical: 8 },
    loginText: { fontSize: 14, color: c.textSecondary },
    loginAccent: { fontSize: 14, color: c.violet, fontWeight: "700" },

    // Buttons
    btnOuter: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
    btnDimmed: { opacity: 0.7 },
    btnInner: { height: 56, alignItems: "center", justifyContent: "center" },
    btnLabel: { color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.3 },

    // Inputs
    inputWrap: { marginBottom: 20 },
    inputLabel: { fontSize: 13, fontWeight: "600", color: c.primary, marginBottom: 8, letterSpacing: 0.2 },
    inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: c.surfaceVariant, borderRadius: 14, borderWidth: 1.5, borderColor: c.border, paddingHorizontal: 14, height: 54 },
    inputFocused: { borderColor: c.primary, backgroundColor: "#fff" },
    inputErrored: { borderColor: c.error },
    inputDisabled: { opacity: 0.5 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: c.text, fontWeight: "500" },
    eye: { padding: 4 },
    inputError: { fontSize: 12, color: c.error, marginTop: 5, marginLeft: 2 },

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
    headerBack: { width: 36, height: 36, borderRadius: 10, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center" },
    headerLogo: { alignItems: "center", gap: 4 },
    headerBar: { width: 40, height: 3, borderRadius: 2 },
    headerWord: { fontSize: 15, fontWeight: "800", color: c.primary, letterSpacing: -0.3 },

    // Step indicator
    stepWrap: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 32 },
    stepDot: { height: 4, borderRadius: 2 },
    stepDotActive: { width: 24, backgroundColor: c.primary },
    stepDotInactive: { width: 8, backgroundColor: c.border },

    // Success screen
    scWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    scIconWrap: { marginBottom: 32 },
    scIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
    scHeading: { fontSize: 28, fontWeight: "800", color: c.primary, letterSpacing: -0.5, marginBottom: 12, textAlign: "center" },
    scSub: { fontSize: 15, color: c.textSecondary, textAlign: "center", lineHeight: 23, marginBottom: 40, maxWidth: 320 },
  });
}

function GradientButton({ label, onPress, loading, disabled, c }: any) {
  const styles = createStyles(c);
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
            : [c.mint, c.blue, c.violet, c.pink]
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

function StyledInput({ label, placeholder, value, onChangeText, icon, secure, keyboardType, error, autoCapitalize, editable, c }: any) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secure);
  const styles = createStyles(c);

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
              <Eye size={18} color={c.textSecondary} />
            ) : (
              <EyeOff size={18} color={c.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
}

function PasswordStrength({ password, c }: { password: string; c: any }) {
  const styles = createStyles(c);
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(ch => ch.ok).length;
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
                      ? c.mint
                      : "#f97316"
                    : c.border,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.psChecks}>
        {checks.map((ch, i) => (
          <View key={i} style={styles.psCheckRow}>
            <View
              style={[styles.psDot, { backgroundColor: ch.ok ? c.mint : c.border }]}
            />
            <Text
              style={[
                styles.psCheckLabel,
                { color: ch.ok ? c.primary : c.textSecondary },
              ]}
            >
              {ch.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Header({ onBack, c }: any) {
  const styles = createStyles(c);
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.headerBack} onPress={onBack}>
        <ChevronLeft size={22} color={c.primary} />
      </TouchableOpacity>
      <View style={styles.headerLogo}>
        <LinearGradient
          colors={[c.mint, c.blue, c.violet, c.pink]}
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

function StepIndicator({ current, total, c }: { current: number; total: number; c: any }) {
  const styles = createStyles(c);
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

function StepAccount({ email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, onNext, c }: any) {
  const styles = createStyles(c);
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
        icon={<Mail size={18} color={errors.email ? c.error : c.primary} />}
        keyboardType="email-address"
        error={errors.email}
        c={c}
      />

      <StyledInput
        label="Password"
        placeholder="Create a strong password"
        value={password}
        onChangeText={setPassword}
        icon={<Lock size={18} color={errors.password ? c.error : c.primary} />}
        secure
        error={errors.password}
        c={c}
      />

      <PasswordStrength password={password} c={c} />

      <StyledInput
        label="Confirm password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon={<Lock size={18} color={errors.confirmPassword ? c.error : c.primary} />}
        secure
        error={errors.confirmPassword}
        c={c}
      />

      <StepIndicator current={1} total={2} c={c} />

      <GradientButton
        label="Continue"
        onPress={onNext}
        disabled={!email.trim() || !password || !confirmPassword}
        c={c}
      />
    </View>
  );
}

function StepPersonal({ fullName, setFullName, phoneNumber, setPhoneNumber, pin, setPin, errors, onBack, onSubmit, loading, c }: any) {
  const styles = createStyles(c);
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
        icon={<User size={18} color={errors.fullName ? c.error : c.primary} />}
        error={errors.fullName}
        autoCapitalize="words"
        c={c}
      />

      <StyledInput
        label="Phone number"
        placeholder="+234 800 000 0000"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        icon={<Phone size={18} color={errors.phoneNumber ? c.error : c.primary} />}
        keyboardType="phone-pad"
        error={errors.phoneNumber}
        c={c}
      />

      <StyledInput
        label="Transaction PIN (4 digits)"
        placeholder="Enter a 4-digit PIN"
        value={pin}
        onChangeText={setPin}
        icon={<Shield size={18} color={errors.pin ? c.error : c.primary} />}
        secure
        keyboardType="number-pad"
        error={errors.pin}
        c={c}
      />

      <StepIndicator current={2} total={2} c={c} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <GradientButton
          label="Create Account"
          onPress={onSubmit}
          loading={loading}
          disabled={!fullName.trim() || !phoneNumber.trim() || !pin.trim()}
          c={c}
        />
      </View>
    </View>
  );
}

function SuccessScreen({ onDone, c }: any) {
  const styles = createStyles(c);
  return (
    <View style={styles.scWrap}>
      <View style={styles.scIconWrap}>
        <LinearGradient
          colors={[c.mint, c.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scIcon}
        >
          <Check size={40} color="#fff" strokeWidth={3} />
        </LinearGradient>
      </View>
      <Text style={styles.scHeading}>Welcome to AmstaPay!</Text>
      <Text style={styles.scSub}>Your account has been created. Check your email to verify.</Text>
      <GradientButton label="Get Started" onPress={onDone} c={c} />
    </View>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
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
    if (!pin.trim() || pin.length !== 4) errs.pin = "Enter a valid 4-digit PIN";
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
      const response = await authService.signup({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        pin,
        accountType: "personal",
        termsAgreed: true,
        infoAccurate: true,
        verificationConsent: true,
      });
      const data = (response as { verificationCode?: string; data?: { verificationCode?: string } });
      const code = data?.verificationCode ?? data?.data?.verificationCode ?? '';
      emailService.send(email.trim(), 'welcome-verify', {
        name: fullName.trim(),
        code,
        verifyLink: `${API_BASE_URL}${API.PREFIX}/auth/verify?email=${encodeURIComponent(email.trim())}&code=${code}`,
      });
      router.replace({ pathname: '/verify', params: { email: email.trim() } });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.surface }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={createStyles(c).scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header onBack={() => (step === 1 ? router.back() : setStep(1))} c={c} />

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
            c={c}
          />
        )}

        {step === 2 && (
          <StepPersonal
            fullName={fullName}
            setFullName={setFullName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            pin={pin}
            setPin={setPin}
            errors={errors}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
            loading={loading}
            c={c}
          />
        )}

        <TouchableOpacity style={createStyles(c).loginRow} onPress={() => router.push("/login")}>
          <Text style={createStyles(c).loginText}>Already have an account? </Text>
          <Text style={createStyles(c).loginAccent}>Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
