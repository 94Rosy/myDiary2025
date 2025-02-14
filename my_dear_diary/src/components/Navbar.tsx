// 헤더 - 내비게이션 기능
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient"; // Supabase 연결
import "../styles/navbar.scss";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data } = await supabase.auth.getUser();
  //     setUser(data?.user);
  //   };

  //   fetchUser();

  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       setUser(session?.user || null);
  //     }
  //   );

  //   return () => {
  //     authListener?.subscription.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };

    fetchUser();
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
            // 로그인 상태일 경우 로그아웃 버튼 표시
            <li>
              <span className="user-email">
                {user.email} ({user.app_metadata?.provider})
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                🔓LogOut
              </button>
            </li>
          ) : (
            // 로그아웃 상태일 때는 로그인 & 회원가입 버튼 표시
            <>
              <li>
                <Link to="/signup" className="signup-btn">
                  💡Join
                </Link>
              </li>
              <li>
                <Link to="/login" className="login-btn">
                  🔒LogIn
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/emotionList">💟Diary</Link> {/** 감정 게시판 */}
          </li>
          <li>
            <Link to="/dashboard">📊Chart</Link> {/** 대시보드 페이지로 */}
          </li>
          <li>
            <Link to="/contact">📞Contact</Link>
            {/** 나를 소개하는 페이지로 */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
