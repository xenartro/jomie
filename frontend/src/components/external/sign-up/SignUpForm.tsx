import SignUpSuccess from "./SignUpSuccess";
import Button from "components/common/button/Button";
import CheckboxLabel from "components/common/checkbox-label/CheckboxLabel";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import PasswordInput from "components/common/password-input/PasswordInput";
import {
  handleInputChange,
  handleCheckboxChange,
  DataType,
} from "helpers/forms";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserLang, registerUser, UserData } from "services/signup";

const SignUpForm = () => {
  const [data, setData] = useState<DataType>({
    name: "",
    email: "",
    nickname: "",
    nickname_prefix: "",
    password: "",
    terms_accepted: 0,
  });
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const userData: UserData = {
      name: `${data.name}`,
      email: `${data.email}`,
      nickname: `${data.nickname}`,
      nickname_prefix: `${data.nickname_prefix}`,
      password: `${data.password}`,
      lang: getUserLang(),
    };

    return await registerUser(userData, Boolean(data.terms_accepted));
  };

  return (
    <Form onSubmit={handleSubmit} success={<SignUpSuccess />}>
      <FieldLabel htmlFor="nickname-field" label="Nickname / URL">
        <Input
          id="nickname-field"
          name="nickname"
          type="text"
          value={data.nickname}
          onChange={handleInputChange.bind(null, data, setData)}
        />

        <p className="form__feedback">{t("Please enter your nickname")}</p>
      </FieldLabel>

      {data.nickname && (
        <div className="form__help">
          Your URL: {import.meta.env.VITE_APP_URL}/
          {data.nickname_prefix ? `${data.nickname_prefix}/` : ""}
          {data.nickname}
          <br />
          <br />
        </div>
      )}
      <FieldLabel htmlFor="name-field" label="Full name">
        <Input
          id="name-field"
          name="name"
          type="text"
          value={data.name}
          onChange={handleInputChange.bind(null, data, setData)}
          required
        />
        <p className="form__feedback">{t("Please enter your full name")}</p>
      </FieldLabel>

      <FieldLabel htmlFor="email-field" label="Email">
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
      <CheckboxLabel
        htmlFor="terms-field"
        label="I read and accept the terms and conditions"
      >
        <Input
          id="terms-field"
          name="terms_accepted"
          type="checkbox"
          value={1}
          onChange={handleCheckboxChange.bind(null, data, setData)}
          required
        />

        <p className="form__feedback">
          {t("You need to accept the terms to create the account")}
        </p>
      </CheckboxLabel>

      <div className="Form__Submit">
        <Button type="submit">{t("Create account")}</Button>
      </div>
    </Form>
  );
};

export default SignUpForm;
