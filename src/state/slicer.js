import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminSidebar: true,
  clientSidebar: true,
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
    ToggleClientSidebar: (state) => {
      state.clientSidebar = !state.clientSidebar;
    },
    MinimizeSidebar: (state) => {
      state.sidebarMinimized = !state.sidebarMinimized;
    },
    setCartLength: (state, action) => {
      state.cartLength = Number(action.payload);
    },
  },
});

export const { ToggleAdminSidebar, MinimizeSidebar, setCartLength, ToggleClientSidebar } =
  MainReduxSlice.actions;
export default MainReduxSlice.reducer;
