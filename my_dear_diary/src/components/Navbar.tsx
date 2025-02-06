// 헤더 - 내비게이션 기능

import { Link } from "react-router-dom";
import "../styles/navbar.scss";

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">📖 My Diary</Link> {/* 로고 클릭 시 홈으로 이동 */}
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">📊 Dashboard</Link> {/** 대시보드 페이지로 */}
          </li>
          <li>
            <Link to="/emotionList">😊 Emotion Board</Link> {/** 감정 게시판 */}
          </li>
          <li>
            <Link to="/contact">📞 Contact Board</Link> {/** 나를 소개하는 페이지로 */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
