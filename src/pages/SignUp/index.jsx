import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import SignUpForm from "./SignUpForm";
import { useSignUp } from "./useSignUp";

export default function SignUpPage() {
  const {
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
  } = useSignUp();

  return (
    <Card withShadow>
      <PageHeader
        title="Create your profile"
        subtitle="Join local events as an organizer or participant."
        logoSize="medium"
      />

      <SignUpForm
        form={form}
        errors={errors}
        roles={roles}
        selectedRole={selectedRole}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        setSelectedRole={setSelectedRole}
      />
    </Card>
  );
}
