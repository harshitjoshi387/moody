import { createContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (credentials) => {
    const data = await login(credentials);
    setUser(data.user || data);
    return data;
  };

  const handleRegister = async (credentials) => {
    const data = await register(credentials);
    setUser(data.user || data);
    return data;
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
