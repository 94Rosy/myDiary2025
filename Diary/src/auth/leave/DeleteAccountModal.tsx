// 회원 탈퇴 모달
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { User } from "@supabase/supabase-js";
import { deleteUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
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
import "./deleteAccountModal.scss";
interface Props {
  onClose: () => void;
  user: User;
}

const DeleteAccountModal: React.FC<Props> = ({ onClose, user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [password, setPassword] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  // 계정 탈퇴 처리 핸들러
  const handleDeleteAccount = async (finalReason: string, password: string) => {
    if (!user) return;

    // 비밀번호 확인 로직
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (error || !data?.user) {
      alert("비밀번호가 올바르지 않습니다.");
      return;
    }

    // 탈퇴 처리 (Redux Thunk)
    dispatch(
      deleteUser({
        user_id: user.id,
        reason: finalReason || "",
        email: user.user_metadata?.email || "",
      })
    );

    navigate("/"); // 메인으로 이동
    onClose();
  };

  const reasons = [
    "회원탈퇴 기능 확인 중이에요.",
    "기능을 다 확인했어요.",
    "개인정보 삭제를 원해요.",
    "(기타) 피드백을 드려요.",
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
    const finalReason =
      reason === "(기타) 피드백을 드려요." ? customReason : reason;
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    handleDeleteAccount(finalReason, password);
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

            {reason === "(기타) 피드백을 드려요." && (
              <TextField
                type="text"
                placeholder="피드백이 있다면 알려주세요. :)"
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
