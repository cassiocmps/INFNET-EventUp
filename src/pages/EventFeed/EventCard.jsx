import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FavoriteIcon from "../../assets/icons/FavoriteIcon";
import PrimaryButton from "../../components/PrimaryButton";
import TertiaryButton from "../../components/TertiaryButton";
import { useRegistrationAction } from "../../hooks/useRegistrationAction";
import styles from "./EventCard.module.css";

export default function EventCard({ event, setToast }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    toggleFavorite,
    isFavorite,
    isParticipant,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
  } = useAuth();
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
  const registered = isRegistered(id);
  const { isLoading: isRegistrationLoading, toggleRegistration } =
    useRegistrationAction({
      eventId: id,
      isRegistered: registered,
      registerForEvent,
      unregisterFromEvent,
      setToast,
    });

  function handleFavoriteClick(e) {
    e.stopPropagation();
    toggleFavorite(id);
  }

  function handleRegisterClick() {
    toggleRegistration();
  }

  return (
    <article
      className={`${styles.card} ${isExpanded ? styles.expanded : ""} ${registered ? styles.registered : ""}`}
    >
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

          {isParticipant && (
            <div className={styles.registrationSection}>
              {registered ? (
                <TertiaryButton
                  type="button"
                  onClick={handleRegisterClick}
                  disabled={isRegistrationLoading}
                >
                  {isRegistrationLoading
                    ? "Cancelling..."
                    : "Cancel Registration"}
                </TertiaryButton>
              ) : (
                <PrimaryButton
                  type="button"
                  onClick={handleRegisterClick}
                  disabled={isRegistrationLoading}
                >
                  {isRegistrationLoading
                    ? "Confirming..."
                    : "Confirm Attendance"}
                </PrimaryButton>
              )}
              {registered && (
                <p className={styles.registrationStatus}>
                  ✓ You are registered for this event
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
