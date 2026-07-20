/**
 * authService.js — Frontend service functions for authentication API calls.
 * All functions communicate with /api/auth/* on the Node backend.
 */

import coreApi from './coreApi.js';

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ user: object }>}
 */
export async function register({ name, email, password, role }) {
  // `role` is optional and may only be 'seeker' or 'recruiter'; the backend
  // rejects any attempt to self-register as an admin.
  const payload = { name, email, password };
  if (role) payload.role = role;

  const response = await coreApi.post('/auth/register', payload);
  return response.data.data;
}

/**
 * Log in with email and password (Step 1).
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ otpRequired: boolean, email: string }>}
 */
export async function login({ email, password }) {
  const response = await coreApi.post('/auth/login', { email, password });
  return response.data.data;
}

/**
 * Verify OTP code to log in (Step 2).
 * @param {{ email: string, otp: string }} data
 * @returns {Promise<{ user: object }>}
 */
export async function verifyOtp(data) {
    const response = await coreApi.post("/auth/verify-otp", data);

    // Save JWT for Python backend
    if (response.data?.data?.token) {
        localStorage.setItem("token", response.data.data.token);
    }

    return response.data.data;
}

/**
 * Resend OTP code.
 * @param {{ email: string, type?: string }} data
 * @returns {Promise<object>}
 */
export async function resendOtp({ email, type }) {
  const response = await coreApi.post('/auth/resend-otp', { email, type });
  return response.data.data;
}

/**
 * Request password reset (Step 1).
 * @param {string} email
 * @returns {Promise<object>}
 */
export async function forgotPassword(email) {
  const response = await coreApi.post('/auth/forgot-password', { email });
  return response.data.data;
}

/**
 * Verify reset OTP code (Step 2).
 * @param {{ email: string, otp: string }} data
 * @returns {Promise<object>}
 */
export async function verifyResetOtp({ email, otp }) {
  const response = await coreApi.post('/auth/verify-reset-otp', { email, otp });
  return response.data.data;
}

/**
 * Reset password to new value (Step 3).
 * @param {{ email: string, otp: string, password: string }} data
 * @returns {Promise<object>}
 */
export async function resetPassword({ email, otp, password }) {
  const response = await coreApi.post('/auth/reset-password', { email, otp, password });
  return response.data.data;
}

/**
 * Log out the current user.
 */
export async function logout() {
  await coreApi.post('/auth/logout');
}

/**
 * Fetch the currently authenticated user and their preferences.
 * Returns null if not authenticated (401) instead of throwing.
 * @returns {Promise<{ user: object, preferences: object } | null>}
 */
export async function getMe() {
  try {
    const response = await coreApi.get('/auth/me');
    return response.data.data;
  } catch (err) {
    if (err.response?.status === 401) {
      return null; // Not logged in — not an error
    }
    throw err;
  }
}

/**
 * Update the current user's profile fields.
 * @param {object} fields
 * @returns {Promise<{ user: object }>}
 */
export async function updateProfile(fields) {
  const response = await coreApi.patch('/auth/profile', fields);
  return response.data.data;
}

/**
 * Get the current user's job preferences.
 * @returns {Promise<{ preferences: object }>}
 */
export async function getPreferences() {
  const response = await coreApi.get('/auth/preferences');
  return response.data.data;
}

/**
 * Update the current user's job preferences.
 * @param {object} fields
 * @returns {Promise<{ preferences: object }>}
 */
export async function updatePreferences(fields) {
  const response = await coreApi.patch('/auth/preferences', fields);
  return response.data.data;
}
