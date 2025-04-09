import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  addEmotion,
  EmotionEntry,
  updateEmotion,
  startGridLoading,
  stopGridLoading,
} from "../../../store/emotionSlice";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import { supabase } from "../../../utils/supabaseClient";

interface Props {
  today: string;
  selectedEmotion: EmotionEntry | null;
  emotionOptions: string[];
  onClose: () => void;
}

const EmotionNoteModal: React.FC<Props> = ({
  selectedEmotion,
  today,
  emotionOptions,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [emotion, setEmotion] = useState("😊 기쁨");
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

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

    dispatch(startGridLoading());
    await new Promise((res) => setTimeout(res, 250));

    try {
      let uploadedImageUrl = selectedEmotion?.image_url || "";

      if (selectedFile) {
        const { data, error } = await supabase.storage
          .from("emotion-images")
          .upload(`images/${Date.now()}-${selectedFile.name}`, selectedFile);

        if (error) throw new Error(error.message);

        const { data: publicUrlData } = supabase.storage
          .from("emotion-images")
          .getPublicUrl(data.path);

        uploadedImageUrl = publicUrlData?.publicUrl || "";
      }

      if (selectedEmotion) {
        if (isImageDeleted) uploadedImageUrl = "";

        await dispatch(
          updateEmotion({
            ...selectedEmotion,
            emotion,
            note,
            image_url: uploadedImageUrl,
          })
        ).unwrap();
      } else {
        await dispatch(
          addEmotion({
            id: crypto.randomUUID(),
            date: today,
            emotion,
            note,
            image_url: uploadedImageUrl,
          })
        ).unwrap();
      }

      // 이미지 삭제 로직
      if (isImageDeleted && selectedEmotion?.image_url) {
        const imagePath = selectedEmotion.image_url.split(
          "/storage/v1/object/public/emotion-images/"
        )[1];
        if (imagePath) {
          await supabase.storage.from("emotion-images").remove([imagePath]);
        }
      }

      onClose();
    } catch (err) {
      console.error("감정 저장 실패:", err);
    } finally {
      dispatch(stopGridLoading());
    }
  };

  const handleDeleteImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsImageDeleted(true);
  };

  useEffect(() => {
    if (selectedEmotion) {
      setEmotion(selectedEmotion.emotion);
      setNote(selectedEmotion?.note || "");
      setPreviewUrl(selectedEmotion.image_url || null);
    } else {
      setEmotion("😊 기쁨");
      setNote("");
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsImageDeleted(false);
  }, [selectedEmotion]);

  return (
    <Box className="modal__emotion__box">
      <h3>{selectedEmotion ? "감정 수정" : "감정 등록"}</h3>
      <FormControl fullWidth margin="normal">
        <InputLabel>감정 선택</InputLabel>
        <Select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
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
              sx={{ color: "#d6276a", "&:hover": { transition: "color 0.2s" } }}
            >
              <ClearIcon sx={{ transition: "color 0.2s" }} />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <div className="modal__buttons">
        <Button
          onClick={onClose}
          sx={{
            width: "80px",
            height: "50px",
            color: "#4a4a4a",
            backgroundColor: "var(--cancel-button)",
            "&:hover": {
              color: "#4a4a4a",
              backgroundColor: "var(--cancel-button-hover)",
            },
          }}
        >
          취소
        </Button>
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
  );
};

export default EmotionNoteModal;
