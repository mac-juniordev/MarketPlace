import axios from 'axios';

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5269/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// AUTH TOKEN INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// AUTH API
// ============================================================

export const authApi = {
  register: (data) =>
    api.post('/auth/register', data),

  login: (data) =>
    api.post('/auth/login', data),
};

// ============================================================
// LISTING API
// ============================================================

export const listingApi = {
  // Get all listings
  getAll: () =>
    api.get('/listings'),

  // Get listing by ID
  getById: (id) =>
    api.get(`/listings/${id}`),

  // Search listings
  search: (query, page = 1, pageSize = 20) =>
    api.get('/listings/search', {
      params: {
        query,
        page,
        pageSize,
      },
    }),

  // Featured listings
  getFeatured: (count = 10) =>
    api.get('/listings/featured', {
      params: {
        count,
      },
    }),

  // Hot listings
  getHot: (count = 8) =>
    api.get('/listings/hot', {
      params: {
        count,
      },
    }),

  // Listings by category
  getByCategory: (categoryId) =>
    api.get(`/listings/category/${categoryId}`),

  // Listings by business
  getByBusiness: (businessId) =>
    api.get(`/listings/business/${businessId}`),

  // Business catalogue
  getBusinessCatalogue: (businessId) =>
    api.get(`/listings/business/${businessId}/catalogue`),

  // Seller statistics
  getSellerStats: () =>
    api.get('/listings/seller-stats'),

  // Create listing
  create: (data) =>
    api.post('/listings', data),

  // Update listing
  update: (id, data) =>
    api.put(`/listings/${id}`, data),

  // Delete listing
  delete: (id) =>
    api.delete(`/listings/${id}`),
};

// ============================================================
// CATEGORY API
// ============================================================

export const categoryApi = {
  // Get all categories
  getAll: () =>
    api.get('/categories'),

  // Get category by ID
  getById: (id) =>
    api.get(`/categories/${id}`),

  // Get category by slug
  getBySlug: (slug) =>
    api.get(`/categories/slug/${slug}`),
};

// ============================================================
// BUSINESS API
// ============================================================

export const businessApi = {
  // Create business
  create: (data) =>
    api.post('/businesses', data),

  // Get business by ID
  getById: (id) =>
    api.get(`/businesses/${id}`),

  // Get current seller's businesses
  getMyBusinesses: () =>
    api.get('/businesses/my'),

  // Update business
  update: (id, data) =>
    api.put(`/businesses/${id}`, data),
};

// ============================================================
// RESERVATION API
// ============================================================

export const reservationApi = {
  // Create reservation
  create: (data) =>
    api.post('/reservations', data),

  // Get current user's reservations
  getMyReservations: () =>
    api.get('/reservations/my'),

  // Get reservations for a listing
  getByListing: (listingId) =>
    api.get(`/reservations/listing/${listingId}`),

  // Cancel reservation
  cancel: (id) =>
    api.post(`/reservations/${id}/cancel`),

  // Complete reservation
  complete: (id) =>
    api.post(`/reservations/${id}/complete`),
};

// ============================================================
// REVIEW API
// ============================================================

export const reviewApi = {
  // Get reviews for listing
  getByListing: (listingId) =>
    api.get(`/reviews/listing/${listingId}`),

  // Get reviews by user
  getByUser: (userId) =>
    api.get(`/reviews/user/${userId}`),

  // Create review
  create: (data) =>
    api.post('/reviews', data),
};

// ============================================================
// REPORT API
// ============================================================

export const reportApi = {
  // Create listing report
  create: (data) =>
    api.post('/reports', data),

  // Create seller report
  createSellerReport: (data) =>
    api.post('/reports/seller', data),

  // Get pending reports
  getPending: () =>
    api.get('/reports/pending'),

  // Resolve report
  resolve: (id, status = 3, adminNotes = '') =>
    api.post(`/reports/${id}/resolve`, {
      status,
      adminNotes,
    }),

  // Dismiss report
  dismiss: (id, adminNotes = '') =>
    api.post(`/reports/${id}/resolve`, {
      status: 4,
      adminNotes,
    }),
};

// ============================================================
// USER API
// ============================================================

export const userApi = {
  // Get current user
  getMe: () =>
    api.get('/users/me'),

  // Update current user
  updateProfile: (data) =>
    api.put('/users/me', data),
};

// ============================================================
// NOTIFICATION API
// ============================================================

export const notificationApi = {
  // Get notifications
  getMyNotifications: (unreadOnly = false) =>
    api.get('/notifications', {
      params: {
        unreadOnly,
      },
    }),

  // Mark notification as read
  markAsRead: (id) =>
    api.post(`/notifications/${id}/read`),
};

// ============================================================
// ADMIN API
// ============================================================

export const adminApi = {
  // Dashboard statistics
  getStats: () =>
    api.get('/admin/stats'),

  // Get sellers
  getSellers: () =>
    api.get('/admin/sellers'),

  // Create seller
  createSeller: (data) =>
    api.post('/admin/sellers', data),

  // Suspend seller
  suspendSeller: (id) =>
    api.post(`/admin/sellers/${id}/suspend`),

  // Delete seller
  deleteSeller: (id) =>
    api.delete(`/admin/sellers/${id}`),
};

// ============================================================
// UPLOAD API
// ============================================================

export const uploadApi = {
  // Upload image
  uploadImage: (formData) =>
    api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;
