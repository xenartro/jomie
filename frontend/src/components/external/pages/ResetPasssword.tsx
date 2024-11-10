import ResetPasswordForm from "../login/ResetPasswordForm";
import SideColumnLayout from "components/external/layout/SideColumnLayout";
import Header from "components/external/layout/header/Header";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();

  return (
    <SideColumnLayout>
      <Header version="logoOnly" />
      <h4>{t("Reset my password")}</h4>
      <ResetPasswordForm />
    </SideColumnLayout>
  );
};

export default ResetPassword;
