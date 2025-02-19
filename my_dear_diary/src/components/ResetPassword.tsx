import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 확인
  const navigate = useNavigate();

  // 📌 페이지 진입 시 로그인 상태 확인 후 자동 로그아웃 처리
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setIsLoggedIn(false); // 유저 정보가 없으면 로그인되지 않은 상태
      } else {
        await supabase.auth.signOut(); // 로그인된 경우 로그아웃
        setIsLoggedIn(false); // 로그아웃 후 비로그인 상태로 변경
      }
    };
    checkAuth();
  }, []);

  // 📌 비밀번호 재설정 함수
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("⚠ 비밀번호가 일치하지 않습니다!");
      return;
    }

    if (newPassword.length < 8) {
      setError("⚠ 비밀번호는 8자 이상이어야 합니다!");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError("비밀번호 변경 실패! 다시 시도해 주세요.");
      console.error("비밀번호 변경 오류:", error.message);
      return;
    }

    setSuccessMessage(
      "✅ 비밀번호가 변경되었습니다! 로그인 페이지로 이동합니다."
    );

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="auth-container">
      <h2>비밀번호 재설정</h2>

      {isLoggedIn ? (
        <p>잠시만 기다려 주세요...</p> // 로그인 확인 중
      ) : (
        <>
          <p>새 비밀번호를 입력하고 변경하세요.</p>

          <form onSubmit={handleResetPassword}>
            <TextField
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
            />

            {error && <p className="error-msg">{error}</p>}
            {successMessage && <p className="success-msg">{successMessage}</p>}

            <Button type="submit" variant="contained">
              비밀번호 변경
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
