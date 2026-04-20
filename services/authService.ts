// services/authService.ts

const API_BASE_URL = "https://amstapay-backend.onrender.com/api";

export async function loginUser(emailOrPhone: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    return data; // Should include token/user info
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("Network")) {
      throw new Error("Network error. Please try again.");
    }
    throw error;
  }
}
