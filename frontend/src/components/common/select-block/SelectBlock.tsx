import Icon from "../icon/Icon";
import "./SelectBlock.scss";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

interface SelectBlockInterface {
  icon?: string;
  multiple?: boolean;
  onChange(a: SelectBlockOption): void;
  options: SelectBlockOption[];
}

export interface SelectBlockOption {
  name: string;
  value: string;
  icon: string;
  multiple?: boolean;
  selected?: boolean;
}

const SelectBlock: FC<PropsWithChildren<SelectBlockInterface>> = ({
  icon,
  multiple,
  onChange,
  options,
}) => {
  const { t } = useTranslation();
  const selected = options.find((option) => option.selected === true);
  let classes = "SelectBlock";
  classes += icon ? " withIcon" : "";
  classes += multiple ? " multipleSelect" : "";

  return (
    <div className={classes}>
      <div className="SelectBlock__Container">
        {options.map((option) => {
          let optionClasses = "Option";
          optionClasses += selected === option ? " --selected" : "";
          optionClasses += multiple ? " multiple" : "";
          return (
            <div
              className={optionClasses}
              key={option.value}
              onClick={() => {
                options.forEach((option) => (option.selected = false));
                option.selected = true;
                onChange(option);
              }}
            >
              <div className="Option__Icon">
                <Icon name={option.icon} />
              </div>
              <div className="Option__Name">{t(option.name)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectBlock;
