import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// -------------------- ASYNC THUNKS --------------------

/**
 * Fetch participants for a specific event
 */
export const fetchParticipants = createAsyncThunk(
    "participants/fetchParticipants",
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/events/${eventId}/participants`);
            return { eventId, participants: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch participants"
            );
        }
    }
);

/**
 * Invite users to an event
 */
export const inviteParticipants = createAsyncThunk(
    "participants/inviteParticipants",
    async ({ eventId, emails }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/events/${eventId}/invite`, { emails });
            return { eventId, results: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to invite participants"
            );
        }
    }
);

/**
 * Respond to an event invitation
 */
export const respondToInvitation = createAsyncThunk(
    "participants/respondToInvitation",
    async ({ eventId, status }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/events/${eventId}/respond`, { status });
            return { eventId, participant: response.data.participant };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to respond to invitation"
            );
        }
    }
);

// -------------------- SLICE --------------------
const participantsSlice = createSlice({
    name: "participants",
    initialState: {
        // Store participants by eventId
        participantsByEvent: {}, // { [eventId]: [...participants] }
        loading: false,
        error: null,
        inviteResults: null,
    },

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearInviteResults: (state) => {
            state.inviteResults = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // -------- Fetch participants --------
            .addCase(fetchParticipants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParticipants.fulfilled, (state, action) => {
                state.loading = false;
                const { eventId, participants } = action.payload;
                state.participantsByEvent[eventId] = participants;
            })
            .addCase(fetchParticipants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -------- Invite participants --------
            .addCase(inviteParticipants.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.inviteResults = null;
            })
            .addCase(inviteParticipants.fulfilled, (state, action) => {
                state.loading = false;
                state.inviteResults = action.payload.results;
            })
            .addCase(inviteParticipants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -------- Respond to invitation --------
            .addCase(respondToInvitation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(respondToInvitation.fulfilled, (state, action) => {
                state.loading = false;
                const { eventId, participant } = action.payload;

                // Update the participant in the list if it exists
                if (state.participantsByEvent[eventId]) {
                    const index = state.participantsByEvent[eventId].findIndex(
                        (p) => p.id === participant.id
                    );
                    if (index !== -1) {
                        state.participantsByEvent[eventId][index] = participant;
                    }
                }
            })
            .addCase(respondToInvitation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearInviteResults } = participantsSlice.actions;

export default participantsSlice.reducer;
