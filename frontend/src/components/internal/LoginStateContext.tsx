import { useQuery, useQueryClient } from "@tanstack/react-query";
import ServerError from "components/common/error/ServerError";
import AppWarmup from "components/common/loading/AppWarmup";
import User from "models/User";
import {
  useContext,
  createContext,
  PropsWithChildren,
  FC,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import { checkUser } from "services/login";
import { init } from "services/user";

/*
 * The user can be a User, null, or undefined.
 * undefined: means we're asking the API if there's a user, so we need to display a loading/waiting
 * state.
 * null: means there's no logged in user.
 */
const UserContext = createContext<{
  user: User | null | undefined;
  refresh: () => void;
}>({ user: undefined, refresh: () => {} });

const LoginStateContext: FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const {
    isFetching,
    error,
    data: user,
    isSuccess,
    isRefetching,
    isError,
  } = useQuery({
    queryKey: ["loggedUser"],
    queryFn: checkUser,
    gcTime: 5 * 60 * 1000,
    staleTime: 14 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (isRefetching) {
      return;
    }
    if (isSuccess) {
      init(user);
      if (user?.preferences.lang) {
        i18n.changeLanguage(user?.preferences.lang);
      }
      setInitialized(true);
    } else if (isError) {
      init(null);
      setInitialized(true);
    }
  }, [i18n, isError, isRefetching, isSuccess, user]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["loggedUser"] });
  }, [queryClient]);

  if (!initialized && isFetching) {
    return <AppWarmup />;
  }

  if (error) {
    return <ServerError />;
  }

  if (!initialized) {
    return <AppWarmup />;
  }

  return (
    <UserContext.Provider value={{ user, refresh }}>
      {children}
    </UserContext.Provider>
  );
};

export default LoginStateContext;

export function useLoginState() {
  const { user, refresh } = useContext(UserContext);

  return { user, refresh };
}
