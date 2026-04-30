import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8035/api",
});

/** Set from UnauthorizedBridge (inside Router) to redirect on invalid/expired token */
let onUnauthorized = () => {};

export function registerUnauthorizedHandler(fn) {
  onUnauthorized = typeof fn === "function" ? fn : () => {};
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url ?? "";

    if (
      status === 401 &&
      !reqUrl.includes("/login") &&
      !reqUrl.includes("/register")
    ) {
      localStorage.removeItem("token");
      onUnauthorized();
    }

    return Promise.reject(error);
  },
);

export default api;