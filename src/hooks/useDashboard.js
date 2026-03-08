import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { eventService } from "../services/eventService";

export function useDashboard() {
  const location = useLocation();
  const { isParticipant, favorites, registrations } = useAuth();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      setToast({
        message: location.state.successMessage,
        type: "success",
      });
      window.history.replaceState({}, document.title);
    }

    if (location.state?.errorMessage) {
      setToast({
        message: location.state.errorMessage,
        type: "error",
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isParticipant) return;

    async function loadEvents() {
      setIsLoading(true);
      try {
        const allEvents = await eventService.getEvents();

        setFavoriteEvents(
          allEvents.filter((event) => favorites.includes(event.id)),
        );
        setRegisteredEvents(
          allEvents.filter((event) => registrations.includes(event.id)),
        );
      } catch (error) {
        setToast({
          message: "Failed to load events. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [isParticipant, favorites, registrations]);

  return {
    toast,
    setToast,
    activeTab,
    setActiveTab,
    favoriteEvents,
    registeredEvents,
    isLoading,
  };
}
