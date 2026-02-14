import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import Toast from "../components/Toast";
import { PATHS } from "../routes/paths";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isOrganizer, isParticipant } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (location.state?.successMessage) {
      setToast({
        message: location.state.successMessage,
        type: "success",
      });
      window.history.replaceState({}, document.title);
    }

    if (location.state?.errorMessage) {
      setToast({
        message: location.state.errorMessage,
        type: "error",
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
    </>
  );
}
