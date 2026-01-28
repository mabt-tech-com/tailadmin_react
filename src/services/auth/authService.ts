import { apiClient } from "../api/apiClient";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GoogleLoginRequest,
  GoogleRegisterRequest,
  LogoutResponse,
} from "../../types/auth/auth";

function toFormData(obj: Record<string, any>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;

    // FastAPI Form fields parse booleans from strings fine ("true"/"false")
    if (typeof v === "boolean") fd.append(k, v ? "true" : "false");
    else fd.append(k, String(v));
  }
  return fd;
}

export const authService = {
  login(payload: LoginRequest) {
    return apiClient.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: toFormData(payload),
    });
  },

  register(payload: RegisterRequest) {
    return apiClient.request<RegisterResponse>("/api/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: toFormData(payload),
    });
  },

  googleLogin(payload: GoogleLoginRequest) {
    return apiClient.request<LoginResponse>("/api/auth/google", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: toFormData(payload),
    });
  },

  googleRegister(payload: GoogleRegisterRequest) {
    return apiClient.request<RegisterResponse>("/api/auth/google-register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: toFormData(payload),
    });
  },

  logout() {
    return apiClient.request<LogoutResponse>("/api/auth/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
  },
};