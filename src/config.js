<<<<<<< HEAD
// src/config.js
// Use your machine's local IP so both web and mobile can reach FastAPI.
// 192.168.254.120 is your current machine IP — change this if it ever changes.

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://10.134.99.116:8000';

const TOKEN_KEY = 'spendwise_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
=======
// ── Single place to update your IP ──────────────────────────────────────────
// Run `ipconfig` to get your current IPv4 address and update here
export const BASE_URL = 'http://192.168.1.246:8000/api';
export const getToken = () => localStorage.getItem('adminToken');
>>>>>>> fa5ac0d02e88362de87e2b823b4b33cecc9d49e8
