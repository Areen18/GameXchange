import type { AccountListing, AuthResponse, CreateListingInput, Trade, User } from "../types/marketplace";

// In development, use relative path to leverage Vite proxy
// In production, use full URL from environment variable
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || '/api');
const TOKEN_KEY = "gamexchange_token";
const REFRESH_TOKEN_KEY = "gamexchange_refresh_token";
const SESSION_TOKEN_KEY = "gamexchange_token_session";
const SESSION_REFRESH_TOKEN_KEY = "gamexchange_refresh_token_session";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearStoredToken();
      return null;
    }

    const data = await response.json();
    storeToken(data.token, data.refreshToken, true);
    return data.token;
  } catch {
    clearStoredToken();
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle token expiration with automatic refresh
  if (response.status === 401) {
    // Clone response before reading to avoid "body stream already read" error
    const clonedResponse = response.clone();
    
    try {
      const text = await clonedResponse.text();
      const data = text ? JSON.parse(text) : {};
      
      if (data.code === "TOKEN_EXPIRED") {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshAccessToken();
          isRefreshing = false;

          if (newToken) {
            onTokenRefreshed(newToken);
            
            // Retry original request with new token
            headers.set("Authorization", `Bearer ${newToken}`);
            response = await fetch(`${API_BASE_URL}${path}`, {
              ...options,
              headers,
            });
          } else {
            throw new Error("Session expired. Please login again");
          }
        } else {
          // Wait for token refresh to complete
          const newToken = await new Promise<string>((resolve) => {
            addRefreshSubscriber((token: string) => {
              resolve(token);
            });
          });

          headers.set("Authorization", `Bearer ${newToken}`);
          response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
          });
        }
      }
    } catch (parseError) {
      // If parsing fails, continue with original response
      console.error('Failed to parse 401 response:', parseError);
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export function storeToken(token: string, refreshToken: string, remember = true) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_REFRESH_TOKEN_KEY);
    return;
  }

  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  sessionStorage.setItem(SESSION_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_REFRESH_TOKEN_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(SESSION_REFRESH_TOKEN_KEY);
}

export async function signup(payload: { email: string; password: string; fullName: string }) {
  return request<{ user: User; message: string; requiresVerification: boolean }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(token: string) {
  return request<AuthResponse & { success: boolean; message: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification(email: string) {
  return request<{ success: boolean; message: string }>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function logout() {
  try {
    await request<{ success: boolean }>("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearStoredToken();
  }
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return request<{ success: boolean; message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return request<{ user: User }>("/auth/me");
}

export async function getAccounts(filters: {
  search?: string;
  rank?: string;
  region?: string;
  minSkins?: string;
}) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<{ accounts: AccountListing[] }>(`/accounts${suffix}`);
}

export async function createListing(payload: CreateListingInput) {
  return request<{ account: AccountListing }>("/accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getTrades() {
  return request<{ trades: Trade[] }>("/trades");
}

export async function createTrade(accountId: string) {
  return request<{ 
    trade: Trade; 
    paymentOrder: { 
      id: string; 
      amount: number; 
      currency: string; 
    } 
  }>("/trades", {
    method: "POST",
    body: JSON.stringify({ accountId }),
  });
}

export async function verifyPayment(tradeId: string, paymentDetails: {
  paymentId: string;
  orderId: string;
  signature: string;
}) {
  return request<{ success: boolean; message: string; trade: Partial<Trade> }>(`/trades/${tradeId}/verify-payment`, {
    method: "POST",
    body: JSON.stringify(paymentDetails),
  });
}

export async function getPaymentConfig() {
  return request<{ key: string; currency: string }>("/payment/config");
}

export async function confirmTrade(tradeId: string) {
  return request<{ success: boolean }>(`/trades/${tradeId}/confirm`, {
    method: "PATCH",
  });
}

export async function cancelTrade(tradeId: string) {
  return request<{ success: boolean; message: string }>(`/trades/${tradeId}/cancel`, {
    method: "PATCH",
  });
}
