import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  selectedFilter: "week" | "month" | "3months" | "6months";
};

const initialState: FilterState = {
  selectedFilter: "week", // 기본값: 일주일
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<FilterState["selectedFilter"]>
    ) => {
      state.selectedFilter = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
