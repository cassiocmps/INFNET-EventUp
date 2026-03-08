import Toast from "../../components/Toast";
import SignInBranding from "./SignInBranding";
import SignInForm from "./SignInForm";
import { useSignIn } from "./useSignIn";
import styles from "./SignInPage.module.css";

export default function SignInPage() {
  const {
    form,
    toast,
    canSubmit,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleNavigateToSignUp,
    setToast,
  } = useSignIn();

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
        <SignInBranding />
        <SignInForm
          form={form}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleNavigateToSignUp={handleNavigateToSignUp}
        />
      </section>
    </>
  );
}
