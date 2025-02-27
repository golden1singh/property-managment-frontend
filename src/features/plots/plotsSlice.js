import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axios'


// Async thunk for fetching plots
export const fetchPlots = createAsyncThunk(
  'plots/fetchPlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/plots')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching plots')
    }
  }
)

const plotsSlice = createSlice({
  name: 'plots',
  initialState: {
    plots: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    // Add any additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlots.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPlots.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.plots = action.payload
        state.error = null
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

// Selectors
export const selectAllPlots = (state) => state.plots.plots
export const selectPlotsStatus = (state) => state.plots.status
export const selectPlotsError = (state) => state.plots.error

export default plotsSlice.reducer 