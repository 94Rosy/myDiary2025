import { Box, Modal } from "@mui/material";
import { useState } from "react";

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
    "서비스를 다 확인했어요",
    "기능을 다 확인했어요",
    "개인정보 삭제를 원해요",
    "기타 (직접 입력)",
  ];

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReason(e.target.value);
    if (e.target.value === "개인정보 삭제를 원해요") {
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
      <Box className="delete-modal">
        <div className="modal-overlay">
          <div className="modal">
            <h2>회원탈퇴</h2>
            <p>탈퇴 사유를 선택해주세요.</p>
            <select value={reason} onChange={handleReasonChange}>
              <option value="">사유 선택</option>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {reason === "기타 (직접 입력)" && (
              <input
                type="text"
                placeholder="탈퇴 사유를 입력하세요"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
            {showWarning && (
              <p className="warning">
                ⚠️ 개인정보는 즉시 삭제되지 않으며, 6개월 후 완전히 삭제됩니다.
              </p>
            )}
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={onClose}>취소</button>
              <button onClick={handleSubmit} className="delete">
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteAccountModal;
