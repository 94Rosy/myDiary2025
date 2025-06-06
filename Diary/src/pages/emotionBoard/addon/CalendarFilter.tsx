import { useDispatch } from "react-redux";
import Calendar from "react-calendar";
import {
  EmotionEntry,
  startGridLoading,
  stopGridLoading,
} from "../../../store/emotionSlice";
import classNames from "classnames";
import "react-calendar/dist/Calendar.css";
import "./calendarFilter.scss";

interface Props {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  emotionData: EmotionEntry[];
}

const dotColors: Record<string, string> = {
  "😊 기쁨": "joy",
  "😢 슬픔": "sad",
  "😡 분노": "angry",
  "😌 평온": "calm",
  "😱 놀람": "surprise",
  "🥰 사랑": "love",
};

const CalendarFilter: React.FC<Props> = ({
  selectedDate,
  onDateChange,
  emotionData,
}) => {
  const dispatch = useDispatch();
  const checkedEmotions = (date: Date) => {
    // const dateStr = date.toISOString().split("T")[0];
    // const entry = emotionData.find((e) => e.date === dateStr);
    // return entry ? dotColors[entry.emotion] || "" : "";
    // 주석 친 이유 - supabase에서 받아온 e.date는 문자열이고, new Date(e.date)로 생성하면 로컬 타임 기준이라 하루가 밀림

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // .toString().padStart(2, "0")를 해주면 앞에 0을 붙여서 두자릿수로 맞춰줌!
    const day = date.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`; // 로컬 기준 YYYY-MM-DD

    const entry = emotionData.find((e) => e.date === dateStr);
    return entry ? dotColors[entry.emotion] || "" : "";
  };

  const handleDateChange = (date: Date) => {
    dispatch(startGridLoading());

    // 날짜를 YYYY-MM-DD 포맷으로 비교
    const clickedDate = date.toISOString().split("T")[0];
    const selected = selectedDate?.toISOString().split("T")[0];

    if (clickedDate === selected) {
      // 같은 날짜를 다시 클릭하면 필터 리셋
      onDateChange(null);
    } else {
      onDateChange(date);
    }

    // 로딩 느낌 주기 위한 약간의 딜레이 후 stop
    setTimeout(() => {
      dispatch(stopGridLoading());
    }, 250);
  };

  return (
    <div className="calendar__filter">
      <Calendar
        calendarType="gregory"
        showNeighboringMonth={false}
        onChange={(value) => handleDateChange(value as Date)}
        value={selectedDate}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const className = checkedEmotions(date);
            return className ? (
              <div className={classNames("dot", className)} />
            ) : null;
          }
          return null;
        }}
      />
    </div>
  );
};

export default CalendarFilter;
