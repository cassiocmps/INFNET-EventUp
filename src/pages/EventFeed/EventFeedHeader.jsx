import SecondaryButton from "../../components/SecondaryButton";
import EventFeedFilters from "./EventFeedFilters";
import styles from "./EventFeedPage.module.css";

export default function EventFeedHeader({
  onRefresh,
  isRefreshing,
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <p className={styles.subtitle}>Discover amazing community events</p>

        <div className={styles.refreshSection}>
          <SecondaryButton onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </SecondaryButton>
        </div>
      </div>

      <EventFeedFilters
        categories={categories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}
