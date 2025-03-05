import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // 유저 상태 Slice

export const store = configureStore({
  reducer: {
    auth: authReducer, // 유저 상태 관리
    // filter: filterReducer, // 필터 상태 관리
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
