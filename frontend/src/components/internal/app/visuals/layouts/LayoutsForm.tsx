import { useQuery } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import CheckboxLabel from "components/common/checkbox-label/CheckboxLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  getLayouts,
  VisualSettings,
  saveVisualSettings,
  getVisualSettings,
  getLoadingEffects,
} from "services/styles";

interface Props {
  refreshUnpublishedChanges(): void;
  setPreviewContent(content: string): void;
}

const VisualLayoutsForm = ({
  refreshUnpublishedChanges,
  setPreviewContent,
}: Props) => {
  const { t } = useTranslation();
  const [layoutId, setLayoutId] = useState(0);
  const [loadingEffectId, setLoadingEffectId] = useState(-1);
  const layoutsQuery = useQuery({
    queryKey: ["getLayouts"],
    queryFn: getLayouts,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const effectsQuery = useQuery({
    queryKey: ["getLoadingEffects"],
    queryFn: getLoadingEffects,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useLayoutEffect(() => {
    setPreviewContent(`layout=${layoutId}&effect=${loadingEffectId}`);
  }, [layoutId, loadingEffectId, setPreviewContent]);

  useEffect(() => {
    return () => {
      setPreviewContent("");
    };
  }, [setPreviewContent]);

  const onDataLoaded = useCallback(
    (settings: VisualSettings) => {
      setLayoutId(settings.layout_id);
      setLoadingEffectId(settings.loading_effect_id);
      refreshUnpublishedChanges();
    },
    [refreshUnpublishedChanges]
  );

  const handleLayoutChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    setLayoutId(parseInt(e.currentTarget.value));
  }, []);
  const handleEffectChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    setLoadingEffectId(parseInt(e.currentTarget.value));
  }, []);

  const handleSubmit = useCallback(async () => {
    await saveVisualSettings({
      layout_id: layoutId,
      loading_effect_id: loadingEffectId,
    });
  }, [layoutId, loadingEffectId]);

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getVisualSettings}
      getDataCallback={onDataLoaded}
      getDataName="getVisualSettings"
    >
      <strong>{t("Layout configurations")}</strong>
      {layoutsQuery.isPending && <div>{t("Loading layouts...")}</div>}
      {layoutsQuery.isError && <div>{t("Couldn't get layouts")}</div>}
      {layoutsQuery.data?.map((layout) => (
        <CheckboxLabel
          htmlFor={`layout-${layout.id}`}
          key={layout.id}
          label={layout.name}
        >
          <Input
            id={`layout-${layout.id}`}
            name={`layout-${layout.id}`}
            type="radio"
            checked={layout.id === layoutId}
            value={layout.id}
            onChange={handleLayoutChange}
          />
        </CheckboxLabel>
      ))}

      <strong>{t("Loading effects")}</strong>
      {effectsQuery.isPending && <div>{t("Loading effects...")}</div>}
      {effectsQuery.isError && <div>{t("Couldn't get effects")}</div>}
      {effectsQuery.data?.map((effect) => (
        <CheckboxLabel
          htmlFor={`effect-${effect.id}`}
          key={effect.id}
          label={effect.name}
        >
          <Input
            id={`effect-${effect.id}`}
            name={`effect-${effect.id}`}
            type="radio"
            checked={effect.id === loadingEffectId}
            value={effect.id}
            onChange={handleEffectChange}
          />
        </CheckboxLabel>
      ))}

      <div className="Form__Submit">
        <Button variant="link" type="reset" className="Form__Discard">
          Discard changes
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default VisualLayoutsForm;
