import "./Post.scss";
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const EditPost = lazy(() => import("../../content/blog/EditPost"));

const Post = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  return (
    <div className="CreatePost">
      <h5>{t(id ? "Edit Post" : "Edit Post")}</h5>
      <Suspense fallback={t("Loading editor...")}>
        <EditPost />
      </Suspense>
    </div>
  );
};

export default Post;
