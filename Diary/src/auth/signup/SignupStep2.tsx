import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchUser, signupUser } from "../../store/authSlice";
import "./signup2.scss";

interface Props {
  prevStep: () => void;
}

const SignupStep2: React.FC<Props> = ({ prevStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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

    // 에러 초기화
    setError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // 유효성 검사 - 이메일
    if (!validateEmail(email)) {
      setEmailError("⚠ 올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 유효성 검사 - 비밀번호
    if (!validatePassword(password)) {
      setPasswordError(
        "⚠ 비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다."
      );
      return;
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setConfirmPasswordError("⚠ 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 탈퇴 유저 확인
    const { data: deletedUser } = await supabase
      .from("delete_requests")
      .select("email")
      .eq("email", email)
      .single();

    if (deletedUser) {
      setEmailError(
        "⚠ 이 이메일은 탈퇴 처리된 계정입니다. 6개월 후 재가입 가능합니다."
      );
      return;
    }

    // 회원가입
    dispatch(signupUser({ email, password, name }))
      .unwrap()
      .then(() => {
        alert("이메일 인증을 완료하신 후 가입됩니다. 😇");
        navigate("/");
        dispatch(fetchUser());
      })
      .catch((err: string) => {
        setError(`회원가입 실패: ${err}`);
      });
  };

  return (
    <div className="signup__step2">
      <h2>회원가입</h2>

      <div className="sign__box">
        <form onSubmit={handleSignup}>
          <span>이메일</span>
          <TextField
            label="이메일 입력"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            required
            error={!!emailError}
            helperText={emailError}
          />

          <span>닉네임</span>
          <TextField
            label="닉네임 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <span>비밀번호</span>
          <TextField
            label="비밀번호 입력"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            error={!!passwordError}
            helperText={passwordError}
          />

          <span>비밀번호 재입력</span>
          <TextField
            label="비밀번호 재입력"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />

          <div className="button__container">
            <Button variant="outlined" onClick={() => prevStep()}>
              이전으로
            </Button>
            <Button type="submit" variant="contained" color="primary">
              회원가입
            </Button>
          </div>
          {error && <p className="error__msg">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupStep2;
