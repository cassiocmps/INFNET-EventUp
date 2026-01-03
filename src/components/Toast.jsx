import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

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
      <span className={styles.message}>{message}</span>
    </div>
  );
}
