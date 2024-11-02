import LoginForm from "../login/LoginForm";
import Button from "components/common/button/Button";
import SideColumnLayout from "components/external/layout/SideColumnLayout";
import Header from "components/external/layout/header/Header";
import { useLoginState } from "components/internal/LoginStateContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const { user, refresh } = useLoginState();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (user) {
    return <Navigate to="/app" />;
  }

  return (
    <SideColumnLayout>
      <Header version="logoOnly" />
      <h4>{t("Welcome back.")}</h4>
      <LoginForm />
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
