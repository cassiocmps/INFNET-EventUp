import styles from "./SecondaryButton.module.css";

interface SecondaryButtonProps {
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function SecondaryButton({
  children,
  type,
  onClick,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth,
}: SecondaryButtonProps) {
  return (
    <button
      className={
        fullWidth ? `${styles.button} ${styles.fullWidth}` : styles.button
      }
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
}
