import { Bell } from "lucide-react";
import styles from "./NotificationBell.module.css";

export default function NotificationBell({ unreadCount, onClick }) {
  return (
    <button
      type="button"
      className={styles.bell}
      onClick={onClick}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
