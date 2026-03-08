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
      favorites: user.favorites || [],
    };
    setCurrentUser(userToStore);
    localStorage.setItem("currentUser", JSON.stringify(userToStore));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  }

  function toggleFavorite(eventId) {
    if (!currentUser) return;

    const currentFavorites = currentUser.favorites || [];
    const isFavorited = currentFavorites.includes(eventId);

    const updatedFavorites = isFavorited
      ? currentFavorites.filter((id) => id !== eventId)
      : [...currentFavorites, eventId];

    const updatedUser = {
      ...currentUser,
      favorites: updatedFavorites,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }

  function isFavorite(eventId) {
    if (!currentUser) return false;
    return (currentUser.favorites || []).includes(eventId);
  }

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    toggleFavorite,
    isFavorite,
    favorites: currentUser?.favorites || [],
    isOrganizer: currentUser?.role === "organizer",
    isParticipant: currentUser?.role === "participant",
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
