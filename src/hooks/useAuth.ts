import { useCallback, useState } from "react";
import { authService } from "../services/auth/authService";
import type { LoginRequest, RegisterRequest, GoogleLoginRequest, GoogleRegisterRequest } from "./../types/auth/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      if (!res.success) {
        setError(res.error);
        return { ok: false as const, error: res.error };
      }
      return { ok: true as const, redirect: res.redirect ?? "/dashboard" };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Login failed";
      setError(msg);
      return { ok: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (payload: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(payload);
      if (!res.success) {
        setError(res.error);
        return { ok: false as const, error: res.error };
      }
      return { ok: true as const, redirect: res.redirect ?? "/signin?success=Account+created" };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Registration failed";
      setError(msg);
      return { ok: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
}

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useCallback(async (payload: GoogleLoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.googleLogin(payload);
      if (!res.success) {
        setError(res.error);
        return { ok: false as const, error: res.error };
      }
      return { ok: true as const, redirect: res.redirect ?? "/dashboard" };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Google login failed";
      setError(msg);
      return { ok: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const googleRegister = useCallback(async (payload: GoogleRegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.googleRegister(payload);
      if (!res.success) {
        setError(res.error);
        return { ok: false as const, error: res.error };
      }
      return { ok: true as const, redirect: res.redirect ?? "/dashboard" };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Google signup failed";
      setError(msg);
      return { ok: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { googleLogin, googleRegister, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.logout();
      if (!res.success) return { ok: false as const, error: res.error };
      return { ok: true as const, redirect: res.redirect ?? "/signin" };
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Logout failed";
      return { ok: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading };
}