import { configureStore } from "@reduxjs/toolkit";
import mainReducer from './slicer'

const store = configureStore({
    reducer: {
        rtkreducer: mainReducer
    }
});

export default store;
