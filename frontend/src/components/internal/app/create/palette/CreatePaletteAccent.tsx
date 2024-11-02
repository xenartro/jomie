import CancelButton from "../create-flow/CancelButton";
import { useColorFlowContext } from "../create-flow/CreateColorFlow";
import Contrast from "./ColorPicker/Contrast/Contrast";
import "./CreatePalette.scss";
import Button from "components/common/button/Button";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Navigate } from "react-router-dom";

function getRandomComponent(): number {
  return parseFloat(Math.random().toFixed(2));
}

const CreatePaletteAccent = () => {
  const { hue, saturation, selectPalette, selectedPalette } =
    useColorFlowContext();
  const [randomComponent, setRandomComponent] = useState(
    selectedPalette?.randomComponent || getRandomComponent()
  );
  const { t } = useTranslation();

  const handleNewVariation = useCallback(() => {
    setRandomComponent(getRandomComponent());
    selectPalette(undefined);
  }, [selectPalette]);

  if (hue === undefined || saturation === undefined) {
    return <Navigate to="/app/create/palette" />;
  }

  return (
    <>
      <div className="LayoutColumn --Content CreateFlowPanel">
        <div className="Create__Palette">
          <h4>{t("Select the contrast of your color")}</h4>
          <p className="p --s">
            {t(
              `From the generated colors, select up to 4 variations to compose the palette for your site.`
            )}
          </p>
          <p className="p --s">
            {t(
              `You can generate a new variation or pick a different base color from the previous step.`
            )}
          </p>
          <p>
            <Button type="button" variant="ghost" onClick={handleNewVariation}>
              New variation
            </Button>
          </p>
          <NavLink to={"/app/create/palette"}>
            <Button type="button" variant="ghost" icon="arrow-left">
              Back
            </Button>
          </NavLink>
          {selectedPalette && (
            <NavLink to="/app/create/palette/confirm">
              <Button
                type="button"
                variant="secondary"
                icon="arrow-right"
                iconRight
              >
                Next
              </Button>
            </NavLink>
          )}
        </div>
        <CancelButton to="/app/visuals/palette" />
      </div>
      <div className="LayoutColumn --Background CreateFlowSelector">
        <Contrast randomComponent={randomComponent} />
      </div>
    </>
  );
};

export default CreatePaletteAccent;
