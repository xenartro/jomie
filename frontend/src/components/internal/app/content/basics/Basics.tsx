import ContentNameForm from "../ContentNameForm";
import { useContentContext } from "../editor/Editor";
import "./Basics.scss";
import ContentBasicsForm from "./BasicsForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ContentBasics = () => {
  const { t } = useTranslation();
  const context = useContentContext();

  useEffect(() => {
    context.setCurrentContent("basics");
  }, [context]);

  return (
    <div className="Content__Basics">
      <div className="Hero">
        <h5>{t("Content")}</h5>
        <h2>{t("Your basic info.")}</h2>
      </div>
      <div className="Content__Basics__Form">
        <ContentBasicsForm {...context} />
      </div>
      <div className="Content__Basics__Form">
        <ContentNameForm content="basics" />
      </div>
    </div>
  );
};

export default ContentBasics;
