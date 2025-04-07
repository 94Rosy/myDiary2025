import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import "./signup1.scss";

const Signup = () => {
  const [step, setStep] = useState(1); // 현재 스텝 상태 관리

  return (
    <div className="auth__container">
      {step === 1 ? (
        <SignupStep1 onNext={() => setStep(2)} />
      ) : (
        <SignupStep2 prevStep={() => setStep(1)} />
      )}
    </div>
  );
};

export default Signup;
