import { useLoginState } from "components/internal/LoginStateContext";
import {
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
  FC,
  useContext,
} from "react";
import {
  ThemeType,
  getSystemTheme,
  getUserTheme,
  setUserTheme,
} from "services/user";

const defaultTheme: ThemeType = getSystemTheme();

interface ThemeContextInterface {
  theme: ThemeType;
  switchTheme(p: ThemeType): void;
  previewTheme(p: ThemeType): void;
}
const ThemeContext = createContext<ThemeContextInterface>({
  theme: defaultTheme,
  switchTheme: () => {},
  previewTheme: () => {},
});

const Theme: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useLoginState();
  const [theme, setTheme] = useState<ThemeType>(getUserTheme(user));
  function switchTheme(theme: ThemeType) {
    setTheme(theme);
    if (user) {
      setUserTheme(user, theme);
    }
  }
  function previewTheme(theme: ThemeType) {
    setTheme(theme);
  }

  useEffect(() => {
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        switchTheme,
        previewTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const { theme, switchTheme, previewTheme } = useContext(ThemeContext);

  return { theme, switchTheme, previewTheme };
}

export default Theme;
