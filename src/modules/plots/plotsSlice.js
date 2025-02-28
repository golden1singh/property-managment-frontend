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

export const createPlot = createAsyncThunk(
  'plots/createPlot',
  async (plotData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/plots', plotData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating plot')
    }
  }
)

export const updatePlot = createAsyncThunk(
  'plots/updatePlot',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/api/plots/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating plot')
    }
  }
)

export const deletePlot = createAsyncThunk(
  'plots/deletePlot',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/plots/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting plot')
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
    clearError: (state) => {
      state.error = null
    }
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
      .addCase(createPlot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createPlot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.plots.push(action.payload)
        state.error = null
      })
      .addCase(createPlot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(updatePlot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updatePlot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.plots.findIndex(plot => plot.id === action.payload.id)
        if (index !== -1) {
          state.plots[index] = action.payload
        }
        state.error = null
      })
      .addCase(updatePlot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deletePlot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deletePlot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.plots = state.plots.filter(plot => plot.id !== action.payload)
        state.error = null
      })
      .addCase(deletePlot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

// Actions
export const { clearError } = plotsSlice.actions

// Selectors
export const selectAllPlots = (state) => state.plots.plots
export const selectPlotsStatus = (state) => state.plots.status
export const selectPlotsError = (state) => state.plots.error

export default plotsSlice.reducer 