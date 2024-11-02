import AccountForm from "./SiteForm";
import { useTranslation } from "react-i18next";

const SiteSettings = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h4>{t("Site Settings")}</h4>
      <AccountForm />
    </div>
  );
};

export default SiteSettings;
