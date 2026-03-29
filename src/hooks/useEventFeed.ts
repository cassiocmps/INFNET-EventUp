import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category, Event, ToastState } from "types";
import { useAuth } from "../contexts/AuthContext";
import { PATHS } from "../routes/paths";
import { eventService } from "../services/eventService";

const PULL_THRESHOLD = 70;
const MAX_PULL_DISTANCE = 120;

export function useEventFeed() {
  const navigate = useNavigate();
  const { isParticipant } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);

  useEffect(() => {
    if (!isParticipant) {
      navigate(PATHS.dashboard);
      return;
    }
    loadCategories();
    fetchEvents();
  }, [isParticipant, navigate]);

  async function loadCategories() {
    try {
      const data = await eventService.getCategories();
      setCategories(data);
    } catch (error) {
      setToast({
        message: "Failed to load categories. Please try again.",
        type: "error",
      });
    }
  }

  async function fetchEvents() {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
      setIsLoading(false);
    } catch (error) {
      setToast({
        message: "Failed to load events. Please try again.",
        type: "error",
      });
      setIsLoading(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      setToast({
        message: "Failed to refresh events. Please try again.",
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  function isMobileViewport() {
    return window.innerWidth < 768;
  }

  function handleTouchStart(event: React.TouchEvent): void {
    if (!isMobileViewport() || isRefreshing || window.scrollY > 0) {
      return;
    }

    touchStartYRef.current = event.touches[0].clientY;
  }

  function handleTouchMove(event: React.TouchEvent): void {
    if (touchStartYRef.current === null || !isMobileViewport()) {
      return;
    }

    const currentY = event.touches[0].clientY;
    const delta = currentY - touchStartYRef.current;

    if (delta <= 0) {
      return;
    }

    const nextDistance = Math.min(delta, MAX_PULL_DISTANCE);
    pullDistanceRef.current = nextDistance;
    setPullDistance(nextDistance);
  }

  async function handleTouchEnd() {
    const shouldRefresh = pullDistanceRef.current >= PULL_THRESHOLD;

    touchStartYRef.current = null;
    pullDistanceRef.current = 0;
    setPullDistance(0);

    if (shouldRefresh && !isRefreshing) {
      await handleRefresh();
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("");
  }

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        !selectedCategory || event.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        event.title?.toLowerCase().includes(normalizedSearch) ||
        event.description?.toLowerCase().includes(normalizedSearch) ||
        event.location?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [events, searchTerm, selectedCategory]);

  return {
    events,
    filteredEvents,
    categories,
    searchTerm,
    selectedCategory,
    isLoading,
    isRefreshing,
    pullDistance,
    toast,
    setToast,
    handleRefresh,
    setSearchTerm,
    setSelectedCategory,
    clearFilters,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
