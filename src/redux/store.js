    import { configureStore } from "@reduxjs/toolkit";
    import authReducer from "../redux/slices/authSlice";

    /**
     * @comment
     * Configure the Redux store using Redux Toolkit.
     */
    export const store = configureStore({
        reducer: {
        auth: authReducer,
        },
    });
