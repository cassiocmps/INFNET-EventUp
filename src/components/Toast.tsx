import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { ToastType } from "types";
import styles from "./Toast.module.css";

const ICONS: Record<ToastType, React.ReactElement> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertCircle size={18} />,
};

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 2000,
}: ToastProps) {
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
    </div>
  );
}
