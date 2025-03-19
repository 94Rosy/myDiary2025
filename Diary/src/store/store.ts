import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // 유저 상태 Slice
import filterReducer from "./filterSlice"; // 유저 상태 Slice
import emotionReducer from "./emotionSlice"; // 감정 상태 Slice
import paginationReducer from "./paginationSlice"; // 페이지네이션 Slice

export const store = configureStore({
  reducer: {
    auth: authReducer, // 유저 상태 관리
    filter: filterReducer, // 필터 상태 관리
    emotions: emotionReducer, // 감정 데이터 관리
    pagination: paginationReducer, // 페이지네이션 관리
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
