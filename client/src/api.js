import axios from "axios";
import { isProtectedAppRoute, setAuthNotice } from "./utils/authSession.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000,
});

let requestInterceptorId = null;
let responseInterceptorId = null;
let isLoggingOut = false;

/**
 * Attach the Supabase bearer token and handle 401s globally.
 * Mirrors the uploaded Resume Analyzer Pro axios setup so the same
 * pendingAction retry pattern keeps working.
 */
export function setupApiInterceptor(
  session,
  signOut,
  openLoginModal,
  setPendingAction,
  pathname = ""
) {
  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId);
    requestInterceptorId = null;
  }
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
    responseInterceptorId = null;
  }

  const getPathname = () => {
    try {
      return window.location.pathname;
    } catch {
      return pathname;
    }
  };

  requestInterceptorId = api.interceptors.request.use(
    (config) => {
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  responseInterceptorId = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const isNetworkError = !error.response;
      if (status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        try {
          if (signOut && openLoginModal) {
            const hasAuthHeader = Boolean(error.config?.headers?.Authorization);
            const shouldPrompt =
              hasAuthHeader || isProtectedAppRoute(getPathname());

            if (shouldPrompt && setPendingAction && hasAuthHeader) {
              const retryAction = () => api.request(error.config);
              setPendingAction(retryAction);
            }
            if (shouldPrompt) {
              setAuthNotice("Your session has expired. Please sign in again.");
            }
            await signOut();
            if (shouldPrompt) {
              openLoginModal("Your session has expired. Please sign in again.");
            }
          }
        } catch (signOutError) {
          console.error("API interceptor error:", signOutError);
        } finally {
          isLoggingOut = false;
        }
      }
      // Network error: backend unreachable
      if (isNetworkError && !isLoggingOut) {
        setAuthNotice("Cannot reach the server. Please check your connection.");
      }
      return Promise.reject(error);
    }
  );
}

export default api;
