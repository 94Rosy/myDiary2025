import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  currentPage: number;
}

// 새로고침 시 로컬스토리지에 저장한 페이지 불러오기
const savedPage = localStorage.getItem("currentPage");

const initialState: State = {
  currentPage: savedPage ? parseInt(savedPage, 10) : 1,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      localStorage.setItem("currentPage", String(action.payload)); // 로컬스토리지에 저장
    },

    resetPage: (state) => {
      state.currentPage = 1;
      localStorage.setItem("currentPage", "1"); // 페이지 초기화 시 로컬스토리지도 업데이트
    },
  },
});

export const { setPage, resetPage } = paginationSlice.actions;
export default paginationSlice.reducer;
