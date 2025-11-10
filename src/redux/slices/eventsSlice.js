import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
// API Service with Sanctum authentication
const apiService = {
  // Fetch all events
  fetchEvents: async () => {
    const response = await fetch(`http://localhost:8000/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
  },

  // Fetch single event
  fetchEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return response.json();
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }

    return response.json();
  },
};

// Redux Async Thunks
const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.fetchEvents();
      // Handle both array response and object with data property
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      const data = await apiService.fetchEvent(eventId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const data = await apiService.createEvent(eventData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await apiService.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
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
    setEvents: (state, action) => {
      state.events = action.payload;
      state.filteredEvents = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredEvents = state.events.filter((event) => {
        const title = event.title?.toLowerCase() || "";
        const location = event.location?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        const searchLower = action.payload.toLowerCase();

        return (
          title.includes(searchLower) ||
          location.includes(searchLower) ||
          description.includes(searchLower)
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
      // Fetch Events
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
        state.error = action.payload || "Failed to fetch events";
      })
      // Fetch Event Details
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
        state.actionError = action.payload || "Failed to fetch event details";
      })
      // Create Event
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
        state.actionError = action.payload || "Failed to create event";
      })
      // Delete Event
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
        state.actionError = action.payload || "Failed to delete event";
      });
  },
});

export const { setSearchTerm, clearError } = eventsSlice.actions;
export { fetchEvents, fetchEventDetails, createEvent, deleteEvent };
export default eventsSlice.reducer;
