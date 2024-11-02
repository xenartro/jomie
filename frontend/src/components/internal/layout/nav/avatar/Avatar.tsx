import "./Avatar.scss";
import User from "models/User";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import AvatarImage from "resources/images/avatar.jpg";

interface AvatarInterface {
  user?: User;
}

const Avatar: FC<AvatarInterface> = ({ user }) => {
  const { t } = useTranslation();
  return (
    <div className="Avatar__Container">
      <div className="Avatar">
        <img
          src={user?.meta.profile_image || AvatarImage}
          alt={user?.name || "Anon"}
        />
      </div>
      <div className="Avatar__Label">{t("Account & Settings")}</div>
    </div>
  );
};

export default Avatar;
