import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  currentPage: number;
}

const initialState: State = {
  currentPage: 1,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    resetPage: (state) => {
      state.currentPage = 1;
    },
  },
});

export const { setPage, resetPage } = paginationSlice.actions;
export default paginationSlice.reducer;
