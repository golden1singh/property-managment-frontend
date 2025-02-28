import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../modules/auth/authSlice'
import plotsReducer from '../modules/plots/plotsSlice'
import roomsReducer from '../modules/rooms/roomsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    plots: plotsReducer,
    rooms: roomsReducer,
  },
})

export default store 