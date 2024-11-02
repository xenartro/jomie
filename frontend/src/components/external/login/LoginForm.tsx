import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import PasswordInput from "components/common/password-input/PasswordInput";
import { handleInputChange, DataType } from "helpers/forms";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { login, LoginData } from "services/login";

const LoginForm = () => {
  const [data, setData] = useState<DataType>({
    email: "",
    password: "",
    remember: 0,
  });
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const userData: LoginData = {
      email: `${data.email}`,
      password: `${data.password}`,
      remember: Boolean(data.remember),
    };
    await login(userData);
    window.location.assign(`${import.meta.env.VITE_APP_URL}/app`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FieldLabel htmlFor="email-field" label="Your email">
        <Input
          id="email-field"
          name="email"
          type="email"
          value={data.email}
          onChange={handleInputChange.bind(null, data, setData)}
          required
        />
        <p className="form__feedback">{t("Please enter your email")}</p>
      </FieldLabel>
      <FieldLabel htmlFor="password-field" label="Your password">
        <PasswordInput
          id="password-field"
          name="password"
          autoComplete="off"
          type="text"
          value={data.password}
          onChange={handleInputChange.bind(null, data, setData)}
          required
        />

        <p className="form__feedback">{t("Please enter your password")}</p>
      </FieldLabel>
      <div className="Form__Submit">
        <Button type="submit">Login</Button>
      </div>
    </Form>
  );
};

export default LoginForm;
