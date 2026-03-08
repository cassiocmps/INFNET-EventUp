import { useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Users, Pencil, AlertTriangle, DollarSign } from "lucide-react";
import { CategoryIcon } from "../../utils/categoryIcons";
import ConfirmModal from "../../components/ConfirmModal";
import SecondaryButton from "../../components/SecondaryButton";
import TertiaryButton from "../../components/TertiaryButton";
import { PATHS } from "../../routes/paths";
import styles from "./OrganizerEventCard.module.css";

export default function OrganizerEventCard({ event, onCancel }) {
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { id, title, category, enrolled = 0, price = 0 } = event;
  const revenue = price * enrolled;

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  function handleEdit() {
    navigate(generatePath(PATHS.editEvent, { eventId: id }));
  }

  async function handleConfirmCancel() {
    setIsCancelling(true);
    try {
      await onCancel(id);
    } finally {
      setIsCancelling(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          title="Cancel event?"
          message={`"${title}" will be permanently cancelled and participants will no longer be able to register.`}
          confirmLabel="Yes, cancel event"
          icon={<AlertTriangle size={28} color="#dc2626" />}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowConfirm(false)}
          isLoading={isCancelling}
        />
      )}

      <article className={styles.card}>
        <div className={styles.header}>
          <span className={styles.category}>
            <CategoryIcon value={category} size={12} />
            {categoryLabel}
          </span>
          <span className={styles.enrolled}>
            <Users size={14} />
            {enrolled} enrolled
          </span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        {price > 0 && (
          <div className={styles.revenue}>
            <DollarSign size={14} />
            <span>Total revenue:</span>
            <strong>${revenue.toFixed(2)}</strong>
          </div>
        )}

        <div className={styles.actions}>
          <SecondaryButton
            type="button"
            leftIcon={<Pencil size={16} />}
            onClick={handleEdit}
          >
            Edit
          </SecondaryButton>
          <TertiaryButton
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isCancelling}
          >
            Cancel Event
          </TertiaryButton>
        </div>
      </article>
    </>
  );
}
