import axios from "axios";

const APP_ENV = (typeof process !== "undefined" && process.env.REACT_APP_ENV) || (typeof import.meta !== "undefined" && import.meta.env && (import.meta.env.VITE_APP_ENV || import.meta.env.REACT_APP_ENV)) || "production";

let IMAGE_BASE_URL = "";
let BASE_URL = "";
let server = "";

switch (APP_ENV) {
  case "dev":
    IMAGE_BASE_URL = "http://192.168.1.14:2001/public";
    BASE_URL = "http://192.168.1.14:2001/api/website";
    server = "http://192.168.1.14:2001";
    break;

  case "production":
    IMAGE_BASE_URL = "http://http://65.0.84.181:5003/public";
    BASE_URL = "http://65.0.84.181:5003/api/website";
    server = "http://65.0.84.181:5003";
    break;

  case "local":
  default:
    IMAGE_BASE_URL = "http://192.168.1.33:2001/public";
    BASE_URL = "http://192.168.1.33:2001/api/website";
    server = "http://192.168.1.33:2001";
    break;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("login") &&
      !error.config.url.includes("verify-move") &&
      !window.location.pathname.includes("sign-in")
    ) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

const getImageUrl = (path) => {
  if (!path) return "";
  if (typeof path === "object" && path.path) {
    path = path.path;
  }
  if (typeof path !== "string") return "";
  
  if (path.startsWith("http")) return path;
  if (path.startsWith("/public")) {
    return `${server}${path}`;
  }
  if (path.startsWith("public")) {
    return `${server}/${path}`;
  }
  return `${IMAGE_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

export { IMAGE_BASE_URL, BASE_URL, server, apiClient, apiClient as api, apiClient as clientApi, BASE_URL as API_URL, BASE_URL as CLIENT_API_URL, getImageUrl };

export default apiClient;