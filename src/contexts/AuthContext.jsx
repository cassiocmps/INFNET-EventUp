import { createContext, useContext, useEffect, useState } from "react";
import { eventService } from "../services/eventService";

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
      registrations: user.registrations || [],
    };
    setCurrentUser(userToStore);
    localStorage.setItem("currentUser", JSON.stringify(userToStore));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  }

  function syncCurrentUser(updatedUser) {
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }

  async function toggleFavorite(eventId) {
    if (!currentUser) return;

    try {
      const updatedUser = await eventService.toggleFavoriteForUser({
        user: currentUser,
        eventId,
      });
      syncCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }

  function isFavorite(eventId) {
    if (!currentUser) return false;
    return (currentUser.favorites || []).includes(eventId);
  }

  async function registerForEvent(eventId) {
    if (!currentUser) return;

    try {
      const updatedUser = await eventService.registerForEventForUser({
        user: currentUser,
        eventId,
      });
      syncCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  }

  async function unregisterFromEvent(eventId) {
    if (!currentUser) return;

    try {
      const updatedUser = await eventService.unregisterFromEventForUser({
        user: currentUser,
        eventId,
      });
      syncCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error unregistering from event:", error);
    }
  }

  function isRegistered(eventId) {
    if (!currentUser) return false;
    return (currentUser.registrations || []).includes(eventId);
  }

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    toggleFavorite,
    isFavorite,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
    favorites: currentUser?.favorites || [],
    registrations: currentUser?.registrations || [],
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
