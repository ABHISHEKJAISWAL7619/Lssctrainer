import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth-slice";
import batchSlice from "./slice/batch-slice";
import batchperformanceSlice from "./slice/batchperformance-slice";
import userSlice from "./slice/user-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    batch: batchSlice,
    batchperformance: batchperformanceSlice,
    user: userSlice,
  },
});
