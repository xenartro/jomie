import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { useLoginState } from "components/internal/LoginStateContext";
import { DataType, handleInputChange } from "helpers/forms";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { updateSite } from "services/settings";

const AccountForm = () => {
  const { user, refresh } = useLoginState();
  const [data, setData] = useState<DataType>({
    nickname: user!.nickname,
    nickname_prefix: user!.nickname_prefix,
    meta_title: user!.preferences.meta_title,
    meta_description: user!.preferences.meta_description,
  });
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    await updateSite({
      nickname: data.nickname.toString(),
      nickname_prefix: data.nickname_prefix.toString(),
      meta_title: data.meta_title.toString(),
      meta_description: data.meta_description.toString(),
    });
    refresh();
  }, [
    data.meta_description,
    data.meta_title,
    data.nickname,
    data.nickname_prefix,
    refresh,
  ]);

  return (
    <Form onSubmit={handleSubmit}>
      <FieldLabel
        htmlFor="nickname_prefix"
        label="Nickname prefix"
        helpText="Optional. You can choose a prefix for your account if you want to make it more unique."
      >
        <Input
          id="nickname_prefix"
          name="nickname_prefix"
          value={data.nickname_prefix}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </FieldLabel>
      <FieldLabel
        htmlFor="nickname"
        label="Nickname"
        helpText="Your nickname is the public name of your account."
      >
        <Input
          id="nickname"
          name="nickname"
          value={data.nickname}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
          required
        />
      </FieldLabel>
      <FieldLabel label="Preview">
        <div>
          <a
            href={`${import.meta.env.VITE_APP_URL}/${
              data.nickname_prefix ? `${data.nickname_prefix}/` : ""
            }${data.nickname}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {import.meta.env.VITE_APP_URL}/
            {data.nickname_prefix ? `${data.nickname_prefix}/` : ""}
            {data.nickname}
          </a>
        </div>
      </FieldLabel>
      <FieldLabel
        htmlFor="meta_title"
        label="Site title"
        helpText="Title for your site. This will be displayed in search engines and in the browser tab."
      >
        <Input
          id="meta_title"
          name="meta_title"
          value={data.meta_title}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
          required
        />
      </FieldLabel>
      <FieldLabel
        htmlFor="meta_description"
        label="Site description"
        helpText="Description for your site. This will be displayed in search engines and when sharing your site."
      >
        <Input
          id="meta_description"
          name="meta_description"
          value={data.meta_description}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
          required
        />
      </FieldLabel>
      <div className="Form__Submit">
        <Button type="submit" size="small">
          {t("Save changes")}
        </Button>
      </div>
    </Form>
  );
};

export default AccountForm;
