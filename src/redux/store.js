    import { configureStore } from "@reduxjs/toolkit";
    import authReducer from "../redux/slices/authSlice";
    import eventsReducer from "../redux/slices/eventsSlice";

    /**
     * @comment
     * Configure the Redux store using Redux Toolkit.
     */
    export const store = configureStore({
      reducer: {
        auth: authReducer,
        events: eventsReducer,
      },
    });
