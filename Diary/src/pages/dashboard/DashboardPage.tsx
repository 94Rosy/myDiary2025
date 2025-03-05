// 대시보드 페이지
import DateFilter from "./DateFilter";
import DateEmotionChart from "./DateEmotionChart";
import CompareChart from "./CompareChart";

const DashboardPage = () => {
  return (
    <>
      <h1>📊 감정 차트</h1>
      <DateFilter />
      <DateEmotionChart />
      <CompareChart />
    </>
  );
};

export default DashboardPage;
