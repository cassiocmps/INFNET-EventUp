import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Event, ToastState } from "types";
import { useAuth } from "../contexts/AuthContext";
import { eventService } from "../services/eventService";

export function useDashboard() {
  const location = useLocation();
  const { currentUser, isParticipant, isOrganizer, favorites, registrations } =
    useAuth();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
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

    async function loadParticipantEvents() {
      setIsLoading(true);
      try {
        const allEvents = await eventService.getEvents();

        setFavoriteEvents(
          allEvents.filter((event) => favorites.includes(event.id)),
        );
        setRegisteredEvents(
          allEvents.filter((event) => registrations.includes(event.id)),
        );
      } catch {
        setToast({
          message: "Failed to load events. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadParticipantEvents();
  }, [isParticipant, favorites, registrations]);

  useEffect(() => {
    if (!isOrganizer || !currentUser) return;

    async function loadOrganizerEvents() {
      const userId = currentUser!.id;
      setIsLoading(true);
      try {
        const events = await eventService.getEventsByOrganizer(userId);
        setOrganizerEvents(events);
      } catch {
        setToast({
          message: "Failed to load your events. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadOrganizerEvents();
  }, [isOrganizer, currentUser, location.key]);

  async function handleCancelEvent(eventId: string): Promise<void> {
    try {
      await eventService.cancelEvent(eventId);
      setOrganizerEvents((prev) => prev.filter((e) => e.id !== eventId));
      setToast({ message: "Event cancelled successfully.", type: "success" });
    } catch {
      setToast({
        message: "Failed to cancel the event. Please try again.",
        type: "error",
      });
    }
  }

  return {
    toast,
    setToast,
    activeTab,
    setActiveTab,
    favoriteEvents,
    registeredEvents,
    organizerEvents,
    handleCancelEvent,
    isLoading,
  };
}
