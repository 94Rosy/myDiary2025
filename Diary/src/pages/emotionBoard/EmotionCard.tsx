import React, { useState } from "react";
import { EmotionEntry } from "../../store/emotionSlice";
import { Tooltip, IconButton, Modal, Box, Button } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./emotionCard.scss";
import classNames from "classnames";

interface Props {
  entry: EmotionEntry;
  onEdit: (emotionEntry?: EmotionEntry) => void;
  onDelete: (id: string) => void;
}

const EmotionCard: React.FC<Props> = ({ entry, onDelete, onEdit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // 테스트 유저
  const isTestUser = user?.email === "test@emolog.com";

  const edit__msg = () => {
    if (isTestUser) return "테스트 계정은 수정이 제한되어 있습니다.";

    return "수정하기";
  };

  const delete__msg = () => {
    if (isTestUser) return "테스트 계정은 삭제가 제한되어 있습니다.";

    return "지우기";
  };

  return (
    <div className="emotion__card">
      <div className="emotion__header">
        {entry.emotion}
        <div className="card__buttons">
          <Tooltip title={edit__msg()} placement="bottom">
            <span>
              <IconButton
                className={classNames("edit__button", {
                  disabled: isTestUser,
                })}
                disabled={isTestUser}
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

          <Tooltip title={delete__msg()} placement="bottom">
            <span>
              <IconButton
                className={classNames("delete__button", {
                  disabled: isTestUser,
                })}
                disabled={isTestUser}
                onClick={() => setConfirmDelete(true)}
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

      {/* 삭제 확인 모달 */}
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <Box className="modal__delete__box">
          <div className="delete__msg">
            <p>선택한 감정을 삭제하시겠습니까?</p>
          </div>

          <div className="modal__buttons">
            <Button
              onClick={() => setConfirmDelete(false)}
              sx={{
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
              onClick={() => {
                onDelete(entry.id);
                setConfirmDelete(false);
              }}
              sx={{
                color: "#fff",
                backgroundColor: "var(--check-color)",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "var(--check-active-color)",
                },
              }}
            >
              삭제
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EmotionCard;
