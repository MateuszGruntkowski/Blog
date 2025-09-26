import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    const { token } = authResponse;
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = () => {
    if (!user) return false;

    try {
      const decoded = jwtDecode(user.token);

      if (decoded.role === "ADMIN") return true;
      return false;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return false;
    }
  };

  const getUserId = () => {
    if (!user) return null;

    try {
      const decoded = jwtDecode(user.token);
      // console.log("id z tokenu: ", typeof decoded.userId);
      return decoded.userId;
    } catch (error) {
      console.log("Error decoding token for user ID:", error);
      return null;
    }
  };

  const isAuthenticated = () => !!user;

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    getUserId,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
