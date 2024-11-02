import { useState, InputHTMLAttributes, FC, FocusEvent } from "react";
import { useTranslation } from "react-i18next";

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const { t } = useTranslation();

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const handleInvalid = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTouched(true);
  };

  const classes = touched ? `form_input--touched ${className}` : className;

  return (
    <input
      onBlur={handleBlur}
      onInvalid={handleInvalid}
      {...props}
      placeholder={props.placeholder ? t(props.placeholder) : undefined}
      className={classes}
    />
  );
};

export default Input;
