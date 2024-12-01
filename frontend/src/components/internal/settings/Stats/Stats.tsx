import { useLoginState } from "components/internal/LoginStateContext";
import { useTranslation } from "react-i18next";

const AccountSettings = () => {
  const { t } = useTranslation();
  const { user } = useLoginState();
  if (!user) {
    return null;
  }
  return (
    <div>
      <h4>{t("Stats")}</h4>
      <p>
        <strong>{t("Total visits")}</strong>: {user.stats}
      </p>
      <p>
        <strong>{t("Visits today")}</strong>: {user.meta.stats.today}
      </p>
      {user.meta.stats.highest && (
        <p>
          <strong>{t("Highest visits")}</strong>:{" "}
          {user.meta.stats.highest.count} -{" "}
          {new Date(user.meta.stats.highest.date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default AccountSettings;
