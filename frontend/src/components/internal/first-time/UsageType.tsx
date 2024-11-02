import { useSetupData } from "./InitialSetup";
import SkipButton from "./SkipButton";
import Button from "components/common/button/Button";
import SelectBlock, {
  SelectBlockOption,
} from "components/common/select-block/SelectBlock";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { UsageDataType } from "services/initialSetup";

const options: SelectBlockOption[] = [
  {
    name: "Personal Card",
    value: "personal-card",
    icon: "arrow-right",
  },
  {
    name: "Personal Website",
    value: "website",
    icon: "arrow",
  },
  {
    name: "Blog",
    value: "blog",
    icon: "arrow",
  },
  {
    name: "Portfolio",
    value: "portfolio",
    icon: "arrow",
  },
  {
    name: "I don't know",
    value: "dont-know",
    icon: "arrow",
  },
  {
    name: "Other",
    value: "other",
    icon: "arrow",
  },
];

const UsageType = () => {
  const { t } = useTranslation();
  const { data, set } = useSetupData();

  const handleChange = useCallback(
    (option: SelectBlockOption) => {
      set({
        ...data,
        usage: option.value as UsageDataType,
      });
    },
    [data, set]
  );

  return (
    <div>
      <p className="p --s">1/3</p>
      <h4>{t("How will you use Jomie")}</h4>
      <p className="p --s">
        {t("Tell us the main purpose of your Jomie site")}
      </p>
      <div className="StepContent">
        <SelectBlock onChange={handleChange} options={options} />
      </div>
      <div className="StepActions">
        <Link to="/app/initial-setup/identity">
          <Button type="button" variant="ghost">
            Next
          </Button>
        </Link>
      </div>
      <div className="StepSecondaryActions">
        <SkipButton />
      </div>
    </div>
  );
};

export default UsageType;
