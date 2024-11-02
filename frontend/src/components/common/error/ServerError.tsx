import { useTranslation } from "react-i18next";

const ServerError = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("Error")}</h1>
      <p>{t("Our app is currently not available. Please try again later.")}</p>
    </div>
  );
};

export default ServerError;
