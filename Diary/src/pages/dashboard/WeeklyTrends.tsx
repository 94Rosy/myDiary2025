import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabaseClient";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { RootState } from "../../store/store";

const EMOTION_COLORS: Record<string, string> = {
  "😊 기쁨": "#FFD700",
  "😢 슬픔": "#4A90E2",
  "😡 분노": "#FF3B30",
  "😌 평온": "#A0E57C",
  "🥰 사랑": "#FF69B4",
  "😱 놀람": "#FF8C00",
};

const WEEK_DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

export default function WeeklyTrends() {
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const fetchEmotionData = async () => {
      const userId = user.id;

      // 필터에 따라 가져올 데이터 기간 설정
      let startDate = new Date();
      if (selectedFilter === "week") startDate.setDate(startDate.getDate() - 7);
      if (selectedFilter === "month")
        startDate.setMonth(startDate.getMonth() - 1);
      if (selectedFilter === "3months")
        startDate.setMonth(startDate.getMonth() - 3);
      if (selectedFilter === "6months")
        startDate.setMonth(startDate.getMonth() - 6);

      const formattedStartDate = startDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("emotions")
        .select("emotion, date")
        .eq("user_id", userId)
        .gte("date", formattedStartDate);

      if (error) {
        console.error("Error fetching emotions:", error);
        return;
      }

      // 감정 데이터를 요일별로 그룹화
      const emotionByDay: Record<string, Record<string, number>> = {};
      WEEK_DAYS.forEach((day) => {
        emotionByDay[day] = {};
      });

      data.forEach(({ emotion, date }) => {
        const dayIndex = new Date(date).getDay(); // 0(일) ~ 6(토)
        const dayName = WEEK_DAYS[dayIndex === 0 ? 6 : dayIndex - 1]; // 요일 변환 (일요일이 0이므로 보정)

        if (!emotionByDay[dayName][emotion]) {
          emotionByDay[dayName][emotion] = 0;
        }
        emotionByDay[dayName][emotion] += 1;
      });

      // Recharts에 맞게 데이터 변환
      const finalChartData = WEEK_DAYS.map((day) => ({
        day,
        ...emotionByDay[day],
      }));

      setChartData(finalChartData);
    };

    fetchEmotionData();
  }, [selectedFilter, user]); // Redux의 user 상태가 변경될 때도 실행됨

  return (
    <div>
      <h3>요일별 감정 트렌드</h3>
      <ResponsiveContainer width={820} height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => `${value}회`} />
          <Legend />
          {Object.keys(EMOTION_COLORS).map((emotion) => (
            <Bar key={emotion} dataKey={emotion} stackId="a">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={EMOTION_COLORS[emotion] || "#8884d8"}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
