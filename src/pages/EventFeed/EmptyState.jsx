import { CalendarX } from "lucide-react";
import styles from "./EventFeedPage.module.css";

export default function EmptyState() {
  return (
    <div className={styles.empty}>
      <CalendarX size={40} strokeWidth={1.5} className={styles.emptyIcon} />
      <p className={styles.emptyText}>No events available at the moment.</p>
      <p className={styles.emptySubtext}>Check back later for new events!</p>
    </div>
  );
}
