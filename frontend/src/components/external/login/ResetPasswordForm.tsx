import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { handleInputChange, DataType } from "helpers/forms";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resetPasswordRequest } from "services/login";

const ResetPasswordForm = ({ cancel }: { cancel(): void }) => {
  const [data, setData] = useState<DataType>({
    email: "",
  });
  const { t } = useTranslation();

  const handleSubmit = async () => {
    await resetPasswordRequest(data.email.toString());
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
      <div className="Form__Submit">
        <Button type="submit">Reset my password</Button>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
