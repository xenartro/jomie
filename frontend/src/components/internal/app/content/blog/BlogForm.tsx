import { useContentContext } from "../editor/Editor";
import PostListItem from "./PostListItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {
  BlogPost,
  deleteBlogPost,
  discardPostChanges,
  getBlogPosts,
  restoreBlogPost,
} from "services/content";

interface Props {
  refreshUnpublishedChanges(): void;
}

const ContentBlogForm = ({ refreshUnpublishedChanges }: Props) => {
  const { t } = useTranslation();
  const { reloadPreview } = useContentContext();
  const query = useQuery({
    queryKey: ["getBlogPosts"],
    queryFn: getBlogPosts,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (query.isSuccess) {
      refreshUnpublishedChanges();
      reloadPreview();
    }
  }, [query.isSuccess, refreshUnpublishedChanges, reloadPreview]);

  const handleDiscard = useCallback(async () => {
    if (!confirm(t("Discard new, deleted, and edited posts?"))) {
      return;
    }
    await discardPostChanges();
    queryClient.invalidateQueries({ queryKey: ["getBlogPosts"] });
  }, [queryClient, t]);
  const handleDelete = useCallback(
    async (post: BlogPost) => {
      await deleteBlogPost(post);
      queryClient.invalidateQueries({ queryKey: ["getBlogPosts"] });
    },
    [queryClient]
  );
  const handleRestore = useCallback(
    async (post: BlogPost) => {
      await restoreBlogPost(post);
      queryClient.invalidateQueries({ queryKey: ["getBlogPosts"] });
    },
    [queryClient]
  );

  const unpublishedPosts = query.data?.filter(
    (post) => !post.published || post.deleted
  );

  return (
    <>
      <div>
        <NavLink to="/app/create/post">
          <Button type="button" size="small" variant="secondary" icon="plus">
            {t("Add new Post")}
          </Button>
        </NavLink>{" "}
        <br />
        <br />
      </div>
      <div className="PostsList">
        {query.isPending && <div>{t("Loading...")}</div>}
        {query.isError && <div>{t("Couldn't get your posts")}</div>}
        {query.data?.map((post: BlogPost, i: number) => (
          <PostListItem
            key={post.id || i}
            post={post}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        ))}
      </div>

      {unpublishedPosts && (
        <div className="Form__Submit">
          <Button
            variant="link"
            type="reset"
            className="Form__Discard"
            onClick={handleDiscard}
          >
            Discard changes
          </Button>
        </div>
      )}
    </>
  );
};

export default ContentBlogForm;
