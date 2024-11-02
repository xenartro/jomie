import Button from "./button/Button";
import FieldLabel from "./field-label/FieldLabel";
import Form from "./form/Form";
import Input from "./input/Input";
import Textarea from "./textarea/textarea";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Feedback = () => {
  const { t } = useTranslation();
  const handleSubmit = async () => {};
  return (
    <div className="Layout --FlexibleGrid ">
      <div className="Row ">
        <div className="Col --size6 --pos4">
          <Link to="/">
            <Button
              type="button"
              size="small"
              variant="ghost"
              icon="arrow-left"
            >
              {t("Go Back to Jomie")}
            </Button>
          </Link>
          <br />
          <br />
          <h3>{t("Feedback")}</h3>
          <p>
            {t(
              "Tell us how can we improve Jomie for you. Any feedback is appreciated."
            )}
          </p>
          <Form onSubmit={handleSubmit}>
            <FieldLabel htmlFor="email-field" label="Your email">
              <Input id="email-field" name="email" type="email" required />
              <p className="form__feedback">{t("Please enter your email")}</p>
            </FieldLabel>
            <FieldLabel htmlFor="message-field" label="Your message">
              <Textarea id="message-field" required name="content" />
            </FieldLabel>

            <div className="Form__Submit">
              <Button type="submit">Send</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
