import Button from "components/common/button/Button";
import { useNavigate } from "react-router-dom";
import { skipInitialSetup } from "services/user";

/* This needs to be a button, otherwise we have to prevent default, etc */
const SkipButton = () => {
  const navigate = useNavigate();

  async function handleClick() {
    await skipInitialSetup();
    navigate("/app");
  }

  return (
    <Button size="small" variant="link" onClick={handleClick}>
      Skip
    </Button>
  );
};

export default SkipButton;
