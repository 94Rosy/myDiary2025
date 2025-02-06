// 메인 페이지

const MainPage = () => {
  return (
    <div className="main-content">
      {/** 어제의 감정을 보여 줌
       * 1. 해당 감정 이모티콘으로 직관적으로 보여줌
       * 2. 툴팁으로 설명도 */}
      <div className="card">😌 어제의 감정</div>
      {/** 오늘의 감정 쓰기
       * 1. 한 줄 쓰기(모달 or 팝업 형식)
       * 2. 게시(post)하면 감정 게시판으로 이동
       */}
      <div className="card">✍ 오늘의 감정</div>
      {/** 감정 기록 게시판
       * 1. 감정 기록 게시판으로 이동할 수 있는 카드
       */}
      <div className="card">📖 감정 게시판</div>
      {/** 감정 차트 게시판
       * 1. 올해, 이번 달, 이번 주의 감정을 그래프로 표현
       * 2. 평균 감정의 상태를 그래프로 알려주는 대시보드
       */}
      <div className="card">📊 대시보드</div>
      {/** 캘린더
       * 1. 각 일자에 해당 감정의 색깔을 입혀서 날짜 색깔만으로도 해당 날의 감정을 알 수 있게 해 줌
       */}
      <div className="card">📅 캘린더</div>
    </div>
  );
};

export default MainPage;
