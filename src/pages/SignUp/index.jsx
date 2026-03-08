import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Toast from "../../components/Toast";
import SignUpForm from "./SignUpForm";
import { useSignUp } from "../../hooks/useSignUp";

export default function SignUpPage() {
  const {
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
  } = useSignUp();

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
    </>
  );
}
