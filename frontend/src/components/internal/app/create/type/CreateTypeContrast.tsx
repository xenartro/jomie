import { useTypeFlowContext } from "../create-flow/CreateTypeFlow";
import { CancelButton } from "./CancelButton";
import "./CreateType.scss";
import TypeContrast from "./TypePicker/TypeContrast/TypeContrast";
import Button from "components/common/button/Button";
import { useTranslation } from "react-i18next";
import { NavLink, Navigate } from "react-router-dom";

const CreateTypeContrast = () => {
  const { t } = useTranslation();
  const { ratio, weight, mainFamily } = useTypeFlowContext();
  if (!mainFamily) {
    return <Navigate to="/app/create/type" />;
  }
  return (
    <>
      <div className="LayoutColumn --Content CreateFlowPanel">
        <div className="Create__Type">
          <h4>{t("Select the boldness and size ratio")}</h4>
          <p className="p --s">
            {t(
              "Move the cursor around to see how the text looks with different weights and sizes."
            )}
          </p>
          <NavLink to="/app/create/type/">
            <Button type="button" variant="ghost" icon="arrow-left">
              Back
            </Button>
          </NavLink>
          {ratio !== undefined && weight !== undefined && (
            <NavLink to="/app/create/type/families">
              <Button
                type="button"
                variant="secondary"
                icon="arrow-right"
                iconRight
              >
                Next
              </Button>
            </NavLink>
          )}
        </div>
        <CancelButton />
      </div>
      <div className="LayoutColumn --Background CreateFlowSelector">
        <TypeContrast />
      </div>
    </>
  );
};

export default CreateTypeContrast;
