import Icon from "../icon/Icon";
import "./Button.scss";
import { FC, ButtonHTMLAttributes, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

export type ButtonVariantType =
  | "main"
  | "secondary"
  | "ghost"
  | "link"
  | "content"
  | "visuals"
  | "publish"
  | undefined;

interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "big" | "small" | undefined;
  variant?: ButtonVariantType;
  icon?: string;
  iconRight?: boolean;
  danger?: boolean;
}

const Button: FC<PropsWithChildren<ButtonInterface>> = ({
  children,
  type = "button",
  size,
  variant,
  icon,
  iconRight,
  danger,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  let classes = `Button ${className}`;
  classes += size ? ` ${size}` : "";
  classes += variant ? ` ${variant}` : "";
  classes += icon ? " withIcon" : "";
  classes += iconRight ? " iconRight" : "";
  classes += danger ? " danger" : "";
  classes += !children ? " iconOnly" : "";

  let buttonContent;
  const textContent = `${children || ""}`;

  if (icon) {
    if (iconRight) {
      buttonContent = (
        <>
          {t(`${textContent}`)} <Icon name={icon} />{" "}
        </>
      );
    } else {
      buttonContent = (
        <>
          <Icon name={icon} /> {t(textContent)}
        </>
      );
    }
  } else {
    buttonContent = t(textContent);
  }

  return (
    <button className={classes} type={type} {...rest}>
      {buttonContent}
    </button>
  );
};

export default Button;
