import Button from "components/common/button/Button";
import DangerousActionIcon from "components/common/dangerous-action-button/DangerousActionIcon";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BlogPost } from "services/content";

interface Props {
  post: BlogPost;
  onView?(post: BlogPost): void;
  onRestore(post: BlogPost): void;
  onDelete(post: BlogPost): void;
}

const PostListItem = ({ post, onView, onRestore, onDelete }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={`PostsList__Item `}>
      <div className="PostsList__Item__Title">
        <div className="Title">{post.title}</div>
        {post.id && !post.published && !post.edited_id && (
          <small>{t("Unpublished")}</small>
        )}
        {post.id && post.edited_id && <small>{t("Edited")}</small>}
        <div className="PostsList__Item__Options">
          {post.id && !post.deleted && (
            <>
              {onView && (
                <Button
                  variant="ghost"
                  icon="eye-open"
                  size="small"
                  onClick={() => onView(post)}
                />
              )}
              <Link to={`/app/edit/post/${post.id}`}>
                <Button
                  variant="ghost"
                  icon="pencil"
                  title={t("Edit")}
                  size="small"
                />
              </Link>
            </>
          )}
          {post.deleted === 1 && (
            <Button
              variant="ghost"
              icon="plus"
              size="small"
              onClick={() => onRestore(post)}
              title={t("Restore Post")}
            />
          )}
          <DangerousActionIcon
            variant="ghost"
            icon="trash"
            size="small"
            title={t(post.edited_id ? "Discard changes" : "Delete")}
            onClick={() => onDelete(post)}
          />
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
