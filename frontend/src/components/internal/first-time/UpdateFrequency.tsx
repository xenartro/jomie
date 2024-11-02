import { useSetupData } from "./InitialSetup";
import SkipButton from "./SkipButton";
import Button from "components/common/button/Button";
import SelectBlock, {
  SelectBlockOption,
} from "components/common/select-block/SelectBlock";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FrequencyType } from "services/initialSetup";
import { completeInitialSetup } from "services/user";

const options: SelectBlockOption[] = [
  {
    name: "Daily",
    value: "daily",
    icon: "arrow-right",
  },
  {
    name: "Weekly",
    value: "weekly",
    icon: "arrow-right",
  },
  {
    name: "Monthly",
    value: "monthly",
    icon: "arrow-right",
  },
  {
    name: "Sometimes",
    value: "sometimes",
    icon: "arrow-right",
  },
  {
    name: "I don't know",
    value: "dont-know",
    icon: "arrow-right",
  },
];

const UpdateFrequency = () => {
  const { t } = useTranslation();
  const { data, set } = useSetupData();

  const handleChange = useCallback(
    (option: SelectBlockOption) => {
      set({
        ...data,
        frequency: option.value as FrequencyType,
      });
    },
    [data, set]
  );

  return (
    <div>
      <p className="p --s">3/3</p>
      <h4>{t("How often will you update your site")}</h4>
      <p className="p --s">
        {t("Tell us how frecuently will you update your personal site")}
      </p>
      <div className="StepContent">
        <SelectBlock onChange={handleChange} options={options} />
      </div>
      <div className="StepActions">
        <Link to="/app/initial-setup/identity">
          <Button type="button" variant="ghost">
            Back
          </Button>
        </Link>
        <Link to="/app">
          <Button type="button" onClick={() => completeInitialSetup(data)}>
            Finish
          </Button>
        </Link>
      </div>
      <div className="StepSecondaryActions">
        <SkipButton />
      </div>
    </div>
  );
};

export default UpdateFrequency;
