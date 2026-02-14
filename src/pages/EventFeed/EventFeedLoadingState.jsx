import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import styles from "./EventFeedPage.module.css";

export default function EventFeedLoadingState() {
  return (
    <Card withShadow>
      <PageHeader title="Event Feed" showBackButton={true} />
      <div className={styles.loading}>
        <p>Loading events...</p>
      </div>
    </Card>
  );
}
