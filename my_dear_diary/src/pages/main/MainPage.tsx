import EmotionCard from "./EmotionCard";
import "./mainPage.scss";

const MainPage = () => {
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <EmotionCard cardType="yesterday" description="어제 나의 감정은?" />
        <EmotionCard cardType="today" description="오늘 나의 감정은?" />
        <EmotionCard
          cardType="journal"
          link="/emotionList"
          description="나의 감정들 보러 가기"
        />
        <EmotionCard
          cardType="dashboard"
          link="/dashboard"
          description="내 감정들이 어땠을까?"
        />
        <EmotionCard cardType="calendar" description="어떤 날의 감정들" />
      </div>
    </div>
  );
};

export default MainPage;
