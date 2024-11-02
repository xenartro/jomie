import "./FieldLabel.scss";
import { FC, ReactNode, LabelHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

interface FieldLabelInterface extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  children: ReactNode;
  helpText?: string;
}

const FieldLabel: FC<FieldLabelInterface> = ({
  label,
  children,
  helpText,
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <div className="FieldLabel">
      <div className="FieldLabel__Container">
        <label {...rest}>{t(label)}:</label>
        {children}
        {helpText && <div className="FieldLabel__HelpText">{t(helpText)}</div>}
      </div>
    </div>
  );
};

export default FieldLabel;
