import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./resetPassword.scss";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // 비밀번호 유효성 검사 (8자 이상, 숫자 & 특수문자 포함)
  const validatePassword = (password: string) => {
    const regex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // 비밀번호 재설정 함수
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setPasswordError("");

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "⚠ 비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("⚠ 비밀번호가 일치하지 않습니다.");
      return;
    }

    // Supabase 비밀번호 변경 요청
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    // 기존 비밀번호와 동일하면 Supabase에서 422 오류 반환
    if (error) {
      if (
        error.message.includes(
          "New password should be different from the old password"
        )
      ) {
        setPasswordError("⚠ 기존 비밀번호와 동일할 수 없습니다.");
        return;
      }

      setError("⚠ 비밀번호 변경 실패! 다시 시도해 주세요.");
      console.error("비밀번호 변경 오류:", error.message);
      return;
    }

    // 비밀번호 변경 성공 후, 입력값 초기화
    setNewPassword("");
    setConfirmPassword("");

    setSuccessMessage("😊 비밀번호가 변경되었습니다! 다시 로그인해 주세요.");

    // 2초 후 자동 로그아웃 & 로그인 페이지 이동
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="reset__wrapper">
      <h2>비밀번호 재설정</h2>
      <p>새 비밀번호를 입력하고 변경하세요.</p>

      <div className="sign__box">
        <form onSubmit={handleResetPassword}>
          {/* 기존 비밀번호와 동일한 경우 에러 메시지로 표시 */}
          <span>새 비밀번호</span>

          <TextField
            label="새 비밀번호 입력"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError(""); // 입력 시 에러 메시지 초기화
            }}
            required
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
          />

          {/* 비밀번호 확인 필드 */}
          <span>새 비밀번호 재입력</span>
          <TextField
            label="새 비밀번호 재입력"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
            error={!!error}
            helperText={error}
          />

          <div className="button__container">
            <Button type="submit" variant="contained">
              비밀번호 변경
            </Button>
          </div>
          {successMessage && <p className="success-msg">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
