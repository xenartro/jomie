import "./Toggle.scss";
import { FC, InputHTMLAttributes } from "react";

interface ToggleInterface extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "content" | "visuals" | "main" | undefined;
}

const Toggle: FC<ToggleInterface> = ({ checked, variant, ...props }) => {
  let classes = "Toggle";
  classes += checked ? " --on" : " --off";
  classes += variant ? ` --${variant}` : "";

  return (
    <label className={classes}>
      <input type="checkbox" checked={checked} {...props} />
      <span className="Toggle__Slider"></span>
    </label>
  );
};

export default Toggle;
