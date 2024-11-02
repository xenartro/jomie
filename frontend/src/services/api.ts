import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { DataType } from "helpers/forms";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
});

const onRequest = (config: AxiosRequestConfig) => {
  if (
    (config.method === "post" ||
      config.method === "put" ||
      config.method === "delete") &&
    !Cookies.get("XSRF-TOKEN")
  ) {
    return setCSRFToken().then(() => config);
  }
  return config;
};

const setCSRFToken = () => {
  return axiosInstance.get("/sanctum/csrf-cookie");
};

function onError(error: AxiosError) {
  const href = window.location.href;
  if (
    error &&
    error.response?.status === 401 &&
    !href.includes("/login") &&
    href.includes("/app")
  ) {
    window.location.assign("/login");
  }
  return error;
}

// attach your interceptor
axiosInstance.interceptors.request.use(onRequest);

axiosInstance.interceptors.response.use((r) => r, onError);

export default axiosInstance;

export const getNoop = async () => ({
  isLoading: false,
  error: false,
  data: null,
});

export const postFormData = async <T = null>(
  url: string,
  data: DataType,
  fileInputIds: string[] = []
) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, `${value}`);
  }
  for (const fileId of fileInputIds) {
    const fileInput = document.getElementById(
      fileId
    ) as HTMLInputElement | null;
    if (fileInput?.files?.length) {
      formData.append(`${fileInput.getAttribute("name")}`, fileInput.files[0]);
    }
  }

  return await axiosInstance.post<T>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
