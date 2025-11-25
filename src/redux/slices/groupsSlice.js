import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// -------------------- ASYNC THUNKS --------------------

/**
 * Fetch all groups
 */
export const fetchGroups = createAsyncThunk(
    "groups/fetchGroups",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/groups");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch groups"
            );
        }
    }
);

/**
 * Fetch a single group by ID
 */
export const fetchGroupDetails = createAsyncThunk(
    "groups/fetchGroupDetails",
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/groups/${groupId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch group details"
            );
        }
    }
);

/**
 * Create a new group
 */
export const createGroup = createAsyncThunk(
    "groups/createGroup",
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await api.post("/groups", groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create group"
            );
        }
    }
);

/**
 * Update a group
 */
export const updateGroup = createAsyncThunk(
    "groups/updateGroup",
    async ({ groupId, groupData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/groups/${groupId}`, groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update group"
            );
        }
    }
);

/**
 * Invite users to a group (adds them automatically)
 */
export const inviteToGroup = createAsyncThunk(
    "groups/inviteToGroup",
    async ({ groupId, emails }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/groups/${groupId}/invite`, { emails });
            return { groupId, message: response.data.message };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to invite users to group"
            );
        }
    }
);

/**
 * Delete a group
 */
export const deleteGroup = createAsyncThunk(
    "groups/deleteGroup",
    async (groupId, { rejectWithValue }) => {
        try {
            await api.delete(`/groups/${groupId}`);
            return groupId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete group"
            );
        }
    }
);

// -------------------- SLICE --------------------
const groupsSlice = createSlice({
    name: "groups",
    initialState: {
        groups: [],
        selectedGroup: null,
        loading: false,
        actionLoading: false,
        error: null,
        actionError: null,
    },

    reducers: {
        clearError: (state) => {
            state.error = null;
            state.actionError = null;
        },
        clearSelectedGroup: (state) => {
            state.selectedGroup = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // -------- Fetch all groups --------
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -------- Fetch group details --------
            .addCase(fetchGroupDetails.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(fetchGroupDetails.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.selectedGroup = action.payload;
            })
            .addCase(fetchGroupDetails.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })

            // -------- Create group --------
            .addCase(createGroup.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.groups.push(action.payload);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })

            // -------- Update group --------
            .addCase(updateGroup.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.actionLoading = false;

                // Update the group in the groups array
                const index = state.groups.findIndex((g) => g.id === action.payload.id);
                if (index !== -1) {
                    state.groups[index] = action.payload;
                }

                // Update selectedGroup if it's the one being updated
                if (state.selectedGroup?.id === action.payload.id) {
                    state.selectedGroup = action.payload;
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })

            // -------- Invite to group --------
            .addCase(inviteToGroup.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(inviteToGroup.fulfilled, (state, action) => {
                state.actionLoading = false;
                // Optionally refetch group details after invitation
            })
            .addCase(inviteToGroup.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })

            // -------- Delete group --------
            .addCase(deleteGroup.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.groups = state.groups.filter((g) => g.id !== action.payload);

                // Clear selectedGroup if it was deleted
                if (state.selectedGroup?.id === action.payload) {
                    state.selectedGroup = null;
                }
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            });
    },
});

export const { clearError, clearSelectedGroup } = groupsSlice.actions;

export default groupsSlice.reducer;
