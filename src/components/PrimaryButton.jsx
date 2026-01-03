import styles from "./PrimaryButton.module.css";

export default function PrimaryButton({ children, type, disabled, onClick }) {
  return (
    <button
      className={styles.button}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
