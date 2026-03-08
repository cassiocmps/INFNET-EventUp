import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import styles from "./Toast.module.css";

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertCircle size={18} />,
};

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 2000,
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const closeTimer = setTimeout(() => {
        setIsClosing(true);
      }, duration - 300);

      const removeTimer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(closeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isClosing ? styles.closing : ""}`}
    >
      <span className={styles.icon}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
