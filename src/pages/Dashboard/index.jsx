import Toast from "../../components/Toast";
import DashboardContent from "./DashboardContent";
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardPage() {
  const {
    toast,
    setToast,
    activeTab,
    setActiveTab,
    favoriteEvents,
    registeredEvents,
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
        isLoading={isLoading}
      />
    </>
  );
}
