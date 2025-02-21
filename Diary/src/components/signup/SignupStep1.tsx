import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
} from "@mui/material";

interface Props {
  onNext: () => void;
}

const SignupStep1: React.FC<Props> = ({ onNext }) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!agreeTerms || !agreePrivacy) {
      setError("⚠ 약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.");
      return;
    }
    setError("");
    onNext(); // 다음 단계로 이동
  };

  return (
    <div className="signup-step">
      <h2>회원가입 - 약관 동의</h2>

      <div className="terms-box">
        <h3>이용약관</h3>
        <TextareaAutosize
          readOnly
          value="여기에 서비스 이용약관 내용을 넣으세요."
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
          }
          label="이용약관에 동의합니다."
        />
      </div>

      <div className="terms-box">
        <h3>개인정보 처리방침</h3>
        <textarea readOnly value="여기에 개인정보 처리방침 내용을 넣으세요." />
        <FormControlLabel
          control={
            <Checkbox
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
          }
          label="개인정보 처리방침에 동의합니다."
        />
      </div>

      {error && <p className="error-msg">{error}</p>}

      <Button variant="contained" onClick={handleNext} fullWidth>
        다음 단계
      </Button>
    </div>
  );
};

export default SignupStep1;
