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
  const today = new Date().toISOString().split("T")[0];
  const isToday = emotions.some((entry) => entry.date === today);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmotions = async () => {
      const { data, error } = await supabase
        .from("emotions")
        .select("id, date, emotion, note, created_at")
        .order("date", { ascending: false }) // 날짜 최신순
        .order("created_at", { ascending: false }); // 같은 날짜라면, 업로드 시간 최신순

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);

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
    const today = new Date().toISOString().split("T")[0];
    let uploadedImageUrl = "";

    // 이미지를 업로드한 경우 Supabase Storage에 업로드
    if (selectedFile) {
      const { data, error } = await supabase.storage
        .from("emotion-images") // Storage 버킷 이름
        .upload(`images/${Date.now()}-${selectedFile.name}`, selectedFile);

      if (error) {
        console.error("upload err:", error);
        return;
      }

      uploadedImageUrl = data?.path;
      // ? `https://test.supabase.co/storage/v1/object/public/emotion-images/${data.path}`
      // : "";
    }

    // 감정 데이터 저장
    const newEntry = {
      id: crypto.randomUUID(),
      date: today,
      emotion,
      note,
      image_url: uploadedImageUrl, // 업로드된 이미지 URL 저장
    };

    const { error } = await supabase.from("emotions").insert([newEntry]);

    if (error) {
      console.error("err:", error);
      return;
    }

    setEmotions((prev) => [newEntry, ...prev]);
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
        게시판
        <Tooltip
          title={!isToday ? "" : "🩷 오늘의 감정은 이미 등록되어 있어요 🩷"}
          placement="bottom-start"
          arrow
          disableHoverListener={!isToday}
        >
          <span>
            <button
              className={classNames("add-button", {
                disabled: isToday,
              })}
              onClick={() => openModal()}
              disabled={isToday}
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
          {/* 파일 첨부 */}
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="미리보기" />
            </div>
          )}

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
