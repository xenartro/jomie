import { useLoginState } from "../LoginStateContext";
import Nav from "../layout/nav/Nav";
import Publish from "./publish/Publish";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FlexibleGridLayout from "components/common/layout/FlexibleGridLayout";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, Outlet, useOutletContext } from "react-router-dom";
import { UnpublishedType, getUnpublishedContents } from "services/content";
import { requiresInitialSetup } from "services/user";

interface AppContextInterface {
  refreshUnpublishedChanges(): void;
  hasUnpublishedContents: boolean;
  unpublishedChanges: string[];
  setCurrentContent(content: string): void;
  previewKey: string;
  reloadPreview(): void;
}

const App = () => {
  const { user } = useLoginState();
  const [publishOpen, setPublishOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState("preview");
  const [unpublishedChanges, setUnpublishedChanges] = useState<UnpublishedType>(
    user?.meta.unpublished || { content: [], visual: [] }
  );
  const [unpublishedList, setUnpublishedList] = useState<string[]>(
    user?.unpublishedList || []
  );
  const [currentContent, setCurrentContent] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    isSuccess,
    data: unpublished,
  } = useQuery({
    queryKey: ["unpublishedChanges"],
    queryFn: getUnpublishedContents,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      setUnpublishedChanges(unpublished);
      setUnpublishedList([...unpublished.content, ...unpublished.visual]);
    }
  }, [isSuccess, unpublished]);

  const refreshUnpublishedChanges = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["unpublishedChanges"] });
  }, [queryClient]);

  const togglePublish = useCallback(() => {
    setPublishOpen(!publishOpen);
  }, [publishOpen]);

  const reloadPreview = useCallback(() => {
    setPreviewKey(`${Math.random()}${Date.now()}`);
  }, []);

  useEffect(() => {
    if (requiresInitialSetup()) {
      navigate("/app/initial-setup");
    }
  }, [navigate]);

  return (
    <div>
      <Nav
        unpublishedChanges={unpublishedList}
        togglePublish={togglePublish}
        content={currentContent}
        reloadPreview={reloadPreview}
      />
      <Publish
        unpublishedChanges={unpublishedChanges}
        open={publishOpen}
        toggle={togglePublish}
        loading={isLoading}
        error={!!error}
      />
      <FlexibleGridLayout>
        <Outlet
          context={{
            hasUnpublishedContents: unpublishedList.length > 0,
            unpublishedChanges: unpublishedList,
            refreshUnpublishedChanges,
            setCurrentContent,
            previewKey,
            reloadPreview,
          }}
        />
      </FlexibleGridLayout>
    </div>
  );
};

export function useAppContext() {
  return useOutletContext<AppContextInterface>();
}

export default App;
