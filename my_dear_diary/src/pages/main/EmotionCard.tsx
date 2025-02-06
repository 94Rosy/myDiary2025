import { Link } from "react-router-dom";
import "../../styles/emotionCard.scss";

interface EmotionCardProps {
  icon: string;
  title: string;
  description?: string;
  link?: string;
  onClick?: () => void;
}

const EmotionCard = ({
  icon,
  title,
  description,
  link,
  onClick,
}: EmotionCardProps) => {
  const content = (
    <div className="card" onClick={onClick}>
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default EmotionCard;
