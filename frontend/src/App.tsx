import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Theme from "components/common/Theme.tsx";
import LoginStateContext from "components/internal/LoginStateContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetScrollPosition } from "services/ui";

const queryClient = new QueryClient();

function MainApp() {
  const location = useLocation();

  useEffect(() => resetScrollPosition(), [location]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LoginStateContext>
          <Theme>
            <Router />
          </Theme>
        </LoginStateContext>
      </QueryClientProvider>
    </>
  );
}

export default MainApp;
