import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import eventsReducer from "../redux/slices/eventsSlice";
import notificationsReducer from "../redux/slices/notificationsSlice";
import participantsReducer from "../redux/slices/participantsSlice";
import groupsReducer from "../redux/slices/groupsSlice";

/**
 * @comment
 * Configure the Redux store using Redux Toolkit.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    notifications: notificationsReducer,
    participants: participantsReducer,
    groups: groupsReducer,
  },
});
