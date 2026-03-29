import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  withShadow?: boolean;
}

export default function Card({ children, withShadow = false }: CardProps) {
  return (
    <section
      className={
        withShadow ? `${styles.card} ${styles.withShadow}` : styles.card
      }
    >
      {children}
    </section>
  );
}
