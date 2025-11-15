/**
 * Authentication API Service
 * 
 * Handles all API calls to the backend authentication endpoints.
 * Manages tokens in localStorage for persistent authentication.
 */

import { http } from './http';

const TOKEN_KEY = 'novalib_access_token';
const REFRESH_TOKEN_KEY = 'novalib_refresh_token';
const USER_KEY = 'novalib_user';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise} - { user, tokens }
 */
export async function registerAPI(userData) {
  const response = await http.post('/v1/auth/register', userData);
  
  if (response.data.success) {
    // Store tokens
    localStorage.setItem(TOKEN_KEY, response.data.tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  
  return response.data;
}

/**
 * Login existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - { user, tokens }
 */
export async function loginAPI(credentials) {
  const response = await http.post('/v1/auth/login', credentials);
  
  if (response.data.success) {
    // Store tokens
    localStorage.setItem(TOKEN_KEY, response.data.tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  
  return response.data;
}

/**
 * Get current user profile
 * @returns {Promise} - { user }
 */
export async function getMeAPI() {
  const token = localStorage.getItem(TOKEN_KEY);
  
  if (!token) {
    throw new Error('No access token found');
  }
  
  const response = await http.get('/v1/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (response.data.success) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  
  return response.data;
}

/**
 * Refresh access token
 * @returns {Promise} - { accessToken }
 */
export async function refreshTokenAPI() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }
  
  const response = await http.post('/v1/auth/refresh', { refreshToken });
  
  if (response.data.success) {
    localStorage.setItem(TOKEN_KEY, response.data.accessToken);
  }
  
  return response.data;
}

/**
 * Logout user
 * @returns {Promise}
 */
export async function logoutAPI() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (refreshToken) {
    try {
      await http.post('/v1/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }
  
  // Clear local storage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored user from localStorage
 * @returns {Object|null} - User object or null
 */
export function getStoredUser() {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Get stored access token
 * @returns {string|null}
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getStoredToken();
}
