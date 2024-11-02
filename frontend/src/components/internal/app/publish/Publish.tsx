import "./Publish.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import DangerousActionButton from "components/common/dangerous-action-button/DangerousActionButton";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  UnpublishedType,
  discardContents,
  publishContents,
} from "services/content";

interface Props {
  open: boolean;
  loading: boolean;
  error: boolean;
  toggle(): void;
  unpublishedChanges: UnpublishedType;
}

const UnpublishedContentsList: FC<
  Pick<Props, "unpublishedChanges" | "toggle" | "loading" | "error">
> = ({ unpublishedChanges, toggle, loading, error }) => {
  const [publishHidden, setPublishHidden] = useState(false);
  const [discardHidden, setDiscardHidden] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: publishContents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unpublishedChanges"] });
      window.location.reload();
    },
  });
  const discardMutation = useMutation({
    mutationFn: discardContents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unpublishedChanges"] });
      window.location.reload();
    },
  });
  const publish = useCallback(() => {
    publishMutation.mutate();
  }, [publishMutation]);
  const discard = useCallback(() => {
    discardMutation.mutate();
  }, [discardMutation]);
  const hidePublish = useCallback(() => {
    setPublishHidden(true);
  }, []);
  const hideDiscard = useCallback(() => {
    setDiscardHidden(true);
  }, []);
  const resetHide = useCallback(() => {
    setPublishHidden(false);
    setDiscardHidden(false);
  }, []);

  if (loading) {
    return <div>{t("Checking your recent changes...")}</div>;
  }

  if (error) {
    return <div>{t("Your personal site has unpublished changes.")}</div>;
  }

  if (
    !unpublishedChanges?.content.length &&
    !unpublishedChanges?.visual.length
  ) {
    return (
      <div className="Publish__Modal__Content">
        <div className="Publish__Modal__Close">
          <Button variant="link" icon="cross" onClick={toggle} iconRight />
        </div>
        <div>{t("Your personal site is up to date ✅.")}</div>
      </div>
    );
  }

  return (
    <div className="Publish__Modal__Content">
      <div className="Publish__Modal__Close">
        <Button variant="link" icon="cross" onClick={toggle} iconRight></Button>
      </div>
      <h5>{t("You have unpublished updates")}</h5>
      <p className="p --s">
        {t("You recently updated the following contents:")}
      </p>
      <div className="Publish__Modal__UpdatesList">
        <ul>
          {unpublishedChanges.content.map((change) => (
            <li key={change}>
              <Link to={`/app/content/${change}`}>{t(change)}</Link>
            </li>
          ))}
          {unpublishedChanges.visual.map((change) => (
            <li key={change}>
              <Link to={`/app/visuals/${change}`}>{t(change)}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {!publishHidden && (
          <DangerousActionButton
            onClick={publish}
            onConfirm={hideDiscard}
            onCancel={resetHide}
            variant="main"
            message="Do you wish to publish your changes?"
          >
            Publish
          </DangerousActionButton>
        )}
        {!discardHidden && (
          <DangerousActionButton
            onClick={discard}
            onConfirm={hidePublish}
            onCancel={resetHide}
            variant="ghost"
            message="Do you wish to discard your changes?"
          >
            Discard
          </DangerousActionButton>
        )}
      </div>
    </div>
  );
};

const Publish = ({ open, ...rest }: Props) => {
  if (!open) {
    return null;
  }
  return (
    <div className="Publish__Modal">
      <UnpublishedContentsList {...rest} />
    </div>
  );
};

export default Publish;
