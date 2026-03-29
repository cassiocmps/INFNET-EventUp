import { useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw } from "lucide-react";
import type { Category } from "types";
import SecondaryButton from "../../components/SecondaryButton";
import EventFeedFilters from "./EventFeedFilters";
import { PATHS } from "../../routes/paths";
import styles from "./EventFeedPage.module.css";

interface EventFeedHeaderProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  categories: Category[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (cat: string) => void;
  onClearFilters: () => void;
}

export default function EventFeedHeader({
  onRefresh,
  isRefreshing,
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}: EventFeedHeaderProps): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <div className={styles.backSection}>
          <SecondaryButton
            onClick={() => navigate(PATHS.dashboard)}
            leftIcon={<ChevronLeft size={18} />}
          >
            Back
          </SecondaryButton>
        </div>

        <p className={styles.subtitle}>Discover amazing community events</p>

        <div className={styles.headerActions}>
          <SecondaryButton
            onClick={onRefresh}
            disabled={isRefreshing}
            leftIcon={<RefreshCw size={16} />}
          >
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
