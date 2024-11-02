import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { useLoginState } from "components/internal/LoginStateContext";
import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateSectionNamePreview } from "services/preview";
import { updatePreferences } from "services/user";

interface Props {
  content: "basics" | "links" | "posts" | "photos";
}

const ContentNameForm = ({ content }: Props) => {
  const { user, refresh } = useLoginState();
  const attribute = `${content}_name`;
  const currentName = user?.preferences[attribute].toString() ?? "";
  const [newName, setNewName] = useState(currentName);
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    await updatePreferences(attribute, newName);
    await refresh();
  }, [attribute, newName, refresh]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
    updateSectionNamePreview(content, e.target.value);
  }, []);

  const handleReset = useCallback(() => {
    setNewName(currentName);
  }, [currentName]);

  const dirty = newName !== currentName;

  return (
    <Form onSubmit={handleSubmit}>
      <p className="p">
        {t(
          "You can customize the name of this section, which will be displayed as a title and the navigation link in the website menu."
        )}
      </p>
      <FieldLabel
        htmlFor="section-name"
        label="Section name"
        helpText="This text will be used in different ways according to your selected Jomie layout."
      >
        <Input
          id="section-name"
          name="name"
          value={newName}
          type="text"
          onChange={handleChange}
        />
      </FieldLabel>
      {dirty && (
        <div className="Form__Submit">
          <Button
            variant="link"
            onClick={handleReset}
            className="Form__Discard"
          >
            Discard changes
          </Button>{" "}
          <Button type="submit">Save</Button>
        </div>
      )}
    </Form>
  );
};

export default ContentNameForm;
