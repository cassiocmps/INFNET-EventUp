import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { PATHS } from "../../routes/paths";

const initialForm = {
  email: "",
  password: "",
};

export function useSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState(null);
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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authService.signIn(form.email, form.password);
      login(result.user);
      navigate(PATHS.dashboard);
    } catch (error) {
      setToast({
        message: error.message || "An error occurred. Please try again.",
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
