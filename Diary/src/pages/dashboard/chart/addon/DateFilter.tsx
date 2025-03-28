import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { setFilter } from "../../../../store/filterSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmotionEntry } from "../../../../store/emotionSlice";

interface Props {
  emotions: EmotionEntry[];
}

const DateFilter: React.FC<Props> = ({ emotions }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFilter = useSelector(
    (state: RootState) => state.filter.selectedFilter
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleFilterChange = async (
    filter: "week" | "month" | "3months" | "6months"
  ) => {
    dispatch(setFilter(filter));
    if (user && filter === "week") {
      // 일주일 보기 선택 시에만 나타남
      await analyzeEmotionTrends();
    }
  };

  const analyzeEmotionTrends = () => {
    if (!emotions.length) return;

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    // Redux 데이터에서 필터링
    const filteredEmotions = emotions.filter(
      (entry) => entry.date >= formattedStartDate
    );

    if (!filteredEmotions.length) return;

    const emotionCounts: Record<string, number> = {};
    filteredEmotions.forEach(({ emotion }) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const totalEmotions = filteredEmotions.length;
    const sadnessPercentage =
      ((emotionCounts["😢 슬픔"] || 0) / totalEmotions) * 100;
    const angerPercentage =
      ((emotionCounts["😡 분노"] || 0) / totalEmotions) * 100;

    if (sadnessPercentage >= 50 && angerPercentage >= 50) {
      setModalMessage(
        `최근 7일간 슬픔(😢) ${sadnessPercentage.toFixed(
          1
        )}%, 분노(😡) ${angerPercentage.toFixed(
          1
        )}%였어요. 많이 힘든 시기일 수도 있어요.`
      );
    } else if (sadnessPercentage >= 50) {
      setModalMessage(
        `최근 7일간 슬픔(😢) 비율이 ${sadnessPercentage.toFixed(
          1
        )}%였어요. 위로가 필요할 수도 있어요.`
      );
    } else if (angerPercentage >= 50) {
      setModalMessage(
        `최근 7일간 분노(😡) 비율이 ${angerPercentage.toFixed(
          1
        )}%였어요. 스트레스를 조절해 보세요.`
      );
    } else if (sadnessPercentage >= 30 || angerPercentage >= 30) {
      setModalMessage(
        `최근 7일간 슬픔(😢) ${sadnessPercentage.toFixed(
          1
        )}%, 분노(😡) ${angerPercentage.toFixed(
          1
        )}%였어요. 조금 힘든 시기일 수도 있어요.`
      );
    } else {
      setModalMessage(""); // 감정이 너무 적으면 모달 표시 안 함
      return;
    }

    setOpenModal(true);
  };

  return (
    <div>
      <div className="filter-buttons">
        {["week", "month", "3months", "6months"].map((filter) => (
          <button
            key={filter}
            className={selectedFilter === filter ? "active" : ""}
            onClick={() =>
              handleFilterChange(
                filter as "week" | "month" | "3months" | "6months"
              )
            }
          >
            {filter === "week"
              ? "일주일 보기"
              : filter === "month"
              ? "한 달 보기"
              : filter === "3months"
              ? "3개월 보기"
              : "6개월 보기"}
          </button>
        ))}
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>감정 분석 결과</DialogTitle>
        <DialogContent>
          <p>{modalMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/contact")} color="primary">
            마음 풀러 가기
          </Button>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DateFilter;
