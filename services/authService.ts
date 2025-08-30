// services/authService.ts
import axios from "axios";

const API_BASE_URL = "https://amstapay-backend.onrender.com/api";

export async function loginUser(emailOrPhone: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      emailOrPhone,
      password,
    });

    return response.data; // Should include token/user info
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Invalid credentials");
    }
    throw new Error("Network error. Please try again.");
  }
}
