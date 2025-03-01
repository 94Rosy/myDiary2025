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
import { supabase } from "../../utils/supabaseClient"; // Supabase 연결
import "./EmotionBoard.scss";

type EmotionEntry = {
  id: string;
  date: string;
  emotion: string;
  note?: string;
  image_url?: string | null;
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

  // Supabase에서 감정 데이터 가져오기
  useEffect(() => {
    const fetchEmotions = async () => {
      const { data, error } = await supabase
        .from("emotions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("error:", error);
      } else {
        setEmotions(data || []);
      }
    };

    fetchEmotions();
  }, []);

  // 이미지 파일 업로드 (Supabase Storage 연동)
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
    let uploadedImageUrl = selectedEmotion?.image_url || "";

    // 현재 로그인한 유저 정보 가져오기
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const user_id = user.user.id; // 현재 로그인한 유저 ID

    // 이미지 업로드 (수정하는 경우 기존 이미지 유지)
    if (selectedFile) {
      const { data, error } = await supabase.storage
        .from("emotion-images")
        .upload(`images/${Date.now()}-${selectedFile.name}`, selectedFile);

      if (error) {
        console.error("err:", error);
        return;
      }

      // getPublicUrl()을 올바르게 가져오기
      const { data: publicUrlData } = supabase.storage
        .from("emotion-images")
        .getPublicUrl(data.path);
      // getPublicUrl: Supabase에서 퍼블릭하게 접근할 수 있는 파일 URL을 가져오는 기능

      uploadedImageUrl = publicUrlData?.publicUrl || "";
    }

    if (selectedEmotion) {
      // 기존 데이터가 있으면 UPDATE 실행
      const { error } = await supabase
        .from("emotions")
        .update({
          emotion,
          note,
          image_url: uploadedImageUrl,
        })
        .eq("id", selectedEmotion.id)
        .eq("user_id", user_id); // 본인이 작성한 데이터만 수정 가능

      if (error) {
        console.error("err:", error);
        return;
      }

      // 수정된 데이터 UI 업데이트
      setEmotions((prev) =>
        prev.map((entry) =>
          entry.id === selectedEmotion.id
            ? { ...entry, emotion, note, image_url: uploadedImageUrl }
            : entry
        )
      );
    } else {
      // 새로운 데이터면 INSERT 실행
      const newEntry = {
        id: crypto.randomUUID(),
        date: today,
        emotion,
        note,
        image_url: uploadedImageUrl,
        user_id, // 유저 ID 추가
      };

      const { error } = await supabase.from("emotions").insert([newEntry]);

      if (error) {
        console.error("err:", error);
        return;
      }

      setEmotions((prev) => [newEntry, ...prev]);
    }

    closeModal();
  };

  // 감정 데이터 삭제
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("emotions").delete().eq("id", id);

    if (error) {
      console.error("err:", error);
      return;
    }

    setEmotions((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleDeleteImage = async () => {
    if (!selectedEmotion || !selectedEmotion.image_url) {
      return;
    }

    // Supabase Storage에서 이미지 삭제
    const imagePath = selectedEmotion.image_url.split(
      "/storage/v1/object/public/emotion-images/"
    )[1];

    const { error } = await supabase.storage
      .from("emotion-images")
      .remove([imagePath]);

    if (error) {
      console.error("error:", error);
      return;
    }

    // 감정 데이터에서 image_url 제거
    const { error: updateError } = await supabase
      .from("emotions")
      .update({ image_url: null })
      .eq("id", selectedEmotion.id);

    if (updateError) {
      console.error("error:", updateError);
      return;
    }

    // UI에서 이미지 삭제 반영
    setEmotions((prev) =>
      prev.map((entry) =>
        entry.id === selectedEmotion.id ? { ...entry, image_url: null } : entry
      )
    );

    alert("이미지가 삭제되었습니다.");
    // setIsModalOpen(false);
  };

  // 모달 상태 관리
  const openModal = (emotionEntry?: EmotionEntry) => {
    setSelectedEmotion(emotionEntry || null);
    setEmotion(emotionEntry?.emotion || "😊 기쁨");
    setNote(emotionEntry?.note || "");
    setPreviewUrl(emotionEntry?.image_url || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmotion(null);
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="emotion-board">
      <h2>
        게시판
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
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
          {/* {selectedEmotion?.image_url && (
            <div className="image-preview">
              <img
                src={selectedEmotion.image_url}
                alt="첨부 이미지"
                style={{ width: 200, height: 200 }}
              />
              <button onClick={handleDeleteImage} className="delete-image-btn">
                ❌ 삭제
              </button>
            </div>
          )} */}
          <Button onClick={handleSave}>저장</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EmotionBoard;
