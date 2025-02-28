import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../modules/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export default store