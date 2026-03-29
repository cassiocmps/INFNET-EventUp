import { useState } from "react";
import { Heart, Calendar, Clock, MapPin, User, CreditCard } from "lucide-react";
import type { Event, ToastState } from "types";
import { useAuth } from "../../contexts/AuthContext";
import { CategoryIcon } from "../../utils/categoryIcons";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import ConfirmModal from "../../components/ConfirmModal";
import { useRegistrationAction } from "../../hooks/useRegistrationAction";
import styles from "./ParticipantEventCard.module.css";

interface ParticipantEventCardProps {
  event: Event;
  type: "favorite" | "registered";
  setToast: (t: ToastState | null) => void;
}

export default function ParticipantEventCard({ event, type, setToast }: ParticipantEventCardProps): React.ReactElement {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    price,
  } = event;

  const isPaid = price > 0;
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const formattedDate = new Date(date).toLocaleDateString();
  const registered = isRegistered(id);
  const {
    isLoading,
    isPaymentLoading,
    toggleRegistration,
    cancelRegistration,
    payAndRegister,
  } = useRegistrationAction({
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

  async function handleConfirmPayment() {
    await payAndRegister();
    setShowPaymentModal(false);
  }

  return (
    <article className={styles.card}>
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
          ) : isPaid ? (
            <PrimaryButton
              onClick={() => setShowPaymentModal(true)}
              disabled={isPaymentLoading}
            >
              {`Pay $${price}`}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleRegisterToggle} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Attendance"}
            </PrimaryButton>
          )
        ) : (
          <SecondaryButton
            onClick={handleCancelRegistration}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Registration"}
          </SecondaryButton>
        )}
      </div>
    </article>
  );
}
