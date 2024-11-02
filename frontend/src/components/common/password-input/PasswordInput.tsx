import Input from "../input/Input";
import "./PasswordInput.scss";
import { FC, InputHTMLAttributes, useState } from "react";

interface PasswordInputInterface extends InputHTMLAttributes<HTMLInputElement> {
  feedback?: string;
}

const PasswordInput: FC<PasswordInputInterface> = ({ feedback, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="PasswordInput">
      <Input {...props} type={show ? "text" : "password"} />
      {feedback && <p className="form__feedback">{feedback}</p>}
      <span onClick={() => setShow(!show)}>
        <button type="button">{show ? "🐵" : "🙈"}</button>
      </span>
    </div>
  );
};

export default PasswordInput;
