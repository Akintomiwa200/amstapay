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
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { emailService } from "@/services/email";

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
  c,
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
  c: {
    primary: string;
    mint: string;
    blue: string;
    violet: string;
    pink: string;
    text: string;
    textSecondary: string;
    border: string;
    surfaceVariant: string;
    surface: string;
    error: string;
  };
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secure);

  return (
    <View style={inp.wrap}>
      <Text style={[inp.label, { color: c.primary }]}>{label}</Text>
      <View
        style={[
          inp.row,
          { backgroundColor: c.surfaceVariant, borderColor: c.border },
          focused && { borderColor: c.primary, backgroundColor: "#fff" },
          !!error && { borderColor: c.error },
          !editable && inp.rowDisabled,
        ]}
      >
        <View style={inp.iconWrap}>{icon}</View>
        <TextInput
          style={[inp.input, { color: c.text }]}
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
              <Eye size={18} color={c.textSecondary} />
            ) : (
              <EyeOff size={18} color={c.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={[inp.error, { color: c.error }]}>{error}</Text>}
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 54,
  },
  rowFocused: {},
  rowError: {},
  rowDisabled: { opacity: 0.5 },
  iconWrap: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontWeight: "500" },
  eye: { padding: 4 },
  error: { fontSize: 12, marginTop: 5, marginLeft: 2 },
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
  const { theme } = useTheme();
  const c = theme.colors;

  const validate = (): boolean => {
    const e: typeof errors = {};
    const cleaned = emailOrPhone.trim();

    if (!cleaned) {
      e.emailOrPhone = "Email or phone number is required";
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
      await login({ emailOrPhone: emailOrPhone.trim(), password });
      const email = emailOrPhone.trim().includes('@') ? emailOrPhone.trim() : '';
      if (email) {
        emailService.send(email, 'login-confirm', {
          name: email.split('@')[0],
          time: new Date().toLocaleString(),
          device: Platform.OS === 'ios' ? 'iOS' : 'Android',
          location: 'Unknown',
          ipAddress: 'Unknown',
        });
      }
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
      style={{ flex: 1, backgroundColor: c.surface }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={[s.scroll, { backgroundColor: c.surface }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <ChevronLeft size={22} color={c.primary} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={s.logoBlock}>
          <LinearGradient
            colors={[c.mint, c.blue, c.violet, c.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.logoBar}
          />
          <Text style={[s.logoWord, { color: c.primary }]}>AmstaPay</Text>
        </View>

        {/* Heading */}
        <View style={s.headingBlock}>
          <Text style={[s.heading, { color: c.primary }]}>Welcome back</Text>
          <Text style={[s.subheading, { color: c.textSecondary }]}>
            Sign in to your wallet and continue transacting seamlessly.
          </Text>
        </View>

        {/* General error banner */}
        {errors.general ? (
          <View style={s.errorBanner}>
            <Text style={[s.errorBannerText, { color: c.error }]}>⚠  {errors.general}</Text>
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
                color={errors.emailOrPhone ? c.error : c.primary}
              />
            }
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            editable={!loading}
            error={errors.emailOrPhone}
            c={c}
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
              <Lock size={18} color={errors.password ? c.error : c.primary} />
            }
            secure
            textContentType="password"
            autoComplete="password"
            editable={!loading}
            error={errors.password}
            c={c}
          />

          {/* Forgot password */}
          <TouchableOpacity
            style={s.forgotWrap}
            onPress={() => router.push("/forgot-password")}
            disabled={loading}
          >
            <Text style={[s.forgotText, { color: c.violet }]}>Forgot password?</Text>
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
                ? [c.mint, c.blue, c.violet, c.pink]
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
          <View style={[s.dividerLine, { backgroundColor: c.border }]} />
          <Text style={[s.dividerText, { color: c.textSecondary }]}>or</Text>
          <View style={[s.dividerLine, { backgroundColor: c.border }]} />
        </View>

        {/* Signup link */}
        <TouchableOpacity
          style={s.signupRow}
          onPress={() => router.push("/signup")}
          disabled={loading}
        >
          <Text style={[s.signupText, { color: c.textSecondary }]}>Don't have an account? </Text>
          <Text style={[s.signupAccent, { color: c.violet }]}>Create one</Text>
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
    letterSpacing: -0.5,
  },

  headingBlock: { marginBottom: 32 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
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
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  form: { marginBottom: 8 },

  forgotWrap: { alignSelf: "flex-end", marginTop: -8, paddingVertical: 6 },
  forgotText: { fontSize: 13, fontWeight: "700" },

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
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontWeight: "500" },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  signupText: { fontSize: 14 },
  signupAccent: { fontSize: 14, fontWeight: "700" },
});
