import styles from "./SignInPage.module.css";

export default function SignInBranding() {
  return (
    <div className={styles.branding}>
      <div className={styles.brandContent}>
        <h1 className={styles.title}>Connect with your community</h1>
        <p className={styles.description}>
          Create, collaborate, and discover local events that transform your
          neighborhood.
        </p>
      </div>
    </div>
  );
}
