import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setFilter } from "../../store/selectedFilter";
import "./DateFilter.scss";

export default function EmotionFilter() {
  const dispatch = useDispatch();
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );

  const handleFilterChange = (
    filter: "week" | "month" | "3months" | "6months"
  ) => {
    dispatch(setFilter(filter));
  };

  return (
    <div className="filter-buttons">
      {["week", "month", "3months", "6months"].map((filter) => (
        <button
          key={filter}
          className={selectedFilter === filter ? "active" : ""}
          onClick={() =>
            handleFilterChange(
              filter as "week" | "month" | "3months" | "6months"
            )
          }
        >
          {filter === "week"
            ? "일주일 보기"
            : filter === "month"
            ? "한 달 보기"
            : filter === "3months"
            ? "3개월 보기"
            : "6개월 보기"}
        </button>
      ))}
    </div>
  );
}
