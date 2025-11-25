import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

// --- FETCH NOTIFICATIONS ---
export const fetchNotifications = createAsyncThunk(
    "notifications/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/notifications");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);

// --- MARK NOTIFICATION AS READ ---
export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            return notificationId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to mark notification as read"
            );
        }
    }
);

// --- NOTIFICATIONS SLICE ---
const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        loading: false,
        error: null,
        unreadCount: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH NOTIFICATIONS
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.read_at).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // MARK AS READ
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (n) => n.id === action.payload
                );
                if (notification) {
                    notification.read_at = new Date().toISOString();
                    state.unreadCount = state.notifications.filter(n => !n.read_at).length;
                }
            });
    },
});

export default notificationsSlice.reducer;
