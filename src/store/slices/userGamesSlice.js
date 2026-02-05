import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUserGames = createAsyncThunk(
  'userGames/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/user-games');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch games');
    }
  }
);

export const addGameToBacklog = createAsyncThunk(
  'userGames/add',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/user-games', { game_id: gameId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add game');
    }
  }
);

export const updateGameStatus = createAsyncThunk(
  'userGames/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/user-games/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update status');
    }
  }
);

export const updateGameProgress = createAsyncThunk(
  'userGames/updateProgress',
  async ({ id, progressPercent, playtimeHours }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/user-games/${id}/progress`, {
        progress_percent: progressPercent,
        playtime_hours: playtimeHours,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update progress');
    }
  }
);

export const updateGameNotes = createAsyncThunk(
  'userGames/updateNotes',
  async ({ id, notes, rating, platform }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/user-games/${id}/notes`, {
        notes,
        rating,
        platform,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update details');
    }
  }
);

export const deleteUserGame = createAsyncThunk(
  'userGames/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/user-games/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete game');
    }
  }
);

const userGamesSlice = createSlice({
  name: 'userGames',
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic update for drag-and-drop
    moveGame: (state, action) => {
      const { id, newStatus } = action.payload;
      const game = state.games.find((g) => g.id === id);
      if (game) {
        game.status = newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchUserGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGames.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        // Ensure we always have an array
        if (data && !Array.isArray(data) && Array.isArray(data.data)) {
            state.games = data.data;
        } else {
            state.games = Array.isArray(data) ? data : [];
        }
      })
      .addCase(fetchUserGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add game
      .addCase(addGameToBacklog.fulfilled, (state, action) => {
        if (!Array.isArray(state.games)) {
            state.games = [];
        }
        state.games.push(action.payload);
      })
      // Update status
      .addCase(updateGameStatus.fulfilled, (state, action) => {
        const index = state.games.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.games[index] = action.payload;
        }
      })
      // Update progress
      .addCase(updateGameProgress.fulfilled, (state, action) => {
        const index = state.games.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.games[index] = action.payload;
        }
      })
      // Update notes
      .addCase(updateGameNotes.fulfilled, (state, action) => {
        const index = state.games.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.games[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteUserGame.fulfilled, (state, action) => {
        state.games = state.games.filter((g) => g.id !== action.payload);
      });
  },
});

export const { clearError, moveGame } = userGamesSlice.actions;
export default userGamesSlice.reducer;

// Selectors
export const selectGamesByStatus = (state, status) =>
  state.userGames.games.filter((game) => game.status === status);
