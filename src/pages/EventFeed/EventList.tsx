import type { Event, ToastState } from "types";
import EventCard from "./EventCard";
import styles from "./EventFeedPage.module.css";

interface EventListProps {
  events: Event[];
  setToast: (t: ToastState | null) => void;
}

export default function EventList({ events, setToast }: EventListProps): React.ReactElement {
  return (
    <div className={styles.eventList}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} setToast={setToast} />
      ))}
    </div>
  );
}
