import { http } from './http.js';
import { API } from '@/constants/api.js';

export const documentService = {
  list: (params) => http.get(API.DOCUMENTS, { params }),
  upload: (formData) =>
    http.post(API.DOCUMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id) => http.delete(`${API.DOCUMENTS}/${id}`),
};

export default documentService;
