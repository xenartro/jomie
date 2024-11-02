import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import Form from "components/common/form/Form";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Palette, deletePalette } from "services/palette";
import { updatePalettePreview } from "services/preview";
import {
  VisualSettings,
  getPalettes,
  getVisualSettings,
  saveVisualSettings,
} from "services/styles";

interface Props {
  refreshUnpublishedChanges(): void;
}

const VisualPaletteForm = ({ refreshUnpublishedChanges }: Props) => {
  const [paletteId, setPaletteId] = useState(0);
  const [selectedPaletteId, setSelectedPaletteId] = useState(0);
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ["getPalettes"],
    queryFn: getPalettes,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    if (paletteId) {
      updatePalettePreview(paletteId);
    }
  }, [paletteId, query.data]);

  useEffect(() => {
    const createdId = parseInt(sessionStorage.getItem("palette_id") || "", 10);
    if (
      createdId &&
      query.data &&
      query.data?.find((p) => p.id === createdId)
    ) {
      saveVisualSettings({ palette_id: createdId }).then(() => {
        refreshUnpublishedChanges();
      });
      setPaletteId(createdId);
      sessionStorage.removeItem("palette_id");
    }
  }, [query.data, refreshUnpublishedChanges]);

  const onDataLoaded = useCallback(
    (settings: VisualSettings) => {
      setPaletteId(settings.palette_id);
      setSelectedPaletteId(settings.palette_id);
      refreshUnpublishedChanges();
    },
    [refreshUnpublishedChanges]
  );
  const handleDelete = useCallback(
    (id: number) => {
      deletePalette(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["getPalettes"] });
      });
    },
    [queryClient]
  );

  const handleSubmit = useCallback(async () => {
    await saveVisualSettings({ palette_id: paletteId });
  }, [paletteId]);

  const touched = useMemo(
    () => paletteId !== selectedPaletteId,
    [paletteId, selectedPaletteId]
  );

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getVisualSettings}
      getDataCallback={onDataLoaded}
      getDataName="getVisualSettings"
    >
      <div className="PalettesList">
        <Link to="/app/create/palette">
          <Button type="button" variant="secondary" size="small" icon="plus">
            {t("Create new Palette")}
          </Button>
        </Link>
        <br />
        <br />
        {query.isPending && <div>{t("Loading palettes...")}</div>}
        {query.isError && (
          <div>{t("The palettes are not available right now")}</div>
        )}
        {query.data?.map((palette: Palette) => (
          <div
            key={palette.id}
            className={`Palette__Item ${
              palette.id === paletteId ? "--selected" : ""
            }`}
            onClick={() => setPaletteId(palette.id)}
          >
            <div className="Palette__Item__Body">
              {palette.palette.map(({ hue, saturation }, i) => (
                <div
                  key={i}
                  className="Palette__Item__Color "
                  style={{
                    backgroundColor: `hsl(${hue}, ${saturation}%, 50%)`,
                  }}
                />
              ))}
              {palette.id === paletteId && (
                <div className="Palette__Item__Tag">
                  <span>{t("Selected")}</span>
                </div>
              )}
            </div>

            <div className="Palette__Item__Options">
              {palette.user_palette && (
                <>
                  <Link to={`/app/edit/palette/${palette.id}`}>
                    <Button variant="ghost" icon="pencil" size="small" />
                  </Link>
                  {selectedPaletteId !== palette.id && (
                    <Button
                      variant="ghost"
                      icon="trash"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(palette.id);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className="Form__Submit"
        style={touched ? { visibility: "visible" } : undefined}
      >
        <Button variant="link" type="reset" className="Form__Discard">
          Discard changes
        </Button>
        <Button type="submit">{t("Save")}</Button>
      </div>
    </Form>
  );
};

export default VisualPaletteForm;
