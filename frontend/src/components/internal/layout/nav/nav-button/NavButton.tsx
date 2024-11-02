import "./NavButton.scss";
import Icon from "components/common/icon/Icon";
import { FC, ButtonHTMLAttributes, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

interface NavButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "content" | "visuals" | "settings" | "publish" | undefined;
  icon: string;
  level?: "sub-nav" | undefined;
  active?: boolean;
  position?: "right" | undefined;
  indicator?: string;
}

const Button: FC<PropsWithChildren<NavButtonInterface>> = ({
  variant,
  level,
  icon,
  active,
  position,
  children,
  indicator,
  ...rest
}) => {
  const { t } = useTranslation();
  let classes = "NavButton";
  classes += variant ? ` --${variant}` : "";
  classes += level ? ` --${level}` : "";
  classes += active ? ` --active` : "";

  let containerClasses = "NavButton__Container";
  containerClasses += position ? ` --${position}` : "";

  return (
    <div className={containerClasses}>
      <button className={classes} type={"button"} {...rest}>
        <Icon name={icon} />
      </button>
      <div className="NavButton__Label">{t(`${children || ""}`)}</div>
      {variant === "publish" && indicator && (
        <div className="NavButton__Publish-Star">
          <span>{indicator}</span>
          <svg
            width="39"
            height="38"
            viewBox="0 0 39 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.5 0L24.1686 6.6732L32.0344 4.56213L31.3212 12.675L38.7038 16.1139L32.9426 21.8703L36.3875 29.25L28.2741 29.9565L26.1694 37.824L19.5 33.15L12.8306 37.824L10.7259 29.9565L2.6125 29.25L6.05737 21.8703L0.296249 16.1139L7.67875 12.675L6.96564 4.56213L14.8314 6.6732L19.5 0Z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Button;
