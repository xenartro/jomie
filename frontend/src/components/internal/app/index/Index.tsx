import { useAppContext } from "../App";
import Preview from "../Preview";
import "./Index.scss";
import { TipOfTheDay } from "./TipOfTheDay";
import Button from "components/common/button/Button";
import DangerousActionButton from "components/common/dangerous-action-button/DangerousActionButton";
import Footer from "components/common/footer/Footer";
import { useLoginState } from "components/internal/LoginStateContext";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { publishContents } from "services/content";

const AppIndex = () => {
  const { t } = useTranslation();
  const { unpublishedChanges } = useAppContext();
  const { user } = useLoginState();

  const handlePublish = useCallback(() => {
    publishContents().then(() => {
      window.location.reload();
    });
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="Home">
      <div className="Hero">
        <h1>{t("Welcome Jomie!")}</h1>
        <TipOfTheDay />
      </div>
      <div className="MainSections">
        <div className="Content">
          <div className="SectionInfo">
            <div className="Title">
              <h2>{t("Content")}</h2>
              <p className="p">
                {t("Let the world know how awesome you are.")}
              </p>
            </div>
            <div className="Options">
              <div className="Option">
                {t("Basics")}
                <Link to="/app/content/basics">
                  <Button
                    size="small"
                    variant="content"
                    icon="arrow-right"
                    iconRight
                  >
                    {user.meta.customizations.basics_updated
                      ? "Edit"
                      : "Start here"}
                  </Button>
                </Link>
              </div>

              <div className="Option">
                {t("Links")}
                <Link to="/app/content/links">
                  <Button
                    size="small"
                    variant="content"
                    icon="arrow-right"
                    iconRight
                  >
                    {user.meta.customizations.links_updated
                      ? "Edit"
                      : "Add links"}
                  </Button>
                </Link>
              </div>
              <div className="Option">
                {t("Photos")}
                <Link to="/app/content/posts">
                  <Button
                    size="small"
                    variant="content"
                    icon="arrow-right"
                    iconRight
                  >
                    {user.meta.customizations.photos_updated
                      ? "Edit"
                      : "Upload photos"}
                  </Button>
                </Link>
              </div>
              <div className="Option">
                {t("Posts")}
                <Link to="/app/content/posts">
                  <Button
                    size="small"
                    variant="content"
                    icon="arrow-right"
                    iconRight
                  >
                    {user.meta.customizations.blog_updated
                      ? "Edit"
                      : "Create post"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="Visuals">
          <div className="SectionInfo">
            <div className="Title">
              <h2>{t("Visuals")}</h2>
              <p className="p">{t("Create your own style.")}</p>
            </div>
            <div className="Options">
              <div className="Option">
                {t("Color Palette")}
                <Link to="/app/visuals/palette">
                  <Button
                    size="small"
                    variant="visuals"
                    icon="arrow-right"
                    iconRight
                  >
                    Customize
                  </Button>
                </Link>
              </div>
              <div className="Option">
                {t("Typography")}
                <Link to="/app/visuals/font">
                  <Button
                    size="small"
                    variant="visuals"
                    icon="arrow-right"
                    iconRight
                  >
                    Customize
                  </Button>
                </Link>
              </div>

              <div className="Option">
                {t("Layout")}
                <Link to="/app/visuals/layout">
                  <Button
                    size="small"
                    variant="visuals"
                    icon="arrow-right"
                    iconRight
                  >
                    Customize
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="MainSections__Preview">
        <div className="MainSections__Preview__Content">
          <h2>{t("This is how your Jomie site looks like.")}</h2>
          {unpublishedChanges.length > 0 && (
            <>
              <p>
                {t(
                  "You have {{amount}} {{changeWord}} to publish. Publish the changes to allow your visitors to see it.",
                  {
                    amount: unpublishedChanges.length,
                    changeWord:
                      unpublishedChanges.length > 1
                        ? t("changes")
                        : t("change"),
                  }
                )}
              </p>
              <DangerousActionButton
                onClick={handlePublish}
                variant="publish"
                message="Do you wish to publish your changes?"
              >
                Publish
              </DangerousActionButton>
            </>
          )}
        </div>
        <div className="MainSections__Preview__Preview">
          <Preview />
        </div>
      </div>
      <div className="SecondarySections Row">
        <div className="Settings Col --size4">
          <h2>{t("Settings")}</h2>
          <p className="p">
            {t(
              "Access more configuration options for your site and your Jomie account."
            )}
          </p>
          <Link to="/app/settings">
            <Button variant="ghost" icon="arrow-right" iconRight>
              Go to Settings
            </Button>
          </Link>
        </div>
        <div className="Help Col --size4 --pos7">
          <h2>{t("Need help?")}</h2>
          <p className="p">
            {t(
              "If you need help creating or configuring your website, reach out to us and we will gladly help you. Any feedback will be much appreciated."
            )}
          </p>
          <Link to="/help-and-contact">
            <Button variant="ghost" icon="arrow-right" iconRight>
              {t("Contact us")}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AppIndex;
