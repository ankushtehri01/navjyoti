import { http } from './http.js';
import { API } from '@/constants/api.js';

export const fundingInquiryService = {
  create: (payload) => http.post(API.FUNDING_INQUIRIES, payload),
};

export default fundingInquiryService;
