import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ... (keep all your existing type definitions)
type User = {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  accountType?: string;
  isVerified?: boolean;
  role?: string;
  createdAt?: string;
  name?: string;
  phone?: string;
};

type Transaction = {
  _id: string;
  sender: string;
  receiverName: string;
  receiverAccountNumber: string;
  receiverBank: string;
  amount: number;
  type: string;
  qrData?: string;
  reference?: string;
  merchantId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
};

type WalletBalance = {
  balance: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  getTransactions: () => Promise<Transaction[]>;
  getTransaction: (id: string) => Promise<Transaction>;
  updateTransactionStatus: (id: string, status: string) => Promise<void>;
  getWalletBalance: () => Promise<WalletBalance>;
  fundWallet: (amount: number, paymentMethod: string) => Promise<void>;
  withdrawFromWallet: (amount: number, accountDetails: any) => Promise<void>;
  transferToWallet: (amount: number, recipient: string) => Promise<void>;
  getWalletTransactions: () => Promise<any[]>;
  sendViaQR: (qrData: any, amount: number) => Promise<void>;
  receiveViaQR: (qrData: any) => Promise<void>;
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
        
        console.log("Loaded token from storage:", savedToken ? "exists" : "null");
        console.log("Loaded user from storage:", savedUser ? "exists" : "null");
        
        if (savedToken) {
          setToken(savedToken);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // Try to fetch user profile if we have token but no user data
            try {
              await fetchUserProfile(savedToken);
            } catch (error) {
              console.error("Failed to fetch user profile:", error);
              // Clear invalid token
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load auth state", err);
        // Clear corrupted data
        try {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
        } catch (clearError) {
          console.error("Failed to clear corrupted auth data", clearError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = "https://amstapay-backend.onrender.com/api";
    // const baseUrl = "http://localhost:3000/api"; // Use this for local development
    
    console.log(`Making API request to: ${baseUrl}${endpoint}`);
    
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
        timeout: 10000, // 10 second timeout
      });

      console.log(`API Response Status: ${response.status}`);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = {};
        }

        const errorMessage = errorData.message || 
                           errorData.error || 
                           `Request failed with status ${response.status}`;
        
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API Request successful");
      return data;
      
    } catch (error) {
      console.error("API Request failed:", error);
      
      if (error instanceof TypeError && error.message.includes("Network request failed")) {
        throw new Error("Network error. Please check your internet connection.");
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("An unexpected error occurred");
    }
  };

  const fetchUserProfile = async (authToken: string) => {
    try {
      const data = await apiRequest("/users/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      console.log("Attempting login for:", emailOrPhone);
      
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ 
          emailOrPhone: emailOrPhone.trim(), 
          password: password 
        }),
      });

      console.log("Login response received");

      if (!data.token) {
        throw new Error("No authentication token received");
      }

      setToken(data.token);
      await AsyncStorage.setItem("token", data.token);

      // Fetch user profile
      const profile = await fetchUserProfile(data.token);
      setUser(profile);
      await AsyncStorage.setItem("user", JSON.stringify(profile));

      console.log("Login completed successfully");
      
    } catch (error) {
      console.error("Login failed:", error);
      
      // Clear any partial auth state
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      
      console.log("Logout completed");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force clear state even if AsyncStorage fails
      setUser(null);
      setToken(null);
    }
  };

  const refreshUser = async () => {
    if (token) {
      try {
        await fetchUserProfile(token);
      } catch (error) {
        console.error("Failed to refresh user:", error);
        // If refresh fails, might be due to expired token
        if (error instanceof Error && error.message.includes("401")) {
          await logout();
        }
        throw error;
      }
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    const data = await apiRequest("/users/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    
    setUser(data);
    await AsyncStorage.setItem("user", JSON.stringify(data));
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await apiRequest("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  };

  const deleteAccount = async () => {
    await apiRequest("/users/delete", {
      method: "DELETE",
    });
    
    await logout();
  };

  const getTransactions = async (): Promise<Transaction[]> => {
    return await apiRequest("/transactions");
  };

  const getTransaction = async (id: string): Promise<Transaction> => {
    return await apiRequest(`/transactions/${id}`);
  };

  const updateTransactionStatus = async (id: string, status: string) => {
    await apiRequest(`/transactions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  };

  const getWalletBalance = async (): Promise<WalletBalance> => {
    return await apiRequest("/wallets/balance");
  };

  const fundWallet = async (amount: number, paymentMethod: string) => {
    await apiRequest("/wallets/fund", {
      method: "POST",
      body: JSON.stringify({ amount, paymentMethod }),
    });
  };

  const withdrawFromWallet = async (amount: number, accountDetails: any) => {
    await apiRequest("/wallets/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount, accountDetails }),
    });
  };

  const transferToWallet = async (amount: number, recipient: string) => {
    await apiRequest("/wallets/transfer", {
      method: "POST",
      body: JSON.stringify({ amount, recipient }),
    });
  };

  const getWalletTransactions = async (): Promise<any[]> => {
    return await apiRequest("/wallets/transactions");
  };

  const sendViaQR = async (qrData: any, amount: number) => {
    await apiRequest("/payments/send", {
      method: "POST",
      body: JSON.stringify({ qrData, amount }),
    });
  };

  const receiveViaQR = async (qrData: any) => {
    await apiRequest("/payments/receive", {
      method: "POST",
      body: JSON.stringify({ qrData }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
        deleteAccount,
        getTransactions,
        getTransaction,
        updateTransactionStatus,
        getWalletBalance,
        fundWallet,
        withdrawFromWallet,
        transferToWallet,
        getWalletTransactions,
        sendViaQR,
        receiveViaQR,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};