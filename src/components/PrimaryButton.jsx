import styles from "./PrimaryButton.module.css";

export default function PrimaryButton({
  children,
  type,
  disabled,
  onClick,
  leftIcon,
}) {
  return (
    <button
      className={styles.button}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children}
    </button>
  );
}
