// 헤더 - 내비게이션 기능

import { Link } from "react-router-dom";
import "../styles/navbar.scss";

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">📖 나의 감정 일기장</Link> {/* 로고 클릭 시 홈으로 이동 */}
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">📊 감정 차트</Link> {/** 대시보드 페이지로 */}
          </li>
          <li>
            <Link to="/emotionList">😊 감정 다이어리</Link> {/** 감정 게시판 */}
          </li>
          <li>
            <Link to="/contact">📞 Contact</Link> {/** 나를 소개하는 페이지로 */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
