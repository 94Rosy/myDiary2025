import EmotionCard from "./EmotionCard";
import "./mainPage.scss";

const MainPage = () => {
  return (
    <div className="main-wrapper">
      <div className="title-content">
        {/* <div>마음의 조각</div> */}
        {/* <div>매일매일 나의 마음은 어떤 모양일까?</div> */}
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
          subText="나의 감정들 보러 가기"
        />
        <EmotionCard
          cardType="dashboard"
          link="/dashboard"
          mainText="감정 차트"
          subText="요즘 내 감정들은 어땠을까?"
        />
        <EmotionCard
          cardType="calendar"
          mainText="캘린더"
          subText="어떤 날의 감정들"
        />
        <EmotionCard cardType="contact" link="/contact" mainText="Contact" />
      </div>
    </div>
  );
};

export default MainPage;
