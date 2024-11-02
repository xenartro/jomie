import "./Settings.scss";
import Button from "components/common/button/Button";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

const Settings = () => {
  const { t } = useTranslation();
  return (
    <div className="Settings">
      <div className="SettingsHero Row">
        <div className=" Col --size12">
          <h2>{t("Account & Settings")}.</h2>
        </div>
      </div>
      <div className="Row">
        <div className="SettingsNav Col --size3">
          <ul>
            <li className="--active">
              <NavLink end to="/app/settings">
                {t("Site Settings")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/app/settings/account">{t("My Account")}</NavLink>
            </li>
            <li>
              <NavLink to="/logout">
                <Button type="button" size="small" variant="secondary">
                  {t("Logout")}
                </Button>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="SettingsForm Col --size6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;
