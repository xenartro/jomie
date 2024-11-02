import "./Tabs.scss";
import { useTranslation } from "react-i18next";

interface Props {
  active: string;
  className?: string;
  tabs: Tab[];
  onClick(id: string): void;
}

export type Tab = {
  id: string;
  label: string;
};

const Tabs = ({ active, className = "", tabs, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <div className={`Tabs ${className}`}>
      {tabs.map((tab) => (
        <button
          onClick={() => onClick(tab.id)}
          key={tab.id}
          className={`Tab ${active === tab.id ? "--selected" : ""}`}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
