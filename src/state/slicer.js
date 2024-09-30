import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    adminSidebar: true,
}

const MainReduxSlice = createSlice({
    name: 'mainreduxslicer',
    initialState,
    reducers: {
        ToggleAdminSidebar: (state) => {
            state.adminSidebar = !state.adminSidebar;
        }
    }
})

export const { ToggleAdminSidebar } = MainReduxSlice.actions;
export default MainReduxSlice.reducer;
