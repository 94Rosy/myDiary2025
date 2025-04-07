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
        <div>EmotionLog</div>
        <div>Capture your feelings, track your mind!</div>
      </div>

      <div className="main-content">
        <MainCardList
          cardType="emotions"
          link="/emotions"
          mainText="My Mood"
          subText="일기 기록하러 가기"
        />
        <MainCardList
          cardType="dashboard"
          link="/dashboard"
          mainText="Mood Trends"
          subText="기록 차트 보러 가기"
        />
      </div>
    </div>
  );
};

export default MainPage;
