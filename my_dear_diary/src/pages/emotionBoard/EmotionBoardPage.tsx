import React, { useEffect, useState } from "react";
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
import { supabase } from "../../utils/supabaseClient"; // Supabase 불러오기
import "./EmotionBoard.scss";

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

  useEffect(() => {
    const fetchEmotions = async () => {
      const { data, error } = await supabase.from("emotions").select("*");

      if (error) {
        console.error("err:", error);
        return;
      }

      setEmotions(data || []);
    };

    fetchEmotions();
  }, []);

  const openModal = (emotion?: EmotionEntry) => {
    setSelectedEmotion(emotion || null);
    setEmotion(emotion?.emotion || "😊 기쁨");
    setNote(emotion?.note || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmotion(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (selectedEmotion) {
      // 감정 수정
      const { error } = await supabase
        .from("emotions")
        .update({ emotion, note })
        .eq("id", selectedEmotion.id);

      if (error) {
        console.error("err:", error);
        return;
      }

      setEmotions((prev) =>
        prev.map((entry) =>
          entry.id === selectedEmotion.id ? { ...entry, emotion, note } : entry
        )
      );
    } else {
      // 감정 추가
      const today = new Date().toISOString().split("T")[0];
      const newEntry = { id: crypto.randomUUID(), date: today, emotion, note };

      const { error } = await supabase.from("emotions").insert([newEntry]);

      if (error) {
        console.error("err:", error);
        return;
      }

      setEmotions((prev) => [...prev, newEntry]);
    }

    closeModal();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("emotions").delete().eq("id", id);

    if (error) {
      console.error("err:", error);
      return;
    }

    setEmotions((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="emotion-board">
      <h2>
        감정 다이어리
        <Tooltip
          title={
            !emotions.length ? "" : "🩷 오늘의 감정은 이미 등록되어 있어요 🩷"
          }
          placement="bottom-start"
          arrow
          disableHoverListener={!emotions.length}
        >
          <span>
            <button
              className={classNames("add-button", {
                disabled: emotions.length,
              })}
              onClick={() => openModal()}
              disabled={emotions.length > 0}
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

      {/* 감정 추가 & 수정 모달 */}
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
