import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
} from "@mui/material";
import "./signup1.scss";
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

  const termsText = `
제1조 (목적)
이 약관은 EmotionLog 서비스의 이용 조건 및 절차에 관한 사항을 규정합니다.

제2조 (서비스의 제공)
1. 사용자는 본 서비스를 통해 감정 일기를 작성할 수 있습니다.
2. 서비스는 웹 기반으로 제공됩니다.

제3조 (이용자의 의무)
- 타인의 정보를 도용해서는 안 됩니다.
- 사용자는 감정 콘텐츠에 대한 책임을 집니다.
- 비속어, 욕설, 문제 되는 언어 사용을 금지합니다.
- 무분별한 유출을 금지합니다.

제4조 (회원가입의 성립)
- 회원가입의 동의는 "약관 내용에 동의함" 체크를 함으로써 그 효력이 발생합니다.
`;

  const privacyText = `
1. 수집 항목: 이메일, 닉네임, 감정 데이터
2. 수집 목적: 사용자 인증, 감정 통계 제공
3. 보관 기간: 회원 탈퇴 시점부터 6개월간 보관되며, 이후 안전하게 삭제됩니다.
`;

  return (
    <div className="signup__step1">
      <h2>회원가입</h2>

      <div className="terms__box">
        <h3>이용약관</h3>
        <TextareaAutosize readOnly value={termsText} />
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

      <div className="terms__box">
        <h3>개인정보 처리방침</h3>
        <TextareaAutosize readOnly value={privacyText} />
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

      {error && <p className="error__msg">{error}</p>}
      <Button variant="contained" onClick={handleNext} fullWidth>
        다음 단계
      </Button>
    </div>
  );
};

export default SignupStep1;
