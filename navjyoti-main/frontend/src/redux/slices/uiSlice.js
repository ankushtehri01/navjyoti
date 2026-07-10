/**
 * Global UI state: sidebar toggles and (future) modal control.
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false, // mobile dashboard/admin sidebar
  mobileNavOpen: false, // public site mobile nav
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar: (state, { payload }) => {
      state.sidebarOpen = payload;
    },
    toggleMobileNav: (state) => {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setMobileNav: (state, { payload }) => {
      state.mobileNavOpen = payload;
    },
  },
});

export const { toggleSidebar, setSidebar, toggleMobileNav, setMobileNav } =
  uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectMobileNavOpen = (state) => state.ui.mobileNavOpen;

export default uiSlice.reducer;
