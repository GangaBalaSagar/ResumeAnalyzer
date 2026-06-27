import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let requestInterceptorId = null;
let responseInterceptorId = null;
let isLoggingOut = false;

/**
 * Configure API interceptor with authentication token and session expiration handling
 * 
 * @param {Object} session - Supabase session object with access_token
 * @param {Function} signOut - Callback to sign out the user (from AuthContext)
 * @param {Function} openLoginModal - Callback to open login modal (from AuthModalContext)
 * @param {Function} setPendingAction - Callback to save an action to retry after auth
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
      const status = error.response?.status;

      if (status === 401) {
        if (isLoggingOut) {
          return Promise.reject(error);
        }

        isLoggingOut = true;

        try {
          if (signOut && openLoginModal) {
            if (setPendingAction && error.config) {
              const retryAction = () => api.request(error.config);
              setPendingAction(retryAction);
            }

            await signOut();
            openLoginModal();
            sessionStorage.setItem(
              "authMessage",
              "Your session has expired. Please log in again."
            );
          }
        } catch (signOutError) {
          console.error("❌ API error", signOutError);
        } finally {
          isLoggingOut = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export default api;
