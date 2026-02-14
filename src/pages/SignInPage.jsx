import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FormInput from "../components/FormInput";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import TertiaryButton from "../components/TertiaryButton";
import Toast from "../components/Toast";
import { authService } from "../services/authService";
import { PATHS } from "../routes/paths";
import styles from "./SignInPage.module.css";

const initialForm = {
  email: "",
  password: "",
};

export default function SignInPage() {
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

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <section className={styles.page}>
        <div className={styles.branding}>
          <div className={styles.brandContent}>
            <h1 className={styles.title}>Connect with your community</h1>
            <p className={styles.description}>
              Create, collaborate, and discover local events that transform your
              neighborhood.
            </p>
          </div>
        </div>

        <div className={styles.formPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Logo size="large" />

            <FormInput
              id="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <PrimaryButton type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Signing in..." : "Enter"}
            </PrimaryButton>

            <TertiaryButton
              type="button"
              onClick={() => navigate(PATHS.signup)}
            >
              New here? Join our amazing community
            </TertiaryButton>
          </form>
        </div>
      </section>
    </>
  );
}
