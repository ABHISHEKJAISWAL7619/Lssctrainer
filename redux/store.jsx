import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/auth-slice'
import batchSlice from './slice/batch-slice'


export const store = configureStore({
  reducer: {
    auth:authSlice,
    batch: batchSlice
    
  },
})