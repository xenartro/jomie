import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { handleArrayInputChange } from "helpers/forms";
import { useState, useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ContentPhotoData,
  getPhotosContent,
  removePhoto,
  updatePhotosContent,
} from "services/content";
import { updateContentPhotosPreview } from "services/preview";

interface Props {
  refreshUnpublishedChanges(): void;
}

const ContentPhotosForm = ({ refreshUnpublishedChanges }: Props) => {
  const [data, setData] = useState<string[]>(["", "", "", "", "", ""]);
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    updateContentPhotosPreview(data);
  });

  const onDataLoaded = useCallback(
    (data: ContentPhotoData[]) => {
      const newData = ["", "", "", "", "", ""];
      data.forEach((photo) => (newData[photo.position - 1] = photo.image));
      setData(newData);
      refreshUnpublishedChanges();
      setLoaded(true);
    },
    [refreshUnpublishedChanges]
  );

  const handleSubmit = useCallback(async () => {
    const result = await updatePhotosContent();

    if (result?.data?.data) {
      onDataLoaded(result.data.data);
    }

    return result;
  }, [onDataLoaded]);

  const handleRemovePhoto = useCallback(
    async (index: number) => {
      const result = await removePhoto(index);

      if (result?.data?.data) {
        onDataLoaded(result.data.data);
      }

      return result;
    },
    [onDataLoaded]
  );

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getPhotosContent}
      getDataCallback={onDataLoaded}
      getDataName="getPhotosContent"
    >
      {!loaded && <p>{t("Asking the server for your images...")}</p>}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i}>
          <FieldLabel htmlFor="image-field" label={`Photo ${i + 1}`}>
            <Input
              id={`photo_${i + 1}`}
              name={`photo_${i + 1}`}
              type="file"
              onChange={handleArrayInputChange.bind(null, data, i, setData)}
              accept="image/*"
              value={data[i].startsWith("http") ? "" : data[i]}
            />
          </FieldLabel>
          {data[i].startsWith("http") && (
            <div>
              <img
                src={data[i]}
                alt={`Photo ${i + 1}`}
                width="60"
                height="auto"
              />
              <Button
                variant="link"
                aria-label={`Remove photo ${i + 1}`}
                onClick={handleRemovePhoto.bind(null, i + 1)}
              >
                Remove
              </Button>
              <hr />
            </div>
          )}
        </div>
      ))}
      <div className="Form__Submit">
        <Button variant="link" type="reset" className="Form__Discard">
          Discard changes
        </Button>{" "}
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default ContentPhotosForm;
