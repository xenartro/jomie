import "./Logo.scss";
import logo from "resources/images/logo.svg";
import { FC } from "react";

const Logo: FC = () => {
  return (
    <div className="Logo">
      <img src={logo} />
    </div>
  );
};

export default Logo;
