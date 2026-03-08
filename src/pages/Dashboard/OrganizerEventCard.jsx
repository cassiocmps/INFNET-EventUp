import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePath } from "react-router-dom";
import { Users, Pencil } from "lucide-react";
import { CategoryIcon } from "../../utils/categoryIcons";
import SecondaryButton from "../../components/SecondaryButton";
import TertiaryButton from "../../components/TertiaryButton";
import { PATHS } from "../../routes/paths";
import styles from "./OrganizerEventCard.module.css";

export default function OrganizerEventCard({ event, onCancel }) {
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const { id, title, category, enrolled = 0 } = event;

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  function handleEdit() {
    navigate(generatePath(PATHS.editEvent, { eventId: id }));
  }

  async function handleCancel() {
    setIsCancelling(true);
    try {
      await onCancel(id);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
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
          onClick={handleCancel}
          disabled={isCancelling}
        >
          {isCancelling ? "Cancelling..." : "Cancel Event"}
        </TertiaryButton>
      </div>
    </article>
  );
}
