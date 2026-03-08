import BackIcon from "../../assets/icons/BackIcon";
import FormInput from "../../components/FormInput";
import PrimaryButton from "../../components/PrimaryButton";
import RoleSelector from "../../components/RoleSelector";
import SecondaryButton from "../../components/SecondaryButton";
import styles from "./SignUpPage.module.css";

export default function SignUpForm({
  form,
  errors,
  roles,
  selectedRole,
  canSubmit,
  isSubmitting,
  handleChange,
  handleSubmit,
  handleCancel,
  setSelectedRole,
}) {
  return (
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
        onClick={handleCancel}
        leftIcon={<BackIcon size={18} />}
        fullWidth
      >
        Back
      </SecondaryButton>
    </form>
  );
}
