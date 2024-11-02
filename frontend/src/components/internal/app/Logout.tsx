import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "services/login";

const Logout = () => {
  const { t } = useTranslation();

  useEffect(() => {
    logout().finally(() => {
      window.location.replace("/");
    });
  }, []);

  return (
    <div>
      <p>{t("Logging you out...")}</p>
      <p>
        <a href="/app">{t("Taking too long?")}</a>
      </p>
    </div>
  );
};

export default Logout;
