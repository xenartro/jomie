import { useContentContext } from "../../content/editor/Editor";
import "./Palette.scss";
import VisualsPaletteForm from "./PaletteForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const VisualsPalette = () => {
  const context = useContentContext();
  const { t } = useTranslation();
  useEffect(() => {
    context.setCurrentContent("palette");
  }, [context]);
  return (
    <div className="Visuals__Palette">
      <div className="Hero">
        <h5>{t("Visuals")}</h5>
        <h2>{t("Color Palettes")}</h2>
      </div>
      <div className="Visuals__Palette__Form">
        <VisualsPaletteForm {...context} />
      </div>
    </div>
  );
};

export default VisualsPalette;
