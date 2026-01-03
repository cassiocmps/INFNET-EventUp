import styles from "./SecondaryButton.module.css";

export default function SecondaryButton({
  children,
  type,
  onClick,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth,
}) {
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
