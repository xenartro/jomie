import { InitialSetupInterface, storeSetup } from "./initialSetup";
import User from "models/User";
import api from "services/api";

let initialSetupCompleted = false;
let initialSetupSkipped = false;
export function requiresInitialSetup() {
  if (initialSetupSkipped) {
    return false;
  }
  return !initialSetupCompleted;
}

export async function completeInitialSetup(data: InitialSetupInterface) {
  initialSetupCompleted = true;
  await storeSetup(data);
}

export async function skipInitialSetup() {
  initialSetupSkipped = true;
  try {
    await api.post("/api/user/skip-setup");
  } catch (e) {
    console.error("skipInitialSetup", e);
  }
}

export function getSystemTheme(): ThemeType {
  let theme: ThemeType = "light";
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    theme = "dark";
  }
  return theme;
}

export type ThemeType = "light" | "dark";
export type ThemeOptions = "light" | "dark" | "auto";
export async function setUserTheme(user: User, theme: ThemeOptions) {
  user.preferences.theme_name = theme;
  try {
    await api.post("/api/user/set-theme", {
      data: theme,
    });
  } catch (e) {
    console.error("setUserTheme", e);
  }
}
export function getUserTheme(user: User | undefined | null) {
  if (!user) {
    return getSystemTheme();
  }
  switch (user.preferences.theme_name) {
    case "light":
    case "dark":
      return user.preferences.theme_name;
    case "auto":
    default:
      return getSystemTheme();
  }
}

export function init(user: User | null | undefined) {
  if (!user) {
    return;
  }

  initialSetupSkipped = Boolean(user.preferences?.setup_skipped);
  initialSetupCompleted = Boolean(user.preferences?.setup_completed);
}

export async function updatePreferences(
  preference: string,
  value: string | number | boolean
) {
  await api.post("/api/user/preferences", {
    data: {
      preference,
      value,
    },
  });
}
