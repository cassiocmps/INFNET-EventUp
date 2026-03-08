import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FavoriteIcon from "../../assets/icons/FavoriteIcon";
import styles from "./EventCard.module.css";

export default function EventCard({ event }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleFavorite, isFavorite, isParticipant } = useAuth();
  const {
    id,
    title,
    description,
    category,
    date,
    time,
    location,
    organizerName,
  } = event;

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const formattedDate = new Date(date).toLocaleDateString();
  const favorited = isFavorite(id);

  function handleFavoriteClick(e) {
    e.stopPropagation();
    toggleFavorite(id);
  }

  return (
    <article className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}>
      <button
        className={styles.rowButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.rowContent}>
          <div className={styles.categoryCell}>
            <span className={styles.category}>{categoryLabel}</span>
          </div>
          <div className={styles.titleCell}>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <div className={styles.dateCell}>
            <span className={styles.dateValue}>{formattedDate}</span>
          </div>
          {isParticipant && (
            <div className={styles.favoriteCell}>
              <button
                type="button"
                className={styles.favoriteButton}
                onClick={handleFavoriteClick}
                aria-label={
                  favorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <FavoriteIcon
                  filled={favorited}
                  size={20}
                  color={favorited ? "#ef4444" : "#9ca3af"}
                />
              </button>
            </div>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <p className={styles.description}>{description}</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Date:</span>
              <span className={styles.value}>{formattedDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Time:</span>
              <span className={styles.value}>{time}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Location:</span>
              <span className={styles.value}>{location}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Organizer:</span>
              <span className={styles.value}>{organizerName}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
