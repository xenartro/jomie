import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import CheckboxLabel from "components/common/checkbox-label/CheckboxLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { deleteType } from "services/font";
import { updateFontPreview } from "services/preview";
import {
  VisualSettings,
  getFonts,
  getVisualSettings,
  saveVisualSettings,
} from "services/styles";

interface Props {
  refreshUnpublishedChanges(): void;
}

const VisualTypeForm = ({ refreshUnpublishedChanges }: Props) => {
  const { t } = useTranslation();
  const [fontId, setFontId] = useState(0);
  const [selectedFontId, setSelectedFontId] = useState(0);
  const query = useQuery({
    queryKey: ["getFonts"],
    queryFn: getFonts,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  useEffect(() => {
    const font = query.data?.find((font) => font.id === fontId);
    if (font) {
      updateFontPreview(font);
    }
  }, [fontId, query.data]);

  useEffect(() => {
    const createdId = parseInt(sessionStorage.getItem("font_id") || "", 10);
    const font = query.data?.find((p) => p.id === createdId);
    if (!font) {
      return;
    }
    saveVisualSettings({ font_id: createdId }).then(() => {
      refreshUnpublishedChanges();
    });
    setFontId(createdId);
    sessionStorage.removeItem("font_id");
  }, [query.data, refreshUnpublishedChanges]);

  const onDataLoaded = useCallback(
    (settings: VisualSettings) => {
      setFontId(settings.font_id);
      setSelectedFontId(settings.font_id);
      refreshUnpublishedChanges();
    },
    [refreshUnpublishedChanges]
  );

  const handleChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    setFontId(parseInt(e.currentTarget.value));
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteType(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["getFonts"] });
      });
    },
    [queryClient]
  );

  const handleSubmit = useCallback(async () => {
    await saveVisualSettings({ font_id: fontId });
  }, [fontId]);

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getVisualSettings}
      getDataCallback={onDataLoaded}
      getDataName="getVisualSettings"
    >
      <div className="TypeStylesList">
        <NavLink to="/app/create/type">
          <Button type="button" variant="secondary" size="small" icon="plus">
            {t("Create new Type Style")}
          </Button>
        </NavLink>
        <br />
        <br />
        {query.isPending && <div>{t("Loading font families...")}</div>}
        {query.isError && <div>{t("Couldn't get your type styles")}</div>}
        {query.data?.map((font) => (
          <div
            key={font.id}
            className={`TypeStyle__Item ${
              font.id === fontId ? "--selected" : ""
            }`}
          >
            <div className="TypeStyle__Item__Checkbox">
              <CheckboxLabel htmlFor={`font-${font.id}`} label=" ">
                <Input
                  id={`font-${font.id}`}
                  name={`selected-font-${font.id}`}
                  type="checkbox"
                  checked={font.id === fontId}
                  value={font.id}
                  onChange={handleChange}
                />
              </CheckboxLabel>
            </div>
            <div className="TypeStyle__Item__Title">
              <h5>{font.name}</h5>
            </div>
            <div className="TypeStyle__Item__Options">
              {font.user_type && (
                <>
                  <Link to={`/app/edit/type/${font.id}`}>
                    <Button variant="ghost" icon="pencil" size="small" />
                  </Link>
                  {selectedFontId !== font.id && (
                    <Button
                      variant="ghost"
                      icon="trash"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (font.id) {
                          handleDelete(font.id);
                        }
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="Form__Submit">
        <Button variant="link" type="reset" className="Form__Discard">
          Discard changes
        </Button>
        <Button type="submit">{t("Save")}</Button>
      </div>
    </Form>
  );
};

export default VisualTypeForm;
