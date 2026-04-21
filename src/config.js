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