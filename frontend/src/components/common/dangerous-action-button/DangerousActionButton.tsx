import Button, { ButtonVariantType } from "../button/Button";
import "./DangerousActionButton.scss";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  variant?: ButtonVariantType;
  message: string;
  size?: "small" | "big" | undefined;
  onClick(): void;
  onConfirm?(): void;
  onCancel?(): void;
}

const DangerousActionButton: FC<PropsWithChildren<Props>> = ({
  children,
  variant = "secondary",
  size = "small",
  message,
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
      <div className="DangerousActionButton">
        <p className="DangerousActionButton__Message p --s">{t(message)}</p>
        <Button variant="main" size="small" onClick={handleDangerousAction}>
          Yes
        </Button>
        <Button variant="ghost" size="small" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={displayConfirmation}
    >{`${children}`}</Button>
  );
};

export default DangerousActionButton;
