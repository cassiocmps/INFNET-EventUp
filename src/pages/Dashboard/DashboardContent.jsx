import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PrimaryButton from "../../components/PrimaryButton";
import { PATHS } from "../../routes/paths";
import styles from "./DashboardPage.module.css";

export default function DashboardContent() {
  const navigate = useNavigate();
  const { currentUser, isOrganizer, isParticipant } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome{currentUser?.name ? `, ${currentUser.name}` : " to EventUp"}
        </h1>
        {isOrganizer && (
          <>
            <p className={styles.text}>
              Ready to create your next community event?
            </p>
            <div className={styles.actions}>
              <PrimaryButton onClick={() => navigate(PATHS.createEvent)}>
                Create new event
              </PrimaryButton>
            </div>
          </>
        )}
        {isParticipant && (
          <>
            <p className={styles.text}>
              Discover and participate in amazing community events.
            </p>
            <div className={styles.actions}>
              <PrimaryButton onClick={() => navigate(PATHS.eventFeed)}>
                Browse events
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
