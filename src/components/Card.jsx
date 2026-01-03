import styles from "./Card.module.css";

export default function Card({ children, withShadow = false }) {
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
