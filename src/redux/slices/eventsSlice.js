import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -------------------- CONFIG --------------------
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Authorization: `Bearer ${token}`,
  },
});

// -------------------- API SERVICE (AXIOS) --------------------
const apiService = {
  fetchEvents: async () => {
    try {
      const response = await axiosInstance.get("/events");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  },

  fetchEvent: async (eventId) => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch event details"
      );
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await axiosInstance.post("/events", eventData);
      return response.data.event;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create event"
      );
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const response = await axiosInstance.put(`/events/${eventId}`, eventData);
      return response.data.event; // return the updated event object
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update event"
      );
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      return eventId;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  },

  submitVote: async (voteData) => {
    try {
      const response = await axiosInstance.post("/votes", voteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to submit vote");
    }
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

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      return await apiService.updateEvent(eventId, eventData);
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

export const submitVote = createAsyncThunk(
  "events/submitVote",
  async (voteData, { rejectWithValue, getState }) => {
    try {
      const response = await apiService.submitVote(voteData);
      return {
        ...response,
        eventId: getState().events.selectedEvent?.id,
      };
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

    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
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

      // -------- Update event --------
      .addCase(updateEvent.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.actionLoading = false;

        // Update the event in the events array
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }

        // Update in filteredEvents array too
        const filteredIndex = state.filteredEvents.findIndex(
          (e) => e.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredEvents[filteredIndex] = action.payload;
        }

        // Update selectedEvent if it's the one being updated
        if (state.selectedEvent?.id === action.payload.id) {
          state.selectedEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
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
      })

      // -------- Submit vote --------
      .addCase(submitVote.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.actionLoading = false;

        if (state.selectedEvent && action.payload.best_date_id) {
          state.selectedEvent.best_date_id = action.payload.best_date_id;
        }
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { setSearchTerm, clearError, clearSelectedEvent } =
  eventsSlice.actions;

export default eventsSlice.reducer;
