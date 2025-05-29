import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminSidebar: true,
  sidebarMinimized: false,
  cartLength: 0,
};

const MainReduxSlice = createSlice({
  name: "mainreduxslicer",
  initialState,
  reducers: {
    ToggleAdminSidebar: (state) => {
      state.adminSidebar = !state.adminSidebar;
    },
    MinimizeSidebar: (state) => {
      state.sidebarMinimized = !state.sidebarMinimized;
    },
    setCartLength: (state, action) => {
      state.cartLength = Number(action.payload);
    },
  },
});

export const { ToggleAdminSidebar, MinimizeSidebar, setCartLength } =
  MainReduxSlice.actions;
export default MainReduxSlice.reducer;
