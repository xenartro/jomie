import LoginForm from "../login/LoginForm";
import ResetPasswordForm from "../login/ResetPasswordForm";
import Button from "components/common/button/Button";
import SideColumnLayout from "components/external/layout/SideColumnLayout";
import Header from "components/external/layout/header/Header";
import { useLoginState } from "components/internal/LoginStateContext";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const { user, refresh } = useLoginState();
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleForgot = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    setForgot(true);
  }, []);

  const handleRemember = useCallback((e?: SyntheticEvent) => {
    e?.preventDefault();
    setForgot(false);
  }, []);

  if (user) {
    return <Navigate to="/app" />;
  }

  return (
    <SideColumnLayout>
      <Header version="logoOnly" />
      <h4>{t(forgot ? "Request password reset" : "Welcome back.")}</h4>
      {forgot ? <ResetPasswordForm cancel={handleRemember} /> : <LoginForm />}
      <p className="p --s --mt">
        {forgot ? (
          <a href="/login" onClick={handleRemember}>
            {t("I remember my password")}
          </a>
        ) : (
          <a href="/login" onClick={handleForgot}>
            {t("Forgot your password?")}
          </a>
        )}
      </p>
      <div className="BottomContent">
        <p className="p --s --only">
          {t("New to Jomie? Create your account for free.")}
        </p>
        <Link to="/sign-up">
          <Button
            type="button"
            size="small"
            variant="secondary"
            icon="arrow-right"
            iconRight
          >
            Create account
          </Button>
        </Link>
      </div>
    </SideColumnLayout>
  );
};

export default Login;
