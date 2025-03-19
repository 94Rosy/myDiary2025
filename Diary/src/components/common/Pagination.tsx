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

const MAX_PAGE_NUMBERS = 7; // 한 번에 보여줄 페이지 개수

const Pagination: React.FC<Props> = ({ totalPages }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(
    (state: RootState) => state.pagination.currentPage
  );

  const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_NUMBERS / 2));
  const endPage = Math.min(totalPages, startPage + MAX_PAGE_NUMBERS - 1);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const pageChangeHandler = (page: number) => {
    dispatch(setPage(page));
  };

  const firstPageHandler = () => {
    dispatch(setPage(1));
  };

  const lastPageHandler = () => {
    dispatch(setPage(totalPages));
  };

  return (
    <div className="pagination">
      <Button className="first" onClick={firstPageHandler}>
        &laquo;
      </Button>

      {pageNumbers.map((num) => (
        <Button
          key={num}
          className={classNames("pagebar", { active: num === currentPage })}
          onClick={() => pageChangeHandler(num)}
        >
          {num}
        </Button>
      ))}

      <Button className="last" onClick={lastPageHandler}>
        &raquo;
      </Button>
    </div>
  );
};

export default Pagination;
