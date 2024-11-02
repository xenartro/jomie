import { useTypeFlowContext } from "../create-flow/CreateTypeFlow";
import { CancelButton } from "./CancelButton";
import "./CreateType.scss";
import Shape from "./TypePicker/Shape/Shape";
import Button from "components/common/button/Button";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const CreateTypeShape = () => {
  const { t } = useTranslation();
  const { mainFamily } = useTypeFlowContext();
  return (
    <>
      <div className="LayoutColumn --Content CreateFlowPanel">
        <div className="Create__Type">
          <h4>Choose a shape</h4>
          <p className="p --s">
            {t("Select the shape that feels more aligned with your style.")}
          </p>
          {mainFamily && (
            <NavLink to="/app/create/type/contrast">
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
        <Shape />
      </div>
    </>
  );
};

export default CreateTypeShape;
