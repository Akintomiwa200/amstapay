import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  accountType?: string;
  isVerified?: boolean;
  role?: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken) {
          setToken(savedToken);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            await fetchUserProfile(savedToken); // refresh if only token is saved
          }
        }
      } catch (err) {
        console.error("Failed to load auth state", err);
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

 // AuthContext.tsx

const fetchUserProfile = async (authToken: string) => {
  const res = await fetch("https://amstapay-backend.onrender.com/api/users/me", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
};

const login = async (emailOrPhone: string, password: string) => {
  try {
    const res = await fetch(
      "https://amstapay-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Invalid credentials");
    }

    const data = await res.json();

    // save token
    setToken(data.token);
    await AsyncStorage.setItem("token", data.token);

    // fetch profile using token
    const profile = await fetchUserProfile(data.token);
    setUser(profile);
    await AsyncStorage.setItem("user", JSON.stringify(profile));
  } catch (err) {
    throw err;
  }
};


  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  // Allow screens to refresh user manually
  const refreshUser = async () => {
    if (token) {
      await fetchUserProfile(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
