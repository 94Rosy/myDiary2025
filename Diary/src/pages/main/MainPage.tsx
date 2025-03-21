import { useDispatch } from "react-redux";
import EmotionCard from "./EmotionCard";
import "./mainPage.scss";
import { useEffect } from "react";
import { resetPage } from "../../store/paginationSlice";

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
        <EmotionCard
          cardType="yesterday"
          mainText="어제의 감정"
          subText="어제 나의 감정은 어땠을까?"
        />
        <EmotionCard
          cardType="today"
          mainText="오늘의 감정"
          subText="오늘 나의 감정 한 줄 적기"
        />
        <EmotionCard
          cardType="journal"
          link="/emotionList"
          mainText="감정 다이어리"
          subText="마음의 조각들 보러 가기"
        />
        <EmotionCard
          cardType="dashboard"
          link="/dashboard"
          mainText="감정 차트"
          subText="마음의 조각을 모아서"
        />
        <EmotionCard
          cardType="contact"
          link="/contact"
          mainText="오늘의 위로"
          subText="위로가 필요할 때"
        />
      </div>
    </div>
  );
};

export default MainPage;
