import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    // 회원가입 성공 시 자동 로그인 & 메인 페이지 이동
    navigate("/");
  };

  // 깃허브 & 구글 회원가입 (OAuth 방식)
  const handleOAuthSignup = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "http://localhost:3000" },
    });

    if (error) {
      console.error("OAuth login err:", error);
    } else {
      // 로그인 후 현재 계정이 어떤 provider인지 확인
      const { data } = await supabase.auth.getUser();
      console.log("login user:", data?.user?.app_metadata?.provider);
    }
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>

      <p className="auth-info">
        원하는 방식으로 회원가입하세요
        <br /> 깃허브나 구글 로그인 시, 자동으로 계정이 생성됩니다.
      </p>

      {/* 1️. 이메일 & 비밀번호 회원가입 */}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">회원가입</button>
      </form>

      <div className="divider">또는</div>

      {/* 2️. 깃허브 & 구글 로그인 */}
      <div className="oauth-buttons">
        <button onClick={() => handleOAuthSignup("github")}>
          🚀 GitHub로 가입
        </button>
        <button onClick={() => handleOAuthSignup("google")}>
          🌎 Google로 가입
        </button>
      </div>
    </div>
  );
};

export default Signup;
