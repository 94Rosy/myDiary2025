import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // GitHub & Google 로그인 핸들러
  const handleOAuthLogin = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "http://localhost:3000" }, // 배포 시 실제 도메인으로 변경
    });

    if (error) {
      console.error("OAuth 로그인 오류:", error);
    }

    // 로그인 성공 시 메인 페이지 이동
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>

      {/* 🔹 GitHub 로그인 버튼 */}
      <button onClick={() => handleOAuthLogin("github")}>
        GitHub로 로그인
      </button>

      {/* 🔹 Google 로그인 버튼 */}
      <button onClick={() => handleOAuthLogin("google")}>
        Google로 로그인
      </button>
    </div>
  );
};

export default Login;
