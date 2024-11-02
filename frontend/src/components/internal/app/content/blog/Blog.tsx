import ContentNameForm from "../ContentNameForm";
import { useContentContext } from "../editor/Editor";
import "./Blog.scss";
import ContentBlogForm from "./BlogForm";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ContentBlog = () => {
  const context = useContentContext();
  const { t } = useTranslation();
  useEffect(() => {
    context.setCurrentContent("posts");
  }, [context]);

  return (
    <div className="Content__Blog">
      <div className="Hero">
        <h5>{t("Content")}</h5>
        <h2>{t("Posts.")}</h2>
      </div>
      <div className="Content__Blog__Form">
        <ContentBlogForm {...context} />
      </div>
      <div className="Content__Blog__Form">
        <ContentNameForm content="posts" />
      </div>
    </div>
  );
};

export default ContentBlog;
