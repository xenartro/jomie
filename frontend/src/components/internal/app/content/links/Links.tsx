import ContentNameForm from "../ContentNameForm";
import { useContentContext } from "../editor/Editor";
import "./Links.scss";
import ContentLinksForm from "./LinksForm";
import ContentSocialLinksForm from "./SocialLinksForm";
import Tabs, { Tab } from "components/common/tabs/Tabs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const tabs: Tab[] = [
  {
    id: "social",
    label: "Social Links",
  },
  {
    id: "other",
    label: "Other Links",
  },
];

const ContentLinks = () => {
  const [tab, setTab] = useState("social");
  const context = useContentContext();
  const { t } = useTranslation();

  useEffect(() => {
    context.setCurrentContent("links");
  }, [context]);

  return (
    <div className="Content__Links">
      <div className="Hero">
        <h5>{t(`Content`)}</h5>
        <h2>{t(`Links.`)}</h2>
      </div>
      <div className="SubNav">
        <Tabs tabs={tabs} onClick={setTab} active={tab} />
      </div>
      <div className="Content__Links__Form">
        {tab === "social" ? (
          <ContentSocialLinksForm {...context} />
        ) : (
          <ContentLinksForm {...context} />
        )}
      </div>
      <div className="Content__Links__Form">
        <ContentNameForm content="links" />
      </div>
    </div>
  );
};

export default ContentLinks;
