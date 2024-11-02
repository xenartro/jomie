import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  diffSourcePlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { MDXEditor } from "@mdxeditor/editor/MDXEditor";
import "@mdxeditor/editor/style.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "components/common/Theme";
import Button from "components/common/button/Button";
import DangerousActionButton from "components/common/dangerous-action-button/DangerousActionButton";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { DataType, SetDataType, handleInputChange } from "helpers/forms";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  BlogPost,
  deleteBlogPost,
  getBlogPost,
  postImageUploadHandler,
  restoreBlogPost,
  saveBlogPost,
} from "services/content";

const EditPost = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["getBlogPost"],
    queryFn: async () => {
      if (!id) {
        return;
      }
      const post = await getBlogPost(parseInt(id));
      if (post) {
        setPost(post);
        return post;
      } else {
        navigate("/app/content/posts");
      }
    },
    enabled: Boolean(id),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [post, setPost] = useState<BlogPost | null>(
    !id
      ? {
          title: t("New post"),
          content: t("New post content here!"),
          published: 0,
        }
      : null
  );
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const handleSubmit = useCallback(async () => {
    if (!post) {
      return;
    }
    const updatedPost = await saveBlogPost(post, "image-field");
    if (updatedPost) {
      setPost(updatedPost);
    }
    queryClient.invalidateQueries({ queryKey: ["getBlogPosts"] });
  }, [post, queryClient]);
  const handleDelete = useCallback(async () => {
    if (!post) {
      return;
    }
    await deleteBlogPost(post);
    queryClient.invalidateQueries({ queryKey: ["getBlogPosts"] });
    navigate("/app/content/posts");
  }, [navigate, post, queryClient]);
  const handleRestore = useCallback(async () => {
    if (!post) {
      return;
    }
    await restoreBlogPost(post);
    queryClient.invalidateQueries({ queryKey: ["getBlogPosts"] });
  }, [post, queryClient]);

  const handlePostContentChange = useCallback(
    (content: string) => {
      if (!post) {
        return;
      }
      setPost({ ...post, content });
    },
    [post]
  );

  if (!post) {
    return t("Asking the server for your amazing post, one second.");
  }

  if (query.isError) {
    return t("Failed to retrieve your post. Please try again later.");
  }

  return (
    <Form className="Post__Form" onSubmit={handleSubmit}>
      <div className="Post__Body">
        <div className="Post__MainCol">
          <FieldLabel htmlFor="title-field" label="Title">
            <Input
              id="title-field"
              name="title"
              required
              type="text"
              value={post.title}
              onChange={handleInputChange.bind(
                null,
                post as unknown as DataType,
                setPost as unknown as SetDataType
              )}
            />
          </FieldLabel>
          <FieldLabel label="Content">
            <MDXEditor
              className={theme === "dark" ? "dark-theme" : ""}
              markdown={post.content}
              onChange={handlePostContentChange}
              plugins={[
                diffSourcePlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin({
                  imageUploadHandler: postImageUploadHandler.bind(
                    null,
                    post.id
                  ),
                }),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <BoldItalicUnderlineToggles />
                      <BlockTypeSelect />
                      <CreateLink />
                      <InsertImage />
                    </>
                  ),
                }),
              ]}
            />
          </FieldLabel>
        </div>

        <div className="Post__SecondaryCol">
          <FieldLabel htmlFor="image-field" label="Cover image">
            <Input
              id="image-field"
              name="image"
              type="file"
              accept=".png,.jpg"
              onChange={handleInputChange.bind(
                null,
                post as unknown as DataType,
                setPost as unknown as SetDataType
              )}
            />
          </FieldLabel>
          {post.image && (
            <div>
              <img
                src={`${import.meta.env.VITE_APP_URL}/storage/images/${
                  post.image
                }`}
                alt={`Post image`}
                width="100%"
                height="auto"
              />
            </div>
          )}
        </div>
      </div>
      <div className="Post__Actions">
        {post.id && !post.deleted && (
          <a
            href={`${import.meta.env.VITE_APP_URL}/render?section=posts`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="small" variant="ghost" icon="preview">
              Preview Post
            </Button>
          </a>
        )}

        {post.id !== undefined && post.deleted !== 1 && !post.edited_id && (
          <DangerousActionButton
            onClick={handleDelete}
            message={t("Are you sure you want to delete this post?")}
            size="small"
            variant="ghost"
          >
            Delete Post
          </DangerousActionButton>
        )}
        {post.edited_id != null && (
          <DangerousActionButton
            onClick={handleDelete}
            message={t("Are you sure you want discard your changes?")}
            size="small"
            variant="ghost"
          >
            Discard Changes
          </DangerousActionButton>
        )}
        {post.deleted === 1 && (
          <DangerousActionButton
            onClick={handleRestore}
            message={t("Are you sure you want to restore this post?")}
            size="small"
            variant="ghost"
          >
            Restore Post
          </DangerousActionButton>
        )}

        <Button type="submit" size="small">
          {post.id ? "Update Post" : "Save Post"}
        </Button>
      </div>
    </Form>
  );
};

export default EditPost;
