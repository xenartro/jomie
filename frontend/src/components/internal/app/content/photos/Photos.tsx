import ContentNameForm from "../ContentNameForm";
import { useContentContext } from "../editor/Editor";
import "./Photos.scss";
import ContentPhotosForm from "./PhotosForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ContentPhotos = () => {
  const { t } = useTranslation();
  const context = useContentContext();

  useEffect(() => {
    context.setCurrentContent("photos");
  }, [context]);

  return (
    <div className="Content__Photos">
      <div className="Hero">
        <h5>{t("Photos")}</h5>
        <h2>{t("Your favorite images.")}</h2>
      </div>
      <div className="Content__Photos__Form">
        <ContentPhotosForm {...context} />
      </div>
      <div className="Content__Photos__Form">
        <ContentNameForm content="photos" />
      </div>
    </div>
  );
};

export default ContentPhotos;
