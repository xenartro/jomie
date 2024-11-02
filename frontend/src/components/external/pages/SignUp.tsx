import SignUpForm from "../sign-up/SignUpForm";
import Button from "components/common/button/Button";
import SideColumnLayout from "components/external/layout/SideColumnLayout";
import Header from "components/external/layout/header/Header";
import { useLoginState } from "components/internal/LoginStateContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";

const SignUp = () => {
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
      <h4>{t("Create your free account.")}</h4>
      <SignUpForm />
      <div className="BottomContent">
        <p className="p --s  --only">{t("Already have an account?")}</p>
        <Link to="/login">
          <Button
            type="button"
            size="small"
            variant="secondary"
            icon="arrow-right"
            iconRight
          >
            Log In
          </Button>
        </Link>
      </div>
    </SideColumnLayout>
  );
};

export default SignUp;
