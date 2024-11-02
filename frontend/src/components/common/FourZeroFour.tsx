import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FourZeroFour = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("Page not found!")}</h1>
      <p>
        {t(
          "The URL you requested does not exist. If you think this is an error, please let us know {{email}}",
          { email: import.meta.env.VITE_SUPPORT_EMAIL }
        )}
      </p>
      <Link to="/">{t("Continue")}</Link>
    </div>
  );
};

export default FourZeroFour;
