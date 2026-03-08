import Toast from "../../components/Toast";
import DashboardContent from "./DashboardContent";
import { useDashboard } from "./useDashboard";

export default function DashboardPage() {
  const { toast, setToast } = useDashboard();

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <DashboardContent />
    </>
  );
}
