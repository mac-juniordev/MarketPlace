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

// Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Listing API
export const listingApi = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  search: (query, page, pageSize) => api.get('/listings/search', { params: { query, page, pageSize } }),
  getFeatured: (count) => api.get('/listings/featured', { params: { count } }),
  getHot: (count) => api.get('/listings/hot', { params: { count } }),
  getByCategory: (categoryId) => api.get(`/listings/category/${categoryId}`),
  getByBusiness: (businessId) => api.get(`/listings/business/${businessId}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// Category API
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

// Business API
export const businessApi = {
  create: (data) => api.post('/businesses', data),
  getById: (id) => api.get(`/businesses/${id}`),
  getMyBusinesses: () => api.get('/businesses/my'),
  update: (id, data) => api.put(`/businesses/${id}`, data),
};

// Reservation API
export const reservationApi = {
  create: (data) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my'),
  getByListing: (listingId) => api.get(`/reservations/listing/${listingId}`),
  cancel: (id) => api.post(`/reservations/${id}/cancel`),
};

// Review API
export const reviewApi = {
  getByListing: (listingId) => api.get(`/reviews/listing/${listingId}`),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  create: (data) => api.post('/reviews', data),
};

// Report API
export const reportApi = {
  create: (data) => api.post('/reports', data),
};

// User API
export const userApi = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

// Notification API
export const notificationApi = {
  getMyNotifications: (unreadOnly = false) => api.get('/notifications', { params: { unreadOnly } }),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
};

// Admin API
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getSellers: () => api.get('/admin/sellers'),
  createSeller: (data) => api.post('/admin/sellers', data),
  suspendSeller: (id) => api.post(`/admin/sellers/${id}/suspend`),
  deleteSeller: (id) => api.delete(`/admin/sellers/${id}`),
};

// Upload API
export const uploadApi = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;