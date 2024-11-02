import "./CheckboxLabel.scss";
import { FC, ReactNode, LabelHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

interface CheckboxLabelInterface extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  children: ReactNode;
}

const CheckboxLabel: FC<CheckboxLabelInterface> = ({
  label,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div className="CheckboxLabel">
      <div className="CheckboxLabel__Container">
        <label {...props}>{t(label)}</label>
        {children}
      </div>
    </div>
  );
};

export default CheckboxLabel;
