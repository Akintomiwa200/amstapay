// import React, { createContext, useContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type User = {
//   _id: string;
//   fullName?: string;
//   email?: string;
//   phoneNumber?: string;
//   accountType?: string;
//   isVerified?: boolean;
//   role?: string;
//   createdAt?: string;
//   name?: string;
//   phone?: string;
// };

// type Transaction = {
//   _id: string;
//   sender: string;
//   receiverName: string;
//   receiverAccountNumber: string;
//   receiverBank: string;
//   amount: number;
//   type: string;
//   qrData?: string;
//   reference?: string;
//   merchantId?: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
//   status?: string;
// };

// type WalletBalance = {
//   balance: number;
// };

// type AuthContextType = {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (emailOrPhone: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
//   updateProfile: (userData: Partial<User>) => Promise<void>;
//   changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
//   deleteAccount: () => Promise<void>;
//   getTransactions: () => Promise<Transaction[]>;
//   getTransaction: (id: string) => Promise<Transaction>;
//   updateTransactionStatus: (id: string, status: string) => Promise<void>;
//   getWalletBalance: () => Promise<WalletBalance>;
//   fundWallet: (amount: number, paymentMethod: string) => Promise<void>;
//   withdrawFromWallet: (amount: number, accountDetails: any) => Promise<void>;
//   transferToWallet: (amount: number, recipient: string) => Promise<void>;
//   getWalletTransactions: () => Promise<any[]>;
//   sendViaQR: (qrData: any, amount: number) => Promise<void>;
//   receiveViaQR: (qrData: any) => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadStoredAuth = async () => {
//       try {
//         const savedToken = await AsyncStorage.getItem("token");
//         const savedUser = await AsyncStorage.getItem("user");
//         if (savedToken) {
//           setToken(savedToken);
//           if (savedUser) {
//             setUser(JSON.parse(savedUser));
//           } else {
//             await fetchUserProfile(savedToken);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load auth state", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadStoredAuth();
//   }, []);

//   const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//     const baseUrl = "https://amstapay-backend.onrender.com/api";
//     // const baseUrl = "http://localhost:3000/api";
    
//     const headers = {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     const response = await fetch(`${baseUrl}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `API request failed: ${response.status}`);
//     }

//     return response.json();
//   };

//   const fetchUserProfile = async (authToken: string) => {
//     const data = await apiRequest("/users/me", {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
    
//     setUser(data);
//     await AsyncStorage.setItem("user", JSON.stringify(data));
//     return data;
//   };

//   const login = async (emailOrPhone: string, password: string) => {
//     const data = await apiRequest("/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ emailOrPhone, password }),
//     });

//     setToken(data.token);
//     await AsyncStorage.setItem("token", data.token);

//     const profile = await fetchUserProfile(data.token);
//     setUser(profile);
//     await AsyncStorage.setItem("user", JSON.stringify(profile));
//   };

//   const logout = async () => {
//     setUser(null);
//     setToken(null);
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("user");
//   };

//   const refreshUser = async () => {
//     if (token) {
//       await fetchUserProfile(token);
//     }
//   };

//   const updateProfile = async (userData: Partial<User>) => {
//     const data = await apiRequest("/users/me", {
//       method: "PUT",
//       body: JSON.stringify(userData),
//     });
    
//     setUser(data);
//     await AsyncStorage.setItem("user", JSON.stringify(data));
//   };

//   const changePassword = async (currentPassword: string, newPassword: string) => {
//     await apiRequest("/users/change-password", {
//       method: "POST",
//       body: JSON.stringify({ currentPassword, newPassword }),
//     });
//   };

//   const deleteAccount = async () => {
//     await apiRequest("/users/delete", {
//       method: "DELETE",
//     });
    
//     await logout();
//   };

//   const getTransactions = async (): Promise<Transaction[]> => {
//     return await apiRequest("/transactions");
//   };

//   const getTransaction = async (id: string): Promise<Transaction> => {
//     return await apiRequest(`/transactions/${id}`);
//   };

//   const updateTransactionStatus = async (id: string, status: string) => {
//     await apiRequest(`/transactions/${id}/status`, {
//       method: "PATCH",
//       body: JSON.stringify({ status }),
//     });
//   };

//   const getWalletBalance = async (): Promise<WalletBalance> => {
//     return await apiRequest("/wallets/balance");
//   };

//   const fundWallet = async (amount: number, paymentMethod: string) => {
//     await apiRequest("/wallets/fund", {
//       method: "POST",
//       body: JSON.stringify({ amount, paymentMethod }),
//     });
//   };

//   const withdrawFromWallet = async (amount: number, accountDetails: any) => {
//     await apiRequest("/wallets/withdraw", {
//       method: "POST",
//       body: JSON.stringify({ amount, accountDetails }),
//     });
//   };

//   const transferToWallet = async (amount: number, recipient: string) => {
//     await apiRequest("/wallets/transfer", {
//       method: "POST",
//       body: JSON.stringify({ amount, recipient }),
//     });
//   };

//   const getWalletTransactions = async (): Promise<any[]> => {
//     return await apiRequest("/wallets/transactions");
//   };

//   const sendViaQR = async (qrData: any, amount: number) => {
//     await apiRequest("/payments/send", {
//       method: "POST",
//       body: JSON.stringify({ qrData, amount }),
//     });
//   };

//   const receiveViaQR = async (qrData: any) => {
//     await apiRequest("/payments/receive", {
//       method: "POST",
//       body: JSON.stringify({ qrData }),
//     });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         login,
//         logout,
//         refreshUser,
//         updateProfile,
//         changePassword,
//         deleteAccount,
//         getTransactions,
//         getTransaction,
//         updateTransactionStatus,
//         getWalletBalance,
//         fundWallet,
//         withdrawFromWallet,
//         transferToWallet,
//         getWalletTransactions,
//         sendViaQR,
//         receiveViaQR,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  accountType: string;
  amstapayAccountNumber?: string;
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  kycLevel: number;
  isVerified: boolean;
  isOtpVerified: boolean;
  // Add other fields as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  getWalletBalance: () => Promise<{ balance: number; user: User }>;
  refreshUserData: () => Promise<User | null>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Refresh user data to ensure it's current
        await refreshUserData();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await logout(); // Clear any corrupted data
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to logout:', error);
      // Still set state even if storage fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      await logout();
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const refreshUserData = async (): Promise<User | null> => {
    try {
      const response = await makeAuthenticatedRequest('/users/me');
      
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error(response.message || 'Failed to fetch user data');
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      
      if (error.message.includes('Authentication failed')) {
        // Don't throw here, logout was already called
        return null;
      }
      
      throw error;
    }
  };

  const getWalletBalance = async (): Promise<{ balance: number; user: User }> => {
    try {
      // First, get updated user data
      const userData = await refreshUserData();
      
      if (!userData) {
        throw new Error('User not found or inactive');
      }

      // For now, return mock balance - replace with actual wallet API call
      // TODO: Replace with actual wallet balance endpoint
      const mockBalance = 150000; // This should come from your wallet/balance endpoint
      
      return {
        balance: mockBalance,
        user: userData
      };
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    getWalletBalance,
    refreshUserData,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};