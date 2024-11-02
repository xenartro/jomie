import CancelButton from "../create-flow/CancelButton";
import { useColorFlowContext } from "../create-flow/CreateColorFlow";
import HueSaturation from "./ColorPicker/HueSaturation/HueSaturation";
import ColorPreview from "./ColorPreview";
import "./CreatePalette.scss";
import { useQuery } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";

const CreatePaletteStart = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { hue, saturation, edit } = useColorFlowContext();

  const { isLoading, isSuccess } = useQuery({
    queryKey: [`getPalette_${id}`],
    queryFn: () => {
      if (id) {
        return edit(parseInt(id));
      }
    },
    enabled: Boolean(id),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const interactive = !id || (!isLoading && isSuccess);

  return (
    <>
      <div className="LayoutColumn --Content CreateFlowPanel">
        <div className="Create__Palette">
          <h4>{t("Select the main color and saturation")}</h4>
          <p className="p --s">
            {t(
              `Move the cursor around the screen to find a color that represents you. From left to right to pick a color, and from top to bottom to select the saturation.`
            )}
          </p>
          {interactive && (
            <>
              {hue >= 0 && saturation >= 0 && (
                <>
                  <p>
                    <ColorPreview
                      hue={hue}
                      saturation={saturation}
                      size={100}
                    />
                  </p>
                  <NavLink to="/app/create/palette/accent">
                    <Button
                      type="button"
                      variant="secondary"
                      icon="arrow-right"
                      iconRight
                    >
                      Next
                    </Button>
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>
        <CancelButton to="/app/visuals/palette" />
      </div>
      <div className="LayoutColumn --Background CreateFlowSelector">
        {interactive && <HueSaturation />}
      </div>
    </>
  );
};

export default CreatePaletteStart;
