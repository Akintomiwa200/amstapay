// forgot-password.tsx
// Complete forgot-password workflow:
// Step 0 → Request (email/phone)
// Step 1 → OTP Verify (6-digit code)
// Step 2 → New Password (set + confirm + strength)
// Step 3 → Success

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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
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

// ─── Shared page header ───────────────────────────────────────────────────────
function Header({ onBack, step }: { onBack: () => void; step: number }) {
  const totalSteps = 3; // steps 0-2 show progress; step 3 is success
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
      {/* Step pills */}
      {step < 3 && (
        <View style={hdr.pills}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                hdr.pill,
                i < step && hdr.pillDone,
                i === step && hdr.pillActive,
              ]}
            />
          ))}
        </View>
      )}
      {step === 3 && <View style={{ width: 80 }} />}
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
  pills: { flexDirection: "row", gap: 5, alignItems: "center" },
  pill: { width: 20, height: 4, borderRadius: 2, backgroundColor: C.border },
  pillDone: { backgroundColor: C.mint },
  pillActive: { backgroundColor: C.primary, width: 28 },
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 0 — Request reset (email or phone)
// ═══════════════════════════════════════════════════════════════════════════════
function StepRequest({
  onNext,
  onBack,
}: {
  onNext: (contact: string) => void;
  onBack: () => void;
}) {
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const v = contact.trim();
    if (!v) return "Email or phone number is required";
    const isEmail = v.includes("@");
    const isPhone = /^\+?[\d\s\-()\u0020]{7,}$/.test(v);
    if (!isEmail && !isPhone) return "Enter a valid email or phone number";
    return "";
  };

  const handleContinue = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    // Simulate API call to send OTP
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onNext(contact.trim());
  };

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Forgot password?</Text>
        <Text style={s.subheading}>
          No worries — enter the email or phone linked to your account and we'll
          send a verification code.
        </Text>
      </View>

      {/* Illustration */}
      <View style={s.illustrationWrap}>
        <View style={s.iconCircle}>
          <LinearGradient
            colors={[C.primaryLight, "#E8E0F0"]}
            style={s.iconCircleGrad}
          >
            <Mail size={36} color={C.primary} />
          </LinearGradient>
        </View>
        <View style={s.iconBadge}>
          <Text style={s.iconBadgeText}>?</Text>
        </View>
      </View>

      <StyledInput
        label="Email or phone number"
        placeholder="you@example.com or +234 800…"
        value={contact}
        onChangeText={(v) => { setContact(v); setError(""); }}
        icon={<Mail size={18} color={error ? C.error : C.primary} />}
        keyboardType="email-address"
        error={error}
        editable={!loading}
      />

      <GradientButton
        label="Send Verification Code"
        onPress={handleContinue}
        loading={loading}
        disabled={!contact.trim()}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — OTP verification (6-digit code)
// ═══════════════════════════════════════════════════════════════════════════════
function StepOTP({
  contact,
  onNext,
  onBack,
}: {
  contact: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit code"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    // In production: verify OTP against backend
    // For demo, any 6-digit code passes
    onNext();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendCooldown(30);
    inputs.current[0]?.focus();
    // In production: call resend OTP API
  };

  const display = contact.includes("@")
    ? contact.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : contact.replace(/(\+?\d{3})\d+(\d{3})/, "$1****$2");

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>Enter the code</Text>
        <Text style={s.subheading}>
          We sent a 6-digit verification code to{" "}
          <Text style={s.contactHighlight}>{display}</Text>. It expires in 10 minutes.
        </Text>
      </View>

      {/* OTP boxes */}
      <View style={otp_.row}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => (inputs.current[i] = r)}
            style={[
              otp_.box,
              digit && otp_.boxFilled,
              !!error && otp_.boxError,
            ]}
            value={digit}
            onChangeText={(v) => handleChange(v, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>

      {!!error && <Text style={s.otpError}>{error}</Text>}

      {/* Resend */}
      <View style={otp_.resendRow}>
        <Text style={otp_.resendLabel}>Didn't receive it? </Text>
        <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0}>
          <Text
            style={[
              otp_.resendLink,
              resendCooldown > 0 && otp_.resendDisabled,
            ]}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </Text>
        </TouchableOpacity>
      </View>

      <GradientButton
        label="Verify Code"
        onPress={handleVerify}
        loading={loading}
        disabled={otp.join("").length < 6}
      />
    </>
  );
}

const otp_ = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, gap: 8 },
  box: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    fontSize: 24,
    fontWeight: "800",
    color: C.primary,
    textAlign: "center",
  },
  boxFilled: { borderColor: C.primary, backgroundColor: "#fff" },
  boxError: { borderColor: C.error },
  resendRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 28, marginTop: 8 },
  resendLabel: { fontSize: 13, color: C.textSub },
  resendLink: { fontSize: 13, fontWeight: "700", color: C.violet },
  resendDisabled: { color: C.textSub },
});

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Set new password
// ═══════════════════════════════════════════════════════════════════════════════
function StepNewPassword({ onNext }: { onNext: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReset = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    onNext();
  };

  const strengthScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const isReady = password.length >= 8 && confirm.length > 0 && strengthScore >= 2;

  return (
    <>
      <View style={s.titleBlock}>
        <Text style={s.heading}>New password</Text>
        <Text style={s.subheading}>
          Create a strong password for your AmstaPay wallet. You can't reuse your last password.
        </Text>
      </View>

      <View style={s.illustrationWrap}>
        <View style={s.iconCircle}>
          <LinearGradient colors={[C.primaryLight, "#E8E0F0"]} style={s.iconCircleGrad}>
            <Lock size={36} color={C.primary} />
          </LinearGradient>
        </View>
        <View style={[s.iconBadge, { backgroundColor: C.mint }]}>
          <Lock size={10} color="#fff" />
        </View>
      </View>

      <StyledInput
        label="New password"
        placeholder="Create a strong password"
        value={password}
        onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: "" })); }}
        icon={<Lock size={18} color={errors.password ? C.error : C.primary} />}
        secure
        error={errors.password}
        editable={!loading}
      />

      <PasswordStrength password={password} />

      <StyledInput
        label="Confirm password"
        placeholder="Repeat your new password"
        value={confirm}
        onChangeText={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: "" })); }}
        icon={<Lock size={18} color={errors.confirm ? C.error : C.primary} />}
        secure
        error={errors.confirm}
        editable={!loading}
      />

      <GradientButton
        label="Reset Password"
        onPress={handleReset}
        loading={loading}
        disabled={!isReady}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Success
// ═══════════════════════════════════════════════════════════════════════════════
function StepSuccess({ onDone }: { onDone: () => void }) {
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
        <Text style={suc.heading}>Password reset!</Text>
        <Text style={suc.sub}>
          Your AmstaPay password has been updated successfully. Your wallet is secure — sign in to continue.
        </Text>
      </Animated.View>

      {/* Confetti-style accent dots */}
      <View style={suc.dots}>
        {[C.mint, C.pink, C.violet, C.blue, C.mint, C.pink].map((color, i) => (
          <View key={i} style={[suc.dot, { backgroundColor: color }]} />
        ))}
      </View>

      <GradientButton label="Sign In Now" onPress={onDone} />

      <View style={suc.secureNote}>
        <Text style={suc.noteText}>
          🔒  All active sessions have been signed out for your security.
        </Text>
      </View>
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
  secureNote: {
    marginTop: 20,
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    padding: 14,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: C.border,
  },
  noteText: { fontSize: 13, color: C.textSub, lineHeight: 19, textAlign: "center" },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — orchestrates all steps
// ═══════════════════════════════════════════════════════════════════════════════
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState("");

  const handleBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  };

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
        <Header onBack={handleBack} step={step} />

        {step === 0 && (
          <StepRequest
            onNext={(c) => { setContact(c); setStep(1); }}
            onBack={handleBack}
          />
        )}

        {step === 1 && (
          <StepOTP
            contact={contact}
            onNext={() => setStep(2)}
            onBack={handleBack}
          />
        )}

        {step === 2 && (
          <StepNewPassword onNext={() => setStep(3)} />
        )}

        {step === 3 && (
          <StepSuccess onDone={() => router.replace("/login")} />
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
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: C.bg,
  },
  titleBlock: { marginBottom: 32 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subheading: { fontSize: 15, color: C.textSub, lineHeight: 23 },
  contactHighlight: { color: C.primary, fontWeight: "700" },
  otpError: { color: C.error, fontSize: 12, textAlign: "center", marginBottom: 12, marginTop: -4 },

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
    backgroundColor: C.violet,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  iconBadgeText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});