import styles from "./TertiaryButton.module.css";

export default function TertiaryButton({ children, type, onClick, disabled }) {
  return (
    <button
      className={styles.button}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
