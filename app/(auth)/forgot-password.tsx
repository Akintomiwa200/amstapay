// forgot-password.tsx
// Real API integration for password reset
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { authService } from "@/services/auth";
import { emailService } from "@/services/email";

function GradientButton({
  label,
  onPress,
  loading,
  disabled,
  c,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  c: any;
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
            : [c.mint, c.blue, c.violet, c.pink]
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

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset" | "success">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validateEmail = () => {
    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Enter a valid email address";
    return "";
  };

  const handleRequestReset = async () => {
    const err = validateEmail();
    if (err) { setError(err); return; }
    
    setLoading(true);
    setError("");
    try {
      const data = await authService.forgotPassword(email.trim());
      const payload = data as { message?: string; resetCode?: string };
      setSuccessMsg(payload.message || 'Reset code sent to your email/phone');
      setStep('reset');
      emailService.send(email.trim(), 'forgot-password', {
        name: email.trim().split('@')[0],
        code: payload.resetCode || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleResetPassword = async () => {
    const err = validatePassword();
    if (err) { setError(err); return; }
    
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(email.trim(), token, password);
      setStep('success');
      emailService.send(email.trim(), 'password-changed', {
        name: email.trim().split('@')[0],
        time: new Date().toLocaleString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={[s.scroll, { backgroundColor: c.bg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={[s.back, { backgroundColor: c.primaryLight }]} onPress={() => router.back()}>
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

        {step === "request" && (
          <>
            <View style={s.headingBlock}>
              <Text style={[s.heading, { color: c.primary }]}>Forgot Password?</Text>
              <Text style={[s.subheading, { color: c.textSecondary }]}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
            </View>

            {error ? (
              <View style={s.errorBanner}>
                <Text style={[s.errorBannerText, { color: c.error }]}>⚠ {error}</Text>
              </View>
            ) : null}

            {successMsg ? (
              <View style={s.successBanner}>
                <Text style={s.successBannerText}>✓ {successMsg}</Text>
              </View>
            ) : null}

            <View style={s.form}>
              <View style={s.inputWrap}>
                <Text style={[s.label, { color: c.primary }]}>Email Address</Text>
                <View style={[s.inputRow, { backgroundColor: c.surfaceVariant, borderColor: c.border }]}>
                  <Mail size={18} color={c.primary} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { color: c.text }]}
                    placeholder="you@example.com"
                    placeholderTextColor="#B0A8C0"
                    value={email}
                    onChangeText={(v) => { setEmail(v); setError(""); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>
              </View>
            </View>

            <GradientButton
              label="Send Reset Link"
              onPress={handleRequestReset}
              loading={loading}
              disabled={!email.trim()}
              c={c}
            />

            {successMsg && (
              <TouchableOpacity
                style={s.nextStepButton}
                onPress={() => setStep("reset")}
              >
                  <Text style={[s.nextStepButtonText, { color: c.violet }]}>I have a reset code</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {step === "reset" && (
          <>
            <View style={s.headingBlock}>
              <Text style={[s.heading, { color: c.primary }]}>Reset Password</Text>
                <Text style={[s.subheading, { color: c.textSecondary }]}>
                  Enter the code from your email/phone and set a new password.
                </Text>
            </View>

            {error ? (
              <View style={s.errorBanner}>
                <Text style={[s.errorBannerText, { color: c.error }]}>⚠ {error}</Text>
              </View>
            ) : null}

            <View style={s.form}>
              <View style={s.inputWrap}>
                  <Text style={[s.label, { color: c.primary }]}>Reset Code</Text>
                  <View style={[s.inputRow, { backgroundColor: c.surfaceVariant, borderColor: c.border }]}>
                    <Lock size={18} color={c.primary} style={s.inputIcon} />
                    <TextInput
                      style={[s.input, { color: c.text }]}
                      placeholder="Enter code from email/phone"
                      placeholderTextColor="#B0A8C0"
                      value={token}
                      onChangeText={(v) => { setToken(v); setError(""); }}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>
              </View>

              <View style={s.inputWrap}>
                <Text style={[s.label, { color: c.primary }]}>New Password</Text>
                <View style={[s.inputRow, { backgroundColor: c.surfaceVariant, borderColor: c.border }]}>
                  <Lock size={18} color={c.primary} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { color: c.text }]}
                    placeholder="Enter new password"
                    placeholderTextColor="#B0A8C0"
                    value={password}
                    onChangeText={(v) => { setPassword(v); setError(""); }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={18} color={c.textSecondary} />
                    ) : (
                      <Eye size={18} color={c.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={s.inputWrap}>
                <Text style={[s.label, { color: c.primary }]}>Confirm Password</Text>
                <View style={[s.inputRow, { backgroundColor: c.surfaceVariant, borderColor: c.border }]}>
                  <Lock size={18} color={c.primary} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { color: c.text }]}
                    placeholder="Confirm new password"
                    placeholderTextColor="#B0A8C0"
                    value={confirmPassword}
                    onChangeText={(v) => { setConfirmPassword(v); setError(""); }}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? (
                      <EyeOff size={18} color={c.textSecondary} />
                    ) : (
                      <Eye size={18} color={c.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <GradientButton
              label="Reset Password"
              onPress={handleResetPassword}
              loading={loading}
              disabled={!token || !password || !confirmPassword}
              c={c}
            />
          </>
        )}

        {step === "success" && (
          <View style={s.successContainer}>
            <View style={s.successIconWrap}>
              <LinearGradient
                colors={[c.mint, c.blue]}
                style={s.successIcon}
              >
                <Check size={32} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={[s.successHeading, { color: c.primary }]}>Password Reset!</Text>
            <Text style={[s.successText, { color: c.textSecondary }]}>
              Your password has been successfully reset. You can now login with your new password.
            </Text>
            <GradientButton
              label="Back to Login"
              onPress={() => router.replace("/login")}
              c={c}
            />
          </View>
        )}
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
  successBanner: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 14,
    marginBottom: 20,
  },
  successBannerText: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },
  form: { marginBottom: 8 },
  inputWrap: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontWeight: "500" },
  nextStepButton: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 12,
  },
  nextStepButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 16,
  },
  successIconWrap: { marginBottom: 16 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  successHeading: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  successText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});
