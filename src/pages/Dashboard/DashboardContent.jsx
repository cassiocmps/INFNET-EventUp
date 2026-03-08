import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import Tabs from "../../components/Tabs";
import DashboardEventCard from "./DashboardEventCard";
import { PATHS } from "../../routes/paths";
import styles from "./DashboardPage.module.css";

export default function DashboardContent({
  setToast,
  activeTab,
  setActiveTab,
  favoriteEvents,
  registeredEvents,
  isLoading,
}) {
  const navigate = useNavigate();
  const { currentUser, isOrganizer, isParticipant } = useAuth();

  const tabs = [
    { key: "favorites", label: "My Favorites" },
    { key: "registered", label: "Confirmed Events" },
  ];

  return (
    <Card withShadow>
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

            <div className={styles.tabsContainer}>
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              <div className={styles.tabContent}>
                {isLoading ? (
                  <p className={styles.loadingText}>Loading events...</p>
                ) : activeTab === "favorites" ? (
                  favoriteEvents.length > 0 ? (
                    <div className={styles.eventsGrid}>
                      {favoriteEvents.map((event) => (
                        <DashboardEventCard
                          key={event.id}
                          event={event}
                          type="favorite"
                          setToast={setToast}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p className={styles.emptyText}>
                        You haven't favorited any events yet.
                      </p>
                      <p className={styles.emptySubtext}>
                        Browse the event feed to find events you love!
                      </p>
                    </div>
                  )
                ) : registeredEvents.length > 0 ? (
                  <div className={styles.eventsGrid}>
                    {registeredEvents.map((event) => (
                      <DashboardEventCard
                        key={event.id}
                        event={event}
                        type="registered"
                        setToast={setToast}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                      You haven't confirmed attendance for any events yet.
                    </p>
                    <p className={styles.emptySubtext}>
                      Browse events and confirm your attendance to see them
                      here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
