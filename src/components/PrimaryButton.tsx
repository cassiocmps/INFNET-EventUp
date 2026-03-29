import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
}

export default function PrimaryButton({
  children,
  type,
  disabled,
  onClick,
  leftIcon,
}: PrimaryButtonProps) {
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
