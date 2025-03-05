import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabaseClient";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { RootState } from "../../store/store";

const EMOTION_COLORS: Record<string, string> = {
  "😊 기쁨": "#FFD700",
  "😢 슬픔": "#4A90E2",
  "😡 분노": "#FF3B30",
  "😌 평온": "#A0E57C",
  "🥰 사랑": "#FF69B4",
  "😱 놀람": "#FF8C00",
};

export default function DateEmotionChart() {
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const [chartData, setChartData] = useState<
    { emotion: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchEmotionData = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("로그인한 사용자를 찾을 수 없습니다.");
        return;
      }

      const userId = userData.user.id;

      // Redux에서 가져온 필터 값으로 데이터 필터링
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
        .select("emotion")
        .eq("user_id", userId)
        .gte("date", formattedStartDate);

      if (error) {
        console.error("Error fetching emotions:", error);
        return;
      }

      // 감정별 개수 카운트
      const emotionCounts: Record<string, number> = {};
      data.forEach(({ emotion }) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });

      // 차트 데이터 형식으로 변환
      const finalData = Object.keys(emotionCounts).map((emotion) => ({
        emotion,
        count: emotionCounts[emotion],
      }));

      setChartData(finalData);
    };

    fetchEmotionData();
  }, [selectedFilter]); // Redux의 필터 값이 변경될 때마다 데이터 새로 가져오기

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="emotion"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name, value }) => `${name} (${value})`}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={EMOTION_COLORS[entry.emotion] || "#8884d8"}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}회`, `감정: ${name}`]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
