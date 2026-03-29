import { useEffect, useRef } from "react";
import { XCircle, AlertCircle, BellOff } from "lucide-react";
import type { Notification, NotificationType } from "types";
import styles from "./NotificationPanel.module.css";

const TYPE_ICON: Record<NotificationType, React.ReactElement> = {
  cancellation: <XCircle size={16} color="#ef4444" aria-hidden="true" />,
  update: <AlertCircle size={16} color="#f59e0b" aria-hidden="true" />,
};

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

export default function NotificationPanel({ notifications, onClose }: NotificationPanelProps): React.ReactElement {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div
      className={styles.panel}
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>
          <BellOff
            size={32}
            strokeWidth={1.5}
            color="#94a3b8"
            aria-hidden="true"
          />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`${styles.item} ${!n.isRead ? styles.unread : ""}`}
            >
              <span className={styles.itemIcon}>
                {TYPE_ICON[n.type] ?? null}
              </span>
              <div className={styles.itemBody}>
                <p className={styles.itemMessage}>{n.message}</p>
                <span className={styles.itemTime}>
                  {formatRelativeTime(n.createdAt)}
                </span>
              </div>
              {!n.isRead && <span className={styles.dot} aria-label="Unread" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
