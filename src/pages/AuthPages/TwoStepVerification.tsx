import OtpForm from "../../components/auth/OtpForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function TwoStepVerification() {
  return (
    <>
      <PageMeta
        title="Two Step Verification Dashboard "
        description="Two Step Verification Tables "
      />
      <AuthLayout>
        <OtpForm />
      </AuthLayout>
    </>
  );
}
