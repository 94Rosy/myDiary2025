import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  prevStep: () => void;
}

const SignupStep2: React.FC<Props> = ({ prevStep }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("⚠ 올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // users 테이블에서 이메일 중복 확인
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setError("⚠ 이메일 중복 확인 중 오류가 발생했습니다.");
      return;
    }

    if (existingUser) {
      setEmailError("⚠ 중복된 이메일입니다.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "⚠ 비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다."
      );
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("⚠ 비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("😊 이메일 인증을 완료한 후 로그인해 주세요.");
    localStorage.setItem("signupComplete", "true");
    navigate("/");

    // Supabase Auth에 회원가입 요청
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError("⚠ 회원가입 실패! 다시 시도해 주세요.");
      console.error("회원가입 오류:", signUpError.message);
      return;
    }

    // 최신 유저 정보 가져오기 (이메일 인증 후 데이터 저장을 위해)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error(
          "⚠ 유저 정보를 가져오는 데 실패했습니다.",
          authError?.message
        );
        clearInterval(interval);
        return;
      }

      if (authData?.user?.email_confirmed_at) {
        clearInterval(interval); // 인증 완료되면 루프 중지

        console.log("이메일 인증 완료 후 유저 ID:", authData.user.id);

        // users 테이블에 id와 email 저장
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: authData.user.id, email, name }]); // id 값을 authData.user.id로 설정

        if (insertError) {
          console.error("⚠ 유저 정보 저장 오류:", insertError.message);
        } else {
          console.log("📌 users 테이블에 데이터 저장 완료!");
        }
      }

      // 10번 (약 1분) 시도 후 중단
      if (attempts > 10) {
        clearInterval(interval);
        alert("이메일 인증이 확인되지 않았어요. 인증 후 다시 로그인해 주세요.");
      }
    }, 6000); // 6초마다 확인
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>

      <form onSubmit={handleSignup}>
        {/* 이메일 입력 */}
        <TextField
          label="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          label="닉네임"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* 비밀번호 입력 */}
        <TextField
          label="비밀번호 입력"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={!!passwordError}
          helperText={passwordError}
        />

        {/* 비밀번호 재입력 */}
        <TextField
          label="비밀번호 재입력"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />

        {error && <p className="error-msg">{error}</p>}

        <div className="button-container">
          <Button variant="outlined" onClick={() => prevStep()}>
            이전으로
          </Button>
          <Button type="submit" variant="contained" color="primary">
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupStep2;
