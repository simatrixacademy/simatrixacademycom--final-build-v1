import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken, clearToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Check if local admin user session is preserved
    try {
      const stored = localStorage.getItem("simatrix_admin_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          if (parsed.name === "Sakthi" || !parsed.name) {
            parsed.name = "Admin";
            localStorage.setItem("simatrix_admin_user", JSON.stringify(parsed));
          }
          setAdmin(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}

    api
      .me()
      .then((res) => setAdmin(res.data))
      .catch(() => {
        try {
          const stored = localStorage.getItem("simatrix_admin_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.name === "Sakthi" || !parsed.name) {
              parsed.name = "Admin";
              localStorage.setItem("simatrix_admin_user", JSON.stringify(parsed));
            }
            setAdmin(parsed);
            return;
          }
        } catch {}
        clearToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Direct Admin Access for Admin & Sakthi
    const isSakthi =
      (cleanEmail === "sakthi@simatrixacademy.com" ||
        cleanEmail === "sakthi@admin.com" ||
        cleanEmail === "sakthi") &&
      (cleanPassword === "Admin@123" ||
        cleanPassword === "Sakthi@123" ||
        cleanPassword === "admin123" ||
        cleanPassword === "sakthi");

    const isPrimaryAdmin =
      (cleanEmail === "admin@simatrixacademy.com" ||
        cleanEmail === "admin@elysiumacademy.org" ||
        cleanEmail === "admin") &&
      (cleanPassword === "Admin@123" ||
        cleanPassword === "admin123" ||
        cleanPassword === "admin" ||
        cleanPassword === "Sakthi@123");

    if (isSakthi || isPrimaryAdmin) {
      const adminData = {
        id: isSakthi ? "admin-sakthi" : "admin-main",
        name: "Admin",
        email: cleanEmail.includes("@") ? cleanEmail : "admin@simatrixacademy.com",
        role: "super_admin",
      };
      const token = `simatrix_admin_token_${Date.now()}`;
      setToken(token);
      localStorage.setItem("simatrix_admin_user", JSON.stringify(adminData));
      setAdmin(adminData);
      return adminData;
    }

    // 2. Fallback to backend API
    try {
      const res = await api.login(cleanEmail, cleanPassword);
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem("simatrix_admin_user", JSON.stringify(res.data.admin));
      return res.data.admin;
    } catch (err) {
      throw new Error(err.message || "Invalid email or password");
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    try {
      localStorage.removeItem("simatrix_admin_user");
    } catch {}
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
