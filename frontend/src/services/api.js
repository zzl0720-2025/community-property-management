import axios from 'axios';

/**
 * api.js — central Axios instance.
 * Automatically attaches the JWT Bearer token to every request
 * and redirects to /login on 401 Unauthorized.
 */

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401: clear auth state and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accountType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// --- Announcements ---
export const getAnnouncements = () => api.get('/announcements');

// --- Posts ---
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const addComment = (postId, data) => api.post(`/posts/${postId}/comments`, data);

// --- Bookings ---
export const getMyBookings = (userId) => api.get(`/bookings/user/${userId}`);
export const createBooking = (data) => api.post('/bookings', data);

// --- Maintenance ---
export const getMyRequests = (userId) => api.get(`/maintenance/user/${userId}`);
export const createRequest = (data) => api.post('/maintenance', data);

// --- Payments ---
export const getMyPayments = (userId) => api.get(`/payments/user/${userId}`);
export const markAsPaid = (id) => api.patch(`/payments/${id}/pay`);

export default api;
