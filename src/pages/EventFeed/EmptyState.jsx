import styles from "./EventFeedPage.module.css";

export default function EmptyState() {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyText}>No events available at the moment.</p>
      <p className={styles.emptySubtext}>Check back later for new events!</p>
    </div>
  );
}
