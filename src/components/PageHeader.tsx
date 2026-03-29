import Logo from "./Logo";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  logoSize?: "small" | "medium" | "large";
}

export default function PageHeader({
  title,
  subtitle,
  showLogo = true,
  logoSize = "medium",
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {showLogo && (
        <div className={styles.logoContainer}>
          <Logo size={logoSize} />
        </div>
      )}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
