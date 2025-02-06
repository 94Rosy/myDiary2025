import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/emotionCard.scss";

// 이미지 import
import todayImg from "../../assets/today.jpg";
import journalImg from "../../assets/journal.jpg";
import dashboardImg from "../../assets/dashboard.jpg";
import calendarImg from "../../assets/calendar.jpg";

// 카드별 이미지 매핑
const images: { [key: string]: string } = {
  today: todayImg,
  journal: journalImg,
  dashboard: dashboardImg,
  calendar: calendarImg,
};

interface EmotionCardProps {
  cardType: string;
  title?: string;
  description?: string;
  link?: string;
  onClick?: () => void;
}

const EmotionCard = ({
  cardType,
  title,
  description,
  link,
  onClick,
}: EmotionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgImage = images[cardType];

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
      ></div>
      <div className="card-bottom">
        <h3 className="card-title">{title}</h3>
        {description && (
          <div className={`description ${isHovered ? "visible" : ""}`}>
            {description}
          </div>
        )}
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

export default EmotionCard;
