// layout/dashboardLayout.tsx
import BottomNav from "@/components/BottomNav";
import React from "react";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// ─── AmstaPay Color tokens ─────────────────────────────────────────────────────
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
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showHeader?: boolean;
  headerTitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  showHeader = false,
  headerTitle = "",
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} translucent={false} />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          {/* Optional Gradient Header */}
          {showHeader && (
            <LinearGradient
              colors={[C.primaryLight, C.bg]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.header}
            >
              <Text style={styles.headerTitle}>{headerTitle}</Text>
            </LinearGradient>
          )}

          {/* Page content — padded so nothing hides behind floating nav */}
          <View style={[styles.content, !showHeader && styles.contentNoHeader]}>
            {React.Children.map(children, (child) =>
              React.isValidElement(child) ? child : null
            )}
          </View>

          {/* Floating pill nav — absolutely positioned over content */}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default DashboardLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    // nav height ~56 + bottom offset 20 + breathing room = 88
    paddingBottom: 88,
  },
  contentNoHeader: {
    paddingTop: 16,
  },
});