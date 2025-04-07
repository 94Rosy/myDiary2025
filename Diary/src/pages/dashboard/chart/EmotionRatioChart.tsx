import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { RootState } from "../../../store/store";
import { EmotionEntry } from "../../../store/emotionSlice";
import { IconButton, Tooltip as Tooltips } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";
import "./emotionRatioChart.scss";

interface Props {
  emotions: EmotionEntry[];
}

const EMOTION_COLORS: Record<string, string> = {
  "😊 기쁨": "#FFE07D",
  "😢 슬픔": "#AFCBFF",
  "😡 분노": "#FF9A8B",
  "😌 평온": "#D4EDC9",
  "🥰 사랑": "#FFB3D1",
  "😱 놀람": "#FFD6A5",
};

const EmotionRatioChart: React.FC<Props> = ({ emotions }) => {
  const navigate = useNavigate();
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [chartData, setChartData] = useState<
    { emotion: string; count: number; percentage: string }[]
  >([]);

  useEffect(() => {
    if (!user || !emotions.length) return;

    let startDate = new Date();
    if (selectedFilter === "week") startDate.setDate(startDate.getDate() - 7);
    if (selectedFilter === "month")
      startDate.setMonth(startDate.getMonth() - 1);
    if (selectedFilter === "3months")
      startDate.setMonth(startDate.getMonth() - 3);
    if (selectedFilter === "6months")
      startDate.setMonth(startDate.getMonth() - 6);

    const formattedStartDate = startDate.toISOString().split("T")[0];

    // Redux 데이터에서 필터링
    const filteredEmotions = emotions.filter(
      (entry) => entry.date >= formattedStartDate
    );

    if (!filteredEmotions.length) {
      setChartData([]);
      return;
    }

    // 감정별 개수 카운트
    const emotionCounts: Record<string, number> = {};
    filteredEmotions.forEach(({ emotion }) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const totalCount = Object.values(emotionCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // 차트 데이터 형식으로 변환 (퍼센트 값 포함)
    const finalData = Object.keys(emotionCounts).map((emotion) => ({
      emotion,
      count: emotionCounts[emotion],
      percentage: ((emotionCounts[emotion] / totalCount) * 100).toFixed(1),
    }));

    setChartData(finalData);
  }, [selectedFilter, user, emotions]);

  return (
    <div className="cloud__chart">
      {!chartData.length ? (
        <>
          <div className="main__text">도넛을 굽지 못 했어요!</div>
          <div className="sub__text">
            <span>도넛을 구우러 갈까요?</span>
            <Tooltips title="등록하러 가기" placement="bottom-start" arrow>
              <IconButton
                size="small"
                className="go__emotions"
                onClick={() => navigate("/emotions")}
                sx={{
                  backgroundColor: "#fce624",
                  color: "#4a4a4a",
                  "&:hover": {
                    backgroundColor: "#ebd723",
                    color: "#fff",
                    transition: "color 0.2s",
                  },
                }}
              >
                <ArrowOutwardIcon
                  sx={{
                    transition: "color 0.2s",
                  }}
                />
              </IconButton>
            </Tooltips>
          </div>
        </>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              className="ratio__donut"
              data={chartData}
              dataKey="count"
              nameKey="emotion"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={EMOTION_COLORS[entry.emotion] || "#8884d8"}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}회`, `${name}`]} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EmotionRatioChart;
