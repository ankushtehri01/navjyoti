/**
 * Thin wrapper over the axios instance that unwraps the standard
 * { success, message, data } envelope and normalizes errors so callers
 * (services, hooks, React Query) get predictable shapes.
 */
import api from '@/config/axios.js';

/** @typedef {{ message: string, errors: Array, status: number }} NormalizedError */

const normalizeError = (error) => {
  const res = error?.response;
  const normalized = new Error(
    res?.data?.message || error.message || 'Request failed'
  );
  normalized.status = res?.status || 0;
  normalized.errors = res?.data?.errors || [];
  return normalized;
};

const request = async (config) => {
  try {
    const { data } = await api.request(config);
    return data?.data ?? data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const http = {
  get: (url, config) => request({ ...config, method: 'GET', url }),
  post: (url, body, config) => request({ ...config, method: 'POST', url, data: body }),
  put: (url, body, config) => request({ ...config, method: 'PUT', url, data: body }),
  patch: (url, body, config) => request({ ...config, method: 'PATCH', url, data: body }),
  delete: (url, config) => request({ ...config, method: 'DELETE', url }),
};

export default http;
