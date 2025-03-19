import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setPage } from "../../store/paginationSlice";
import { Button } from "@mui/material";
import classNames from "classnames";
import "../../styles/pagination.scss";

interface Props {
  totalPages: number;
}

const Pagination: React.FC<Props> = ({ totalPages }) => {
  const dispatch = useDispatch();
  const currentPages = useSelector(
    (state: RootState) => state.pagination.currentPages
  );

  const pagingHandler = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  return (
    <div className="pagination">
      <Button
        onClick={() => pagingHandler(currentPages - 1)}
        disabled={currentPages === 1}
      >
        이전
      </Button>

      {Array.from({ length: totalPages }, (_, idx) => (
        <Button
          key={idx + 1}
          onClick={() => pagingHandler(idx + 1)}
          className={classNames("page_bar", { active: idx + 1 })}
        >
          {idx + 1}
        </Button>
      ))}
      <Button
        onClick={() => pagingHandler(currentPages + 1)}
        disabled={currentPages === totalPages}
      >
        다음
      </Button>
    </div>
  );
};

export default Pagination;
