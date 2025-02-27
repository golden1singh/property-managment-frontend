import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import plotsReducer from '../features/plots/plotsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plots: plotsReducer,
  },
})

export default store 