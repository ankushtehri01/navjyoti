/**
 * Auth state. The access token also lives in localStorage (for axios);
 * this slice is the reactive source of truth for the UI.
 */
import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/storageKeys.js';
import { setAccessToken } from '@/config/axios.js';

const readUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: readUser(),
  token: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null,
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)),
  status: 'idle', // idle | loading | authenticated | error
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      const { user, accessToken } = payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.status = 'authenticated';
      setAccessToken(accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    setUser: (state, { payload }) => {
      state.user = payload;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload));
    },
    setAuthStatus: (state, { payload }) => {
      state.status = payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      setAccessToken(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
  },
});

export const { setCredentials, setUser, setAuthStatus, logout } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRole = (state) => state.auth.user?.role ?? null;

export default authSlice.reducer;
