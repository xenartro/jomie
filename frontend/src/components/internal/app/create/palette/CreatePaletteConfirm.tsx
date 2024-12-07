import CancelButton from "../create-flow/CancelButton";
import { useColorFlowContext } from "../create-flow/CreateColorFlow";
import Balance from "./ColorPicker/Balance/Balance";
import ColorPreview from "./ColorPreview";
import "./CreatePalette.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Navigate } from "react-router-dom";
import { createPalette } from "services/palette";

const CreatePaletteConfirm = () => {
  const { hue, saturation, balance, selectedPalette, id } =
    useColorFlowContext();
  const [previewBalance, setPreviewBalance] = useState(balance);
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: createPalette });
  const client = useQueryClient();

  const handleCreatePalette = useCallback(() => {
    if (!selectedPalette) {
      return;
    }
    mutation.mutate(
      {
        id,
        balance,
        palette: selectedPalette?.colors,
        random_component: selectedPalette.randomComponent,
      },
      {
        onSuccess(data) {
          if (data?.id) {
            sessionStorage.setItem("palette_id", data?.id.toString());
          }
        },
      }
    );
    client.invalidateQueries({ queryKey: ["getPalettes"] });
  }, [balance, client, id, mutation, selectedPalette]);

  if (hue === undefined || saturation === undefined || !selectedPalette) {
    return <Navigate to="/app/create/palette" />;
  }

  if (mutation.isSuccess) {
    return <Navigate to="/app/visuals/palette" />;
  }

  return (
    <>
      <div className="LayoutColumn --Content CreateFlowPanel">
        <div className="Create__Palette">
          <h4>{t("How colorful do you want your site to look")}</h4>
          <p className="p --s">
            {t(
              `Move the pointer up and down to set the amount of color that you want for your site.`
            )}
          </p>
          <p className="p --s">
            {t(
              `Experiment with different color configurations until you find a palette that is just right for you.`
            )}
          </p>
          <p className="p --s">{t("Main color:")}</p>
          <ColorPreview hue={hue} saturation={saturation} size={100} />
          <p className="p --s">{t("Generated palette:")}</p>
          <p>
            {selectedPalette.colors.map(({ hue, saturation }, i) => (
              <ColorPreview
                key={i}
                hue={hue}
                saturation={saturation}
                size={100}
              />
            ))}
          </p>
          <NavLink to="/app/create/palette/accent">
            <Button type="button" variant="ghost" icon="arrow-left">
              Back
            </Button>
          </NavLink>

          {mutation.isError && (
            <p className="p --s">
              {t("Something went wrong while creating your palette.")}
            </p>
          )}

          <Button
            disabled={mutation.isPending}
            type="button"
            variant="main"
            icon="arrow-right"
            iconRight
            onClick={handleCreatePalette}
          >
            {id ? "Save Palette" : "Create Palette"}
          </Button>
        </div>
        <CancelButton to="/app/visuals/palette" />
      </div>
      <div className="LayoutColumn --Background CreateFlowSelector">
        <Balance
          previewBalance={previewBalance}
          setPreviewBalance={setPreviewBalance}
        />
      </div>
    </>
  );
};

export default CreatePaletteConfirm;
