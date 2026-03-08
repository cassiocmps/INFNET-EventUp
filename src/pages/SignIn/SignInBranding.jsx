import { CalendarDays, Users, MapPin } from "lucide-react";
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
        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <CalendarDays size={20} className={styles.featureIcon} />
            <span>Discover fairs, workshops and more</span>
          </li>
          <li className={styles.featureItem}>
            <Users size={20} className={styles.featureIcon} />
            <span>Collaborate with local organizers</span>
          </li>
          <li className={styles.featureItem}>
            <MapPin size={20} className={styles.featureIcon} />
            <span>Find events near you</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
