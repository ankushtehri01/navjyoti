/**
 * Generic REST resource-service factory. Produces standard CRUD methods over a
 * base path so entity services stay one line each (DRY).
 *
 *   const blogService = createResource('/blogs');
 *   blogService.list({ page, search }); blogService.create(payload); ...
 */
import { http } from './http.js';

export const createResource = (basePath) => ({
  list: (params) => http.get(basePath, { params }),
  get: (id) => http.get(`${basePath}/${id}`),
  create: (payload) => http.post(basePath, payload),
  update: (id, payload) => http.put(`${basePath}/${id}`, payload),
  patch: (id, payload) => http.patch(`${basePath}/${id}`, payload),
  remove: (id) => http.delete(`${basePath}/${id}`),
});

export default createResource;
