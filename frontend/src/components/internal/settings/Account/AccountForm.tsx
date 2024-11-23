import { useTheme } from "components/common/Theme";
import Button from "components/common/button/Button";
import CheckboxLabel from "components/common/checkbox-label/CheckboxLabel";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import PasswordInput from "components/common/password-input/PasswordInput";
import { useLoginState } from "components/internal/LoginStateContext";
import {
  DataType,
  handleCheckboxChange,
  handleInputChange,
} from "helpers/forms";
import { useState, useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateAccount } from "services/settings";
import { ThemeOptions, ThemeType, getSystemTheme } from "services/user";

const AccountForm = () => {
  const { user, refresh } = useLoginState();
  const { theme, previewTheme } = useTheme();
  const [data, setData] = useState<DataType>({
    name: user!.name,
    password: "",
    theme: user?.preferences.theme_name || "auto",
    lang: user?.preferences.lang || "",
  });
  const { t } = useTranslation();

  useLayoutEffect(() => {
    const themePreview: ThemeType =
      data.theme === "auto" ? getSystemTheme() : (data.theme as ThemeType);
    previewTheme(themePreview);
    return () => {
      previewTheme(theme);
    };
  }, [data.theme, previewTheme, theme]);

  const handleSubmit = useCallback(async () => {
    await updateAccount({
      name: data.name.toString(),
      password: data.password.toString(),
      theme: data.theme as ThemeOptions,
      lang: data.lang as "es" | "en" | "",
    });
    refresh();
    setData({
      ...data,
      password: "",
    });
  }, [data, refresh]);

  return (
    <Form onSubmit={handleSubmit}>
      <FieldLabel htmlFor="name" label="Full name">
        <Input
          id="name"
          name="name"
          value={data.name}
          type="text"
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </FieldLabel>
      <FieldLabel
        htmlFor="password"
        label="Change password"
        helpText="Change your account password. Remember to use a unique and strong password of at least 11 characters."
      >
        <PasswordInput
          id="password-field"
          name="password"
          autoComplete="off"
          type="text"
          value={data.password}
          onChange={handleInputChange.bind(null, data, setData)}
          minLength={data.password ? 11 : 0}
          required={data.password ? true : false}
          feedback={t("Please create a password of at least 11 characters")}
        />
      </FieldLabel>

      <h5>{t("Appearance")}</h5>
      <CheckboxLabel htmlFor="appearance-1" label="Light">
        <Input
          id="appearance-1"
          name="theme"
          type="radio"
          value="light"
          checked={data.theme === "light"}
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </CheckboxLabel>

      <CheckboxLabel htmlFor="appearance-2" label="Dark">
        <Input
          id="appearance-2"
          name="theme"
          type="radio"
          value="dark"
          checked={data.theme === "dark"}
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </CheckboxLabel>

      <CheckboxLabel htmlFor="appearance-3" label="System">
        <Input
          id="appearance-3"
          name="theme"
          type="radio"
          value="auto"
          checked={data.theme === "auto"}
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </CheckboxLabel>

      <h5>{t("Language")}</h5>
      <CheckboxLabel htmlFor="lang-es" label="Castellano">
        <Input
          id="lang-es"
          name="lang"
          type="radio"
          value="es"
          checked={data.lang === "es"}
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </CheckboxLabel>

      <CheckboxLabel htmlFor="lang-en" label="English">
        <Input
          id="lang-en"
          name="lang"
          type="radio"
          value="en"
          checked={!data.lang || data.lang === "en"}
          onChange={handleInputChange.bind(null, data, setData)}
        />
      </CheckboxLabel>

      <div className="Form__Submit">
        <Button type="submit" size="small">
          {t("Save changes")}
        </Button>
      </div>
    </Form>
  );
};

export default AccountForm;
