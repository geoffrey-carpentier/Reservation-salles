// contexts/AuthContext.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./authCreate.js";
import { authService } from "../services/api.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authChecking = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        authService
          .getProfile()
          .then((data) => setUser(data.user))
          .catch(() => localStorage.removeItem("token"))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
    authChecking();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
