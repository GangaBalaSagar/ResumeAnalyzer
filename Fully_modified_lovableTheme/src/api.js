import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

let requestInterceptorId = null;
let responseInterceptorId = null;
let isLoggingOut = false;

/**
 * Attach the Supabase bearer token and handle 401s globally.
 * Mirrors the uploaded Resume Analyzer Pro axios setup so the same
 * pendingAction retry pattern keeps working.
 */
export function setupApiInterceptor(session, signOut, openLoginModal, setPendingAction) {
  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId);
    requestInterceptorId = null;
  }
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId);
    responseInterceptorId = null;
  }

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
      if (status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        try {
          if (signOut && openLoginModal) {
            if (setPendingAction && error.config?.headers?.Authorization) {
              const retryAction = () => api.request(error.config);
              setPendingAction(retryAction);
            }
            await signOut();
            openLoginModal();
            try {
              sessionStorage.setItem(
                "authMessage",
                "Your session has expired. Please log in again."
              );
            } catch {}
          }
        } catch (signOutError) {
          console.error("API interceptor error:", signOutError);
        } finally {
          isLoggingOut = false;
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
