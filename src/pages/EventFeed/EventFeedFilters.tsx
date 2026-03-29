import { X } from "lucide-react";
import type { Category } from "types";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import SecondaryButton from "../../components/SecondaryButton";
import styles from "./EventFeedPage.module.css";

interface EventFeedFiltersProps {
  categories: Category[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (cat: string) => void;
  onClearFilters: () => void;
}

export default function EventFeedFilters({
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}: EventFeedFiltersProps): React.ReactElement {
  return (
    <div className={styles.filtersRow}>
      <FormInput
        id="event-feed-search"
        name="eventFeedSearch"
        label="Search"
        type="text"
        value={searchTerm}
        placeholder="Search by title, description or location"
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <FormSelect
        id="event-feed-category"
        name="eventFeedCategory"
        label="Category"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
        options={categories}
        placeholder="All categories"
        showCategoryIcons
      />

      {(searchTerm || selectedCategory) && (
        <div className={styles.clearFiltersButton}>
          <SecondaryButton
            type="button"
            onClick={onClearFilters}
            leftIcon={<X size={14} />}
          >
            Clear filters
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
