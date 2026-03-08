import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useDashboard() {
  const location = useLocation();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (location.state?.successMessage) {
      setToast({
        message: location.state.successMessage,
        type: "success",
      });
      window.history.replaceState({}, document.title);
    }

    if (location.state?.errorMessage) {
      setToast({
        message: location.state.errorMessage,
        type: "error",
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return {
    toast,
    setToast,
  };
}
