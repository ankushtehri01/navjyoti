import { http } from './http.js';
import { API } from '@/constants/api.js';

export const notificationService = {
  list: (params) => http.get(API.NOTIFICATIONS, { params }),
  markRead: (id) => http.patch(`${API.NOTIFICATIONS}/${id}/read`),
  markAllRead: () => http.post(`${API.NOTIFICATIONS}/read-all`),
};

export default notificationService;
