import Button from "components/common/button/Button";
import { Link } from "react-router-dom";

const CancelButton = ({ to }: { to: string }) => {
  return (
    <div className="BottomContent">
      <Link to={to}>
        <Button type="button" size="small" variant="ghost" icon="arrow-left">
          Cancel and go back
        </Button>
      </Link>
    </div>
  );
};

export default CancelButton;
