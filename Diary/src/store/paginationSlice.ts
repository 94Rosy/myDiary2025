import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  currentPages: number;
}

const initialState: State = {
  currentPages: 1,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPages = action.payload;
    },

    resetPage: (state) => {
      state.currentPages = 1;
    },
  },
});

export const { setPage, resetPage } = paginationSlice.actions;
export default paginationSlice.reducer;
