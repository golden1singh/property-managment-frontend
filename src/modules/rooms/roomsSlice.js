import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/rooms');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching rooms');
    }
  }
);

export const fetchPlots = createAsyncThunk(
  'rooms/fetchPlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/plots');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching plots');
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/rooms', roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating room');
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/api/rooms/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating room');
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/rooms/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting room');
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    plots: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filters: {
      searchTerm: '',
      selectedPlot: 'all',
      filterStatus: 'all'
    }
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setSelectedPlot: (state, action) => {
      state.filters.selectedPlot = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filters.filterStatus = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        selectedPlot: 'all',
        filterStatus: 'all'
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rooms = action.payload;
        state.error = null;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Plots
      .addCase(fetchPlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plots = action.payload;
        state.error = null;
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create Room
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })

      // Update Room
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })

      // Delete Room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
      });
  }
});

// Actions
export const {
  setSearchTerm,
  setSelectedPlot,
  setFilterStatus,
  clearFilters,
  clearError
} = roomsSlice.actions;

// Selectors
export const selectAllRooms = (state) => state.rooms.rooms;
export const selectRoomsStatus = (state) => state.rooms.status;
export const selectRoomsError = (state) => state.rooms.error;
export const selectRoomsFilters = (state) => state.rooms.filters;

// Memoized selector for filtered rooms
export const selectFilteredRooms = (state) => {
  const { rooms } = state.rooms;
  const { searchTerm, selectedPlot, filterStatus } = state.rooms.filters;

  return rooms.filter(room => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.currentTenant?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesPlot = selectedPlot === 'all' || room.plotNumber === selectedPlot;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;

    return matchesSearch && matchesPlot && matchesStatus;
  });
};

export default roomsSlice.reducer; 