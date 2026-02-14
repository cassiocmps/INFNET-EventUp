import Card from "../../components/Card";
import Toast from "../../components/Toast";
import EventFeedLoadingState from "./EventFeedLoadingState";
import EventFeedHeader from "./EventFeedHeader";
import EventList from "./EventList";
import EmptyState from "./EmptyState";
import { useEventFeed } from "./useEventFeed";
import styles from "./EventFeedPage.module.css";

export default function EventFeedPage() {
  const {
    events,
    isLoading,
    isRefreshing,
    pullDistance,
    toast,
    setToast,
    handleRefresh,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useEventFeed();

  if (isLoading) {
    return <EventFeedLoadingState />;
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Card withShadow>
        <div
          className={styles.content}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.pullIndicator}
            style={{ height: `${pullDistance}px` }}
          >
            {isRefreshing
              ? "Refreshing events..."
              : pullDistance > 0
                ? "Release to refresh"
                : "Pull down to refresh"}
          </div>

          <EventFeedHeader
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {events.length === 0 ? <EmptyState /> : <EventList events={events} />}
        </div>
      </Card>
    </>
  );
}
