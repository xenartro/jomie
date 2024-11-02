import "./Footer.scss";
import Logo from "components/common/logo/Logo";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();
  return (
    <div className="Footer">
      <div className="Footer__Container">
        <div className="Footer__Logo">
          <div className="Footer__Logo__Iso">
            <Logo />
          </div>
          <div className="Footer__Logo__Text">
            Jomie {new Date().getFullYear()}.
          </div>
        </div>
        <div className="Footer__Links">
          <Link to="/help-and-contact">{t("Contact us")}</Link>
          <Link to="/feedback">{t("Feedback")}</Link>
          <Link to="/terms">{t("Terms & Conditions")}</Link>
          <Link to="/privacy">{t("Privacy Policy")}</Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
