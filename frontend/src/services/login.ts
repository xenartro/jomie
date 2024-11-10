import Bugsnag from "@bugsnag/js";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import User from "models/User";
import api from "services/api";

export interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

export const checkUser = async () => {
  try {
    const response = await api.get("/api/user");
    if (response.data?.data) {
      return new User(response.data?.data);
    }
  } catch (e) {
    console.error(e);
  }

  return null;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/login", data);
  if (response instanceof AxiosError) {
    Bugsnag.notify(response);
    throw response;
  }
  return response;
};

export const resetPasswordRequest = async (email: string) => {
  const response = await api.post("/forgot-password", { email });
  if (response instanceof AxiosError) {
    Bugsnag.notify(response);
    throw response;
  }
  return response;
};

interface ResetPasswordData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
export const resetPassword = async (data: ResetPasswordData) => {
  const response = await api.post("/reset-password", data);
  if (response instanceof AxiosError) {
    Bugsnag.notify(response);
    throw response;
  }
  return response;
};

export const logout = async () => {
  await api.post("/logout");
  Cookies.remove("XSRF-TOKEN");
};
