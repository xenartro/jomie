import { useContentContext } from "../../content/editor/Editor";
import "./Type.scss";
import VisualsTypeForm from "./TypeForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const VisualsType = () => {
  const context = useContentContext();
  const { t } = useTranslation();
  useEffect(() => {
    context.setCurrentContent("font");
  }, [context]);
  return (
    <div className="Visuals__Type">
      <div className="Hero">
        <h5>{t("Visuals")}</h5>
        <h2>{t("Typography.")}</h2>
      </div>
      <div className="Visuals__Type__Form">
        <VisualsTypeForm {...context} />
      </div>
    </div>
  );
};

export default VisualsType;
