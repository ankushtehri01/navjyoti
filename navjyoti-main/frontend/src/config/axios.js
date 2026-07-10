/**
 * Configured Axios instance with:
 * - base URL + credentials (refresh cookie)
 * - access-token injection
 * - transparent 401 -> refresh -> retry, with a single-flight refresh queue
 * - normalized error shape for the UI/services layer
 */
import axios from 'axios';
import { env } from './env.js';
import { API } from '@/constants/api.js';
import { STORAGE_KEYS } from '@/constants/storageKeys.js';

/** Endpoints that must never trigger the 401 -> refresh flow. */
const NO_REFRESH_PATHS = [
  API.AUTH.LOGIN,
  API.AUTH.REGISTER,
  API.AUTH.REFRESH,
  API.AUTH.LOGOUT,
  API.AUTH.FORGOT_PASSWORD,
  API.AUTH.RESET_PASSWORD,
];

/** Broadcast so the app (route guards / providers) can react to a dead session. */
export const SESSION_EXPIRED_EVENT = 'nj:session-expired';

export const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
export const setAccessToken = (token) =>
  token
    ? localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
    : localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- Request: attach bearer token ----------
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Response: refresh-on-401 with single-flight queue ----------
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const skipRefresh = NO_REFRESH_PATHS.some((p) => original?.url?.includes(p));

    if (status === 401 && !original?._retry && !skipRefresh) {
      if (isRefreshing) {
        // Queue requests until the in-flight refresh resolves.
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post(API.AUTH.REFRESH);
        const newToken = data?.data?.accessToken;
        setAccessToken(newToken);
        flushQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        clearSession();
        // Let the app decide how to navigate (route guards handle redirects).
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
