import AccountForm from "./AccountForm";
import { useTranslation } from "react-i18next";

const AccountSettings = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h4>{t("Settings")}</h4>
      <AccountForm />
    </div>
  );
};

export default AccountSettings;
