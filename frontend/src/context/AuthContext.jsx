import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, login, logout, register } from "../services/auth.api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if user is logged in
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
    <AuthContext.Provider value={{ user, loading, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
