import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Box, Button, Modal, TextField, Tooltip } from "@mui/material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  // 이메일 안내 모달
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 비밀번호 유효성 검사 (8자 이상, 숫자 및 특수문자 포함)
  const validatePassword = (password: string) => {
    const regex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError(false);
    setPasswordError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }

    // 1. Supabase에서 회원가입 요청 (users 테이블에는 아직 저장 X)
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError("회원가입 실패! 다시 시도해 주세요.");
      console.error("error:", error.message);
      return;
    }

    // 2. 이메일 인증 모달 띄우기
    setShowVerifyModal(true);
    await supabase.auth.signOut(); // 이메일 인증이 필요하기 때문에 바로 로그인되지 않음

    // 3. 이메일 인증 확인 시작
    checkEmailConfirmation(data?.user?.id); // 이메일 인증 확인 함수 호출
  };

  // 이메일 인증 확인 함수
  const checkEmailConfirmation = async (userId: string | undefined) => {
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("error:", error.message);
        clearInterval(interval);
        return;
      }

      // 4. 이메일 인증 확인 후 `users` 테이블에 저장
      if (data?.user?.email_confirmed_at) {
        clearInterval(interval);
        setShowVerifyModal(false);

        // 이제 users 테이블에 저장
        if (userId) {
          const { error: dbError } = await supabase.from("users").insert([
            {
              id: userId, // Supabase에서 받은 유저 UUID 사용
              email: data.user.email, // 유저 이메일 저장
              created_at: new Date(), // 가입 날짜 저장
            },
          ]);

          if (dbError) {
            console.error("error:", dbError.message);
          }
        }
      }

      // 10번 (약 1분) 시도 후 중단
      if (attempts > 10) {
        clearInterval(interval);
        alert("이메일 인증이 확인되지 않았어요. 인증 후 다시 로그인해 주세요.");
      }
    }, 6000); // 6초마다 확인
  };

  // 이메일 재전송
  const resendEmailHandler = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      console.error("인증 이메일 재발송 오류:", error.message);
      return;
    }

    alert("인증 이메일을 다시 보냈습니다. 받은 편지함을 확인해 주세요.");
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>

      <form onSubmit={handleSignup}>
        {/* 이메일 유효성 검사 */}
        <TextField
          label="이메일 입력"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false); // 이메일 입력 시 오류 메시지 초기화
          }}
          required
          error={emailError}
          helperText={emailError ? "올바른 이메일 형식을 입력하세요." : ""}
        />

        {/* 비밀번호 유효성 검사 */}
        <Tooltip
          title="비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다."
          placement="bottom"
          arrow
          open={password.length > 0 && !validatePassword(password)}
        >
          <TextField
            label="비밀번호 입력"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            required
            error={passwordError}
            helperText={passwordError ? "비밀번호 조건을 확인하세요." : ""}
          />
        </Tooltip>

        {error && <p className="error-msg">{error}</p>}
        <Button type="submit" variant="contained">
          회원가입
        </Button>
      </form>

      <Modal open={showVerifyModal} onClose={() => setShowVerifyModal(false)}>
        <Box className="modal-box">
          <h3>이메일 인증이 필요합니다.</h3>
          <p>
            입력한 이메일로 인증 메일이 발송되었습니다. 받은 편지함 혹은 스팸
            메일함을 확인하고 인증을 완료한 후 다시 로그인해 주세요.
          </p>
          <Button variant="contained" onClick={() => setShowVerifyModal(false)}>
            확인
          </Button>
          <Button variant="outlined" onClick={resendEmailHandler}>
            이메일 인증 다시 보내기
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Signup;
