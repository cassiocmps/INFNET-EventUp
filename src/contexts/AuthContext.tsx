import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextValue, User } from "types";
import { eventService } from "../services/eventService";

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (!parsed.id) {
          localStorage.removeItem("currentUser");
        } else {
          setCurrentUser(parsed);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  function login(user: User): void {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  }

  function syncCurrentUser(updatedUser: User): void {
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }

  async function toggleFavorite(eventId: string): Promise<void> {
    if (!currentUser) return;

    const updatedUser = await eventService.toggleFavoriteForUser({
      user: currentUser,
      eventId,
    });
    syncCurrentUser(updatedUser);
  }

  function isFavorite(eventId: string): boolean {
    if (!currentUser) return false;
    return (currentUser.favorites || []).includes(eventId);
  }

  async function registerForEvent(eventId: string): Promise<void> {
    if (!currentUser) return;

    const updatedUser = await eventService.registerForEventForUser({
      user: currentUser,
      eventId,
    });
    syncCurrentUser(updatedUser);
  }

  async function unregisterFromEvent(eventId: string): Promise<void> {
    if (!currentUser) return;

    const updatedUser = await eventService.unregisterFromEventForUser({
      user: currentUser,
      eventId,
    });
    syncCurrentUser(updatedUser);
  }

  function isRegistered(eventId: string): boolean {
    if (!currentUser) return false;
    return (currentUser.registrations || []).includes(eventId);
  }

  const value: AuthContextValue = {
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
