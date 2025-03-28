import { useState } from "react";
import { Link } from "react-router-dom";
import "../addon/mainCardList.scss";

// 이미지 import
import emotionsImg from "../addon/img/emotions.jpg";
import dashboardImg from "../addon/img/dashboard.jpg";

// 카드별 이미지 매핑
const images: { [key: string]: string } = {
  emotions: emotionsImg,
  dashboard: dashboardImg,
};

interface EmotionCardProps {
  cardType: string;
  mainText: string;
  subText?: string;
  link?: string;
  onClick?: () => void;
}

const MainCardList = ({
  cardType,
  mainText,
  subText,
  link,
  onClick,
}: EmotionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgImage = images[cardType]; // JS에서 배경 이미지 동적 적용

  const content = (
    <div
      className={`card ${cardType} ${isHovered ? "hovered" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="card-top"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="description">
        <div className="main-text">{mainText}</div>
        {subText && <div className="sub-text">{subText}</div>}
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="card-link">
      {content}
    </Link>
  ) : (
    content
  );
};

export default MainCardList;
