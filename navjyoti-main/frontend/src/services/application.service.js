import { http } from './http.js';
import { API } from '@/constants/api.js';

export const applicationService = {
  list: (params) => http.get(API.APPLICATIONS, { params }),
  get: (id) => http.get(`${API.APPLICATIONS}/${id}`),
  create: (payload) => http.post(API.APPLICATIONS, payload),
  stats: () => http.get(`${API.APPLICATIONS}/stats/me`),
};

export default applicationService;
