import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteEmotion, EmotionEntry } from "../../store/emotionSlice";
import { Tooltip, IconButton, Popover, Modal } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreateIcon from "@mui/icons-material/Create";
import classNames from "classnames";
import CalendarFilter from "./addon/CalendarFilter";
import TagFilter from "./addon/TagFilter";
import Pagination from "./addon/Pagination";
import EmotionNoteModal from "./modal/EmotionNoteModal";
import EmotionCard from "./EmotionCard";
import "./emotionBoardPage.scss";

const emotionOptions = [
  "😊 기쁨",
  "😢 슬픔",
  "😡 분노",
  "😌 평온",
  "😱 놀람",
  "🥰 사랑",
];

const PAGE_PER_COUNTS = 14; // 한 페이지에 보여줄 감정 개수(14개)

const EmotionBoardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const emotions = useSelector((state: RootState) => state.emotions.emotions);
  const currentPage = useSelector(
    (state: RootState) => state.pagination.currentPage
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionEntry | null>(
    null
  );
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 캘린더 팝오버 관련

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const isToday = emotions.some((entry) => entry.date === today);

  useEffect(() => {
    setTotalPages(Math.ceil(emotions.length / PAGE_PER_COUNTS)); // 전체 페이지 개수 계산
  }, [emotions]);

  // 날짜, 태그 필터링된 감정 목록
  const filteredEmotions = emotions.filter((entry) => {
    let matchesDate = true;

    // 날짜 필터: 선택된 날짜가 있을 경우, 해당 날짜와 일치하는 감정만 통과
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const selected = `${year}-${month}-${day}`;
      matchesDate = entry.date === selected;
    }

    //  태그 필터: 선택된 감정 태그가 있을 경우, 해당 감정과 일치하는 항목만 통과
    const matchesTag = selectedTag ? entry.emotion === selectedTag : true;

    // 두 조건 모두 만족해야 필터링 결과에 포함
    return matchesDate && matchesTag;
  });

  // 현재 페이지에 해당하는 데이터만 가져오기
  const paginatedEmotions = filteredEmotions.slice(
    (currentPage - 1) * PAGE_PER_COUNTS,
    currentPage * PAGE_PER_COUNTS
  );

  const handleDelete = (id: string) => {
    dispatch(deleteEmotion(id));
  };

  // 모달 상태 관리
  const openModal = (emotionEntry?: EmotionEntry) => {
    setSelectedEmotion(emotionEntry || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmotion(null);
    setIsModalOpen(false);
  };

  // 캘린더 팝오버 오픈
  const calendarOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  // 캘린더 팝오버 닫기
  const calendarClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="emotion__board">
      <div className="page__header">
        <h2 className="main__title">My Moods</h2>
        <p className="sub__title">매일 기록했던 감정 돌아보기</p>
      </div>

      <div className="util__wrapper">
        <Tooltip
          title={!isToday ? "기록하기" : "오늘의 감정은 이미 등록되어 있어요!"}
          placement="top"
        >
          <span>
            <IconButton
              className={classNames("add__button", { disabled: isToday })}
              onClick={() => openModal()}
              disabled={isToday}
              sx={{
                marginRight: "8px",
                backgroundColor: "#b3d4f3",
                "&:hover": {
                  backgroundColor: "#a4c5e4",
                  color: "#fff",
                  transition: "color 0.2s",
                },
              }}
            >
              <CreateIcon
                sx={{
                  transition: "color 0.2s",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>

        {/* 캘린더 필터 */}
        <Tooltip title="날짜로 보기" placement="top">
          <span>
            <IconButton
              onClick={calendarOpen}
              sx={{
                width: "36px",
                height: "36px",
                backgroundColor: "#cab4de",
                "&:hover": {
                  backgroundColor: "#b898d6",
                  color: "#fff",
                  transition: "color 0.2s",
                },
              }}
            >
              <CalendarMonthIcon
                sx={{
                  transition: "color 0.2s",
                }}
              />
            </IconButton>
          </span>
        </Tooltip>

        {/* 태그 필터 */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={calendarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          <CalendarFilter
            onDateChange={(date) => {
              setSelectedDate(date);
              calendarClose();
            }}
            selectedDate={selectedDate as Date}
            emotionData={emotions}
          />
        </Popover>
        <TagFilter selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      </div>

      {/* 감정 카드 리스트 */}
      <div className="emotion__grid">
        {paginatedEmotions.map((entry) => (
          <EmotionCard
            key={entry.id}
            entry={entry}
            onEdit={() => openModal(entry)}
            onDelete={() => handleDelete(entry.id)}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination totalPages={totalPages} />

      {/* 감정 추가 & 수정 모달 */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <EmotionNoteModal
          today={today}
          onClose={closeModal}
          selectedEmotion={selectedEmotion}
          emotionOptions={emotionOptions}
        />
      </Modal>
    </div>
  );
};

export default EmotionBoardPage;
