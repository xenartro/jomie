import { useContentContext } from "../../content/editor/Editor";
import "./Layouts.scss";
import VisualsLayoutsForm from "./LayoutsForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const VisualsLayouts = () => {
  const context = useContentContext();
  const { t } = useTranslation();
  useEffect(() => {
    context.setCurrentContent("layout");
  }, [context]);
  return (
    <div className="Visuals__Layouts">
      <div className="Hero">
        <h5>{t("Visuals")}</h5>
        <h2>{t("Layouts and Animations.")}</h2>
      </div>
      <div className="Visuals__Layouts__Form">
        <VisualsLayoutsForm {...context} />
      </div>
    </div>
  );
};

export default VisualsLayouts;
