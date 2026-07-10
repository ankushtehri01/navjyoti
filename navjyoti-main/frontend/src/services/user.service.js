import { http } from './http.js';
import { API } from '@/constants/api.js';

export const userService = {
  updateProfile: (payload) => http.put(API.ME, payload),
  changePassword: (payload) => http.put(API.ME_PASSWORD, payload),
  uploadAvatar: (formData) =>
    http.post(API.ME_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default userService;
