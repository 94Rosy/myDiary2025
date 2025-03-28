// 대시보드 페이지
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchEmotions } from "../../store/emotionSlice";
import DateFilter from "./chart/addon/DateFilter";
import DateEmotionChart from "./chart/DateEmotionChart";
import CompareChart from "./chart/CompareChart";
import WeeklyTrendsChart from "./chart/WeeklyTrendsChart";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const emotions = useSelector((state: RootState) => state.emotions.emotions); // Redux에서 감정 데이터 가져오기

  useEffect(() => {
    if (!emotions.length) {
      dispatch(fetchEmotions());
    }
  }, [dispatch, emotions.length]);

  return (
    <>
      <h1>📊 감정 차트</h1>
      <DateFilter emotions={emotions} />
      <DateEmotionChart emotions={emotions} />
      <CompareChart emotions={emotions} />
      <WeeklyTrendsChart emotions={emotions} />
    </>
  );
};

export default DashboardPage;
