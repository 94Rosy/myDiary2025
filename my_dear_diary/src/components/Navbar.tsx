// 헤더 - 내비게이션 기능
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient"; // Supabase 연결
import "../styles/navbar.scss";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. 최초 렌더링 시 유저 정보 가져오기
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };

    fetchUser();

    // 2. Supabase 인증 상태 변화 감지 후 자동 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user); // 로그인 or 비밀번호 변경 후 업데이트
        } else {
          setUser(null); // 로그아웃 or 세션 만료 시 업데이트
        }
      }
    );

    // 3. 컴포넌트 언마운트 시 리스너 정리
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🩷💛💚💙❤️</Link> {/* 로고 클릭 시 홈으로 이동 */}
      </div>
      <nav>
        <ul>
          {user ? (
            // 로그인 상태일 경우
            <li>
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                🔓로그아웃
              </button>
            </li>
          ) : (
            // 로그아웃 상태일 경우
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
            <Link to="/emotionList">💟나의 감정 일기</Link> {/** 감정 게시판 */}
          </li>
          <li>
            <Link to="/dashboard">📊대시보드</Link> {/** 대시보드 페이지로 */}
          </li>
          <li>
            <Link to="/contact">📞CONTACT</Link>
            {/** 나를 소개하는 페이지로 */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
