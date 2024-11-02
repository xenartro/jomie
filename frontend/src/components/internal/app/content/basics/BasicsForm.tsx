import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import Textarea from "components/common/textarea/textarea";
import {
  DataType,
  handleInputChange,
  handleTextAreaChange,
} from "helpers/forms";
import { useState, useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ContentBasicData,
  getBasicContent,
  updateBasicContent,
} from "services/content";
import { updateContentBasicPreview } from "services/preview";

interface Props {
  refreshUnpublishedChanges(): void;
}

const ContentBasicsForm = ({ refreshUnpublishedChanges }: Props) => {
  const [data, setData] = useState<DataType>({
    level1: "",
    level2: "",
    level3: "",
    paragraph: "",
  });
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    updateContentBasicPreview(data);
  });

  const onDataLoaded = useCallback(
    (data: ContentBasicData) => {
      setData(data);
      refreshUnpublishedChanges();
      setLoaded(true);
    },
    [refreshUnpublishedChanges]
  );

  const handleSubmit = useCallback(async () => {
    return await updateBasicContent(
      {
        level1: data.level1,
        level2: data.level2,
        level3: data.level3,
        paragraph: data.paragraph,
      },
      "image-field"
    );
  }, [data]);

  const noContent = loaded && !data.level1 && !data.level2 && !data.level3;

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getBasicContent}
      getDataCallback={onDataLoaded}
      getDataName="getBasicContent"
    >
      <FieldLabel htmlFor="level1-field" label="Level 1">
        <Input
          id="level1-field"
          name="level1"
          value={data.level1}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </FieldLabel>
      <FieldLabel htmlFor="level2-field" label="Level 2">
        <Input
          id="level2-field"
          name="level2"
          value={data.level2}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </FieldLabel>
      <FieldLabel htmlFor="level3-field" label="Level 3">
        <Input
          id="level3-field"
          name="level3"
          value={data.level3}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </FieldLabel>

      <FieldLabel htmlFor="paragraph-field" label="Short paragraph">
        <Textarea
          id="paragraph-field"
          name="paragraph"
          value={data.paragraph}
          onChange={handleTextAreaChange.bind(null, data, setData)}
        />
      </FieldLabel>

      <FieldLabel htmlFor="image-field" label="Your picture">
        <Input
          id="image-field"
          name="profile_image"
          type="file"
          onChange={handleInputChange.bind(null, data, setData)}
          accept="image/*"
        />
      </FieldLabel>
      {noContent && (
        <p>
          {t(
            "You have no basic content 😕. Consider disabling the section if you're not using it."
          )}
        </p>
      )}
      <div className="Form__Submit">
        <Button variant="link" type="reset" className="Form__Discard">
          Discard changes
        </Button>{" "}
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default ContentBasicsForm;
