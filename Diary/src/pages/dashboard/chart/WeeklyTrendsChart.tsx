import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { RootState } from "../../../store/store";
import { EmotionEntry } from "../../../store/emotionSlice";
import { IconButton, Tooltip as Tooltips } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";
import "./weeklyTrendsChart.scss";

interface Props {
  emotions: EmotionEntry[];
}

const EMOTION_COLORS: Record<string, string> = {
  "😊 기쁨": "#FFE07D",
  "😢 슬픔": "#AFCBFF",
  "😡 분노": "#FF9A8B",
  "😌 평온": "#D4EDC9",
  "😱 놀람": "#E3D6FD",
  "🥰 사랑": "#FFB3D1",
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

const WeeklyTrendsChart: React.FC<Props> = ({ emotions }) => {
  const navigate = useNavigate();
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!emotions.length) return;

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

    // 감정 데이터를 요일별로 그룹화
    const emotionByDay: Record<string, Record<string, number>> = {};
    WEEK_DAYS.forEach((day) => {
      emotionByDay[day] = {};
    });

    filteredEmotions.forEach(({ emotion, date }) => {
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
  }, [selectedFilter, emotions]); // Redux의 emotions 상태가 변경될 때도 실행됨

  return (
    <div className="trend__chart">
      {!chartData.length ? (
        <>
          <div className="main__text">분석할 감정이 부족해요!</div>
          <div className="sub__text">
            <span>첫 요일 감정을 남기러 갈까요?</span>
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
      )}
    </div>
  );
};

export default WeeklyTrendsChart;
