import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Role, SignUpFormData, SignUpFormErrors, ToastState } from "types";
import { authService } from "../services/authService";
import { PATHS } from "../routes/paths";

const defaultForm: SignUpFormData = {
  name: "",
  email: "",
  password: "",
};

function validateForm({ name, email, password }: SignUpFormData): SignUpFormErrors {
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

export function useSignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignUpFormData>(defaultForm);
  const [errors, setErrors] = useState<SignUpFormErrors>({
    name: "",
    email: "",
    password: "",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("participant");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await authService.getRoles();
        setRoles(data);
      } catch (error) {
        setToast({
          message: "Failed to load roles. Please try again.",
          type: "error",
        });
      }
    }

    loadRoles();
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(form.name && form.email && form.password) && !isSubmitting;
  }, [form, isSubmitting]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (errors[name as keyof SignUpFormData]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const validationErrors = validateForm(form);
    const hasErrors = Object.values(validationErrors).some(Boolean);

    if (hasErrors) {
      setErrors(validationErrors);
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
      setToast({
        message: (error as Error).message || "Sign up failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate(PATHS.signin);
  }

  return {
    form,
    errors,
    roles,
    selectedRole,
    canSubmit,
    isSubmitting,
    toast,
    setToast,
    handleChange,
    handleSubmit,
    handleCancel,
    setSelectedRole,
  };
}
