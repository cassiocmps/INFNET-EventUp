import styles from "./TertiaryButton.module.css";

export default function TertiaryButton({
  children,
  type,
  onClick,
  disabled,
  leftIcon,
}) {
  return (
    <button
      className={styles.button}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children}
    </button>
  );
}
