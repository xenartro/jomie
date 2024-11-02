import Button from "components/common/button/Button";
import { NavLink } from "react-router-dom";

export const CancelButton = () => {
  return (
    <div className="BottomContent">
      <NavLink to="/app/visuals/font">
        <Button type="button" size="small" variant="ghost" icon="arrow-left">
          Cancel and go back
        </Button>
      </NavLink>
    </div>
  );
};
