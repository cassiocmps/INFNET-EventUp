import styles from "./TertiaryButton.module.css";

interface TertiaryButtonProps {
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

export default function TertiaryButton({
  children,
  type,
  onClick,
  disabled,
  leftIcon,
}: TertiaryButtonProps) {
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
