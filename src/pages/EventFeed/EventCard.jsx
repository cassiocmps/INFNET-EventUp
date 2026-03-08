import { useState } from "react";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { CategoryIcon } from "../../utils/categoryIcons";
import PrimaryButton from "../../components/PrimaryButton";
import TertiaryButton from "../../components/TertiaryButton";
import ConfirmModal from "../../components/ConfirmModal";
import { useRegistrationAction } from "../../hooks/useRegistrationAction";
import styles from "./EventCard.module.css";

export default function EventCard({ event, setToast }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    price,
  } = event;

  const isPaid = price > 0;
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const formattedDate = new Date(date).toLocaleDateString();
  const favorited = isFavorite(id);
  const registered = isRegistered(id);
  const {
    isLoading: isRegistrationLoading,
    isPaymentLoading,
    toggleRegistration,
    payAndRegister,
  } = useRegistrationAction({
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

  async function handleConfirmPayment() {
    await payAndRegister();
    setShowPaymentModal(false);
  }

  return (
    <article
      className={`${styles.card} ${isExpanded ? styles.expanded : ""} ${registered ? styles.registered : ""}`}
    >
      {showPaymentModal && (
        <ConfirmModal
          icon={<CreditCard size={28} color="#16a34a" />}
          title="Complete Payment"
          message={`Register for "${title}" for $${price}.`}
          confirmLabel={`Pay $${price}`}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowPaymentModal(false)}
          isLoading={isPaymentLoading}
        />
      )}
      <button
        className={styles.rowButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.rowContent}>
          <div className={styles.categoryCell}>
            <span className={styles.category}>
              <CategoryIcon value={category} size={12} />
              {categoryLabel}
            </span>
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
                <Heart
                  size={20}
                  fill={favorited ? "#ef4444" : "none"}
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
              <Calendar size={14} />
              <span className={styles.label}>Date:</span>
              <span className={styles.value}>{formattedDate}</span>
            </div>
            <div className={styles.detailRow}>
              <Clock size={14} />
              <span className={styles.label}>Time:</span>
              <span className={styles.value}>{time}</span>
            </div>
            <div className={styles.detailRow}>
              <MapPin size={14} />
              <span className={styles.label}>Location:</span>
              <span className={styles.value}>{location}</span>
            </div>
            <div className={styles.detailRow}>
              <User size={14} />
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
              ) : isPaid ? (
                <PrimaryButton
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isPaymentLoading}
                >
                  {`Pay $${price}`}
                </PrimaryButton>
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
                  <CheckCircle size={14} /> You are registered for this event
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
