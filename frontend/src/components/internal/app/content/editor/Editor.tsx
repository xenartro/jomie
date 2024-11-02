import { useAppContext } from "../../App";
import Preview from "../../Preview";
import "./Editor.scss";
import { useLoginState } from "components/internal/LoginStateContext";
import useMainNavType from "hooks/useMainNavType";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { setEditingSectionClass } from "services/ui";

/*
 * This will be the layout container for the Content Editor.
 * It should render settings components on the left and display
 * the preview on the right.
 */
const ContentEditor = () => {
  const [currentContent, setCurrentContent] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const { user } = useLoginState();
  const {
    refreshUnpublishedChanges,
    hasUnpublishedContents,
    setCurrentContent: setAppContent,
    reloadPreview,
  } = useAppContext();

  useEffect(() => {
    const currentContentStatus =
      user?.preferences[`${currentContent}_enabled`] === undefined
        ? undefined
        : Boolean(user?.preferences[`${currentContent}_enabled`]);
    setEditingSectionClass(currentContent, currentContentStatus);
    setAppContent(currentContent);
    return () => {
      setEditingSectionClass("");
      setAppContent("");
      setPreviewContent("");
    };
  }, [currentContent, setAppContent, user?.preferences]);

  const handlePreviewContentChange = useCallback(
    (newContent: string) => {
      setPreviewContent(newContent);
      reloadPreview();
    },
    [reloadPreview]
  );

  const navType = useMainNavType();
  const typeClassName = `--${navType}`;

  return (
    <div className="ContentEditor Row">
      <div className="Form Col --size6">
        <Outlet
          context={{
            refreshUnpublishedChanges,
            hasUnpublishedContents,
            setCurrentContent,
            setPreviewContent: handlePreviewContentChange,
            reloadPreview,
          }}
        />
      </div>
      <div className={`PreviewContainer Col --size6 --pos7 ${typeClassName}`}>
        <Preview
          published={false}
          section={currentContent}
          preview={previewContent}
        />
      </div>
    </div>
  );
};

interface ContentContextInterface {
  refreshUnpublishedChanges(): void;
  setCurrentContent(content: string): void;
  setPreviewContent(preview: string): void;
  hasUnpublishedContents: boolean;
  reloadPreview(): void;
}

export function useContentContext() {
  return useOutletContext<ContentContextInterface>();
}

export default ContentEditor;
