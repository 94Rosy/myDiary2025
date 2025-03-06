import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

// 필터 값에 따라 문구 변경
const FILTER_LABELS: Record<string, string> = {
  week: "일주일",
  month: "한 달",
  "3months": "세 달",
  "6months": "반년",
};

export default function CompareChart() {
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const [chartData, setChartData] = useState<
    { emotion: string; count: number }[]
  >([]);
  const [mostEmotion, setMostEmotion] = useState<string | null>(null);
  const [leastEmotion, setLeastEmotion] = useState<string | null>(null);

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

      // 가장 많이 & 적게 기록한 감정 찾기
      const sortedEmotions = Object.entries(emotionCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const topEmotion = sortedEmotions[0]; // 가장 많이 기록한 감정
      const leastEmotion = sortedEmotions[sortedEmotions.length - 1]; // 가장 적게 기록한 감정

      if (!topEmotion || !leastEmotion) {
        setChartData([]);
        setMostEmotion(null);
        setLeastEmotion(null);
        return;
      }

      setChartData([
        { emotion: topEmotion[0], count: topEmotion[1] },
        { emotion: leastEmotion[0], count: leastEmotion[1] },
      ]);

      // 가장 많이/적게 기록한 감정을 상태로 저장
      setMostEmotion(topEmotion[0]);
      setLeastEmotion(leastEmotion[0]);
    };

    fetchEmotionData();
  }, [selectedFilter]);

  return (
    <div>
      <h3>가장 많이 & 적게 기록한 감정</h3>

      {mostEmotion && leastEmotion && (
        <p
          style={{ fontSize: "16px", marginBottom: "10px", fontWeight: "bold" }}
        >
          지난 <strong>{FILTER_LABELS[selectedFilter]}</strong> 동안 가장 많이
          느낀 감정은
          <span style={{ color: EMOTION_COLORS[mostEmotion] }}>
            {" "}
            {mostEmotion}
          </span>
          , 가장 적게 느낀 감정은
          <span style={{ color: EMOTION_COLORS[leastEmotion] }}>
            {" "}
            {leastEmotion}
          </span>
        </p>
      )}

      <ResponsiveContainer width={820} height={250}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="emotion" type="category" />
          <Tooltip formatter={(value, name) => [`${name}: ${value}회`]} />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={EMOTION_COLORS[entry.emotion] || "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
