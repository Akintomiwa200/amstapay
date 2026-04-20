// components/BottomNav.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Home, DollarSign, CreditCard, Gift, User } from "lucide-react-native";

// ─── AmstaPay Color tokens (matching forgot-password template) ─────────────────
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
  // Active state using gradient colors
  activeBg: "#F3EFF8",      // Soft lavender background
  activeColor: "#2D0057",    // Deep purple (primary)
  inactiveColor: "#9CA3AF",  // Gray for inactive
};

const TABS = [
  { key: "dashboard", label: "Home",    Icon: Home },
  { key: "finance",   label: "Finance", Icon: DollarSign },
  { key: "card",      label: "Cards",   Icon: CreditCard },
  { key: "reward",    label: "Rewards", Icon: Gift },
  { key: "me",        label: "Me",      Icon: User },
] as const;

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <View style={s.wrapper}>
      <View style={s.container}>
        {TABS.map(({ key, label, Icon }) => {
          const active = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={s.tab}
              onPress={() => setActiveTab(key)}
              activeOpacity={0.75}
            >
              {active ? (
                /* Active state — pill with gradient background */
                <View style={s.pill}>
                  <Icon size={18} color={C.activeColor} strokeWidth={2} />
                  <Text style={s.pillLabel}>{label}</Text>
                </View>
              ) : (
                /* Inactive state — icon only */
                <View style={s.iconWrap}>
                  <Icon size={22} color={C.inactiveColor} strokeWidth={1.8} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primaryLight,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  pillLabel: {
    color: C.activeColor,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  iconWrap: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});