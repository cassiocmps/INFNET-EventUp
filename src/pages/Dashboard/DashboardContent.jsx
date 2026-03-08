import { useNavigate } from "react-router-dom";
import {
  Plus,
  Compass,
  Star,
  CalendarCheck,
  CalendarX,
  Loader2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import Tabs from "../../components/Tabs";
import ParticipantEventCard from "./ParticipantEventCard";
import OrganizerEventCard from "./OrganizerEventCard";
import { PATHS } from "../../routes/paths";
import styles from "./DashboardPage.module.css";

export default function DashboardContent({
  setToast,
  activeTab,
  setActiveTab,
  favoriteEvents,
  registeredEvents,
  organizerEvents,
  onCancelEvent,
  isLoading,
}) {
  const navigate = useNavigate();
  const { currentUser, isOrganizer, isParticipant, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate(PATHS.signin);
  }

  const tabs = [
    { key: "favorites", label: "My Favorites" },
    { key: "registered", label: "Confirmed Events" },
  ];

  return (
    <Card withShadow>
      <div className={styles.content}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>
            Welcome{currentUser?.name ? `, ${currentUser.name}` : " to EventUp"}
          </h1>
          <SecondaryButton
            type="button"
            onClick={handleLogout}
            leftIcon={<LogOut size={16} />}
          >
            Logout
          </SecondaryButton>
        </div>
        {isOrganizer && (
          <>
            <p className={styles.text}>
              Ready to create your next community event?
            </p>
            <div className={styles.actions}>
              <PrimaryButton
                onClick={() => navigate(PATHS.createEvent)}
                leftIcon={<Plus size={16} />}
              >
                Create new event
              </PrimaryButton>
            </div>

            <div className={styles.eventsSection}>
              <h2 className={styles.sectionTitle}>My Events</h2>
              {isLoading ? (
                <div className={styles.emptyState}>
                  <Loader2
                    size={36}
                    strokeWidth={1.5}
                    className={styles.spinIcon}
                  />
                  <p className={styles.emptyText}>Loading your events...</p>
                </div>
              ) : organizerEvents.length > 0 ? (
                <div className={styles.eventsGrid}>
                  {organizerEvents.map((event) => (
                    <OrganizerEventCard
                      key={event.id}
                      event={event}
                      onCancel={onCancelEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <CalendarX size={36} strokeWidth={1.5} color="#94a3b8" />
                  <p className={styles.emptyText}>
                    You haven't created any events yet.
                  </p>
                  <p className={styles.emptySubtext}>
                    Use the button above to create your first community event!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        {isParticipant && (
          <>
            <p className={styles.text}>
              Discover and participate in amazing community events.
            </p>
            <div className={styles.actions}>
              <PrimaryButton
                onClick={() => navigate(PATHS.eventFeed)}
                leftIcon={<Compass size={16} />}
              >
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
                        <ParticipantEventCard
                          key={event.id}
                          event={event}
                          type="favorite"
                          setToast={setToast}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Star size={36} strokeWidth={1.5} color="#94a3b8" />
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
                      <ParticipantEventCard
                        key={event.id}
                        event={event}
                        type="registered"
                        setToast={setToast}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <CalendarCheck
                      size={36}
                      strokeWidth={1.5}
                      color="#94a3b8"
                    />
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
