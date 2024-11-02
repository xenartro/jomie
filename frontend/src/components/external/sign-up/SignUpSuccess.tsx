import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SignUpSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className="FormContainer">
      <h2>
        {t("Done!")} {t("Your account has been created.")}
      </h2>
      <p></p>
      <p>
        <Link to="/login">{t("Sign in")}</Link>
        {t(" to start editing your personal site.")}
      </p>
    </div>
  );
};

export default SignUpSuccess;
