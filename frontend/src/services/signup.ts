import { AxiosError } from "axios";
import i18n from "i18n";
import api from "services/api";

export interface UserData {
  name: string;
  email: string;
  password: string;
  nickname: string;
  nickname_prefix: string;
  lang: string;
}

export const registerUser = async (data: UserData, termsAccepted: boolean) => {
  if (!termsAccepted) {
    throw new Error(i18n.t("You need to accept our terms and conditions"));
  }
  const response = await api.post("/register", {
    ...data,
    password_confirmation: data.password,
  });

  if (response instanceof AxiosError) {
    throw response;
  }

  return response;
};

export const getUserLang = () => {
  if (i18n.language.includes("en")) {
    return "en";
  }
  if (i18n.language.includes("es")) {
    return "es";
  }
  return "en";
};
