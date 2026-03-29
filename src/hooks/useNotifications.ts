import { useState, useEffect, useCallback } from "react";
import type { Notification } from "types";
import { useAuth } from "../contexts/AuthContext";
import { notificationService } from "../services/notificationService";

export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) {
      setNotifications([]);
      return;
    }
    setNotifications(
      notificationService.getNotificationsForUser(currentUser.id),
    );
  }, [currentUser?.id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
    if (currentUser?.id) {
      notificationService.markReadForUser(currentUser.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  }, [currentUser?.id]);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const togglePanel = useCallback(() => {
    if (!isPanelOpen) {
      openPanel();
    } else {
      closePanel();
    }
  }, [isPanelOpen, openPanel, closePanel]);

  return { notifications, unreadCount, isPanelOpen, togglePanel, closePanel };
}
