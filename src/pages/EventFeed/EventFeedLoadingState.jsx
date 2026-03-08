import { Loader2 } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import styles from "./EventFeedPage.module.css";

export default function EventFeedLoadingState() {
  return (
    <Card withShadow>
      <PageHeader title="Event Feed" showBackButton={true} />
      <div className={styles.loading}>
        <Loader2 size={28} className={styles.loadingSpinner} />
        <p>Loading events...</p>
      </div>
    </Card>
  );
}
