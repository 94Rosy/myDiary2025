import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { RootState } from "../../../store/store";
import { EmotionEntry } from "../../../store/emotionSlice";
import { IconButton, Tooltip as Tooltips } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";
import "./compareChart.scss";

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

// 필터 값에 따라 문구 변경
const FILTER_LABELS: Record<string, string> = {
  week: "일주일",
  month: "한 달",
  "3months": "세 달",
  "6months": "반년",
};

const CompareChart: React.FC<Props> = ({ emotions }) => {
  const navigate = useNavigate();
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const [chartData, setChartData] = useState<
    { emotion: string; count: number }[]
  >([]);
  const [mostEmotion, setMostEmotion] = useState<string | null>(null);
  const [leastEmotion, setLeastEmotion] = useState<string | null>(null);

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
      setMostEmotion(null);
      setLeastEmotion(null);
      return;
    }

    // 감정별 개수 카운트
    const emotionCounts: Record<string, number> = {};
    filteredEmotions.forEach(({ emotion }) => {
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
  }, [selectedFilter, emotions]);

  return (
    <div className="compare__chart">
      {!chartData.length ? (
        <>
          <div className="main__text">비교할 감정이 부족해요!</div>
          <div className="sub__text">
            <span>오늘부터 기록하러 갈까요?</span>
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
        <div>
          {mostEmotion && leastEmotion && (
            <p
              style={{
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              지난 <strong>{FILTER_LABELS[selectedFilter]}</strong> 동안 가장
              많이 느낀 감정은
              <span
                style={{
                  fontWeight: "bold",
                  color: EMOTION_COLORS[mostEmotion],
                }}
              >
                {" "}
                {mostEmotion}
              </span>
              , 가장 적게 느낀 감정은
              <span
                style={{
                  fontWeight: "bold",
                  color: EMOTION_COLORS[leastEmotion],
                }}
              >
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
      )}
    </div>
  );
};
export default CompareChart;
