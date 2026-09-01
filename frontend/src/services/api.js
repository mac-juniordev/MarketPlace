// Import axios
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5269/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export API methods
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const listingApi = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  search: (query, page, pageSize) => api.get('/listings/search', { params: { query, page, pageSize } }),
  getFeatured: (count) => api.get('/listings/featured', { params: { count } }),
  getByCategory: (categoryId) => api.get(`/listings/category/${categoryId}`),
  getByBusiness: (businessId) => api.get(`/listings/business/${businessId}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

export const businessApi = {
  create: (data) => api.post('/businesses', data),
  getById: (id) => api.get(`/businesses/${id}`),
  getMyBusinesses: () => api.get('/businesses/my'),
  update: (id, data) => api.put(`/businesses/${id}`, data),
};

export const reservationApi = {
  create: (data) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my'),
  cancel: (id) => api.post(`/reservations/${id}/cancel`),
};

export const reviewApi = {
  getByListing: (listingId) => api.get(`/reviews/listing/${listingId}`),
  create: (data) => api.post('/reviews', data),
};

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getSellers: () => api.get('/admin/sellers'),
  createSeller: (data) => api.post('/admin/sellers', data),
  suspendSeller: (id) => api.post(`/admin/sellers/${id}/suspend`),
  deleteSeller: (id) => api.delete(`/admin/sellers/${id}`),
};

export default api;