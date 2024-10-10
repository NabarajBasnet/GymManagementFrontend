import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    adminSidebar: true,
    sidebarMinimized: true,
}

const MainReduxSlice = createSlice({
    name: 'mainreduxslicer',
    initialState,
    reducers: {
        ToggleAdminSidebar: (state) => {
            state.adminSidebar = !state.adminSidebar;
        },
        MinimizeSidebar: (state) => {
            state.sidebarMinimized = !state.sidebarMinimized
        }
    }
})

export const { ToggleAdminSidebar, MinimizeSidebar } = MainReduxSlice.actions;
export default MainReduxSlice.reducer;
