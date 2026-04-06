import axios from "axios";

const normalizeBaseUrl = (value = "") => {
  const trimmedValue = value.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1).trim();
  }

  return trimmedValue;
};

const configuredBaseURL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || "");
const baseURL = (configuredBaseURL || "").replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL: baseURL || undefined,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
