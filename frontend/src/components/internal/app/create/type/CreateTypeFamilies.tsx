import { useTypeFlowContext } from "../create-flow/CreateTypeFlow";
import { CancelButton } from "./CancelButton";
import "./CreateType.scss";
import TypeComplexity from "./TypePicker/TypeComplexity/TypeComplexity";
import Button from "components/common/button/Button";
import { useTranslation } from "react-i18next";
import { NavLink, Navigate } from "react-router-dom";

const CreateTypeFamilies = () => {
  const { id, mainFamily, ratio, weight, family, create } =
    useTypeFlowContext();
  const { t } = useTranslation();
  if (!mainFamily) {
    return <Navigate to="/app/create/type" />;
  }
  if (ratio === undefined || weight === undefined) {
    return <Navigate to="/app/create/type/contrast" />;
  }
  return (
    <>
      <div className="LayoutColumn --Content CreateFlowPanel">
        <div className="Create__Type">
          <h4>{t("Combine families")}</h4>
          <p className="p --s">
            {t(
              "Select the combination of font families that you like the most."
            )}
          </p>

          <NavLink to="/app/create/type/contrast ">
            <Button type="button" variant="ghost" icon="arrow-left">
              Back
            </Button>
          </NavLink>
          {family && (
            <Button
              type="button"
              variant="main"
              icon="arrow-right"
              iconRight
              onClick={create}
            >
              {id ? "Update type" : "Save type"}
            </Button>
          )}
        </div>
        <CancelButton />
      </div>
      <div className="LayoutColumn --Background CreateFlowSelector">
        <TypeComplexity />
      </div>
    </>
  );
};

export default CreateTypeFamilies;
