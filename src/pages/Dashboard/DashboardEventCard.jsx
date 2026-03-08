import { Heart, Calendar, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { CategoryIcon } from "../../utils/categoryIcons";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import TertiaryButton from "../../components/TertiaryButton";
import { useRegistrationAction } from "../../hooks/useRegistrationAction";
import styles from "./DashboardEventCard.module.css";

export default function DashboardEventCard({ event, type, setToast }) {
  const {
    toggleFavorite,
    unregisterFromEvent,
    registerForEvent,
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
  const registered = isRegistered(id);
  const { isLoading, toggleRegistration, cancelRegistration } =
    useRegistrationAction({
      eventId: id,
      isRegistered: registered,
      registerForEvent,
      unregisterFromEvent,
      setToast,
    });

  function handleRemoveFavorite() {
    toggleFavorite(id);
  }

  function handleCancelRegistration() {
    cancelRegistration();
  }

  function handleRegisterToggle() {
    toggleRegistration();
  }

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.category}>
          <CategoryIcon value={category} size={12} />
          {categoryLabel}
        </span>
        {type === "favorite" && (
          <button
            type="button"
            className={styles.favoriteIcon}
            onClick={handleRemoveFavorite}
            aria-label="Remove from favorites"
          >
            <Heart size={20} fill="#ef4444" color="#ef4444" />
          </button>
        )}
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Calendar size={14} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Date:</span>
          <span className={styles.detailValue}>{formattedDate}</span>
        </div>
        <div className={styles.detailItem}>
          <Clock size={14} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Time:</span>
          <span className={styles.detailValue}>{time}</span>
        </div>
        <div className={styles.detailItem}>
          <MapPin size={14} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Location:</span>
          <span className={styles.detailValue}>{location}</span>
        </div>
        <div className={styles.detailItem}>
          <User size={14} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Organizer:</span>
          <span className={styles.detailValue}>{organizerName}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {type === "favorite" ? (
          registered ? (
            <SecondaryButton
              onClick={handleRegisterToggle}
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Cancel Registration"}
            </SecondaryButton>
          ) : (
            <PrimaryButton onClick={handleRegisterToggle} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Attendance"}
            </PrimaryButton>
          )
        ) : (
          <TertiaryButton
            onClick={handleCancelRegistration}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Registration"}
          </TertiaryButton>
        )}
      </div>
    </article>
  );
}
