import { useState, TextareaHTMLAttributes, FC, FocusEvent } from "react";

const Textarea: FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = "",
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setTouched(true);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const handleInvalid = (e: FocusEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setTouched(true);
  };

  const classes = touched ? `form_textarea--touched ${className}` : className;

  return (
    <textarea
      onBlur={handleBlur}
      onInvalid={handleInvalid}
      {...props}
      className={classes}
    />
  );
};

export default Textarea;
