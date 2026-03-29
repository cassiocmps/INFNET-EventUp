import { LogIn, UserPlus } from "lucide-react";
import type { SignInFormData } from "types";
import FormInput from "../../components/FormInput";
import Logo from "../../components/Logo";
import PrimaryButton from "../../components/PrimaryButton";
import TertiaryButton from "../../components/TertiaryButton";
import styles from "./SignInPage.module.css";

interface SignInFormProps {
  form: SignInFormData;
  canSubmit: boolean;
  isSubmitting: boolean;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleNavigateToSignUp: () => void;
}

export default function SignInForm({
  form,
  canSubmit,
  isSubmitting,
  handleChange,
  handleSubmit,
  handleNavigateToSignUp,
}: SignInFormProps): React.ReactElement {
  return (
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

        <PrimaryButton
          type="submit"
          disabled={!canSubmit}
          leftIcon={<LogIn size={18} />}
        >
          {isSubmitting ? "Signing in..." : "Enter"}
        </PrimaryButton>

        <TertiaryButton
          type="button"
          onClick={handleNavigateToSignUp}
          leftIcon={<UserPlus size={16} />}
        >
          New here? Join our amazing community
        </TertiaryButton>
      </form>
    </div>
  );
}
