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
} from "@mui/material";
import classNames from "classnames";
import { supabase } from "../../utils/supabaseClient";
import "./EmotionBoard.scss";

const emotionOptions = [
  "😊 기쁨",
  "😢 슬픔",
  "😡 분노",
  "😌 평온",
  "😱 놀람",
  "🥰 사랑",
];

const EmotionBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const emotions = useSelector((state: RootState) => state.emotions.emotions);
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
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  useEffect(() => {
    dispatch(fetchEmotions());
  }, [dispatch]);

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

    const today = new Date().toISOString().split("T")[0];
    let uploadedImageUrl = selectedEmotion?.image_url || "";

    if (selectedFile) {
      const { data, error } = await supabase.storage
        .from("emotion-images")
        .upload(`images/${Date.now()}-${selectedFile.name}`, selectedFile);

      if (error) {
        console.error("err:", error);
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
          console.error("err:", error);
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

  return (
    <div className="emotion-board">
      <h2>
        감정 일기
        <Tooltip
          title={!isToday ? "" : "🩷 오늘의 감정은 이미 등록되어 있어요 🩷"}
          placement="bottom-start"
          arrow
        >
          <span>
            <button
              className={classNames("add-button", { disabled: isToday })}
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
              {entry.image_url && (
                <img
                  src={entry.image_url}
                  alt="감정 이미지"
                  className="emotion-image"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 감정 추가 & 수정 모달 */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box className="modal-box">
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
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}

          {previewUrl && (
            <>
              <img
                src={previewUrl}
                alt="미리보기"
                style={{ width: 200, height: 200 }}
              />
              <button onClick={handleDeleteImage} className="delete-image-btn">
                ❌ 삭제
              </button>
            </>
          )}
          <Button onClick={handleSave}>저장</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EmotionBoard;
