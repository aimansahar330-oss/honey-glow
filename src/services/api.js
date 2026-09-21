import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("honeyglow_admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* INVALID ADMIN TOKEN HANDLING */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const isAdminRequest =
        error.config?.url?.includes("/admin") ||
        error.config?.url?.includes("/categories/admin") ||
        error.config?.url?.includes("/products/admin");

      if (isAdminRequest) {
        localStorage.removeItem("honeyglow_admin_token");
        localStorage.removeItem("honeyglow_admin");

        if (
          window.location.pathname !== "/admin-login"
        ) {
          window.location.href = "/admin-login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;