// 감정 게시판

import React, { useState, useEffect } from "react";
import "./EmotionBoard.scss";
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
} from "@mui/material";
import classNames from "classnames";

// 감정 데이터 타입 정의
type EmotionEntry = {
  id: string;
  date: string;
  emotion: string;
  note?: string;
};

const emotionOptions = [
  "😊 기쁨",
  "😢 슬픔",
  "😡 분노",
  "😌 평온",
  "😱 놀람",
  "🥰 사랑",
];

const EmotionBoard: React.FC = () => {
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionEntry | null>(
    null
  );
  const [emotion, setEmotion] = useState("😊 기쁨");
  const [note, setNote] = useState("");
  const [canAdd, setCanAdd] = useState(true);

  // API에서 데이터 가져오기 (Read)
  useEffect(() => {
    fetch("http://localhost:5000/emotions")
      .then((res) => res.json())
      .then((data) => {
        setEmotions(data);
        // 오늘 날짜에 등록된 감정이 있는지 확인
        const today = new Date().toISOString().split("T")[0];
        setCanAdd(!data.some((entry: EmotionEntry) => entry.date === today));
      });
  }, []);

  // 감정 추가 또는 수정 (Create & Update)
  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedEmotion) {
      // Update (수정)
      await fetch(`http://localhost:5000/emotions/${selectedEmotion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedEmotion, emotion, note }),
      });
    } else {
      // Create (새로운 감정 추가)
      const newEntry = {
        id: String(Date.now()),
        date: today,
        emotion,
        note,
      };
      await fetch("http://localhost:5000/emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      setEmotions((prev) => [...prev, newEntry]); // 바로 업데이트
      setCanAdd(false);
    }

    // 변경된 데이터 다시 불러오기
    fetch("http://localhost:5000/emotions")
      .then((res) => res.json())
      .then((data) => setEmotions(data));

    closeModal();
  };

  // 감정 삭제 (Delete)
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/emotions/${id}`, { method: "DELETE" });
    setEmotions(emotions.filter((entry) => entry.id !== id));

    // 삭제 후 오늘 날짜의 감정이 없으면 등록 버튼 활성화
    const today = new Date().toISOString().split("T")[0];
    setCanAdd(
      !emotions.some((entry) => entry.id !== id && entry.date === today)
    );
  };

  const openModal = (emotion?: EmotionEntry) => {
    setSelectedEmotion(emotion || null);
    setEmotion(emotion?.emotion || "😊 기쁨");
    setNote(emotion?.note || "");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="emotion-board">
      <h2>
        감정 다이어리
        <Tooltip
          title={canAdd ? "" : "🩷 오늘의 감정은 이미 등록되어 있어요 🩷"}
          placement="bottom-start"
          arrow
          disableHoverListener={canAdd}
        >
          <span>
            <button
              className={classNames("add-button", { disabled: !canAdd })}
              onClick={() => openModal()}
              disabled={!canAdd}
            >
              등록
            </button>
          </span>
        </Tooltip>
      </h2>

      <div className="emotion-grid">
        {emotions.map((entry) => (
          <div key={entry.id} className="emotion-card">
            <div className="emotion-header">
              {entry.emotion}
              <div className="card-buttons">
                <button
                  className="edit-button"
                  onClick={() => openModal(entry)}
                >
                  수정
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(entry.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="emotion-body">
              <p className="date">{entry.date}</p>
              <p className="note">{entry.note}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box className="modal-box">
          <h3>{selectedEmotion ? "감정 수정" : "감정 등록"}</h3>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel shrink={!!emotion}>감정 선택</InputLabel>
            <Select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              displayEmpty
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
            margin="normal"
            multiline
            rows={3}
          />
          <div className="modal-buttons">
            <Button
              variant="contained"
              className="save-button"
              onClick={handleSave}
            >
              저장
            </Button>
            <Button
              variant="outlined"
              className="cancel-button"
              onClick={closeModal}
            >
              취소
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EmotionBoard;
