import { ThemeOptions } from "./user";
import User from "models/User";
import api from "services/api";

interface SiteData extends Pick<User, "nickname" | "nickname_prefix"> {
  meta_title: string;
  meta_description: string;
}

export async function updateSite(data: SiteData) {
  await api.post("/api/settings/site", {
    data,
  });
}

interface AccountData extends Pick<User, "name"> {
  password: string;
  password_confirmation?: string;
  theme: ThemeOptions;
  lang: "es" | "en" | "";
}

export async function updateAccount(data: AccountData) {
  if (data.password) {
    data.password_confirmation = data.password;
  }
  await api.post("/api/settings/account", {
    data,
  });
}
