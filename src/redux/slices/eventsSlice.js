import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const token = localStorage.getItem("token");

const apiHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Authorization: `Bearer ${token}`,
};

// -------------------- API SERVICE --------------------
const apiService = {
  fetchEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "GET",
      headers: apiHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return response.json();
  },

  fetchEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "GET",
      headers: apiHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    return response.json();
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    return response.json();
  },

  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: apiHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    return eventId;
  },
};

// -------------------- ASYNC THUNKS --------------------
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.fetchEvents();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      return await apiService.fetchEvent(eventId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      return await apiService.createEvent(eventData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await apiService.deleteEvent(eventId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// -------------------- SLICE --------------------
const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    filteredEvents: [],
    selectedEvent: null,
    loading: false,
    error: null,
    searchTerm: "",
    actionLoading: false,
    actionError: null,
  },

  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload.toLowerCase();
      state.filteredEvents = state.events.filter((event) => {
        const search = state.searchTerm;
        return (
          event.title?.toLowerCase().includes(search) ||
          event.location?.toLowerCase().includes(search) ||
          event.description?.toLowerCase().includes(search)
        );
      });
    },

    clearError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // -------- Fetch events --------
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.filteredEvents = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Fetch single event --------
      .addCase(fetchEventDetails.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // -------- Create event --------
      .addCase(createEvent.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.events.push(action.payload);
        state.filteredEvents.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // -------- Delete event --------
      .addCase(deleteEvent.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.events = state.events.filter((e) => e.id !== action.payload);
        state.filteredEvents = state.filteredEvents.filter(
          (e) => e.id !== action.payload
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { setSearchTerm, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;
