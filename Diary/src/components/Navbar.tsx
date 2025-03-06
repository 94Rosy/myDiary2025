import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchUser, logoutUser } from "../store/authSlice";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import DeleteAccountModal from "./leave/DeleteAccountModal";
import "../styles/navbar.scss";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = useSelector((state: RootState) => state.auth.name);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());

    // 로그인/로그아웃 상태 감지 후 자동 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          dispatch(fetchUser()); // 로그인 시 유저 정보 다시 가져오기
        } else if (event === "SIGNED_OUT") {
          dispatch(logoutUser()); // 로그아웃 감지됨
          navigate("/login"); // 로그인 페이지로 이동
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("err:", error.message);
      return;
    }

    // 로그아웃 후 세션 강제 갱신하여 즉시 반영
    await supabase.auth.getSession();

    dispatch(logoutUser()); // Redux 상태 업데이트
    navigate("/login"); // 로그인 페이지로 이동
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
              <span className="user-name">
                {/* 🐥 {userName}님 <div>오늘의 마음은 어떠세요?</div> */}
                🐥 {userName}님
              </span>
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
            <Link to="/emotionList">💟감정 다이어리</Link>
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
