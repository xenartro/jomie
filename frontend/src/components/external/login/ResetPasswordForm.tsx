import RedirectToHomePage from "components/common/RedirectToHomePage";
import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import PasswordInput from "components/common/password-input/PasswordInput";
import { handleInputChange, DataType } from "helpers/forms";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { resetPassword } from "services/login";

const ResetPasswordForm = () => {
  const [data, setData] = useState<DataType>({
    email: "",
    password: "",
    token: new URLSearchParams(window.location.search).get("token") ?? "",
  });
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    await resetPassword({
      email: data.email.toString(),
      password: data.password.toString(),
      password_confirmation: data.password.toString(),
      token: data.token.toString(),
    });
    setSuccess(true);
  };

  if (!data.token) {
    return <RedirectToHomePage />;
  }

  if (success) {
    return (
      <div>
        <p className="p">{t("Done! Your password has been changed.")}</p>
        <p>
          <Link to="/login">{t("Login")}</Link>
        </p>
      </div>
    );
  }

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
      <FieldLabel htmlFor="password-field" label="Password">
        <PasswordInput
          id="password-field"
          name="password"
          autoComplete="off"
          type="text"
          value={data.password}
          onChange={handleInputChange.bind(null, data, setData)}
          minLength={11}
          required
          feedback={t("Please create a password of at least 11 characters")}
        />
      </FieldLabel>
      <div className="Form__Submit">
        <Button type="submit">Reset my password</Button>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
