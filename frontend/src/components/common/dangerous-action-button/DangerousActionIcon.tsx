import Button, { ButtonVariantType } from "../button/Button";
import "./DangerousActionButton.scss";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  variant?: ButtonVariantType;
  size?: "small" | "big" | undefined;
  icon: string;
  title?: string;
  onClick(): void;
  onConfirm?(): void;
  onCancel?(): void;
}

const DangerousActionIcon: FC<PropsWithChildren<Props>> = ({
  title,
  variant = "ghost",
  size = "small",
  icon,
  onClick,
  onConfirm,
  onCancel,
}) => {
  const [confirm, setConfirm] = useState(false);
  const { t } = useTranslation();

  const displayConfirmation = useCallback(() => {
    setConfirm(true);
    if (onConfirm) {
      onConfirm();
    }
  }, [onConfirm]);
  const handleDangerousAction = useCallback(() => {
    onClick();
    setConfirm(false);
  }, [onClick]);
  const handleCancel = useCallback(() => {
    setConfirm(false);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  if (confirm) {
    return (
      <div>
        <Button
          variant="main"
          size="small"
          title={t("Remove")}
          onClick={handleDangerousAction}
        >
          👍
        </Button>
        <Button
          variant="ghost"
          size="small"
          title={t("Cancel")}
          onClick={handleCancel}
        >
          👎
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      icon={icon}
      onClick={displayConfirmation}
      title={title}
    />
  );
};

export default DangerousActionIcon;
