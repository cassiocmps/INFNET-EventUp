import { useState } from "react";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useRegistrationAction({
  eventId,
  isRegistered,
  registerForEvent,
  unregisterFromEvent,
  setToast,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

  async function payAndRegister() {
    if (isPaymentLoading) return;

    try {
      setIsPaymentLoading(true);
      await sleep(3000);
      await registerForEvent(eventId);
      setToast?.({
        message: "Payment successful! You are now registered.",
        type: "success",
      });
    } catch {
      setToast?.({
        message: "Payment failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  }

  return {
    isLoading,
    isPaymentLoading,
    toggleRegistration,
    cancelRegistration,
    payAndRegister,
  };
}
