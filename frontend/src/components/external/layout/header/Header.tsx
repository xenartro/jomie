import "./Header.scss";
import Button from "components/common/button/Button";
import Logo from "components/common/logo/Logo";
import { useLoginState } from "components/internal/LoginStateContext";
import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderInterface {
  version?: "logoOnly" | "centerLayout" | undefined;
}

const Header: FC<HeaderInterface> = ({ version }) => {
  const { user } = useLoginState();
  let classes = "Header";
  classes += version ? ` ${"--" + version}` : "";

  return (
    <div className={classes}>
      <div className="Header__Logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="Header__Options">
        {user ? (
          <>
            <Link to="/logout">
              <Button size={"small"} type="button" variant="ghost">
                Log out
              </Button>
            </Link>
            <Link to="/app">
              <Button size={"small"} type="button">
                Back to Jomie
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/sign-up">
              <Button size={"small"} type="button" variant="ghost">
                Create an account
              </Button>
            </Link>
            <Link to="/login">
              <Button size={"small"} type="button">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
