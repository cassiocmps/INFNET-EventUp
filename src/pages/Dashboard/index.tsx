import Toast from "../../components/Toast";
import DashboardContent from "./DashboardContent";
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardPage(): React.ReactElement {
  const {
    toast,
    setToast,
    activeTab,
    setActiveTab,
    favoriteEvents,
    registeredEvents,
    organizerEvents,
    handleCancelEvent,
    isLoading,
  } = useDashboard();

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <DashboardContent
        setToast={setToast}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoriteEvents={favoriteEvents}
        registeredEvents={registeredEvents}
        organizerEvents={organizerEvents}
        onCancelEvent={handleCancelEvent}
        isLoading={isLoading}
      />
    </>
  );
}
