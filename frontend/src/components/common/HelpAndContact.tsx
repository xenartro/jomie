import Button from "./button/Button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const HelpAndContact = () => {
  const { t } = useTranslation();
  return (
    <div className="Layout --FlexibleGrid ">
      <div className="Row ">
        <div className="Col --size6 --pos4">
          <Link to="/">
            <Button
              type="button"
              size="small"
              variant="ghost"
              icon="arrow-left"
            >
              {t("Back to Jomie")}
            </Button>
          </Link>
          <br />
          <br />
          <h3>{t("Help and Contact")}</h3>
          <p>
            {t(
              "If you need help using Jomie, something is not working, you want to report abuse, or just want to say hi, please send us a message to "
            )}
            <a href="mailto:support@jomie.io">support@jomie.io</a>.
          </p>
          <p>
            {t(
              "Jomie is also an Open Source project, so please feel free to report an issue or submit a pull request to our "
            )}
            <a
              href="https://github.com/xenartro/jomie"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("GitHub repository")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpAndContact;
