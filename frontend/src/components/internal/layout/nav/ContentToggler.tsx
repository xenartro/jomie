import GoToMySite from "./GoToMySite";
import Toggle from "components/common/toggle/Toggle";
import { useLoginState } from "components/internal/LoginStateContext";
import { NavType } from "hooks/useMainNavType";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updatePreferences } from "services/user";

interface Props {
  section: NavType;
  content: string;
  reloadPreview(): void;
}

const ContentToggler = ({ section, content, reloadPreview }: Props) => {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user, refresh } = useLoginState();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      setActive(false);
      return;
    }
    switch (content) {
      case "basics":
        setActive(user.preferences.basics_enabled);
        break;
      case "links":
        setActive(user.preferences.links_enabled);
        break;
      case "posts":
        setActive(user.preferences.posts_enabled);
        break;
      case "photos":
        setActive(user.preferences.photos_enabled);
        break;
    }
  }, [content, user]);

  const handleChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked;
      if (loading) {
        return;
      }
      setLoading(true);
      updatePreferences(`${content}_enabled`, checked)
        .then(() => {
          refresh();
          reloadPreview();
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [content, loading, refresh, reloadPreview]
  );

  if (section === "visuals" || !user) {
    return null;
  }

  return (
    <div className={`Nav__Section  --${section} ${loading ? "--loading" : ""}`}>
      <div className="Nav__Section__ToggleContainer">
        <div className="Nav__Section__Status">
          {content && (
            <>
              <span>{t(content)}</span>
              {active ? t(" is active") : t(" is disabled")}
            </>
          )}
        </div>
        <div className="Nav__Section__Toogle">
          <Toggle variant={section} checked={active} onChange={handleChange} />
        </div>
      </div>
      <div className="Nav__Section__Preview">
        <GoToMySite user={user} />
      </div>
    </div>
  );
};

export default ContentToggler;
