import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { TextField, Button, Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPage } from "../../store/paginationSlice";
import { resetEmotions } from "../../store/emotionSlice";
import { fetchUser } from "../../store/authSlice";
import { AppDispatch } from "../../store/store";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !loginData.user) {
      setError("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
      return;
    }

    const userId = loginData.user.id;

    // delete_requests 테이블에서 탈퇴한 유저인지 확인
    const { data: requestData, error: requestError } = await supabase
      .from("delete_requests")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle(); // 없으면 null 반환됨

    if (requestError) {
      setError("서버 오류가 발생했습니다.");
      return;
    }

    if (requestData) {
      // 이미 탈퇴 요청한 유저일 경우
      await supabase.auth.signOut();
      setError("이미 탈퇴한 계정입니다. 6개월 뒤에 재가입 가능합니다.");
      return;
    }

    // 정상 로그인 처리
    dispatch(fetchUser());
    dispatch(resetPage());
    dispatch(resetEmotions());
    navigate("/");
  };

  // [비밀번호 찾기] 재설정 이메일 발송
  const handlePasswordReset = async () => {
    setResetMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: "http://localhost:3000/resetPassword",
    });

    if (error) {
      setResetMessage("비밀번호 재설정 요청 실패! 다시 시도해 주세요.");
      return;
    }

    setResetMessage(
      "비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해 주세요."
    );
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>

      <form onSubmit={handleLogin}>
        <TextField
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />
        {error && <p className="error-msg">{error}</p>}
        <Button type="submit" variant="contained">
          로그인
        </Button>
      </form>

      <p className="forgot-password">
        <Button onClick={() => setShowForgotPassword(true)}>
          비밀번호를 잊으셨나요?
        </Button>
      </p>

      {/* 비밀번호 찾기 모달 */}
      <Modal
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      >
        <Box className="modal-box">
          <h3>비밀번호 재설정</h3>
          <p>가입한 이메일을 입력하면 비밀번호 재설정 이메일을 보내드려요.</p>

          <TextField
            label="이메일 입력"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            margin="normal"
          />

          <Button variant="contained" onClick={handlePasswordReset}>
            비밀번호 재설정 링크 보내기
          </Button>

          {resetMessage && <p className="info-msg">{resetMessage}</p>}
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
