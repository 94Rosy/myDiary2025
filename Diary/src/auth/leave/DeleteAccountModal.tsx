import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import "./deleteAccountModal.scss";
interface Props {
  onClose: () => void;
  onDelete: (finalReason: string, password: string) => void;
}

const DeleteAccountModal: React.FC<Props> = ({ onClose, onDelete }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [password, setPassword] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const reasons = [
    "회원탈퇴 기능 확인 중이에요.",
    "기능을 다 확인했어요.",
    "개인정보 삭제를 원해요.",
    "기타 (직접 입력)",
  ];

  const handleReasonChange = (e: SelectChangeEvent) => {
    setReason(e.target.value);
    if (e.target.value === "개인정보 삭제를 원해요.") {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = () => {
    const finalReason = reason === "기타 (직접 입력)" ? customReason : reason;
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    onDelete(finalReason, password);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box className="modal__leave__box">
        <div className="modal__header">
          <h2>회원탈퇴</h2>
          <p>탈퇴 사유를 선택해주세요.</p>
        </div>

        <div className="modal__body">
          <FormControl fullWidth margin="normal">
            <InputLabel>사유 선택</InputLabel>
            <Select
              value={reason}
              onChange={handleReasonChange}
              displayEmpty
              fullWidth
            >
              {reasons.map((i, idx) => (
                <MenuItem key={idx} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>

            {reason === "기타 (직접 입력)" && (
              <TextField
                type="text"
                placeholder="탈퇴 사유를 입력하세요."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                fullWidth
                sx={{ marginTop: "10px" }}
              />
            )}
          </FormControl>
          {showWarning && (
            <p className="warning">
              ⚠️ 개인정보는 즉시 삭제되지 않으며, 6개월 후 삭제됩니다.
            </p>
          )}

          <TextField
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{ marginTop: "10px" }}
          />

          <div className="modal__footer">
            <Button
              onClick={onClose}
              sx={{
                width: "80px",
                height: "50px",
                color: "#4a4a4a",
                margin: "5px",
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
              className="leave"
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
              onClick={handleSubmit}
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteAccountModal;
