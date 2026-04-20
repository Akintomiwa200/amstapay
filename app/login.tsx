import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  primary: "#2D0057",
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

// ─── Styled Input ─────────────────────────────────────────────────────────────
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
  textContentType,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  icon: React.ReactNode;
  secure?: boolean;
  keyboardType?: any;
  error?: string;
  editable?: boolean;
  autoCapitalize?: any;
  textContentType?: any;
  autoComplete?: any;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secure);

  return (
    <View style={inp.wrap}>
      <Text style={inp.label}>{label}</Text>
      <View
        style={[
          inp.row,
          focused && inp.rowFocused,
          !!error && inp.rowError,
          !editable && inp.rowDisabled,
        ]}
      >
        <View style={inp.iconWrap}>{icon}</View>
        <TextInput
          style={inp.input}
          placeholder={placeholder}
          placeholderTextColor="#B0A8C0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          autoComplete={autoComplete}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            style={inp.eye}
            disabled={!editable}
          >
            {visible ? (
              <Eye size={18} color={C.textSub} />
            ) : (
              <EyeOff size={18} color={C.textSub} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={inp.error}>{error}</Text>}
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
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
  rowFocused: { borderColor: C.primary, backgroundColor: "#fff" },
  rowError: { borderColor: C.error },
  rowDisabled: { opacity: 0.5 },
  iconWrap: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: C.text, fontWeight: "500" },
  eye: { padding: 4 },
  error: { fontSize: 12, color: C.error, marginTop: 5, marginLeft: 2 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
    general?: string;
  }>({});

  const { login } = useAuth();
  const router = useRouter();

  const validate = (): boolean => {
    const e: typeof errors = {};
    const cleaned = emailOrPhone.trim();
    const isEmail = cleaned.includes("@");
    const isPhone = /^\+?[\d\s\-()\u0020]{7,}$/.test(cleaned);

    if (!cleaned) {
      e.emailOrPhone = "Email or phone number is required";
    } else if (!isEmail && !isPhone) {
      e.emailOrPhone = "Enter a valid email or phone number";
    }
    if (!password.trim()) {
      e.password = "Password is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setErrors({});
      await login(emailOrPhone.trim(), password);
      router.replace("/dashboard");
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error instanceof Error) msg = error.message;
      if (msg.toLowerCase().includes("network"))
        msg = "Network error. Check your connection and try again.";
      else if (msg.toLowerCase().includes("invalid"))
        msg = "Invalid credentials. Please check your details.";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const isReady = emailOrPhone.trim().length > 0 && password.trim().length > 0;

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
        {/* Back button */}
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <ChevronLeft size={22} color={C.primary} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={s.logoBlock}>
          <LinearGradient
            colors={[C.mint, C.blue, C.violet, C.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.logoBar}
          />
          <Text style={s.logoWord}>AmstaPay</Text>
        </View>

        {/* Heading */}
        <View style={s.headingBlock}>
          <Text style={s.heading}>Welcome back</Text>
          <Text style={s.subheading}>
            Sign in to your wallet and continue transacting seamlessly.
          </Text>
        </View>

        {/* General error banner */}
        {errors.general ? (
          <View style={s.errorBanner}>
            <Text style={s.errorBannerText}>⚠  {errors.general}</Text>
          </View>
        ) : null}

        {/* Inputs */}
        <View style={s.form}>
          <StyledInput
            label="Email or phone number"
            placeholder="you@example.com or +234 800…"
            value={emailOrPhone}
            onChangeText={(v) => {
              setEmailOrPhone(v);
              if (errors.emailOrPhone)
                setErrors((e) => ({ ...e, emailOrPhone: "" }));
            }}
            icon={
              <Mail
                size={18}
                color={errors.emailOrPhone ? C.error : C.primary}
              />
            }
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            editable={!loading}
            error={errors.emailOrPhone}
          />

          <StyledInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors((e) => ({ ...e, password: "" }));
            }}
            icon={
              <Lock size={18} color={errors.password ? C.error : C.primary} />
            }
            secure
            textContentType="password"
            autoComplete="password"
            editable={!loading}
            error={errors.password}
          />

          {/* Forgot password */}
          <TouchableOpacity
            style={s.forgotWrap}
            onPress={() => router.push("/forgot-password")}
            disabled={loading}
          >
            <Text style={s.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign in CTA */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleLogin}
          disabled={loading || !isReady}
          style={[s.btnOuter, (!isReady || loading) && s.btnDisabled]}
        >
          <LinearGradient
            colors={
              isReady && !loading
                ? [C.mint, C.blue, C.violet, C.pink]
                : ["#D1C4E9", "#D1C4E9"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.btn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.btnText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or</Text>
          <View style={s.dividerLine} />
        </View>

       

        {/* Signup link */}
        <TouchableOpacity
          style={s.signupRow}
          onPress={() => router.push("/signup")}
          disabled={loading}
        >
          <Text style={s.signupText}>Don't have an account? </Text>
          <Text style={s.signupAccent}>Create one</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    backgroundColor: C.bg,
  },

  back: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3EFF8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },

  logoBlock: { alignItems: "center", marginBottom: 40, gap: 8 },
  logoBar: { width: 56, height: 4, borderRadius: 2 },
  logoWord: {
    fontSize: 26,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
  },

  headingBlock: { marginBottom: 32 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: C.textSub,
    lineHeight: 22,
  },

  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 14,
    marginBottom: 20,
  },
  errorBannerText: {
    color: C.error,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  form: { marginBottom: 8 },

  forgotWrap: { alignSelf: "flex-end", marginTop: -8, paddingVertical: 6 },
  forgotText: { color: C.violet, fontSize: 13, fontWeight: "700" },

  btnOuter: { borderRadius: 14, overflow: "hidden", marginTop: 28 },
  btnDisabled: { opacity: 0.7 },
  btn: { height: 56, alignItems: "center", justifyContent: "center" },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.textSub, fontSize: 13, fontWeight: "500" },

  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    height: 54,
    gap: 10,
    backgroundColor: C.inputBg,
    marginBottom: 32,
  },
  socialIcon: { fontSize: 18 },
  socialText: { fontSize: 15, fontWeight: "600", color: C.primary },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  signupText: { fontSize: 14, color: C.textSub },
  signupAccent: { fontSize: 14, color: C.violet, fontWeight: "700" },
});