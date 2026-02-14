import EventCard from "./EventCard";
import styles from "./EventFeedPage.module.css";

export default function EventList({ events }) {
  return (
    <div className={styles.eventList}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
