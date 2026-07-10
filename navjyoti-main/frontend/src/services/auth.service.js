/**
 * Auth API service. Thin, typed wrappers over the HTTP client.
 */
import { http } from './http.js';
import { API } from '@/constants/api.js';

export const authService = {
  register: (payload) => http.post(API.AUTH.REGISTER, payload),
  login: (payload) => http.post(API.AUTH.LOGIN, payload),
  logout: () => http.post(API.AUTH.LOGOUT),
  me: () => http.get(API.AUTH.ME),
  forgotPassword: (payload) => http.post(API.AUTH.FORGOT_PASSWORD, payload),
  resetPassword: (payload) => http.post(API.AUTH.RESET_PASSWORD, payload),
};

export default authService;
