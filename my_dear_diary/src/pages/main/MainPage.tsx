import EmotionCard from "./EmotionCard";
import "./mainPage.scss";

const MainPage = () => {
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <EmotionCard
          icon="😌"
          title="어제의 감정"
          description="어제 기록한 감정을 확인하세요."
        />
        <EmotionCard
          icon="✍"
          title="오늘의 감정"
          description="오늘의 감정을 작성하세요."
          onClick={() => alert("오늘의 감정 입력")} // 일단 alert로 이벤트 임시 처리
        />
        <EmotionCard
          icon="📖"
          title="감정 게시판"
          description="기록된 감정을 확인하세요."
          link="/emotionList"
        />
        <EmotionCard
          icon="📊"
          title="대시보드"
          description="나의 감정 통계를 확인하세요."
          link="/dashboard"
        />
        <EmotionCard
          icon="📅"
          title="캘린더"
          description="날짜별 감정을 한눈에 확인하세요."
        />
      </div>
    </div>
  );
};

export default MainPage;
