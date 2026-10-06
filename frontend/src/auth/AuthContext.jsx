import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, clearToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Authenticate session via HTTP-only cookie with transparent refresh
    api
      .me()
      .then((res) => {
        if (res?.data) {
          setAdmin(res.data);
        } else {
          setAdmin(null);
        }
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await api.login(cleanEmail, cleanPassword);
      if (!res?.data?.admin) {
        throw new Error("Invalid response from server");
      }
      if (res?.data?.token) {
        setToken(res.data.token);
      }
      setAdmin(res.data.admin);
      return res.data.admin;
    } catch (err) {
      throw new Error(err.message || "Invalid email or password");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {}
    clearToken();
    try {
      localStorage.removeItem("simatrix_admin_user");
      localStorage.removeItem("elysium_token");
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
