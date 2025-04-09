import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchEmotions,
  addEmotion,
  updateEmotion,
  deleteEmotion,
  EmotionEntry,
} from "../../store/emotionSlice";
import {
  Modal,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Popover,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreateIcon from "@mui/icons-material/Create";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import classNames from "classnames";
import { supabase } from "../../utils/supabaseClient";
import CalendarFilter from "./addon/CalendarFilter";
import TagFilter from "./addon/TagFilter";
import Pagination from "./addon/Pagination";
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
  const user = useSelector((state: RootState) => state.auth.user);
  const emotions = useSelector((state: RootState) => state.emotions.emotions);
  const currentPage = useSelector(
    (state: RootState) => state.pagination.currentPage
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionEntry | null>(
    null
  );
  const [emotion, setEmotion] = useState("😊 기쁨");
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 캘린더 팝오버 관련

  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getLocalToday();

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

  // 이미지 파일 업로드 (Supabase Storage 연동)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    setIsImageDeleted(false);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    let uploadedImageUrl = selectedEmotion?.image_url || "";

    if (selectedFile) {
      const { data, error } = await supabase.storage
        .from("emotion-images")
        .upload(`images/${Date.now()}-${selectedFile.name}`, selectedFile);

      if (error) {
        console.error("err: ", error);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("emotion-images")
        .getPublicUrl(data.path);

      uploadedImageUrl = publicUrlData?.publicUrl || "";
    }

    if (selectedEmotion) {
      if (isImageDeleted) {
        uploadedImageUrl = "";
      }

      dispatch(
        updateEmotion({
          ...selectedEmotion,
          emotion,
          note,
          image_url: uploadedImageUrl,
        })
      );
    } else {
      dispatch(
        addEmotion({
          id: crypto.randomUUID(),
          date: today,
          emotion,
          note,
          image_url: uploadedImageUrl,
        })
      );
    }

    if (isImageDeleted && selectedEmotion?.image_url) {
      const imagePath = selectedEmotion.image_url.split(
        "/storage/v1/object/public/emotion-images/"
      )[1];

      if (imagePath) {
        const { error } = await supabase.storage
          .from("emotion-images")
          .remove([imagePath]);

        if (error) {
          console.error("err: ", error);
          return;
        }
      }
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEmotion(id));
  };

  const handleDeleteImage = async () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsImageDeleted(true);
  };

  // 모달 상태 관리
  const openModal = (emotionEntry?: EmotionEntry) => {
    setSelectedEmotion(emotionEntry || null);
    setEmotion(emotionEntry?.emotion || "😊 기쁨");
    setNote(emotionEntry?.note || "");
    setPreviewUrl(emotionEntry?.image_url || null);
    setIsImageDeleted(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmotion(null);
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsImageDeleted(false);
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
        {/* 태그 필터 */}
        <TagFilter selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      </div>

      <div className="emotion__grid">
        {paginatedEmotions.map((entry) => (
          <div key={entry.id} className="emotion__card">
            <div className="emotion__header">
              {entry.emotion}
              <div className="card__buttons">
                <Tooltip title="수정하기" placement="bottom">
                  <span>
                    <IconButton
                      className="edit__button"
                      onClick={() => openModal(entry)}
                      sx={{
                        backgroundColor: "#cbe0c3",
                        "&:hover": {
                          backgroundColor: "#b2cfa4",
                          color: "#fff",
                          transition: "color 0.2s",
                        },
                      }}
                    >
                      <AutoFixHighIcon
                        sx={{
                          transition: "color 0.2s",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="지우기" placement="bottom">
                  <span>
                    <IconButton
                      className="delete__button"
                      onClick={() => handleDelete(entry.id)}
                      sx={{
                        backgroundColor: "#e8b4b8",
                        "&:hover": {
                          backgroundColor: "#e89ca4",
                          color: "#fff",
                          transition: "color 0.2s",
                        },
                      }}
                    >
                      <DeleteIcon
                        sx={{
                          transition: "color 0.2s",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </div>
            <div className="emotion__body">
              <p className="date">{entry.date}</p>
              {entry.image_url && (
                <img
                  src={entry.image_url}
                  alt="감정 이미지"
                  className="emotion__image"
                />
              )}
              <p className="note">{entry.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination totalPages={totalPages} />

      {/* 감정 추가 & 수정 모달 */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box className="modal__emotion__box">
          <h3>{selectedEmotion ? "감정 수정" : "감정 등록"}</h3>
          <FormControl fullWidth margin="normal">
            <InputLabel>감정 선택</InputLabel>
            <Select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
            >
              {emotionOptions.map((emo, index) => (
                <MenuItem key={index} value={emo}>
                  {emo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="메모 입력"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          {!previewUrl && (
            <>
              <input
                alt="영문 이름 파일만 첨부 가능합니다."
                className="img__input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="info__msg">
                <InfoIcon
                  sx={{
                    width: 15,
                    height: 15,
                    color: "#ff6b6b",
                    marginRight: "3px",
                  }}
                />
                <span>영문, 숫자명 파일만 첨부 가능합니다.</span>
              </div>
            </>
          )}
          {previewUrl && (
            <div className="image__preview">
              <img
                src={previewUrl}
                alt="미리보기"
                style={{ width: 250, height: 250 }}
              />
              <Tooltip title="파일 삭제" placement="right" arrow>
                <IconButton
                  className="clear__button"
                  onClick={handleDeleteImage}
                  sx={{
                    color: "#d6276a",
                    "&:hover": {
                      transition: "color 0.2s",
                    },
                  }}
                >
                  <ClearIcon
                    sx={{
                      transition: "color 0.2s",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          )}
          <div className="modal__buttons">
            <Button
              onClick={handleSave}
              sx={{
                width: "80px",
                height: "50px",
                color: "#fff",
                backgroundColor: "var(--check-color)",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "var(--check-active-color)",
                },
              }}
            >
              저장
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EmotionBoardPage;
