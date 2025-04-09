// 대시보드 페이지
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchEmotions } from "../../store/emotionSlice";
import DateFilter from "./chart/addon/DateFilter";
import CompareChart from "./chart/CompareChart";
import WeeklyTrendsChart from "./chart/WeeklyTrendsChart";
import EmotionRatioChart from "./chart/EmotionRatioChart";
import KeywordCloudChart from "./chart/KeywordCloudChart";
import { getCloudWordEmo } from "./chart/addon/emotionUtils";
import { isWithinInterval, subDays } from "date-fns";
import "./dashboardPage.scss";

const DashboardPage = () => {
  const emotions = useSelector((state: RootState) => state.emotions.emotions); // Redux에서 감정 데이터 가져오기
  const filters = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );

  const today = new Date();
  let startDate = subDays(today, 7); // 기본값

  if (filters === "month") {
    startDate = subDays(today, 30); // 30일 전 날짜
  } else if (filters === "3months") {
    startDate = subDays(today, 90);
  } else if (filters === "6months") {
    startDate = subDays(today, 180);
  }

  const filteredEmo = emotions.filter((entry) => {
    const entryDate = new Date(entry.date);
    return isWithinInterval(entryDate, { start: startDate, end: today }); // startDate와 오늘 사이의 날짜를 저장
  });

  const wordCloudEmo = getCloudWordEmo(filteredEmo);

  return (
    <div className="dashboard__page">
      <div className="page__header">
        <h2 className="main__title">Mood Trends</h2>
        <p className="sub__title">감정의 흐름을 통계로 들여다보는 시간</p>
      </div>
      <div className="filter__wrapper">
        <DateFilter emotions={emotions} />
      </div>

      <div className="chart__wrapper">
        <div className="view__chart">
          <section className="donut__wrapper">
            <div className="title">한눈에 모아보기</div>
            <div className="donut__chart">
              <EmotionRatioChart emotions={emotions} />
            </div>
          </section>

          <section className="cloud__wrapper">
            <div className="title">핵심 키워드 살펴보기</div>
            <div className="cloud__chart">
              <KeywordCloudChart words={wordCloudEmo} />
            </div>
          </section>
        </div>

        <div className="bar__chart">
          <section className="compare__wrapper">
            <div className="title">가장 많이, 가장 적게 기록한 감정</div>
            <div className="compare__chart">
              <CompareChart emotions={emotions} />
            </div>
          </section>

          <section className="trend__wrapper">
            <div className="title">요일별 감정 트렌드</div>
            <div className="trend__chart">
              <WeeklyTrendsChart emotions={emotions} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
