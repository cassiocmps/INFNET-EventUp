import { useState } from "react";

export function useRegistrationAction({
  eventId,
  isRegistered,
  registerForEvent,
  unregisterFromEvent,
  setToast,
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function toggleRegistration() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (isRegistered) {
        await unregisterFromEvent(eventId);
        setToast?.({
          message: "Registration cancelled successfully",
          type: "success",
        });
      } else {
        await registerForEvent(eventId);
        setToast?.({
          message: "Attendance confirmed successfully",
          type: "success",
        });
      }
    } catch (error) {
      setToast?.({
        message: "Failed to update registration. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function cancelRegistration() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await unregisterFromEvent(eventId);
      setToast?.({
        message: "Registration cancelled successfully",
        type: "success",
      });
    } catch (error) {
      setToast?.({
        message: "Failed to cancel registration. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    toggleRegistration,
    cancelRegistration,
  };
}
