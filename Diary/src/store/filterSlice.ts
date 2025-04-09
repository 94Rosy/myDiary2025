import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  selectedFilter: "week" | "month" | "3months" | "6months";
  filterLoading: boolean;
};

const initialState: FilterState = {
  selectedFilter: "week", // 기본값: 일주일
  filterLoading: false,
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
    startChartLoading: (state) => {
      state.filterLoading = true;
    },
    stopChartLoading: (state) => {
      state.filterLoading = false;
    },
  },
});

export const { setFilter, startChartLoading, stopChartLoading } =
  filterSlice.actions;
export default filterSlice.reducer;
