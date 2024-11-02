import { useSetupData } from "./InitialSetup";
import SkipButton from "./SkipButton";
import Button from "components/common/button/Button";
import SelectBlock, {
  SelectBlockOption,
} from "components/common/select-block/SelectBlock";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PersonaType } from "services/initialSetup";

const options: SelectBlockOption[] = [
  {
    name: "Content creator",
    value: "content-creator",
    icon: "arrow-right",
  },
  {
    name: "Developer",
    value: "developer",
    icon: "arrow",
  },
  {
    name: "Designer",
    value: "designer",
    icon: "arrow",
  },
  {
    name: "Artist",
    value: "artist",
    icon: "arrow",
  },
  {
    name: "Professional",
    value: "professional",
    icon: "arrow",
  },
  {
    name: "Model",
    value: "model",
    icon: "arrow",
  },
  {
    name: "Sportsperson",
    value: "sports",
    icon: "arrow",
  },
  {
    name: "Gamer/E-Sports",
    value: "gamer",
    icon: "arrow",
  },
  {
    name: "Just a human",
    value: "human",
    icon: "arrow",
  },
  {
    name: "Just an alien",
    value: "alien",
    icon: "arrow",
  },
];

const IdentityType = () => {
  const { t } = useTranslation();

  const { data, set } = useSetupData();

  const handleChange = useCallback(
    (option: SelectBlockOption) => {
      set({
        ...data,
        identity: option.value as PersonaType,
      });
    },
    [data, set]
  );

  return (
    <div>
      <p className="p --s">2/3</p>
      <h4>{t("What do you do")}</h4>
      <p className="p --s">{t("Which persona better describes you")}</p>
      <div className="StepContent">
        <SelectBlock onChange={handleChange} options={options} multiple />
      </div>
      <div className="StepActions">
        <Link to="/app/initial-setup">
          <Button type="button" variant="ghost">
            Back
          </Button>
        </Link>
        <Link to="/app/initial-setup/frequency">
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

export default IdentityType;
