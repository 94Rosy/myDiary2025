// EmotionCard.tsx
import React from "react";
import { EmotionEntry } from "../../store/emotionSlice";
import { Tooltip, IconButton } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import "./emotionCard.scss";

interface Props {
  entry: EmotionEntry;
  onEdit: (emotionEntry?: EmotionEntry) => void;
  onDelete: (id: string) => void;
}

const EmotionCard: React.FC<Props> = ({ entry, onDelete, onEdit }) => {
  return (
    <div className="emotion__card">
      <div className="emotion__header">
        {entry.emotion}
        <div className="card__buttons">
          <Tooltip title="수정하기" placement="bottom">
            <span>
              <IconButton
                className="edit__button"
                onClick={() => onEdit(entry)}
                sx={{
                  backgroundColor: "#cbe0c3",
                  "&:hover": {
                    backgroundColor: "#b2cfa4",
                    color: "#fff",
                    transition: "color 0.2s",
                  },
                }}
              >
                <AutoFixHighIcon sx={{ transition: "color 0.2s" }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="지우기" placement="bottom">
            <span>
              <IconButton
                className="delete__button"
                onClick={() => onDelete(entry.id)}
                sx={{
                  backgroundColor: "#e8b4b8",
                  "&:hover": {
                    backgroundColor: "#e89ca4",
                    color: "#fff",
                    transition: "color 0.2s",
                  },
                }}
              >
                <DeleteIcon sx={{ transition: "color 0.2s" }} />
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
  );
};

export default EmotionCard;
