import axios from "axios";

// CRA exposes only environment variables prefixed with REACT_APP_ to browser code.
// The fallback keeps the existing local-development workflow working.
export const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

// Older modules use relative axios URLs. Point them at the same API deployment.
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Existing fetch calls used a hard-coded local API URL. Centralising the rewrite
// prevents the deployed browser from trying to connect to its own localhost.
const originalFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
  const requestUrl =
    typeof input === "string"
      ? input.replace(/^http:\/\/localhost:8080(?=\/|$)/, API_URL)
      : input;

  const isApiRequest =
    typeof requestUrl === "string" && requestUrl.startsWith(API_URL);
  const headers = new Headers(init.headers || {});
  const token = localStorage.getItem("access");
  if (isApiRequest && token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return originalFetch(requestUrl, {
    ...init,
    headers,
    credentials: isApiRequest ? init.credentials || "include" : init.credentials,
  });
};
