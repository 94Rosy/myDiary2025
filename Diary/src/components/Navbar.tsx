import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import DeleteAccountModal from "./leave/DeleteAccountModal";
import "../styles/navbar.scss";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 유저 정보를 불러오는 함수
    const fetchUser = async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        console.error("err:", authError?.message);
        setUser(null);
        setUserName(null);
        return;
      }

      setUser(authData.user);

      // 닉네임 가져오기
      const { data: userData, error: nameError } = await supabase
        .from("users")
        .select("name")
        .eq("id", authData.user.id)
        .single();

      if (nameError) {
        console.error("err:", nameError.message);
        setUserName("게스트");
      } else {
        setUserName(userData?.name || "게스트");
      }
    };

    fetchUser(); // 페이지 로드 시 유저 정보 가져오기

    // 로그인/로그아웃 상태 감지 후 자동 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          fetchUser(); // 로그인 시 유저 정보 다시 가져오기
        } else if (event === "SIGNED_OUT") {
          // 로그아웃 감지됨
          setUser(null);
          setUserName(null);
          navigate("/login"); // 로그인 페이지로 이동
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 처리 (완벽한 상태 업데이트)
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("err:", error.message);
      return;
    }

    // 로그아웃 후 세션 강제 제거
    await supabase.auth.getSession(); // 세션 정보 강제 갱신

    setUser(null);
    setUserName(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🩷💛💚💙❤️</Link>
      </div>
      <nav>
        <ul>
          {user ? (
            <li>
              <span className="user-name">{userName}님 어서오세요!</span>
              {/* 닉네임 유지 */}
              <button className="logout-btn" onClick={handleLogout}>
                🔓로그아웃
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/signup" className="signup-btn">
                  💡회원가입
                </Link>
              </li>
              <li>
                <Link to="/login" className="login-btn">
                  🔒로그인
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/emotionList">💟감정 일기</Link>
          </li>
          <li>
            <Link to="/dashboard">📊감정 차트</Link>
          </li>
          <li>
            <Link to="/contact">🤗오늘의 위로</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
