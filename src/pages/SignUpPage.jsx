import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/icons/BackIcon";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import RoleSelector from "../components/RoleSelector";
import SecondaryButton from "../components/SecondaryButton";
import { authService } from "../services/authService";
import { PATHS } from "../routes/paths";
import styles from "./SignUpPage.module.css";

const defaultForm = {
  name: "",
  email: "",
  password: "",
};

function validateForm({ name, email, password }) {
  const nextErrors = {
    name: "",
    email: "",
    password: "",
  };

  if (!name.trim()) {
    nextErrors.name = "Name is required.";
  }

  if (!email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    nextErrors.password = "Password is required.";
  } else {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    if (!hasMinLength || !hasNumber || !hasUppercase || !hasLowercase) {
      nextErrors.password =
        "Use at least 8 characters, including upper, lower, and a number.";
    }
  }

  return nextErrors;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("participant");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      const response = await fetch("/api/roles.json");
      const data = await response.json();
      setRoles(data.roles);
    }

    loadRoles();
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(form.name && form.email && form.password) && !isSubmitting;
  }, [form, isSubmitting]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some((error) => Boolean(error));
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.signUp({
        name: form.name,
        email: form.email,
        password: form.password,
        role: selectedRole,
      });

      navigate(PATHS.signin, {
        state: {
          successMessage: "Profile created successfully!",
        },
      });
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card withShadow>
      <PageHeader
        title="Create your profile"
        subtitle="Join local events as an organizer or participant."
        logoSize="medium"
      />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <RoleSelector
          roles={roles}
          selectedRole={selectedRole}
          onChange={setSelectedRole}
        />

        <FormInput
          id="name"
          name="name"
          type="text"
          label="Full name"
          value={form.name}
          placeholder="Type your full name"
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          placeholder="name@email.com"
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          placeholder="At least 8 chars, upper/lower and number"
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <PrimaryButton type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Creating profile..." : "Create profile"}
        </PrimaryButton>

        <SecondaryButton
          type="button"
          onClick={() => navigate(PATHS.signin)}
          leftIcon={<BackIcon size={18} />}
          fullWidth
        >
          Back
        </SecondaryButton>
      </form>
    </Card>
  );
}
