import NavButton from "./nav-button/NavButton";
import User from "models/User";

const GoToMySite = ({ user }: { user: User }) => {
  return (
    <a
      href={`${import.meta.env.VITE_APP_URL}/${
        user.nickname_prefix ? `${user.nickname_prefix}/` : ""
      }${user.nickname}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <NavButton position="right" icon="preview">
        Go to My Site
      </NavButton>
    </a>
  );
};

export default GoToMySite;
