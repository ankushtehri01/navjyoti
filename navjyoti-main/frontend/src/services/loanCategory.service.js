import { http } from './http.js';
import { API } from '@/constants/api.js';

export const loanCategoryService = {
  list: (params) => http.get(API.LOAN_CATEGORIES, { params }),
  getBySlug: (slug) => http.get(`${API.LOAN_CATEGORIES}/${slug}`),
};

export default loanCategoryService;
