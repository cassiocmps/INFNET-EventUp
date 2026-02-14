import PrimaryButton from "../../components/PrimaryButton";
import styles from "./EventFeedPage.module.css";

export default function EventFeedHeader({ onRefresh, isRefreshing }) {
  return (
    <div className={styles.header}>
      <p className={styles.subtitle}>Discover amazing community events</p>

      <div className={styles.refreshSection}>
        <PrimaryButton onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </PrimaryButton>
      </div>
    </div>
  );
}
