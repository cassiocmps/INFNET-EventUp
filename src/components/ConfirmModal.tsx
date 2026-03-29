import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Back",
  onConfirm,
  onCancel,
  isLoading = false,
  icon,
}: ConfirmModalProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        {icon && <div className={styles.iconWrap}>{icon}</div>}

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <SecondaryButton
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
