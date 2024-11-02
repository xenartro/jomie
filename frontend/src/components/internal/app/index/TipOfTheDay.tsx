import Button from "components/common/button/Button";
import { useLoginState } from "components/internal/LoginStateContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const TipOfTheDay = () => {
  const { t } = useTranslation();
  const { user } = useLoginState();
  if (!user) {
    return null;
  }
  if (!user.meta.customizations.basics_updated) {
    return (
      <>
        <p className="p">
          {t(
            "Jomie has two main aspects you can work with: Content and Visuals. Use Content to edit your basic information, your links, and create posts to showcase your creativity. Then go to Visuals and customize the aesthetic aspects of your personal site."
          )}
        </p>
        <Link to="/app/content/basics">
          <Button variant="main" icon="arrow-right" iconRight>
            {t("Add your Basic Information")}
          </Button>
        </Link>
      </>
    );
  }
  if (!user.meta.customizations.links_updated) {
    return (
      <>
        <p className="p">
          {t(
            "Jomie has two types of links: social links and other links. Social links are meant to point people to your social network accounts, and are displayed with the corresponding icon. Other links can point people to any other website, and have a customizable title, description, and preview image."
          )}
        </p>
        <Link to="/app/content/links">
          <Button variant="main" icon="arrow-right" iconRight>
            {t("Edit your Links")}
          </Button>
        </Link>
      </>
    );
  }

  if (!user.meta.customizations.photos_updated) {
    return (
      <>
        <p className="p">
          {t(
            "You can upload and display up to 6 images in your Jomie site. Show the world your favorite pictures about you, your work, your interests, or anything you want."
          )}
        </p>
        <Link to="/app/content/photos">
          <Button variant="main" icon="arrow-right" iconRight>
            {t("Upload your Photos")}
          </Button>
        </Link>
      </>
    );
  }

  if (!user.meta.customizations.blog_updated) {
    return (
      <>
        <p className="p">
          {t(
            "You can create and display posts in your Jomie site. Use them as a blog, portfolio, journal, or anything else. The sky is the limit."
          )}
        </p>
        <Link to="/app/content/posts">
          <Button variant="main" icon="arrow-right" iconRight>
            {t("Create a Post")}
          </Button>
        </Link>
      </>
    );
  }

  return null;
};
