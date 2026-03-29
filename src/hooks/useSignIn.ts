import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SignInFormData, ToastState } from "types";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { PATHS } from "../routes/paths";

const initialForm: SignInFormData = {
  email: "",
  password: "",
};

export function useSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState<SignInFormData>(initialForm);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      setToast({
        message: location.state.successMessage,
        type: "success",
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const canSubmit = useMemo(() => {
    return Boolean(form.email && form.password) && !isSubmitting;
  }, [form, isSubmitting]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authService.signIn(form.email, form.password);
      login(result.user);
      navigate(PATHS.dashboard);
    } catch (error) {
      setToast({
        message: (error as Error).message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNavigateToSignUp() {
    navigate(PATHS.signup);
  }

  return {
    form,
    toast,
    canSubmit,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleNavigateToSignUp,
    setToast,
  };
}
