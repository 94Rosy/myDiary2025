import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetPage } from "../../store/paginationSlice";
import MainCardList from "./addon/MainCardList";
import "./mainPage.scss";

const MainPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetPage()); // 메인 진입 시 감정 일기의 페이지네이션 초기화
  }, [dispatch]);

  return (
    <div className="main-wrapper">
      <div className="title-content">
        <div>마음의 조각</div>
        <div>매일매일 나의 마음은 어떤 모양일까?</div>
      </div>

      <div className="main-content">
        <MainCardList
          cardType="emotions"
          link="/emotions"
          mainText="감정 다이어리"
          subText="마음의 조각들 보러 가기"
        />
        <MainCardList
          cardType="dashboard"
          link="/dashboard"
          mainText="감정 차트"
          subText="마음의 조각을 모아서"
        />
      </div>
    </div>
  );
};

export default MainPage;
