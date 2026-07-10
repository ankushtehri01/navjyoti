import { http } from './http.js';
import { API } from '@/constants/api.js';

export const contactService = {
  create: (payload) => http.post(API.CONTACTS, payload),
};

export default contactService;
