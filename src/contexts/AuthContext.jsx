import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  function login(user) {
    const userToStore = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
    setCurrentUser(userToStore);
    localStorage.setItem("currentUser", JSON.stringify(userToStore));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  }

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isOrganizer: currentUser?.role === "organizer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
